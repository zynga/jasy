/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

if (!Object.isObject) {
	/**
	 * Whether the given value is an object.
	 *
	 * @signature function(value)
	 * @param value {var} Value to test
	 * @return {Boolean} Whether the given value is an object
	 */
	Object.isObject = function(value) {
		return value != null && typeof value == "object";
	}
}

(function(toString){
	/**
	 * Whether the given value is an trivial object aka map. This blocks
	 * all instances of objects not directly created by the Object constructor.
	 *
	 * @signature function(value)
	 * @param value {var} Value to test
	 * @return {Boolean} Whether the given value is an trivial object aka map.
	 */
	Object.isMap = function(value) {
		return value != null && toString.call(value) == "[object Object]";
	}
})(Object.prototype.toString);

