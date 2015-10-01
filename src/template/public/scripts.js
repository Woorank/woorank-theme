'use strict';

(function () {
  var $ = window.jQuery;
  var $navbar = $('#top .header.navbar');

  window.prettyPrint();

  function togglePanel (status) {
    if (status) {
      $(window).scrollTop(0);
    }
    $navbar.find('.navbar-collapse').collapse(status ? 'show' : 'hide');
    $('body').toggleClass('navbar-open', status);
  }

  $(document).on('click', function (event) {
    if (
      !$(event.target).parents('.navbar-header').length &&
      !$(event.target).parents('*[class^="js-"],*[class*=" js-"]').length &&
      $('body').hasClass('navbar-open')
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
