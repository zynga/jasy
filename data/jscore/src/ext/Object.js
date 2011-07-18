/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * Whether the given value is an object and not null.
 *
 * @param value {var} Value to test
 * @return {Boolean} Whether the given value is an object
 */
Object.isObject = function isObject(value) {
	return value != null && typeof value == "object";
};

Assert.add(Object.isObject, "isObject", "Not an object!");

/**
 * Whether the given value is an trivial object aka map. This blocks
 * all instances of objects not directly created by the Object constructor.
 *
 * @param value {var} Value to test
 * @return {Boolean} Whether the given value is an trivial object aka map.
 */
Object.isMap = function isMap(value) {
	return value != null && Object.prototype.toString.call(value) == "[object Object]";
};

Assert.add(Object.isMap, "isMap", "Not a map (plain object)!");
