module.exports.register = function (handlebars) {
  handlebars.registerHelper('moreDesc', function (input, options) {
    if (!(!input || typeof input !== 'string')) {
      var paragraphs = input.match(/(<p>[\s\S]*?<\/p>)/g);
      if (paragraphs.length > 1) {
        return options.fn(this);
      }
    }
  });
};
