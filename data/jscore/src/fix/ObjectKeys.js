/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
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
		// ES5 15.2.3.14
		// Based on the work of ES5 Shim
		// MIT License, Copyright (c) 2009, 280 North Inc. http://280north.com/		
		// http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
		Object.keys = function keys(object) 
		{
			Assert.assertObjectOrFunction(object);

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

	if (!Object.isEmpty)
	{
		Object.empty = function(object) 
		{
			Assert.assertObjectOrFunction(object);
			
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