/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Inspired by: http://www.phpied.com/when-is-a-stylesheet-really-loaded/
==================================================================================================
*/

/**
 * @require {fix.DocumentHead}
 */
(function(global, doc) 
{
	// Dynamic URI can be shared because we do not support reloading files
	var dynamicExtension = "?r=" + Date.now();

	
	/** 
	 * Stylesheet loader with support for load callback.
	 */
	Module("jasy.io.StyleSheet",
	{
		/** {Boolean} Whether the loader supports parallel requests. Always true for stylesheets (order should, hopefully, not be important). */
		SUPPORTS_PARALLEL : true,
		
		
		/**
		 * Loads a stylesheet and fires a callback when the stylesheet is applied to the page.
		 *
		 * Inspired by:
		 * http://www.phpied.com/when-is-a-stylesheet-really-loaded/
		 *
		 * @param uri {String} URI pointing to the stylesheet
		 * @param callback {Function ? null} Callback that fires when stylesheet is loaded
		 * @param context {Object ? null} Context in which the callback is being executed. Defaults to global context.
		 * @param nocache {Boolean ? false} Appends a dynamic parameter to each URL to force a fresh copy
		 */
		load: function(uri, callback, context, nocache) 
		{
			if (jasy.Env.isSet("debug")) 
			{
				jasy.Test.assertString(uri);

				if (callback != null) {
					jasy.Test.assertFunction(callback, "Invalid callback method!");
				}
				
				if (context != null) {
					jasy.Test.assertObject(context, "Invalid callback context!");
				}
				
				if (nocache != null) {
					jasy.Test.assertBoolean(nocache);
				}
			}
			
			// Default nocache to true when debugging is enabled
			if (jasy.Env.isSet("debug") && nocache == null) {
				nocache = true;
			}

			var head = doc.head;
			
			if (!context) {
				context = global;
			}

			// Use listener to stylesheet list and compare elements
			if (jasy.Env.isSet("engine", "webkit")) 
			{
				var link = doc.createElement('link');
				var sheets = doc.styleSheets;

				handle = setInterval(function() 
				{
					for (var i = 0, l = sheets.length; i < l; i++)  
					{
						// In Webkit browsers the sheets array is populated as soon
						// as the stylesheet was loaded.
						if (sheets[i].ownerNode === link) 
						{
							clearInterval(handle);
							if (callback) {
								callback.call(context, uri);
							}
						}
					}
				}, 50);

				link.rel = "stylesheet";
				link.type = "text/css";
				link.href = uri + (nocache ? dynamicExtension : "");

				head.appendChild(link);
			}

			// Use style import fallback for buggy GECKO 
			else if (jasy.Env.isSet("engine", "gecko")) 
			{
				var style = doc.createElement("style");
				style.textContent = "@import '" + uri + (nocache ? dynamicExtension : "") + "'";

				var handle = setInterval(function() 
				{
					try 
					{
						// MAGIC: only populated when file is loaded
						style.sheet.cssRules;
						
						clearInterval(handle);
						if (callback) {
							callback.call(context, uri);
						}
					} catch(e) {}
				}, 50);

				head.appendChild(style);
			}

			// Load event only supported by MSIE and OPERA 
			else 
			{
				var link = doc.createElement("link");
				link.onload = link.onerror = function(e) 
				{
					link.onload = link.onerror = null;
					
					if (callback) {
						callback.call(context, uri, (e||global.event).type === "error");
					}
				};

				link.rel = "stylesheet";
				link.type = "text/css";
				link.href = uri + (nocache ? dynamicExtension : "");

				head.appendChild(link);
			}
		}
	});
})(this, document);
