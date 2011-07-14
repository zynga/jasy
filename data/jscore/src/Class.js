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
	
	var detectConflicts = function(obj1, obj2, where, target) {
		for (var key in obj1) {
			if (key in obj2) {
				throw new Error("Conflicting fields in " + where + " through " + obj1 + " and " + obj2 + " joining in: " + target);
			}
		}
	};
	
	var isClassValue = +new Date;
	
	Core.declare("Class", function(name, config) {
	
		if (Permutation.isSet("debug")) {
			Assert.assertModuleName(name, "Invalid class name!");
			Assert.assertMap(config, "Invalid class configuration in class " + name);
		}

		if (Permutation.isSet("debug")) {
			config.construct && Assert.assertFunction("Invalid class constructor in: " + name + "!");
		}
		var construct = config.construct || function construct(){};
	
		// Store name / type
		construct.className = name;
		construct.__isClass = isClassValue;
	
		// Add toString() / valueOf()
		construct.toString = genericToString;
		construct.valueOf = genericToString;

		// Attach to namespace
		Core.declare(name, construct);
		
		// Prototype (stuff attached to all instances)
		var proto = construct.prototype;
	
	
		// Insert other classes (mixin)
		var include = config.include;
		if (include) {
			if (Permutation.isSet("debug")) {
				Assert.isArray(include, "Invalid include list in class " + name);

				var includeLength = include.length;
				
				if (includeLength == 1) {
					Assert.assertClass(mixin, "Class " + name + " includes invalid mixin " + include[i] + " at position: " + i + "!");
				} else {
					var includeMemberKeys = {};
					for (var i=0; i<includeLength; i++) {
						var mixin = include[i];
						var mixinMemberKeys = Object.keys(mixin.prototype);
						console.debug("Keys: " + mixinMemberKeys)
						
						for(var mixinMemberKey in mixinMemberKeys) {
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
		
		
		// Attach members
		var members = config.members;
		var orig, entry;
		
		if (members) {
			if (Permutation.isSet("debug")) {
				Assert.isMap(include, "Invalid member section in class " + name);
			}
			
			for (var key in members) {
				orig = proto[key];
				entry = proto[key] = members[key];

				if (entry instanceof Function) {

					if (orig instanceof Function) {
						entry.__super = orig;
					}

					entry.displayName = name + "." + key;
				}
			}
		}
		
		

		
		// Add destructor 
		proto.destruct = config.destruct || function destruct(){};
	
		// Add reset method
		proto.reset = config.reset || function reset(){};
	
		// Add properties
		var properties = construct.__properties = config.properties || {};
		for (var key in properties) {
			jasy.property.Property.add(proto, key, properties[key]);
		}
	
		// Register events
		var events = construct.__events = config.events || {};
		for (var key in events) {

		}
		
		
		
	
		// Verify interfaces
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
	Assert.add(includesClass, "includesClass", "Does not include mixin %1!");
	
})();
