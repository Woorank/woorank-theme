var fs = require('fs');
var path = require('path');

module.exports.register = function (handlebars) {
  handlebars.registerHelper('include', function (inputFile) {
    var absoluteInputFile = path.join(path.resolve('.'), inputFile);
    var fileContent = fs.readFileSync(absoluteInputFile, { encoding: 'utf8' });
    return new handlebars.SafeString(fileContent);
  });
};
