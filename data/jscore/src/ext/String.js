/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

// Some code is based on the work of:
// ES5 Shim
// MIT License, Copyright (c) 2009, 280 North Inc. http://280north.com/ 

if (!String.isString) 
{
	String.isString = function(arg) {
		return typeof arg == "string" || Object.prototype.toString.call(arg) === "[object String]";
	};
}

// ES5 15.5.4.20
if (!String.prototype.trim) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    var trimBeginRegexp = /^\s\s*/;
    var trimEndRegexp = /\s\s*$/;
    String.prototype.trim = function trim() {
        return String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
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
