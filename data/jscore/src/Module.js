/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * @break {jasy.Env}
 */
(function(global, undef)
{
	var cache = {};
	
	var genericToString = function() {
		return "[module " + this.moduleName + "]";
	};
	
	// Small hack to correctly bootstrap system
	if (!global.jasy) {
		global.jasy = {};
	}
	
	if (!jasy.Env) 
	{
		var selected = {};
		jasy.Env = 
		{
			define : function(name, value) {
				selected[name] = value;
			},
			
			getValue : function() {
				return selected[name];
			}, 
			
			isSet : function(name, value) 
			{
				if (value === undefined) {
					value = true;
				}

				return selected[name] == value;
			}
		};
	}
	
	
	
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
		if (jasy.Env.isSet("debug")) 
		{
			jasy.Test.assertModuleName(name, "Invalid module name " + name + "!");
			jasy.Test.assertMap(members, "Invalid map as module configuration in " + name + "!");
		}

		var prefix = name + ".";
		var value;

		for (var key in members) 
		{
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
		members.__isModule = true;

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

		var splits = name.split(".");
		var current = global;
		var length = splits.length-1;
		var segment;
		var i = 0;

		while(i<length) 
		{
			segment = splits[i++];
			if (current[segment] == null) {
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
	Module.clearName = function(name) 
	{
		if (name in cache) 
		{
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
	Module.getByName = function(moduleName) 
	{
		if (jasy.Env.isSet("debug")) {
			jasy.Test.assertString(moduleName);
		}
		
		var obj = Module.resolveName(moduleName);
		return isModule(obj) ? obj : null;
	};


	/**
	 * Whether the given name is a valid module name.
	 *
	 * @param value {String} Any string
	 * @return {Boolean} Whether the given string is a valid module name
	 */
	var isModuleName = Module.isModuleName = function(value) { 
		return /^(([a-z][a-z0-9]*\.)*)([A-Z][a-zA-Z0-9]*)$/.test(value); 
	};


	/**
	 * Whether the given object is a Model
	 *
	 * @return {Boolean} Whether the given argument is an valid Model.
	 */
	var isModule = Module.isModule = function(module) {
		return !!(module && typeof module == "object" && module.__isModule);
	};
	
	
	// Add assertion for module name
	jasy.Test.add(isModuleName, "isModuleName", "Invalid module name!");

	// Add assertion for module type
	jasy.Test.add(isModule, "isModule", "Invalid module!");	

})(this);
