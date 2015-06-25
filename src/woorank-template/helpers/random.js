
module.exports.register = function (handlebars) {
  var lastRandom;

  handlebars.registerHelper('random', function (input) {
    var random = Math.random() * 100;
    lastRandom = random;
    return new handlebars.SafeString(random);
  });

  handlebars.registerHelper('lastRandom', function (input) {
    if (lastRandom !== undefined) {
      return new handlebars.SafeString(lastRandom.toFixed(2));
    }
  });
};
