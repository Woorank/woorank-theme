var animations = function animations() {

  var checkAnimationLoop = function checkAnimationLoop ($elem, loopLeft) {
    if (loopLeft-- <= 0) {
      return true;
    }

    if ($elem.hasClass('hidden') || $elem.hasClass('fadeout')) {
      return true;
    }

    return false;
  }

  var animationLoop = function animationLoop ($elem, name, loop, delay) {
    var loopLeft = Number($elem.attr('data-animation-loop-left'));

    $elem.removeClass('animated').removeClass(name);

    if (checkAnimationLoop($elem)) {
      return;
    }

    $elem.attr('data-animation-loop-left', loopLeft);

    setTimeout(function () {
      if (checkAnimationLoop($elem, loopLeft)) {
        return;
      }

      $elem.addClass('animated').addClass(name);

      setTimeout(function () {
        if (checkAnimationLoop($elem, loopLeft)) {
          return;
        }

        animationLoop($elem, name, loop, delay);
      }, delay / 2);
    }, delay / 2);
  };

  $('[data-animation=true]').each(function () {
    var loop = Number($(this).attr('data-animation-loop'));
    var name = $(this).attr('data-animation-name');
    var delay = Number($(this).attr('data-animation-delay'));

    $(this).attr('data-animation-loop-left', loop);
    animationLoop($(this), name, loop, delay);
  });
};

module.exports = animations;
