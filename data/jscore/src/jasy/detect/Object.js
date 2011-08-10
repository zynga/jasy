/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * Checks for existance of global API objects.
 *
 */
Module("jasy.detect.Object", 
{
	get : (function(global)
	{
		// TODO
		// But not possible here: 
		// - Canvas
		// - SVG
		// - GeoLocation (navigator)
		// - QuerySelectorAll

		var allowed = 
		{
			"feature.appcache" : "applicationCache",
			"feature.worker" : "Worker",
			"feature.xhr" : "XMLHttpRequest",
			"feature.storage" : "localStorage",
			"feature.gl" : "WebGLRenderingContext",
			"feature.message" : "postMessage",
			"feature.db" : "openDatabase",
			"feature.json" : "JSON",
			"feature.socket" : "WebSocket"
		};
		
		return function get(name) 
		{
			var test = allowed[name];

			try {
				var result = test && test in global;
			} catch(ex) {}
			
			return !!result;
		};
	})(this)
});
