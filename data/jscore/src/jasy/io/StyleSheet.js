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
	load : (function(global, doc)
	{
		var head = doc.getElementsByTagName('head')[0];

		var testEl = doc.createElement("link");
		if ("onload" in testEl)
		{
			return function(url, callback, context)
			{
				var el = doc.createElement("link");
				el.onload = function() 
				{
					el.onload = null;
					callback.call(context||global);
				}
				el.type = "stylesheet";
				el.src = url;

				head.appendChild(el);
			};
		}
		else
		{
			return function(url, callback, context)
			{
				var style = doc.createElement('style');
				style.textContent = '@import "' + url + '"';

				var interval = setInterval(function() 
				{
					var succeed = false;
					try 
					{
						// MAGIC: only populated when file is loaded
						style.sheet.cssRules;
						succeed = true;
					} 
					catch(e){}

					if (succeed) 
					{
						callback.call(context||global);
						clearInterval(interval);
					}
				}, 10);	 

				head.appendChild(style);
			}
		}
	})(this, document)
});
