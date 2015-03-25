module.exports.register = function (handlebars) {
  handlebars.registerHelper('paragraphs', function (input, index, options) {
    if (!input || typeof input !== 'string') return input;
    var paragraphs = input.match(/(<p>[\s\S]*?<\/p>)/g);
    if (paragraphs !== null) {
      if (paragraphs[index - 1] !== undefined) {
        return new handlebars.SafeString(
          paragraphs[index - 1].replace('\n', '<br>')
        );
      }
    }
  });
};
