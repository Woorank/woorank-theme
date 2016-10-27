module.exports.register = function (handlebars) {
  handlebars.registerHelper({
    iconPath: function () {
      return 'assets/svg/symbols.svg';
    },
    iconSize: function () {
      return 'icon-normal';
    },
    iconColor: function () {
      return 'grey-medium';
    }
  });
};
