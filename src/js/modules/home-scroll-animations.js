var homeScrollAnimations = function homeScrollAnimations() {

  $fixedTopNavBar = $('#genbar-fixed');
  $genBarTop = $('#genbar-top');
  $genBarBottom = $('#genbar-bottom');

  var showFixedTopNavBar = function showFixedTopNavBar() {
    var topOffset = $genBarTop.offset();
    var bottomOffset = $genBarBottom.offset();
    var scroll = document.body.scrollTop;
    var bodyHeight = $(document.body).height();

    // check offsets
    if (topOffset && bottomOffset) {
      topOffset.bottom = $genBarTop.outerHeight() + topOffset.top;
      if (scroll > topOffset.bottom && scroll < bottomOffset.top - bodyHeight) {
        $fixedTopNavBar.removeClass('navbar-hidden');
      } else {
        $fixedTopNavBar.addClass('navbar-hidden');
      }
    }
  };

  if ($fixedTopNavBar) {
    $(document).ready(function () {
      $fixedTopNavBar.removeClass('hidden');
      showFixedTopNavBar();
    });

    $(window).on('scroll', function () {
      showFixedTopNavBar();
    });
  }
};

module.exports = homeScrollAnimations;
