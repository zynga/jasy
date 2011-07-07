/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

(function() {
	var genericToString = function() {
		return "[Module " + this.moduleName + "]";
	};
	
	/**
	 * Define a module with static methods
	 * 
	 * @param name {String} Name of Module
	 * @param members {Map} Data structure containing the members
	 */
	Core.declare("Module", function(name, members) {

		// Store module in namespace first
		Core.declare(name, members);
		
		console.debug("Defining module: " + name);

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
		members.__isModule = true;
	});

	/**
	 * Whether the given object is a Model
	 */
	Module.isModule = function(module) {
		return !!(module && typeof module == "object" && module.__isModule);
	}
})();
