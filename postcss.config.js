const path = require('path');
const resolver = require('postcss-import-resolver');

const srcDir = path.join(__dirname, './src/');

module.exports = {
  plugins: {
    'postcss-import': {
      resolve: resolver({
        alias: {
          '@floncss': path.resolve(srcDir, 'floncss'),
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
