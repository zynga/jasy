/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
--------------------------------------------------------------------------------------------------
  Based on the work of ES5 Shim
  MIT License, Copyright (c) 2009, 280 North Inc. http://280north.com/
  http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
==================================================================================================
*/

(function(Object) 
{
	// Fix for IE bug with enumerables
	var hasDontEnumBug = true;
	for (var key in {"toString": null}) {
		hasDontEnumBug = false;	
	}
	
	if (hasDontEnumBug) 
	{
		var dontEnums = "toString,toLocaleString,valueOf,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,constructor".split(",");
		var dontEnumsLength = dontEnums.length;
	}
	
	var owns = Object.hasOwnProperty;

	if (!Object.keys) 
	{
		/**
		 * Returns an array of all own enumerable properties found upon a given object, 
		 * in the same order as that provided by a for-in loop 
		 * 
		 * @see ES5 15.2.3.14
		 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
		 *
		 * @param object {Object} Object to query
		 * @return {Array} Array of strings
		 */
		Object.keys = function keys(object) 
		{
			var keys = [];
			for (var name in object) {
				if (owns(object, name)) {
					keys.push(name);
				}
			}

			if (hasDontEnumBug) 
			{
				for (var i=0; i<dontEnumsLength; i++) 
				{
					var dontEnum = dontEnums[i];
					if (owns(object, dontEnum)) {
						keys.push(dontEnum);
					}
				}
			}

			return keys;
		};
	}

	// non standard extension (because it's easier here than anywhere else)
	if (!Object.isEmpty)
	{
		/**
		 * Tests whether the given object is empty
		 *
		 * @param object {Object} Object to test
		 * @return {Boolean} Whether the object is empty
		 */
		Object.empty = function(object) 
		{
			for (var name in object) {
				return false;
			}

			if (hasDontEnumBug) 
			{
				for (var i=0; i<dontEnumsLength; i++) 
				{
					if (owns(object, dontEnums[i])) {
						return false;
					}
				}
			}

			return true;
		};
	}
})(Object);