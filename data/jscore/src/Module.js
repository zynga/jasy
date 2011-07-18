/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * @break {Permutation}
 */


// Enforce dependency to Assert and Permutation module
Assert;
Permutation;

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


	var genericToString = function() {
		return "[Module " + this.moduleName + "]";
	};
	
	var isModuleValue = +new Date;
	
	// Small hack to correctly bootstrap
	global.Permutation = {getValue:function(){}, isSet:function(){}};
	
	/**
	 * Define a module with static methods/fields.
	 * 
	 * As there are new fields added to the member data structure and the module
	 * itself this is not feasible to being used as a structure for looping through
	 * via for-in loops.
	 * 
	 * @param name {String} Name of Module
	 * @param members {Map} Data structure containing the members
	 */
	var Module = global.Module = function(name, members) 
	{
		if (Permutation.isSet("debug")) {
			Assert.assertModuleName(name, "Invalid module name!");
			Assert.assertMap(members, "Invalid module members!");
		}

		var prefix = name + ".";
		var value;

		for (var key in members) {
			value = members[key];

			// Performance would better using typeof but instanceof is required to exclude RegExps
			if (value instanceof Function) {
				value.displayName = prefix + key;
			}
		}

		// Add module name, implement toString() and valueOf()
		if(members.moduleName == null) {
			members.moduleName = name;
		}

		if(!members.hasOwnProperty("toString")) {
			members.toString = genericToString;
		}

		if(!members.hasOwnProperty("valueOf")) {
			members.valueOf = genericToString;
		}

		// Mark as module
		members.__isModule = isModuleValue;

		// Attach to name
		Module.declareName(name, members, true);
	};
	
	
	/**
	 * Declares the given name and stores the given object onto it.
	 *
	 * @param name {String} Namespace/Package e.g. foo.bar.baz
	 * @param object {Object} Any object
	 * @param duplicate {Boolean?false} Whether an error should be thrown when names are overwritten
	 * @return {Object} Returns the given object
	 */
	Module.declareName = function(name, object, duplicate)
	{
		if (duplicate && name in cache) {
			throw new Error("Namespace " + name + " is already in use by another object!");
		}

		console.debug("Module.declareName: " + name);

		var splits = name.split(".");
		var current = global;
		var length = splits.length-1;
		var segment;
		var i = 0;

		while(i<length) 
		{
			segment = splits[i++];
			if (!(segment in current)) {
				current = current[segment] = {};
			} else {
				current = current[segment];
			}
		}

		// Store Object
		return cache[name] = current[splits[i]] = object;
	};	


	/**
	 * Returns all registers names (modules, interfaces, classes, etc.)
	 *
	 * @return {Array}
	 */
	Module.getAllNames = function() {
		return Object.keys(cache);
	};
	
	
	/**
	 * Clears the object under the given name (incl cache)
	 *
	 * @param name {String} Clears the given name (Only works with stuff attached via {@see #declare})
	 * @return {Boolean} Whether clearing was successful
	 */
	Module.clearName = function(name) {
		if (name in cache) {
			delete cache[name];
			
			var current = global;
			var splitted = name.split(".");
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
	};


	/**
	 * Resolves a given name into the already existing object/class.
	 *
	 * @param name {String} Name to resolve
	 * @return {Object} Returns the object stored under the given name
	 */
	Module.resolveName = function(name)
	{
		var current = cache[name];
		if (!current)
		{
			current = global;
			if (name)
			{
				var splitted = name.split(".");
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
	};
	

	/**
	 * Resolves a given Module name
	 *
	 * @param moduleName {String} Name to resolve
	 * @return {Object} Returns the Module stored under the given name
	 */
	Module.getByName = function(moduleName) {
		if (Permutation.isSet("debug")) {
			Assert.assertString(moduleName);
		}
		
		var obj = Core.resolve(moduleName);
		return isModule(obj) ? obj : null;
	};


	/**
	 * Whether the given name is a valid module name.
	 *
	 * @param value {String} Any string
	 * @return {Boolean} Whether the given string is a valid module name
	 */
	var isModuleName = Module.isModuleName = function(value) { 
		return /^(([a-z][a-z0-9]+\.)*)([A-Z][a-zA-Z0-9]*)$/.test(value); 
	};


	/**
	 * Whether the given object is a Model
	 *
	 * @return {Boolean} Whether the given argument is an valid Model.
	 */
	var isModule = Module.isModule = function(module) {
		return !!(module && typeof module == "object" && module.__isModule === isModuleValue);
	}
	
	
	// Add assertion for module name
	Assert.add(isModuleName, "isModuleName", "Invalid module name!");

	// Add assertion for module type
	Assert.add(isModule, "isModule", "Invalid module!");	

})(this);
