import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { curry, init, last } from 'ramda';

// components
import Code from '../Code';
import Icon from '../Icon';

// local
import styles from './Card.module.css';

const splitPath = path => {
  const split = path.split('/');
  return [init(split).join('/'), last(split)];
};

const importStatement = curry((mod, path) => {
  const [parent, name] = splitPath(path);
  const modulePath = [mod, parent].join('/');
  return `import { ${ name } } from '${ modulePath }';`;
});

const cjsStatement = curry((mod, path) => {
  const [parent, name] = splitPath(path);
  const modulePath = [mod, parent].join('/');
  return `const { ${ name } } = require('${ modulePath }');`;
});

const Card = ({ doc, onQuery }) => (
  <div className={ `${ styles.card } ${ styles[doc.kind] }` } style={{ display: (doc.ignore ? 'none' : 'default') }}>
    <div className={ styles.top }>
      <a className={ styles.sourceLink } href={ doc.url } target={ '_new' } title={ 'View Source' }>
        <Icon type={ 'code' } />
      </a>
      <h2>
        { /* fixme */ }
        <Link to={ `/#${ doc.path.replace(/\//g, '.') }` }>{ doc.path }</Link>
      </h2>
      <Code>{ doc.sig }</Code>
      <div className={ styles.description }>{ doc.description }</div>
      <div>{ (doc.deprecated ? 'deprecated' : '') }</div>
    </div>
    {
      doc.examples.length
        ? (
          <div style={{ lineHeight: 0 }}>
            {
              doc.examples.map((example, i) => (
                <Code
                  lang={ 'javascript' }
                  className={ styles.example }
                  key={ i }
                  inline={ false }
                >{ [cjsStatement('funk-lib', doc.path), '', example].join('\n') }</Code>
              ))
            }
          </div>
        )
        : null
    }
  </div>
);

Card.propTypes = {
  doc: PropTypes.shape({
    path: PropTypes.string,
  }),
  id: PropTypes.string,
  onQuery: PropTypes.func,
};

Card.defaultProps = {
  doc: {},
  onQuery: () => {},
};

export default Card;
