const { override, addWebpackAlias } = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    crypto: 'crypto-browserify'
  })
);