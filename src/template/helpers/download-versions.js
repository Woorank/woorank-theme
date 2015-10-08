'use strict';

var pkg = require('../../../package');
var path = require('path');

function listWrapper (item) {
  return '<li>' + item + '</li>';
}

function linkWrapper (item) {
  if (!item) return;
  return listWrapper(
    '<a target="_blank" href="' + item.url + '">' + item.title + '</a>'
  );
}

function fileByVersions (handlebars) {
  handlebars.registerHelper('fileByVersions', function (options) {
    var links = '';
    var version = pkg.version;
    var fileName = 'woorank-theme.css';
    var fileNameMinified = 'woorank-theme.min.css';
    var v;
    // static template :
    var versions = [
      {
        url: path.join('build', version, fileName),
        title: 'CSS ' + version
      },
      {
        url: path.join('build', version, fileNameMinified),
        title: 'Minified CSS ' + version
      }
    ];

    for (v in versions) {
      links += linkWrapper(versions[v]);
    }

    return new handlebars.SafeString(links);
  });
}

module.exports.register = fileByVersions;
