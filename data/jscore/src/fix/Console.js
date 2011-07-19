/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * Just a dump placeholder for environments without "console" object.
 */
(function(global)
{
	if (!global.console) 
	{
		var helper = function() {};
		
		global.console = 
		{
			debug : helper,
			error : helper,
			warn : helper,
			info : helper,
			log : helper
		};
	}
})(this);
