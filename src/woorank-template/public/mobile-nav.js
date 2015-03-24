(function mobileNav() {
  var $navbar = $('#top .header.navbar');

  var togglePanel = function togglePanel (status) {
    if (status) {
      $(window).scrollTop(0);
    }

    $navbar.find('.navbar-collapse').collapse(status ? 'show' : 'hide');
    $('body').toggleClass('navbar-open', status);
  };

  $(document).on('click', function (event) {
    if (
      !$(event.target).parents('.navbar-header').length
      && $('body').hasClass('navbar-open')
    ) {
      togglePanel(false);
    }
  });

  $navbar.find('.navbar-toggle').on('click', function (event) {
    togglePanel(!$('body').hasClass('navbar-open'));
  });

  $(window).on('resize', function () {
    if ($('body').hasClass('navbar-open')) {
      togglePanel(false);
    }
  });
})();
