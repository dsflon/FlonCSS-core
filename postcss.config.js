const path = require('path');
const resolver = require('postcss-import-resolver');

const floncssDir = path.join(__dirname, './floncss/');

module.exports = {
  plugins: {
    'postcss-import': {
      resolve: resolver({
        alias: {
          '@floncss': path.resolve(floncssDir),
          'floncss/trumps': path.join(__dirname, 'node_modules/floncss/core/trumps'),
        },
      }),
    },
    'postcss-mixins': {},
    // preset-env の設定は postcss-features.js で一元管理
    'postcss-preset-env': require('./postcss-features'),
  },
};
