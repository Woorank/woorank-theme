#!/usr/bin/env node

var http = require('http');

module.exports = function (version, callback) {
  http.get({
    host: process.env.CDN_HOST,
    path: '/woorank-theme/6.6.2/woorank-theme.min.css'
  }, function (response) {
    var versionAlreadyExists = (response.statusCode === 200);
    callback(versionAlreadyExists);
  });
};
