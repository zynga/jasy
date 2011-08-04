/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Inspired by: http://www.phpied.com/when-is-a-stylesheet-really-loaded/
==================================================================================================
*/

Module("jasy.io.StyleSheet",
{
	/**
	 * Loads a stylesheet and fires a callback when the stylesheet is applied to the page.
	 *
	 * Inspired by:
	 * http://www.phpied.com/when-is-a-stylesheet-really-loaded/
	 *
	 * @param {string} url url pointing to the stylesheet
	 * @param {Function} callback callback that fires when stylesheet is loaded
	 * @param {Object} context context in which the callback is being executed. Defaults to global context.
	 */
	load: function(url, callback, context) {

		var head = document.getElementsByTagName('head')[0];

		context = context || window;

		// Use listener to stylesheet list and compare elements
		if (Permutation.isSet("engine", "webkit")) 
		{
			var link = document.createElement('link');
			var sheets = document.styleSheets;
			var startPos = sheets.length;

			handle = setInterval(function() {

				for (var i = 0, l = sheets.length; i < l; i++)  {

					if (sheets[i].ownerNode === link) {
						clearInterval(handle);
						callback.call(context);
					}
				}

			}, 10);

			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = url;

			head.appendChild(link);
		}
		
		// Use style import fallback for buggy GECKO 
		else if (Permutation.isSet("engine", "gecko")) 
		{
			var style = document.createElement("style");
			style.textContent = "@import '" + url + "'";

			var handle = setInterval(function() {
				try {
					// MAGIC: only populated when file is loaded
					style.sheet.cssRules;
					clearInterval(handle);
					callback.call(context);
				} catch(e) {}

			}, 10);

			head.appendChild(style);
		}
		
		// Load event only supported by MSIE and OPERA 
		else 
		{
			var link = document.createElement("link");
			link.onload = function() {
				link.onload = null;
				callback.call(context);
			};

			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = url;

			head.appendChild(link);
		}
	}
});

