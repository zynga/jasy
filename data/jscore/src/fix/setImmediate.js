/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Inspired by http://mathiasbynens.be/notes/settimeout-onload and 
  http://dbaron.org/log/20100309-faster-timeouts
  By L. David Baron <dbaron@dbaron.org>, 2010-03-07, 2010-03-09
  Released under the following license: Copyright (c) 2010, The Mozilla Foundation
  All rights reserved.
==================================================================================================
*/

/**
 * Emulate setImmediate/clearImmediate using postMessage or timeouts.
 * 
 * See also: http://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
 */
(function(global) 
{
	if (global.setImmediate) {
		return;
	}
	
	if (global.postMessage && global.addEventListener) 
	{
		var timeouts = [];
		var messageName = "zero-timeout";
		
		global.addEventListener("message", function(ev) 
		{
			if (ev.source == global && ev.data == messageName) 
			{
				ev.stopPropagation();
				if (timeouts.length) {
					timeouts.shift()();
				}
			}
		}, true);
		
		global.setImmediate = function setImmediate(func) 
		{
			timeouts.push(func);
			postMessage(messageName, "*");
			return func; // use function as timeout handle
		};
		
		global.clearImmediate = function clearImmediate(handle) {
			var pos = timeouts.lastIndexOf(handle);
			if (pos != -1) {
				timeouts.splice(pos, 1);
			}
		};
	}
	else
	{
		global.setImmediate = function setImmediate(func) {
			return setTimeout(func, 0);
		};

		global.clearImmediate = function clearImmediate(handle) {
			clearTimeout(handle);
		};
	}
})(this);
