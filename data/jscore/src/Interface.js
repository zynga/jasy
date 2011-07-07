/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/


(function() {
	var genericToString = function() {
		return "[Interface " + this.name + "]";
	};
	
	/**
	 * Define a interface which can be used for validation of objects.
	 * 
	 * @param name {String} Name of Interface
	 * @param config {Map} Data structure containing the keys 'events', 'properties' and 'members'.
	 */
	Core.declare("Interface", function(name, config) {
		console.debug("Defining interface: " + name);
		
		Core.declare(name, {
			__properties : config.properties,
			__events : config.events,
			__members : config.members,
			__isInterface : true,
			name : name,
			toString : genericToString,
			valueOf : genericToString
		});
	});

	Interface.assert = function(object, iface) {

		var clazz = object.constructor;
	
		var ievents = iface.__events;
		if (clazz.getEvents()) {
		
		}
	
	
		var iproperties = iface.__properties;
		var imembers = iface.__members;
	
	
	
	
	};


	/**
	 * Whether the given object is a Model
	 */
	Interface.isInterface = function(iface) {
		return !!(iface && typeof iface == "object" && iface.__isInterface);
	}
})();