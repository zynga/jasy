/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

if (typeof Array.isArray == "undefined") 
{
	Array.isArray = function (arg) {
		return arg instanceof Array || Object.prototype.toString.call(arg) === "[object Array]";
	};
}

