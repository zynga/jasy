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
	
	var isModuleValue = +new Date;
	
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
	Core.declare("Module", function(name, members) {

		if (Permutation.isSet("debug")) {
			Assert.isTrue(Module.isValidName(name), "Invalid module name!");
			Assert.isMap(members, "Invalid module members!");
		}

		// Store module in namespace first
		Core.declare(name, members);

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
	});


	/** 
	 * Validator expression for module/class/interface names
	 *
	 * @param name {String} Module name to use
	 * @return {Boolean} Whether the given names is valid for being used as a module name.
	 */
	Module.isValidName = function(name) {
		return /^(([a-z][a-z0-9]+\.)*)([A-Z][a-zA-Z0-9]*)$/.test(name);
	},


	/**
	 * Whether the given object is a Model
	 *
	 * @return {Boolean} Whether the given argument is an valid Model.
	 */
	Module.isModule = function(module) {
		return !!(module && typeof module == "object" && module.__isModule === isModuleValue);
	}
})();
