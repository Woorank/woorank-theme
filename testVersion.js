var http = require('http');

module.exports = function (host, path) {
  return new Promise((resolve, reject) => {
    http.get({ host: host, path: path }, function (response) {
      var versionAlreadyExists = (response.statusCode === 200);
      resolve(versionAlreadyExists);
    })
    .on('error', function (e) {
      reject(e);
    });
  });
};
