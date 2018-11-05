'use strict';

// modules
const R = require('ramda');

// local
const { isObject } = require('../is');

// Object<K, V> -> [K, V]
const firstPair = R.pipe(R.toPairs, R.nth(0));
// Object<K, V> -> K
const firstKey = R.pipe(firstPair, R.nth(0));
// Object<K, V> -> V
const firstValue = R.pipe(firstPair, R.nth(1));

// todo: pickAsDeep (recursive)
// pick the keys from the first argument, renaming by the values in the second arg
// pickAs({ a: 'b', b: 'a' }, { a: 1, b: 2 }) === { a: 2, b: 1 }
// object -> object -> object
const pickAs = R.curry((keyVals, obj) => {
  return R.toPairs(keyVals).reduce((result, [key, val]) => {
    return R.assoc(val, obj[key], result);
  }, {});
});

// ([K, V] -> [L, M]) -> Object<K, V> -> Object<L, M>
const mapPairs = R.curry((pred, obj) => {
  return R.fromPairs(R.map(pred, R.toPairs(obj)));
});

// (K -> M) -> Object<K, V> -> Object<M, V>
const mapKeys = R.curry((pred, obj) => {
  return mapPairs(([key, value]) => [pred(key), value], obj);
});

// todo: deprecate in favor of R.map
// (V -> M) -> Object<K, V> -> Object<K, M>
const mapValues = R.curry((pred, obj) => {
  return mapPairs(([key, value]) => [key, pred(value)], obj);
});

// recursive + mutating + identity
const deepFreeze = (obj) => {
  Object.freeze(obj);
  R.forEach(deepFreeze, R.values(obj));
  return obj;
};

// flatten a deeply nested object, joining keys with pred
// inverse of nestWith
const flattenWith = R.curry((pred, obj) => {
  const flatPairs = R.pipe(
    R.toPairs,
    R.chain(([key, val]) => {
      return isObject(val)
        ? R.map(([k2, v2]) => [pred(key, k2), v2], flatPairs(val))
        : [[key, val]];
    }),
  );
  return R.fromPairs(flatPairs(obj));
});

// deeply nest a flattened object, splitting keys with pred
// inverse of flattenWith
const nestWith = R.curry((pred, obj) => {
  return R.reduce((obj, [key, val]) => {
    return R.assocPath(pred(key), val, obj);
  }, {}, R.toPairs(obj));
});

// * -> string
const toHumanJSON = obj => JSON.stringify(obj, null, 2);


// // recursive R.merge with predicate for custom merging
// const mergeDeepWith = R.curry((pred, left, right) => {
//   return R.mergeWith((left, right) => {
//     if (isObject(left) && isObject(right)) return mergeDeepWith(pred, left, right);
//     return pred(left, right);
//   }, left, right);
// });


module.exports = {
  deepFreeze,
  firstKey,
  firstPair,
  firstValue,
  flattenWith,
  mapKeys,
  mapPairs,
  mapValues,
  nestWith,
  pickAs,
  toHumanJSON,
};
