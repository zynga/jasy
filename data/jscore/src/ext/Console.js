/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
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
			info : helper,
			log : helper
		};
	}
})(this);
