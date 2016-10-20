module.exports.register = function (handlebars) {
  handlebars.registerHelper('iconPath', function () {
    return 'assets/svg/symbols.svg';
  });
};
