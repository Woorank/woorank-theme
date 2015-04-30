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

  $fakeInput.find('.js-fake-input')
    .text(loadedInputValue)
    .attr('title', loadedInputValue);

  // open options
  $options.on('click', '.js-options-btn', function (event) {
    $(event.delegateTarget).toggleClass('open');
  });

  // show real input
  $fakeInput.on('click', function (event) {
    if ($(event.target).is('.competitor-tag')
        || $(event.target).parents().is('.competitor-tag')) {
      return false;
    }
    $(this).addClass('hidden');
    $genbarInput.removeClass('hidden').focus();
    $options.removeClass('open').addClass('forced-visible');
  });

  // hide real input
  $genbarInput.on('blur', function () {
    if (valueValidation($(this).val())) {
      $(this).addClass('hidden');
      $fakeInput.removeClass('hidden');
      $options.removeClass('forced-visible');
    }
    applyErrors($genbar, $genbarInput);
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
      $genbar.find('.js-add-competitors').each(function (index, item) {
        if (!$(this).hasClass('used')) {
          $(this).removeClass('hidden', function () {
            $(this).find('input[type=text]').focus();
          });
          return false;
        } else {
          $(this).addClass('hidden');
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
