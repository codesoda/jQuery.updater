//
// create closure
//
(function($) {
	//
	// plugin definition
	//
	$.fn.updater = function(options) {
		
		// build main options before element iteration
		var opts = $.extend({}, $.fn.updater.defaults, options);
		
		// iterate and reformat each matched element
		return this.each(function() {
			$this = $(this);
			
			// build element specific options
			var o = $.extend( {}, opts || {}, $this.data() );

			// if there's no element complain
			if (!o.element)
				throw new Error(o.element + " is not a valid html element");

			// o.element - the element to update
			// o.event - the event on the updater to fire from
			// o.render - the property of the element to update || function to call to do the update
			
			// wire up the event on $this to call updateElement
			$this.bind(
				o.event,
				function(e) {
					$.fn.updater.updateElement(this, o, e);
				}
			);
		});
	};

	//
	// private function for debugging
	//
	function debug($obj) {
		window.console && console.log($obj);
	};

	//
	// define and expose our update function
	//
	$.fn.updater.updateElement = function(from, options, event) {
		
		var $from = $(from);
		var $to = $(options.element);
		
		// which func to do the render
		var render = options.render;
		if (! $.isFunction(render))
			render = $.fn.updater.updateFunctions[render];
		
		// do we have something to render with?
		if ($.isFunction(render)) {
			render($from, $to, options);
		}
		
		// fire onupdate event
		$from.trigger('update', from);
		// push this.form onto ajax update queue
	};

	//
	// plugin defaults
	//
	$.fn.updater.defaults = {
		event: "change",
		render: "text"
	};
	
	// built in render methods
	$.fn.updater.updateFunctions = {
		text: function($from, $to) {
			$to.text( $from.val() );
		},
		html: function($from, $to) {
			$to.html( $from.val() );
		},
    cssClass: function($from, $to) {
      $to.removeClass().addClass($from.val());
    },
    cssBackgroundColor: function($from, $to) {
      $to.css({backgroundColor: "#" + $from.val()});
    },
    cssBorderColor: function($from, $to) {
      $to.css({borderColor: "#" + $from.val()});
    },
    cssColor: function($from, $to) {
      $to.css({ color: "#" + $from.val() });
    },
    fontSize: function($from, $to) {
      $to.css({ fontSize: $from.val() + "px" });
    }
	};
//
// end of closure
//

})(jQuery);


/*

var updateFunctions = {
	"text": function(to, val) {
		to.text(val);
	},
	"html": function(to, val) {
		to.html(val);
	}
};

var fieldUpdaters = {
	// biography
	"#athlete_first_name": { to: "span.given-name", event: "change", using: functionName },
	"#athlete_last_name": "span.family-name",
	"#athlete_headline": "#headline",
	"#athlete_biography": "#bio"
}

for (key in fieldUpdaters) {

	$(key).bind(event, changeUpdaterField);
}

*/
