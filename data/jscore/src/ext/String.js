/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

if (!String.isString) 
{
	String.isString = function(arg) {
		return typeof arg == "string" || Object.prototype.toString.call(arg) === "[object String]";
	};
}

if (!String.prototype.contains) 
{
	String.prototype.contains = function(sub) {
		return this.indexOf(sub) != -1;
	};
}

// Via: http://es5.github.com/#x15.5.4.11
String.prototype.hyphenate = function() {
	return this.replace(/[A-Z]/g,'-$&').toLowerCase();
};

String.prototype.repeat = function(nr) {
	return Array(nr).join(this);
};
