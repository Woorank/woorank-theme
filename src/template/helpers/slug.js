module.exports.register = function (handlebars) {
  handlebars.registerHelper('slug', function (input, options) {
    if (!input || typeof input !== 'string') return input;
    return new handlebars.SafeString(
      input.replace(/^\s+|\s+$/g, '').toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
    );
  });
};
