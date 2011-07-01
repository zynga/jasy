/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

Core.declare("Class", function(name, config) {
	
	var placeholder = new Function;
	var construct = config.construct || placeholder;
	var proto = construct.prototype;
	
	// Store name
	construct.classname = name;
	
	// Add toString()
	construct.toString = new Function(name, "return '[Class ' + name + ']'");

	// Attach to namespace
	Core.declare(name, construct);
	
	// Add members
	if (config.members) {
		var proto = construct.prototype = config.members;
	} else {
		var proto = construct.prototype;
	}
	
	// Add classname
  proto.classname = name;
	
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
	
	// Insert mixins
	var include = config.include;
	if (include) {
		var mixin, mixinproto;
		for (var i=0, l=include.length; i<l; i++) {
			mixin = include[i];
			mixinproto = mixin.prototype;
			if (!mixinproto) {
				throw new Error("Class " + name + " includes invalid mixin " + include[i] + " at position: " + i + "!");
			}
			
			// Merge in member section
			for (var key in mixin) {
				if (proto[key]) {
					throw new Error("Class " + name + " has already a member with the name: " + key + "! Class " + mixin.classname + " could not be included!");
				}
				
				proto[key] = mixinproto[key];
			}
			
			// Copy over event data
			var mixinEvents = mixin.__events;
			for (var key in mixinEvents) {
				if (key in events) {
					throw new Error("Class " + name + " has already a property with the name: " + key + "! Class " + mixin.classname + " could not be included!");
				}
				
				events[key] = mixinEvents[key];
			}

			// Copy over property data (setter/getters are already on the member section)
			var mixinProperties = mixin.__properties;
			for (var key in mixinProperties) {
				if (key in properties) {
					throw new Error("Class " + name + " has already a property with the name: " + key + "! Class " + mixin.classname + " could not be included!");
				}
				
				properties[key] = mixinProperties[key];
			}
		}
	}
	
	// Verify interfaces
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
	
	// Attach class utilities
	construct.getEvents = 
	
});
