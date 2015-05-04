var genbarOptions = function () {
  var $genbar = $('.js-generation-bar-in-header');
  var $genbarInput = $genbar.find('.js-validate-review-url');
  var $fakeInput = $genbar.find('.js-fake-input-container');
  var $options = $genbar.find('.js-generation-bar-options');
  var loadedInputValue = $genbarInput.val();
  var screenMd = 992;

  var tooltipOnSmallScreen = function () {
    $genbar.find('[data-toggle=tooltip]').tooltip(
      (window.innerWidth <= screenMd) ? null : 'destroy'
    );
  };

  var valueValidation = function (value) {
    return value.trim().length > 0;
  };

  var applyErrors = function (form, input) {
    var value = input.val();
    form.toggleClass('error', !valueValidation(value));
  };

  // tooltip show on small resolution only
  tooltipOnSmallScreen();

  $(window).on('resize', function () {
    tooltipOnSmallScreen();
  });

  if (loadedInputValue.trim().length < 1) {
    loadedInputValue = $genbarInput.attr('placeholder');
  }

  // apply default text on fake input
  $fakeInput.find('.js-fake-input')
    .text(loadedInputValue)
    .attr('title', loadedInputValue);

  // open/close options
  $options.on('click', '.js-options-btn', function (event) {
    $options.toggleClass('open');
    if (!$options.hasClass('open') && $fakeInput.is(':visible')) {
      $options.addClass('hidden');
    }
  });

  // show real input
  $fakeInput.on('click', function (event) {
    if ($(event.target).is('.competitor-tag')
        || $(event.target).parents().is('.competitor-tag')) {
      return false;
    }
    $fakeInput.addClass('hidden');
    $genbarInput.removeClass('hidden').focus();
  });

  // hide real input
  $genbarInput.on('blur', function (event) {
    $fakeInput.removeClass('hidden');
    $genbarInput.addClass('hidden');

    if (!$(event.relatedTarget).parents().is($options)) {
      $options.addClass('hidden').removeClass('open');
    }
  });

  // show options on real input focus
  $genbarInput.on('focus', function () {
    $options.removeClass('hidden');
  });

  // update fake input
  $genbarInput.on('keyup', function () {
    var value = $(this).val();
    if (valueValidation(value)) {
      $fakeInput.find('.js-fake-input').text(value).attr('title', value);
    }
    applyErrors($genbar, $genbarInput);
  });

  // close options content popin
  $genbar.find('.js-options-content').on('click', '.btn-close', function () {
    $options.removeClass('open');
    if ($fakeInput.is(':visible')) {
      $options.addClass('hidden');
    }
  });

  // update competitor tag from input + validation (not empty after trim)
  $genbar.find('.js-add-competitors')
  .on('click', '.js-btn-add-competitors', function (event) {
    var $competitorFrom = $(event.delegateTarget);
    var competirorValue = $competitorFrom.find('input[type=text]').val();
    var competitorId = $competitorFrom.attr('id');
    if (valueValidation(competirorValue)) {
      $genbar.find('.competitor-tag [data-target=' + competitorId + ']')
        .text(competirorValue)
        .parent('.competitor-tag')
        .attr('title', competirorValue)
        .removeClass('hidden');

      $competitorFrom.addClass('used');

      // search for others competitors to show
      $genbar.find('.js-add-competitors')
        .addClass('hidden')
        .each(function (index, item) {
          if (!$(this).hasClass('used')) {
            $(this).removeClass('hidden');
            return false;
          }
        });
    }
  });

  // prevent form validation from a deeper input
  $genbar.find('.js-add-competitors').on('keypress', function (event) {
    if (event.charCode === 13) {
      event.preventDefault();
      $(this).find('.js-btn-add-competitors').trigger('click');
    }
  });

  // close competitor tag -> save past competitor to input
  $genbar.find('.js-competitor-tag')
  .on('click', '.btn-close', function (event) {
    var competitorTag = $(event.delegateTarget);
    var pastValue = competitorTag.attr('title');
    var target = competitorTag.find('.competitor-tag-text').attr('data-target');
    var initialFormInput = $('#' + target);

    $genbar.find('.js-add-competitors').addClass('hidden');
    initialFormInput.removeClass('hidden used')
      .find('input[type=text]').val(pastValue);

    competitorTag.addClass('hidden');
  });
};

module.exports = genbarOptions;
