/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * @require {fix.DocumentHead}
 */
(function(global)
{
	var doc = global.document;

	// the following is a feature sniff for the ability to set async=false on dynamically created script elements, as proposed to the W3C
	// RE: http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
	var supportsScriptAsync = doc.createElement("script").async === true;
	
	// Dynamic URI can be shared because we do not support reloading files
	var dynamicExtension = "?r=" + Date.now();
	
	// Used for shorten calls
	var assignCallback = function(elem, value) {
		elem.onload = elem.onerror = elem.onreadystatechange = value;
	};
	

	/**
	 * Generic script loader for features. Could be used for loading feature/class packages after initial load.
	 *
	 * (though limited feature set and file registration not useful for data transaction)
	 */
	Module("jasy.io.Script",
	{
		/** {Boolean} Whether the loader supports parallel requests */
		SUPPORTS_PARALLEL : supportsScriptAsync || jasy.Env.isSet("engine", "gecko") || jasy.Env.isSet("engine", "opera"),
		
		
		/**
		 * Loads the scripts at the given URIs.
		 *
		 * Automatically using preloading of scripts in modern browsers and falls back to sequential loading/executing on others.
		 *
		 * @param uri {String} URI of script sources to load
		 * @param callback {Function} Function to execute when script is loaded
		 * @param context {Object} Context in which the callback should be executed
		 * @param nocache {Boolean?false} Appends a dynamic parameter to each script to force a fresh copy
		 */
		load : function(uri, callback, context, nocache) 
		{
			var elem = doc.createElement("script");

			// load script via 'src' attribute, set onload/onreadystatechange listeners
			assignCallback(elem, function(e) 
			{
				if (!e) {
					e = window.event;
				}

				if (e.type !== "error") 
				{
					var readyState = elem.readyState;
					if (readyState && readyState !== "complete" && readyState !== "loaded") {
						return;
					}
				}

				// Prevent memory leaks
				assignCallback(elem, null);

				// Execute callback
				if (callback) {
					context ? callback.call(context) : callback();
				}
			});

			elem.src = nocache ? uri + dynamicExtension : uri;

			if (supportsScriptAsync) {
				elem.async = false;
			}

			doc.head.insertBefore(elem, doc.head.firstChild);
		}
	});
})(this);

