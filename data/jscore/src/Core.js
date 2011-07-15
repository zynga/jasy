/* 
==================================================================================================
	Jasy - JavaScript Tooling Refined
	Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

(function(global)
{
	var cache = {};
	
	// Define Core initially in a primitive way to have same signature like
	// all following modules/classes.
	var Core = 
	{
		declare : function(namespace, object, duplicate)
		{
			if (duplicate && namespace in cache) {
				throw new Error("Namespace " + namespace + " is already in use by another object!");
			}
			
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
