(function($){
    // TODO: prefix class with .js- in order to prevent
    // broken functionality when css classname changed.

    $.fn.extend ({

      // Center an element on page
      /*
        Usage:
          1. Run Center() on an element to center
              and give it an axis to align(horizontal, vertical)
              by default it will be both(in the middle of the page)
          2. Useful for dialog box, etc.
      */
      Center: function(axis) {
        var self = this,
            $this = $(self),
            windowHeight = $(window).height(),
            windowWidth = $(window).width(),
            elmHeight = $this.height(),
            elmWidth = $this.width(),
            xPos = ((windowWidth - elmWidth) / 2) + "px",
            yPos = ((windowHeight - elmHeight) / 2) + "px";

        $.fn.Center.defaults = { axis: "both" };

        self.option = $.extend({}, $.fn.Center.defaults, axis);

        if (self.option.axis ==  "horizontal") {
          $this.css({'left': xPos})
        }
        else if (self.option.axis == "vertical") {
          $this.css({'top': yPos})
        }
        else {
          $this.css({
            'top' : yPos,
            'left' : xPos,
          })
        }

        return this;
      },

      // Filter: Multiple choices UI element
      /*
        Usage:
          1. Run Filter() on an the list of elements
              optional classname, if not it will take
              js-filter as the default classname
      */
      Filter: function(classname) {
        var classname = classname || 'js-filter',
            filter = $('.'+classname);

        filter.on('click', 'li', function(e){
          var $this = $(this);

          $this.toggleClass('active');

        })

        return this;
      },

      // Toggle: Single choice UI element
      /*
        Usage:
          1. Run Toggle() on an the list of elements
              optional classname, if not it will take
              js-toggle as the default classname
      */
      Toggle: function(classname) {
        var classname = classname || 'js-toggle',
            toggle = $('.'+classname);

        toggle.on('click', 'li', function(e){
          var $this = $(this);

          $this.addClass('active', !$this.hasClass('active'));

          // Going through sibling of clicked element and remove active class if applicable.
          $.each($this.siblings(), function(i, el){
            $(el).removeClass('active', $(this).hasClass('active'))
          })
        })

        return this;
      },

      // Highlights selected rows
      /*
        Usage:
          1. By default HighlightSelectedRows() will run on tables
              have .js-highlight-selected class, and have a column with
              .col-row-selector classes.
          2. This can also be run manually. It takes two parameters that allow
              you to change the table class that this runs on or change the
              column class that contains checkbox that selects a record.
      */
      HighlightSelectedRows: function(tableClass, colClass) {
        var tableClass = tableClass || 'js-highlight-selected',
            colClass = colClass || 'col-row-selector',
            rowSelector = 'tbody .'+colClass+' input[type="checkbox"]';

        if( $(this).find(rowSelector).length > 0 ) {
          //Highlight rows already selected after page loads
          $(rowSelector+':checked', $(this)).closest('tr').addClass('is-selected');

          // On click if row is selected add class 'is-selected' to parent tr
          $(this).on('click', rowSelector, function(){
            $(this).closest('tr').toggleClass('is-selected', $(this).prop('checked'));
          });
        }

        return this;
      },

      Exist: function(callback) {
        var args = Array.prototype.slice.call(arguments, 1);

        if (this.length) {
          callback.call(this, args);
        }

        return this;
      }
    })

})(window.jQuery)


