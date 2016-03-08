var $ = window.jQuery;
var XMLSerializer = window.XMLSerializer;

$('document').ready(function () {
  $.get('../assets/svg/symbols.svg', function (data) {
    var div = document.createElement('div');
    div.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
    document.body.insertBefore(div, document.body.childNodes[0]);
  });
});
