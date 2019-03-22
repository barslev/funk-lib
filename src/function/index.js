import { curry, curryN, pipe } from 'ramda';


/** Curried pipe
  * @func
  * @sig ...f -> f
*/
export const pipeC = (...funcs) => curryN(funcs[0].length, pipe(...funcs));

/** on
  * @func
  * @sig (b -> b -> c) -> (a -> b) -> a -> a -> c
  * @example
  * const records = [{ age: 9 }, { age: 1 }, { age: 3 }];
  *
  * // [{ age: 1 }, { age: 3 }, { age: 9 }]
  * R.sort(on(R.subtract, R.prop('age'))), records);
*/
export const on = curry((bi, un, xa, ya) => bi(un(xa), un(ya)));

/** Creates a function that is restricted to invoking func once.
  * Repeat calls to the function return the value of the first invocation
  * @func
  * @sig (a -> b) -> (a -> b)
  * @example
  * const pred = n => n > 5;
  * const oncePred = once(pred);
  * oncePred(10); // true
  * oncePred(1); // true (cached. pred not called again)
*/
export const once = fn => {
  let called = false;
  let res;
  
  return (...args) => {
    if (called) return res;
    res = fn(...args);
    called = true;
    return res;
  };
};

/** A function that does nothing. "no-op"
  * @func
  * @sig a -> undefined
  * @example noop(); // undefined
*/
export const noop = () => {};

/** Throttle a function
  * @func
  * @sig Number -> (a -> b) -> (a -> b)
*/
export const throttle = curry((delay, fn) => {
  let lastCall = 0;
  return (...args) => {
    const now = (new Date()).getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return fn(...args);
  };
});

/** Debounce a function
  * @func
  * @sig Number -> (a -> b) -> (a -> undefined)
*/
export const debounce = curry((delay, fn) => {
  let timeoutID;
  return (...args) => {
    if (timeoutID) clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      fn(...args);
      timeoutID = null;
    }, delay);
  };
});
