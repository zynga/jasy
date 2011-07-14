/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

// Adds support for extra parameters for setInterval/setTimeout for browsers missing it
// Via: http://webreflection.blogspot.com/2011/05/settimeout-and-setinterval-with-extra.html
// Only missing in IE browsers
setTimeout(function(one) {
	// only if not supported ...
	if (one) {
		return;
	}

	var slice = [].slice;

	// trap original versions
	var Timeout = setTimeout;
	var Interval = setInterval;
	
	// create a delegate
	var delegate = function(callback, args) {
		args = slice.call(args, 2);
		return function() {
			callback.apply(null, args);
		};
	};
	
	// redefine original versions
	setTimeout = function(callback, delay) {
		return Timeout(delegate(callback, arguments), delay);
	};
	
	setInterval = function(callback, delay) {
		return Interval(delegate(callback, arguments), delay);
	};
}, 0, 1);
