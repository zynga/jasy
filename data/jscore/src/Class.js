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
	
		console.debug("Defining class: " + name);
		
		if (jasy.Permutation.isSet("debug")) {
			Assert.isTrue(Module.isValidName(name), "Invalid class name!");
			Assert.isMap(config, "Invalid class configuration");
		}
	
		var placeholder = new Function;
		var construct = config.construct || placeholder;
	
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
	
		// Insert mixins
		var include = config.include;
		if (include) {
			var mixin, mixinproto;
			for (var i=0, l=include.length; i<l; i++) {
				mixin = include[i];
				mixinproto = mixin.prototype;
				if (jasy.Permutation.isSet("debug") && !mixinproto) {
					throw new Error("Class " + name + " includes invalid mixin " + include[i] + " at position: " + i + "!");
				}
			
				detectConflicts(proto, mixin);
				
				for (var key in mixinproto) {
					proto[key] = mixinproto[key];
				}
			}
		}
		
		// Attach members
		var members = config.members;
		var orig, entry;
		
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
		
		

		
		// Add destructor 
		proto.destruct = config.destruct || placeholder;
	
		// Add reset method
		proto.reset = config.reset || placeholder;
	
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
		if (jasy.Permutation.isSet("debug")) {
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
	
		// Attach class utilities
		// construct.getEvents = 
	
	});


	/**
	 * Whether the given object is a Class
	 *
	 * @return {Boolean} Whether the given argument is an valid Class.
	 */
	Class.isClass = function(cls) {
		return !!(cls && typeof cls == "function" && cls.__isClass === isClassValue);
	}
})();