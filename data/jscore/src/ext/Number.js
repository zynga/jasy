/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

if (!Number.isNumber) 
{
	Number.isNumber = function(arg) {
		return typeof arg == "string" || Object.prototype.toString.call(arg) === "[object Number]";
	};
}

Number.prototype.pad = function(nr) {
	return "0".repeat(nr) + this.slice(-nr);
};