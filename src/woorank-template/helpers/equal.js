module.exports.register = function (handlebars) {
  handlebars.registerHelper('equal', function (inputA, inputB, options) {
    if (inputA === inputB) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });
};
