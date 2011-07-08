/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

(function() {
	var genericToString = function() {
		return "[Interface " + this.interfaceName + "]";
	};
	
	var removedUnusedArgs = !(function(arg1){}).length;
	
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
			interfaceName : name,
			toString : genericToString,
			valueOf : genericToString
		});
	});

	/**
	 *
	 */
	Interface.assert = function(objOrClass, iface) {
		
		var cls = typeof objOrClass == "object" ? objOrClass.constructor : objOrClass;
		var clsMembers = cls.prototype;
		var iface = this.__isInterface ? this : iface;
		var ifaceMembers = iface.__members;
		
		var commonErrMsg = "Class " + cls.className + " does not implement interface " + iface.interfaceName + ": ";
		
		for (var key in ifaceMembers) {
			var iMember = ifaceMembers[key];
			var cMember = clsMembers[key];
			
			if (typeof iMember == typeof cMember) {
				if (iMember instanceof Function) {
					if (cMember instanceof Function) {
						if (!removedUnusedArgs && iMember.length != cMember.length) {
							throw new Error(commonErrMsg + "Different number of arguments in function '" + key + "'. Expecting " + iMember.length + "!");
						}
					} else {
						throw new Error(commonErrMsg + "Different member types in: " + key + "!");
					}
				}
			} else {
				throw new Error(commonErrMsg + "Different member types in: " + key + "!");
			}
		}
		
		
	};

	/**
	 * Whether the given object is a Model
	 */
	Interface.isInterface = function(iface) {
		return !!(iface && typeof iface == "object" && iface.__isInterface);
	};
})();