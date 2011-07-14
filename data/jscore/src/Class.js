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
	
	var isClassValue = +new Date;

	
	Core.declare("Class", function(name, config) {
	
		if (Permutation.isSet("debug")) {
			Assert.assertModuleName(name, "Invalid class name!");
			Assert.assertMap(config, "Invalid class configuration in class " + name);
			Assert.assertDefiningAllowedKeysOnly(config, ["construct","events","members","properties","include","implement"], "Invalid clas configuration in class " + name + "! Configuration key %1 is not allowed!");
			
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
		construct.__isClass = isClassValue;
	
		// Add displayName
		construct.displayName = name;
	
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
				var includeLength = include.length;
				
				if (includeLength == 1) {
					Assert.assertClass(mixin, "Class " + name + " includes invalid mixin " + include[i] + " at position: " + i + "!");
				} else {
					var includeMemberKeys = {};
					for (var i=0; i<includeLength; i++) {
						var mixin = include[i];
						var mixinMemberKeys = Object.keys(mixin.prototype);
						
						for(var j=0, jl=mixinMemberKeys.length; j<jl; j++) {
							var mixinMemberKey = mixinMemberKeys[j];
							if (includeMemberKeys.hasOwnProperty(mixinMemberKey)) {
								throw new Error('Conflicting member "' + mixinMemberKey + '" between classes ' + includeMemberKeys[mixinMemberKey] + ' and ' + mixin);
							}

							includeMemberKeys[mixinMemberKey] = mixin;
						}
					}
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
