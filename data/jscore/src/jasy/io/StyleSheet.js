/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Inspired by: http://www.phpied.com/when-is-a-stylesheet-really-loaded/
==================================================================================================
*/

(function(global, doc) 
{
	var completed = {};
	var loading = {};
	var dynamicUri = "?r=" + Date.now();
	
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
		
		
		loadAll: function(uris, callback, context, nocache) 
		{
			if (jasy.Env.isSet("debug")) 
			{
				jasy.Test.assertArray(uris);

				if (callback != null) {
					jasy.Test.assertFunction(callback);
				}
				
				if (context != null) {
					jasy.Test.assertObject(context);
				}
				
				if (nocache != null) {
					jasy.Test.assertBoolean(nocache);
				}
			}
			
			var keys = {};
			for (var i=0, l=uris.length; i<l; i++) 
			{
				var uri = uris[i];
				
				if (!completed[uri]) {
					keys[uri] = true;
				}
			}
			
			var caller = function(uri) 
			{
				return function() 
				{
					delete keys[uri];
			
					if (Object.empty(keys)) {
						callback.call(context||global);
					}
				}
			};
			
			for (var i=0, l=uris.length; i<l; i++) {
				this.load(uris[i], caller(uris[i]), null, nocache);
			}
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
		 * @param nocache {Boolean?false} Appends a dynamic parameter to each script to force a fresh copy
		 */
		load: function(url, callback, context, nocache) 
		{
			var head = doc.getElementsByTagName('head')[0];
			
			if (jasy.Env.isSet("debug")) {
				nocache = true;
			}
			
			context = context || global;

			if (loading[url]) {
				throw new Error("Stylesheet is already loading: " + url);
			}
			
			loading[url] = true;

			var load = function load() 
			{
				completed[url] = true;
				delete loading[url];

				if (callback) {
					callback.call(context);
				}
			};

			// Use listener to stylesheet list and compare elements
			if (jasy.Env.isSet("engine", "webkit")) 
			{
				var link = doc.createElement('link');
				var sheets = doc.styleSheets;
				var startPos = sheets.length;

				handle = setInterval(function() 
				{
					for (var i = startPos, l = sheets.length; i < l; i++)  
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
				link.href = url + (nocache ? dynamicUri : "");

				head.appendChild(link);
			}

			// Use style import fallback for buggy GECKO 
			else if (jasy.Env.isSet("engine", "gecko")) 
			{
				var style = doc.createElement("style");
				style.textContent = "@import '" + url + (nocache ? dynamicUri : "") + "'";

				var handle = setInterval(function() 
				{
					try 
					{
						// MAGIC: only populated when file is loaded
						style.sheet.cssRules;
						clearInterval(handle);
						load();
					} catch(e) {}
				}, 30);

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
				link.href = url + (nocache ? dynamicUri : "");

				head.appendChild(link);
			}
		}
	});
})(this, document);
