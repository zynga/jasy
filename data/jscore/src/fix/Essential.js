// Fix for missing document.head
if (!document.head) {
	document.head = document.getElementsByTagName('head')[0]
}

if (!Function.prototype.bind) 
{
	/**
	 * Binds the given function to the specific context.
	 *
	 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
	 *
	 * Coypright WebReflection - Mit Style License
	 *
	 * @param context {Object} Object to bind function to.
	 * @return {Function} Returns a new function which is bound to the given object.
	 */
	Function.prototype.bind = function bind(context) 
	{
		var self = this; // "trapped" function reference

		// only if there is more than an argument
		// we are interested into more complex operations
		// this will speed up common bind creation
		// avoiding useless slices over arguments
		if (1 < arguments.length) 
		{
			// extra arguments to send by default
			var extraargs = Array.prototype.slice.call(arguments, 1);
			return function()
			{
				return self.apply(
					context,
					// thanks @kangax for this suggestion
					arguments.length ?
						// concat arguments with those received
						extraargs.concat(Array.prototype.slice.call(arguments)) :
						// send just arguments, no concat, no slice
						extraargs
				);
			};
		}

		// optimized callback
		return function() 
		{
			// speed up when function is called without arguments
			return arguments.length ? self.apply(context, arguments) : self.call(context);
		};
	};
}

if (!Object.keys) 
{
	// Fix for IE bug with enumerables
	var hasDontEnumBug = true;
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];

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