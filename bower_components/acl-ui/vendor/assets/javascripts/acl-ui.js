//= require acl-ui-utilities
//= require api/ui-elements
//= require foundation-extend
//= require override/daterangepicker
//= require vendor/jquery.floatThead

// Initialize all necessary plugins.
var ACLUISetup = {
  init: function() {
    // Looks at all tables and if it finds table.js-highlight-selected
    // it will highlight any selected row
    $('table').HighlightSelectedRows();
    this.floatTableHead();
    this.aclPanel();
  },

  floatTableHead: function() {
    $('table.js-acl-tbl-fixed-header').Exist(function() {
      $table = this;
      $table.floatThead({
        zIndex: 1,
        // Keep table scrolling inside a container.
        scrollContainer: function($table){
          return $table.closest('.acl-tbl-wrapper');
        }
      });
    });
  },

  aclPanel: function() {
    var $overlay = $('<div/>', { class: 'acl-panel-overlay' }),
        $panel =  $('.acl-panel'),
        $panelTrigger = $('[data-toggle="acl-panel"]'),
        $panelClose = $panel.find('.panel__close'),
        $panelParent = $panel.parent(),
        hasOverlay = $panel.data('has-overlay'),
        clickableOverlay = $panel.data('clickable-overlay');

    var closePanel = function() {
      $panel.removeClass('is-open');
      $panelParent.off('keyup')
    };

    // trigger panel
    $panelTrigger.on('click', function() {
      $panel.addClass('is-open');

      // Add event listener for closing panel with `esc`
      $panelParent.on('keyup', function(e) {
        if (e.keyCode == 27) {
          closePanel();
        }
      });
      if (hasOverlay) {
        $panel.after($overlay);
      }
    });

    // close panel
    $panelClose.on('click', closePanel);
    if (clickableOverlay) {
      $panelParent.on('click', '.acl-panel-overlay', closePanel);
    }
  }
};

// Call init method
$(document).ready(function(){
  ACLUISetup.init();
});
