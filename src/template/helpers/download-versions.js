'use strict';

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
    var version;
    // static template :
    var versions = [
      { url: 'build/3.0.0/woorank-theme.css', title: 'normal 3.0.0' },
      { url: 'build/3.0.0/woorank-theme.min.css', title: 'minified 3.0.0' }
    ];

    for (version in versions) {
      links += linkWrapper(versions[version]);
    }

    return new handlebars.SafeString(links);
  });
}

module.exports.register = fileByVersions;
