var fs = require('fs');

module.exports.register = function (handlebars) {
  handlebars.registerHelper('include', function (inputFile) {
    console.log('include');
    var fileContent = fs.readFileSync(inputFile, { encoding: 'utf8' });
    return new handlebars.SafeString(fileContent);
  });
};
