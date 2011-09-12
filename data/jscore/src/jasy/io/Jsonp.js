/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on the work of Andrea Giammarchi
  (C) WebReflection Essential - Mit Style
==================================================================================================
*/

/**
 * @require {fix.DocumentHead}
 */
(function(global, doc) {
	
	var id = 0;
	var prefix = "__JSONP__";
	var head = doc.head;
	
	// Dynamic URI can be shared because we do not support reloading files
	var dynamicExtension = "&r=" + Date.now();	

	/**
	 * Async JSON-P loader
	 *
	 */
	Module("jasy.io.Jsonp", 
	{
		/** {Boolean} Whether the loader supports parallel requests. Always true for images. */
		SUPPORTS_PARALLEL : true,
		
		/**
		 * Loads an JSONP and fires a callback when the data was loaded
		 *
		 * @param uri {String} URI pointing to the image
		 * @param callback {Function ? null} Callback that fires when image is loaded
		 * @param context {Object ? null} Context in which the callback is being executed. Defaults to global context.
		 * @param nocache {Boolean ? false} Appends a dynamic parameter to each URL to force a fresh copy
		 */
		load : function load(uri, callback, context, nocache) 
		{
			function JSONPResponse()
			{
				try { 
					delete global[src] 
				} catch(e) {
					global[src] = null;
				}

				head.removeChild(script);
				callback.apply(context||global, arguments);
			}

			var src = prefix + id++;
			var script = doc.createElement("script");

			global[src] = JSONPResponse;

			head.insertBefore(script, head.lastChild);
			script.src = uri + "=" + src + (nocache ? dynamicExtension : "");
		}
	});
})(this, document);
