var http = require('http');

module.exports = function (host, path, callback) {
  http.get({
    host: host,
    path: path
  }, function (response) {
    var versionAlreadyExists = (response.statusCode === 200);
    callback(versionAlreadyExists);
  });
};
