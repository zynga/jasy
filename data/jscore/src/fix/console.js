/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * Just a dump placeholder for environments without "console" object.
 */
(function(global, slice)
{
	var methods = "debug,error,warn,info,trace".split(",");
	var console = global.console;
	
	if (!console) {
		console = global.console = {};
	} 
	
	var log = console.log || new Function;
	
	for (var i=0, l=methods.length; i<l; i++) 
	{
		var name = methods[i];
		if (!console[name]) {
			console[name] = log;
		}
	}
})(this, Array.prototype.slice);
