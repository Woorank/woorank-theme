'use strict';

var $ = window.$;

function tooltipCloser () {
  $('.tooltip').on('click', '.tooltip-btn-close', function (event) {
    event.preventDefault();
    if (window.Modernizr && window.Modernizr.cssanimations) {
      $(event.delegateTarget).addClass('animated fadeout');
    } else {
      $(event.delegateTarget).addClass('hidden');
    }
  });
}

module.exports = tooltipCloser;
