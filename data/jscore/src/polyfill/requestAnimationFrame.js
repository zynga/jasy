/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Inspired by: https://github.com/inexorabletash/raf-shim/blob/master/raf.js
==================================================================================================
*/

(function(global) 
{
	if(global.requestAnimationFrame) {
		return;
	}
	
	// requestAnimationFrame polyfill
	// http://webstuff.nfshost.com/anim-timing/Overview.html

	var postfix = "RequestAnimationFrame";
	var prefix = (function() 
	{
		var all = "webkit,moz,o,ms".split(",");
		for (var i=0; i<4; i++) {
			if (global[all[i]+postfix] != null) {
				return all[i];
			}
		}
	})();
	
	// Vendor specific implementation
	if (prefix) 
	{
		global.requestAnimationFrame = global[prefix+postfix];
		global.cancelRequestAnimationFrame = global[prefix+"Cancel"+postfix];
		return;
	}

	// Custom implementation
	var TARGET_FPS = 60;
	var requests = {};
	var rafHandle = 1;
	var timeoutHandle = null;

	global.requestAnimationFrame = function(callback, root) 
	{
		var callbackHandle = rafHandle++;
		
		// Store callback
		requests[callbackHandle] = callback;

		// Create timeout at first request
		if (timeoutHandle === null) 
		{
			timeoutHandle = setTimeout(function() 
			{
				var time = Date.now();
				var currentRequests = requests;
				var keys = Object.keys(currentRequests);

				// Reset data structure before executing callbacks
				requests = {};
				timeoutHandle = null;

				// Process all callbacks
				for (var i=0, l=keys.length; i<l; i++) {
					currentRequests[keys[i]](time);
				}
			}, 1000 / TARGET_FPS);
		}

		return callbackHandle;
	};

	global.cancelRequestAnimationFrame = function(handle) 
	{
		delete requests[handle];

		// Stop timeout if all where removed
		if (Object.empty(requests)) 
		{
			clearTimeout(timeoutHandle);
			timeoutHandle = null;
		}
	};

})(this);