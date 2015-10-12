'use strict';

var pkg = require('../../../package');
var path = require('path');

function listWrapper (item) {
  return '<li>' + item + '</li>';
}

function linkWrapper (item) {
  if (!item) return;
  item.attr = item.attr || '';
  return listWrapper(
    '<a target="_blank" href="' + item.url + '" ' + item.attr + '>' +
    item.title +
    '</a>'
  );
}

function fileByVersions (handlebars) {
  handlebars.registerHelper('fileByVersions', function (options) {
    var links = '';
    var version = pkg.version;
    var fileName = 'woorank-theme.css';
    var fileNameMinified = 'woorank-theme.min.css';
    var svgSymbols = 'symbols.svg';
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
      },
      {
        url: path.join('build', version, svgSymbols),
        title: 'Icons (SVG Symbols) ' + version,
        attr: 'download'
      }
    ];

    for (v in versions) {
      links += linkWrapper(versions[v]);
    }

    return new handlebars.SafeString(links);
  });
}

module.exports.register = fileByVersions;
