'use strict';

(function (H) {
  H.className = H.className.replace(/\bno-js\b/, 'js'); // Why modernizr anymore, right?
  var $ = window.jQuery;
  var $navbar = $('#top .navbar');

  window.prettyPrint();
  window.svg4everybody();

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

    // Hide the Header Generation bar
    if (
      !$(event.target).parents('.-header-genbar').length &&
      !$(event.target).parents('*[class^="js-"],*[class*=" js-"]').length &&
      $('.-header').hasClass('_genbar-open')
    ) {
      toggleGenbar(false);
    }
  });

  $('[data-toggle="header-genbar"]').on('click', function (e) {
    e.preventDefault();
    toggleGenbar(!$('.-header').hasClass('_genbar-open'));
  });

  function toggleGenbar (status) {
    var $header = $('.-header');
    $header.find('[data-toggle="header-genbar"]').attr('aria-expanded', status);
    $header.toggleClass('_genbar-open', status);
  }

  $navbar.find('.navbar-toggle').on('click', function (event) {
    togglePanel(!$('body').hasClass('navbar-open'));
  });

  $(window).on('resize', function () {
    if ($('body').hasClass('navbar-open')) {
      togglePanel(false);
    }
  });

  $('[data-toggle="popover"]').popover();
  $('[data-toggle="tooltip"]').tooltip();

  var btnAsync = {
    default: 'btn btn-async ',
    success: 'btn-async-success',
    error: 'btn-async-error',
    loader: 'btn-async-loading'
  };

  var btnColors = [
    'btn-default',
    'btn-primary',
    'btn-warning',
    'btn-success',
    'btn-error',
    'btn-link'
  ];

  var btnSizes = [
    'btn-xs',
    'btn-sm',
    'btn-lg'
  ];

  $('[data-demo="js-btn-async-demo"]').each(function () {
    var classes = $(this).attr('class').split(' ');
    for (var c in classes) {
      if (btnColors.indexOf(classes[c]) !== -1) {
        $(this).attr('data-color', classes[c]);
      }
      if (btnSizes.indexOf(classes[c]) !== -1) {
        $(this).attr('data-size', classes[c]);
      }
    }
  });

  $('[data-demo="js-btn-async-demo"]').on('click', function (event) {
    var $btn = $(this);
    var btnColor = $(this).attr('data-color') + ' ';
    var btnSize = $(this).attr('data-size') + ' ';
    var baseClasses = btnAsync.default + btnColor + btnSize;
    event.preventDefault();

    if ($btn.hasClass(btnAsync.error)) {
      return $btn.attr('class', baseClasses);
    }
    if ($btn.hasClass(btnAsync.loader)) {
      return $btn.attr('class', baseClasses + btnAsync.success);
    }
    if ($btn.hasClass(btnAsync.success)) {
      return $btn.attr('class', baseClasses + btnAsync.error);
    }
    return $btn.attr('class', baseClasses + btnAsync.loader);
  });
})(document.documentElement);
