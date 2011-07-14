/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

(function() {
	var genericToString = function() {
		return "[Class " + this.className + "]";
	};
	
	var checkMixinMemberConflicts = function(include, members, name) {
		var allIncludeKeys = {};
		
		if (!members) {
			members = {};
		}
		
		for (var i=0, l=include.length; i<l; i++) {
			var mixin = include[i];
			var mixinKeys = Object.keys(mixin.prototype);
			
			for(var j=0, jl=mixinKeys.length; j<jl; j++) {
				var field = mixinKeys[j];
				
				if (members.hasOwnProperty(field)) {
					// Private field conflict with including class (must fail, always)
					if (field.substring(0,2) == "__") {
						throw new Error("Included class " + mixin.className + " overwrites private field of class " + name);
					}
					
					// members are allowed to override protected and public fields of any included class
				}
				
				if (allIncludeKeys.hasOwnProperty(field)) {
					// Private field conflict between included classes (must fail, always)
					if (field.substring(0,2) == "__") {
						throw new Error("Included class " + mixin.className + " overwrites private member of other included class " + allIncludeKeys[field].className + " in class " + name);
					}
					
					// If both included classes define this field as a function check whether 
					// the members section has a function as well (which might call both of them).
					if (field in members && members[field] instanceof Function && mixin.prototype[field] instanceof Function && allIncludeKeys[field].prototype[field] instanceof Function) {
						// pass
					} else {
						throw new Error("Included class " + mixin.className + " overwrites member of other included class " + allIncludeKeys[field].className + " in class " + name);
					}
				}
				
				allIncludeKeys[field] = mixin;
			}
		}
	};
	
	var checkMixinPropertyConflicts = function() {};
	var checkMixinEventConflicts = function() {};
	
	
	
	var isClassValue = +new Date;

	
	Core.declare("Class", function(name, config) {
	
		if (Permutation.isSet("debug")) {
			Assert.assertModuleName(name, "Invalid class name!");
			Assert.assertMap(config, "Invalid class configuration in class " + name);
			Assert.assertDefiningAllowedKeysOnly(config, ["construct","events","members","properties","include","implement"], 
				"Invalid clas configuration in class " + name + "! Configuration key %1 is not allowed!");
			
			if ("construct" in config) {
				Assert.assertFunction(config.construct, "Invalid constructor in class " + name + "!");
			}
			
			if ("events" in config) {
				Assert.assertMap(config.events, "Invalid event data in class " + name + "!");
			}
			
			if ("members" in config) {
				Assert.assertMap(config.members, "Invalid member section in class " + name);
			}

			if ("properties" in config) {
				Assert.assertMap(config.properties, "Invalid properties section in class " + name);
			}
			
			if ("include" in config) {
				Assert.assertArray(config.include, "Invalid include list in class " + name);
			}

			if ("implement" in config) {
				Assert.assertArray(config.implement, "Invalid implement list in class " + name);
			}
		}
		
		
		
		// ------------------------------------
		//   CONSTRUCTOR
		// ------------------------------------
		
		var construct = config.construct || function construct(){};
	
		// Store name / type
		construct.className = name;
		construct.displayName = name;
		construct.__isClass = isClassValue;
	
		// Add toString() / valueOf()
		construct.toString = genericToString;
		construct.valueOf = genericToString;

		// Attach to namespace
		Core.declare(name, construct);
		
		// Attach events data
		construct.__events = config.events || {};
		
		// Prototype (stuff attached to all instances)
		var proto = construct.prototype;
	
	
	
		// ------------------------------------
		//   LOCALS
		// ------------------------------------
	
		// Attach members
		var members = config.members;
		if (members) {
			for (var key in members) {
				var entry = proto[key] = members[key];
				if (entry instanceof Function) {
					entry.displayName = name + "." + key;
				}
			}
		}
		
		
		// Add properties
		var properties = construct.__properties = config.properties || {};
		for (var key in properties) {
			jasy.property.Property.add(proto, key, properties[key]);
		}
	
	
	
	
	
		// ------------------------------------
		//   MIXINS
		// ------------------------------------
	
		// Insert other classes (mixin)
		var include = config.include;
		if (include) {
			if (Permutation.isSet("debug")) {
				for (var i=0, l=include.length; i<l; i++) {
					Assert.assertClass(include[i], "Class " + name + " includes invalid mixin " + include[i] + " at position: " + i + "!");
				}
				
				if (include.length > 1) {
					checkMixinMemberConflicts(include, members, name);
					checkMixinPropertyConflicts();
					checkMixinEventConflicts();
				}
			}

			for (var i=0, l=include.length; i<l; i++) {
				var mixinproto = include[i].prototype;
				for (var key in mixinproto) {
					proto[key] = mixinproto[key];
				}
			}
		}
		
		

		// ------------------------------------
		//   INTERFACES
		// ------------------------------------
	
		if (Permutation.isSet("debug")) {
			var implement = config.implement;
			if (implement) {
				var iface;
				for (var i=0, l=implement.length; i<l; i++) {
					iface = implement[i];
					if (!iface) {
						throw new Error("Class " + name + " implements invalid interface " + iface + " at position: " + i);
					}

					try {
						Interface.assert(construct, iface);
					} catch(ex) {
						throw new Error("Class " + name + " fails to implement given interface: " + iface + ": " + ex);
					}
				}
			}
		}
	
	});


	/**
	 * Whether the given object is a Class
	 *
	 * @return {Boolean} Whether the given argument is an valid Class.
	 */
	var isClass = Class.isClass = function(cls) {
		return !!(cls && typeof cls == "function" && cls.__isClass === isClassValue);
	};
	
	
	/**
	 * Whether the given class includes the given class.
	 *
	 * @param cls {Class} Class to check for including other class.
	 * @param incCls {Class} Class for checking if being included into first one.
	 * @return {Boolean} Whether the second class is included in the first class.
	 */
	var includesClass = Class.includesClass = function(cls, incCls) {
		Assert.assertClass(cls, "Class to check for including class is itself not a class!");
		Assert.assertClass(incCls, "Class to check for being included is not a class!");
		
		return cls.__flatIncludes.indexOf(incCls) != -1;
	};
	
	
	// Add assertions
	Assert.add(isClass, "isClass", "Invalid class!");
	Assert.add(includesClass, "includesClass", "Does not include class %1!");
	
})();
