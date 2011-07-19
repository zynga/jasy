if (!Object.keys) 
{
	// Fix for IE bug with enumerables
	var hasDontEnumBug = true;
	var dontEnums = "toString,toLocaleString,valueOf,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,constructor".split(",");

	var dontEnumsLength = dontEnums.length;
	for (var key in {"toString": null}) {
		hasDontEnumBug = false;	
	}

	// ES5 15.2.3.14
	// Based on the work of ES5 Shim
	// MIT License, Copyright (c) 2009, 280 North Inc. http://280north.com/		
	// http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
	Object.keys = function keys(object) 
	{
		if (typeof object !== "object" && typeof object !== "function" || object === null) {
			throw new TypeError("Object.keys called on a non-object");
		}

		var keys = [];
		for (var name in object) {
			if (owns(object, name)) {
				keys.push(name);
			}
		}

		if (hasDontEnumBug) 
		{
			for (var i = 0, ii = dontEnumsLength; i < ii; i++) 
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