/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Inspired by: http://www.phpied.com/when-is-a-stylesheet-really-loaded/
==================================================================================================
*/

(function(global, doc) 
{
	var completed = {};
	var loading = {};
	
	/** 
	 * Stylesheet (CSS) loader and manager. Tracks status of all loaded files.
	 */
	Module("jasy.io.StyleSheet",
	{
		/**
		 * Whether the given stylesheet is loaded.
		 * 
		 * @param url {String} URL pointing to the stylesheet
		 * @return {Boolean} Whether the stylesheet is loaded
		 */
		isLoaded : function(url) {
			return !!completed[url];
		},
		
		
		/**
		 * Loads a stylesheet and fires a callback when the stylesheet is applied to the page.
		 *
		 * Inspired by:
		 * http://www.phpied.com/when-is-a-stylesheet-really-loaded/
		 *
		 * @param url {String} URL pointing to the stylesheet
		 * @param callback {Function} Callback that fires when stylesheet is loaded
		 * @param context {Object} Context in which the callback is being executed. Defaults to global context.
		 */
		load: function(url, callback, context) 
		{
			var head = doc.getElementsByTagName('head')[0];

			context = context || global;

			if (Permutation.isSet("debug")) {
				console.log("Loading stylesheet: " + url);
			}
			
			if (loading[url]) {
				throw new Error("Stylesheet is already loading: " + url);
			}
			
			loading[url] = true;

			var load = function load() 
			{
				completed[url] = true;
				delete loading[url];
				
				/*
				if (Permutation.isSet("debug")) {
					console.log("Stylesheet loaded: " + url);
				}
				*/

				if (callback) {
					callback.call(context);
				}
			};

			// Use listener to stylesheet list and compare elements
			if (Permutation.isSet("engine", "webkit")) 
			{
				var link = doc.createElement('link');
				var sheets = doc.styleSheets;
				var startPos = sheets.length;

				handle = setInterval(function() 
				{
					for (var i = 0, l = sheets.length; i < l; i++)  
					{
						if (sheets[i].ownerNode === link) 
						{
							clearInterval(handle);
							load();
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
				var style = doc.createElement("style");
				style.textContent = "@import '" + url + "'";

				var handle = setInterval(function() 
				{
					try 
					{
						// MAGIC: only populated when file is loaded
						style.sheet.cssRules;
						clearInterval(handle);
						load();
					} catch(e) {}
				}, 10);

				head.appendChild(style);
			}

			// Load event only supported by MSIE and OPERA 
			else 
			{
				var link = doc.createElement("link");
				link.onload = function() 
				{
					link.onload = null;
					load();
				};

				link.rel = "stylesheet";
				link.type = "text/css";
				link.href = url;

				head.appendChild(link);
			}
		}
	});
})(this, document);
