/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on the work of Andrea Giammarchi
  Vice-Versa Project: http://code.google.com/p/vice-versa/
  http://webreflection.blogspot.com/2011/05/settimeout-and-setinterval-with-extra.html
  MIT LICENSE
==================================================================================================
*/

/**
 * Adds support for extra parameters for setInterval/setTimeout for browsers (IE, ...) missing it
 */
(function(global, slice, undef) 
{
	// Only fix where support is missing
	if (global.setTimeout.length !== undef) {
		return;
	}
	
	// trap original versions
	var origTimeout = global.setTimeout;
	var origInterval = global.setInterval;
	
	// create a delegate
	var delegate = function(callback, args) 
	{
		args = slice.call(args, 2);
		return function() {
			callback.apply(null, args);
		};
	};
	
	// redefine original implementation
	global.setTimeout = function(callback, delay) {
		return origTimeout(delegate(callback, arguments), delay);
	};
	
	global.setInterval = function(callback, delay) {
		return origInterval(delegate(callback, arguments), delay);
	};
})(this, Array.prototype.slice);
