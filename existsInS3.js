var http = require('http');
var https = require('https');

module.exports = (host, path, options = {}) => {
  return new Promise((resolve, reject) => {
    const protocol = options.https ? https : http;

    protocol
      .get({ host, path }, ({ statusCode }) => resolve(statusCode))
      .on('error', reject);
  });
};
