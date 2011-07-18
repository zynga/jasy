/* 
==================================================================================================
	Jasy - JavaScript Tooling Refined
	Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

(function(global, undef)
{
	var cache = {};
	
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

	
	// Define Core initially in a primitive way to have same signature like
	// all following modules/classes.
	var Core = 
	{
		declare : function(namespace, object, duplicate)
		{
			if (duplicate && namespace in cache) {
				throw new Error("Namespace " + namespace + " is already in use by another object!");
			}
			
			console.debug("Core Declare: " + namespace);
			
			var splits = namespace.split(".");
			var current = global;
			var length = splits.length-1;
			var i = 0;
			var test;
	
			// Fast-check for existing segments
			while(test=current[splits[i]]) 
			{
				current = test;
				i++;
			}
	
			// Create missing segments
			while(i<length) {
				current = current[splits[i++]] = {};
			}
	
			// Store Object
			return cache[namespace] = current[splits[i]] = object;
		}
	};
	
	// Finally declare the real class
	Core.declare("Core",
	{
		/**
		 * Declares the given namespace and stores the given object onto it.
		 *
		 * @param namespace {String} Namespace/Package e.g. foo.bar.baz
		 * @param object {Object} Any object
		 * @param duplicate {Boolean?false} Whether an error should be thrown when namespaces are overwritten
		 * @return {Object} Returns the given object
		 */
		declare : Core.declare,
		
		
		/**
		 * Returns all registers namespaces (modules, interfaces, classes, etc.)
		 *
		 * @return {Array}
		 */
		getAll : function() {
			return Object.keys(cache);
		},
		
		
		/**
		 * Clears the object under the given namespace (incl cache)
		 *
		 * @param namespace {String} Clears the given namespace (Only works with stuff attached via {@see #declare})
		 * @return {Boolean} Whether clearing was successful
		 */
		clear : function(namespace) {
			if (namespace in cache) {
				delete cache[namespace];
				
				var current = global;
				var splitted = namespace.split(".");
				for (var i=0, l=splitted.length-1; i<l; i++) {
					current = current[splitted[i]];
				}
				
				// Delete might not work when global object is affected
				try{
					delete current[splitted[i]];
				} catch(ex) {
					current[splitted[i]] = undef;
				}
				
				return true;
			}
			
			return false;
		},


		/**
		 * Resolves a given namespace into the already existing object/class.
		 *
		 * @param namespace {String} Name to resolve
		 * @return {Object} Returns the object stored under the given namespace
		 */
		resolve : function(namespace)
		{
			var current = cache[namespace];
			if (!current)
			{
				current = global;
				if (namespace)
				{
					var splitted = namespace.split(".");
					for (var i=0, l=splitted.length; i<l; i++) 
					{
						current = current[splitted[i]];
						if (!current) 
						{
							current = null;
							break;
						}
					}
				}
			}
		
			return current;
		}
	});
})(this);
