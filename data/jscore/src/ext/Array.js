/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

if (!Array.isArray) {
	(function(toString){
		/**
		 * Whether the given value is an array.
		 *
		 * @signature function(value)
		 * @param value {var} Value to test
		 * @return {Boolean} Whether the given value is an array
		 */
		Array.isArray = function(value) {
			return value != null && toString.call(value) == "[object Array]";
		}
	})(Object.prototype.toString);
}

Array.max = function(arr){
	return Math.max.apply(Math, arr);
};

Array.min = function(arr){
	return Math.min.apply(Math, arr);
};

Array.prototype.contains = function(sub) {
	return ~this.indexOf(sub);
};