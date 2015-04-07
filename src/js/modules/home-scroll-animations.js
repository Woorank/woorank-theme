var homeScrollAnimations = function homeScrollAnimations() {

  $fixedTopNavBar = $('#genbar-fixed');
  $genBarTop = $('#genbar-top');
  $genBarBottom = $('#genbar-bottom');

  var showFixedTopNavBar = function showFixedTopNavBar() {
    var topOffset = $genBarTop.offset();
    var bottomOffset = $genBarBottom.offset();
    var scroll = document.body.scrollTop;

    // check offsets
    if (topOffset && bottomOffset) {
      topOffset.bottom = $genBarTop.outerHeight() + topOffset.top;
      if (scroll > topOffset.bottom && scroll < bottomOffset.top) {
        $fixedTopNavBar.removeClass('navbar-hidden');
      } else {
        $fixedTopNavBar.addClass('navbar-hidden');
      }
    }
  };

  if ($fixedTopNavBar) {
    $(document).ready(function () {
      showFixedTopNavBar();
    });

    $(window).on('scroll', function () {
      showFixedTopNavBar();
    });
  }
};

module.exports = homeScrollAnimations;
