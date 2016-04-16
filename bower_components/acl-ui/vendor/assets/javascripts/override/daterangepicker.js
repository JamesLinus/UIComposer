//
// DateRangepicker module for
// overriding/extending the plugin
//

var DateRangePicker = (function () {

  // privates
  var template = [
                    '<div class="daterangepicker">',
                      '<div class="calendar left">',
                          '<div class="daterangepicker_input">',
                            '<input type="text" name="daterangepicker_start" value="" />',
                            '<i class="acl-i-calendar"></i>',
                            '<div class="calendar-time">',
                              '<div></div>',
                              '<i class="acl-i-calendar"></i>',
                            '</div>',
                          '</div>',
                          '<div class="calendar-table"></div>',
                      '</div>',
                      '<div class="calendar right">',
                          '<div class="daterangepicker_input">',
                            '<input type="text" name="daterangepicker_end" value="" />',
                            '<i class="acl-i-calendar"></i>',
                            '<div class="calendar-time">',
                              '<div></div>',
                              '<i class="acl-i-calendar"></i>',
                            '</div>',
                          '</div>',
                          '<div class="calendar-table"></div>',
                      '</div>',
                      '<div class="ranges">',
                          '<div class="range_inputs">',
                              '<button class="applyBtn acl-btn primary small" disabled="disabled" type="button"></button>',
                              '<button class="cancelBtn" type="button"></button>',
                          '</div>',
                      '</div>',
                    '</div>'
                  ];

  var getCustomTemplate = function () {
    return template.join('');
  }

  // Enable click on calendar icon to open calendars
  var enableClickOnCalIcon = function () {
    var $calIcon = $('.daterangepicker_container .acl-i-calendar');

    $calIcon.on('click', function() {
      $(this).prev('.daterangepicker_input').click();
    });
  }

  // Make public methods available
  return {
    getCustomTemplate: getCustomTemplate,
    enableClickOnCalIcon: enableClickOnCalIcon
  };

})();

DateRangePicker.enableClickOnCalIcon();
