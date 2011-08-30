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
		
		
		/**
		 * Loads all given stylesheets and execute the given callback after
		 * they have been loaded. Stylesheets are requested in order of the list and
		 * should be applied in the same order.
		 *
		 * @param uris {Array} URLs pointing to all stylesheets
		 * @param callback {Function} Callback that fires when stylesheet is loaded
		 * @param context {Object} Context in which the callback is being executed. Defaults to global context.
		 * @param nocache {Boolean?false} Appends a dynamic parameter to each script to force a fresh copy
		 */
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
			
			var queued = {};
			for (var i=0, l=uris.length; i<l; i++) 
			{
				var uri = uris[i];
				
				if (!completed[uri]) 
				{
					queued[uri] = true;
					
					this.load(uri, function(uri) 
					{
						delete queued[uri];

						if (Object.empty(queued)) {
							callback.call(context||global);
						}
					}, null, nocache);
				}
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
			if (jasy.Env.isSet("debug")) 
			{
				jasy.Test.assertString(url);

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
					callback.call(context, url);
				}
			};

			// Use listener to stylesheet list and compare elements
			if (jasy.Env.isSet("engine", "webkit")) 
			{
				var link = doc.createElement('link');
				var sheets = doc.styleSheets;

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
				}, 50);

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
				}, 50);

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
