const pkg = require('./package.json');

module.exports = {
  iconPath: process.env.ASSET_PATH ||
    `http://d384x5zk471rz.cloudfront.net/woorank-theme/${pkg.version}/symbols.svg`
};
