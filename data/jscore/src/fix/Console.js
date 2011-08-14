/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * Just a dump placeholder for environments without "console" object.
 */
(function(global)
{
	var methods = "log,clear,assert,debug,error,warn,info,trace".split(",");
	var console = global.console || (global.console = {});
	var log = console.log || new Function;
	
	for (var i=0, l=methods.length; i<l; i++) 
	{
		var name = methods[i];
		if (!console[name]) {
			console[name] = log;
		}
	}
})(this);
