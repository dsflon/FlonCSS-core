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
    'postcss-preset-env': {
      features: {
        'custom-properties': false,
        'custom-media-queries': {
          preserve: false,
        },
        'nesting-rules': true,
      },
      // custom-media-queries/custom-properties の preserve オプションはココで指定
      // @see https://github.com/csstools/postcss-preset-env#preserve
      preserve: false,
    },
  },
};
