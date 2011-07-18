/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * Whether the string contains the given substring
 *
 * @param sub {String} Any string
 * @return {Boolean} Whether the substring was found in the string
 */
String.prototype.contains = function contains(sub) {
	return this.indexOf(sub) != -1;
};


/**
 * Returns a hyphenated copy of the original string e.g.
 *
 * * camelCase => camel-case
 * * HelloWorld => -hello-world
 *
 * Via: http://es5.github.com/#x15.5.4.11
 *
 * @return {String} Hyphenated string
 */
String.prototype.hyphenate = function hyphenate() {
	return this.replace(/[A-Z]/g,'-$&').toLowerCase();
};


/** 
 * Returns a new string which is a repeated copy of the original one.
 * 
 * @param nr {Integer} Number of times to repeat
 * @return {String} Repeated string
 */
String.prototype.repeat = function repeat(nr) {
	return Array(nr).join(this);
};
