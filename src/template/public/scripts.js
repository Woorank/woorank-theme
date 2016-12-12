'use strict';

(function () {
  var $ = window.jQuery;
  var $navbar = $('#top .header.navbar');
  var $sidebarNav = $('.sidebar-nav');

  window.prettyPrint();
  window.svg4everybody();

  function togglePanel (status) {
    if (status) {
      $(window).scrollTop(0);
    }
    $navbar.find('.navbar-collapse').collapse(status ? 'show' : 'hide');
    $('body').toggleClass('navbar-open-right', status);
  }

  $(document).on('click', function (event) {
    if (
      !$(event.target).parents('.navbar-header').length &&
      !$(event.target).parents('*[class^="js-"],*[class*=" js-"]').length &&
      $('body').hasClass('navbar-open-right')
    ) {
      togglePanel(false);
    }
  });

  $navbar.find('.navbar-toggle').on('click', function (event) {
    togglePanel(!$('body').hasClass('navbar-open-right'));
  });

  $(window).on('resize', function () {
    if ($('body').hasClass('navbar-open-right')) {
      togglePanel(false);
    }
  });

  $(window).on('scroll', function () {
    var mustFly = $(this).scrollTop() > 60;
    $sidebarNav.toggleClass('fixed', mustFly);
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
})();
