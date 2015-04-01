var tooltipCloser = function tooltipCloser () {
  $('.tooltip').on('click', '.tooltip-btn-close', function (event) {
    event.preventDefault();
    if (Modernizr && Modernizr.cssanimations) {
      $(event.delegateTarget).addClass('animated fadeout');
    } else {
      $(event.delegateTarget).addClass('hidden');
    }
  });
};

module.exports = tooltipCloser;
