'use strict';

var $ = window.$;

function checkboxes () {
  $(document).on('click', '.checkbox', function () {
    var isChecked = $(this).hasClass('checked');
    var isDisabled = $(this).hasClass('disabled');
    var isAllowed = !$(this).hasClass('not-allowed');

    if (!isDisabled && isAllowed) {
      $(this).toggleClass('checked', !isChecked);
    }
  });
}

module.exports = checkboxes;
