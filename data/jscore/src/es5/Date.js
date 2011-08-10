/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on the work of ES5 Shim
  MIT License, Copyright (c) 2009, 280 North Inc. http://280north.com/ 
==================================================================================================
*/

// ES5 15.9.5.43
// Format a Date object as a string according to a subset of the ISO-8601 standard.
// Useful in Atom, among other things.
if (!Date.prototype.toISOString) 
{
	Date.prototype.toISOString = function toISOString() 
	{
		return (
			this.getUTCFullYear() + "-" +
			(this.getUTCMonth() + 1) + "-" +
			this.getUTCDate() + "T" +
			this.getUTCHours() + ":" +
			this.getUTCMinutes() + ":" +
			this.getUTCSeconds() + "Z"
		);
	}
}

// ES5 15.9.5.44
if (!Date.prototype.toJSON) 
{
	Date.prototype.toJSON = function toJSON(key) 
	{
		// This function provides a String representation of a Date object for
		// use by JSON.stringify (15.12.3). When the toJSON method is called
		// with argument key, the following steps are taken:

		// 1. Let O be the result of calling ToObject, giving it the this value as its argument.
		// 2. Let tv be ToPrimitive(O, hint Number).
		// 3. If tv is a Number and is not finite, return null.
		// 4. Let toISO be the result of calling the [[Get]] internal method of O with argument "toISOString".
		// 5. If IsCallable(toISO) is false, throw a TypeError exception.
		if (typeof this.toISOString !== "function") {
			throw new TypeError();
		}
			
		// 6. Return the result of calling the [[Call]] internal method of
		// toISO with O as the this value and an empty argument list.
		return this.toISOString();

		// NOTE 1 The argument is ignored.

		// NOTE 2 The toJSON function is intentionally generic; it does not
		// require that its this value be a Date object. Therefore, it can be
		// transferred to other kinds of objects for use as a method. However,
		// it does require that any such object have a toISOString method. An
		// object is free to use the argument key to filter its
		// stringification.
	};
}
