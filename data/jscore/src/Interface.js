/**
 * Define a interface which can be used for validation of objects.
 * 
 * @param name {String} Name of Interface
 * @param config {Map} Data structure containing the keys 'events', 'properties' and 'members'.
 */
Core.declare("Interface", function(name, config) {
	Core.declare(name, {
		__properties : config.properties,
		__events : config.events,
		__members : config.members
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

