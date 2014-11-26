var path = require('path'),
    util = require('util');

function streamline(name, type, size) {
  return util.format(
    './streamline/%s/%s/*/%s.svg',
    type || 'filled',
    size || 60,
    name
  );
}
module.exports = [
  
  './*.svg',
  streamline('.ai_aim 1')

].map(function (relative) {
  return path.resolve(__dirname, relative);
});
