/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * Converts the given arguments object into an array.
 *
 * Via: http://jsperf.com/arrayifying-arguments/4
 *
 * @param args {arguments} Arguments object to convert
 * @return {Array} Created array instance
 */
Array.fromArguments = function fromArguments(args) {
	return Array.apply(null, args);
};


/**
 * Returns the maximum number in the array.
 *
 * @return {Number} Maximum number
 */
Array.prototype.max = function max(){
	return Math.max.apply(Math, this);
};


/**
 * Returns the minimum number in the array.
 *
 * @return {Number} Minimum number
 */
Array.prototype.min = function min(){
	return Math.min.apply(Math, this);
};


/**
 * Whether the array contains the given value
 *
 * @param value {var} Any value
 * @return {Boolean} Whether the value was found in the array
 */
Array.prototype.contains = function contains(value) {
	return ~this.indexOf(value);
};
