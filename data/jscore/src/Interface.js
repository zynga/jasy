/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

(function() {
	var genericToString = function() {
		return "[interface " + this.interfaceName + "]";
	};
	
	var removedUnusedArgs = !(function(arg1){}).length;
	
	/**
	 * Define a interface which can be used for validation of objects.
	 * 
	 * @param name {String} Name of Interface
	 * @param config {Map} Data structure containing the keys 'events', 'properties' and 'members'.
	 */
	Module.declareName("Interface", function(name, config) 
	{
		if (jasy.Env.isSet("debug")) 
		{
			jasy.Test.assertModuleName(name, "Invalid interface name " + name + "!");
			jasy.Test.assertMap(config, "Invalid interface configuration in " + name);
		}
		
		var iface = 
		{
			__properties : config.properties,
			__events : config.events,
			__members : config.members,
			__isInterface : true,
			
			/** {String} Name of the interface */
			interfaceName : name,
			
			/**
			 * Returns a string representing the Interface.
			 *
			 * @signature function() {}
			 * @return {String} String representing
			 */
			toString : genericToString,

			/**
			 * Returns a string representing the Interface.
			 *
			 * @signature function() {}
			 * @return {String} String representing
			 */
			valueOf : genericToString,
			
			/**
			 * Returns a string representing the Interface.
			 *
			 * @signature function(objOrClass) {}
			 * @param objOrClass {Object|Class} Object or Class to verify
			 * @throws Whenever the object or class does not implements the interface.
			 */
			assert : Interface.assert
		};
		
		// Attach to namespace
		Module.declareName(name, iface, true);
	});
	
	
	/**
	 * Resolves a given Interface name
	 *
	 * @param interfaceName {String} Name to resolve
	 * @return {Object} Returns the Interface stored under the given name
	 */	
	Interface.getByName = function(interfaceName) 
	{
		if (jasy.Env.isSet("debug")) {
			jasy.Test.assertString(interfaceName);
		}
		
		var obj = Module.resolveName(interfaceName);
		return isInterface(obj) ? obj : null;
	};


	/**
	 * Verifies whether the given object or class implements the given interface.
	 *
	 * * Tests all members of being defined and being the same type (based on Object.toString).
	 * * Tests all properties regarding existance. Also checks whether the outer visible aspects: events, group, themeable and inheritable are identical.
	 * * Tests all events regarding existance and whether there EventClass - if defined - is identical.
	 *
	 * @param objOrClass {Object|Class} Object or Class to verify
	 * @param iface {Interface?this} Interface to check for. Falls back to the context being called in.
	 * @throws Whenever the object or class does not implements the interface.
	 */
	Interface.assert = function(objOrClass, iface) 
	{
		if (!objOrClass) {
			throw new Error("Invalid class or object to verify interface with: " + objOrClass);
		}
		
		var cls = typeof objOrClass == "object" ? objOrClass.constructor : objOrClass;
		if (!Class.isClass(cls)) {
			throw new Error("Invalid class or object to verify interface with: " + objOrClass);
		}
		
		if (!iface && this.__isInterface) {
			iface = this;
		}
		
		if (!Interface.isInterface(iface)) {
			throw new Error("Invalid interface " + iface);
		}

		var ifaceMembers = iface.__members;
		var ifaceProperties = iface.__properties;
		var ifaceEvents = iface.__events;
		
		var commonErrMsg = "Class " + cls.className + " does not implement interface " + iface.interfaceName + ": ";
		
		if (ifaceMembers)
		{
			var cMembers = cls.prototype;
			for (var name in ifaceMembers) 
			{
				if (!(name in cMembers)) {
					throw new Error(commonErrMsg + "Missing member: " + name + "!");
				}

				var iMember = ifaceMembers[name];
				var cMember = cMembers[name];

				if (typeof iMember == typeof cMember) 
				{
					if (iMember == null) {
						continue;
					}
					
					if (cMember == null) {
						throw new Error(commonErrMsg + "Missing member: " + name + "!");
					}
					
					if (Object.prototype.toString.call(iMember).slice(8,-1) != Object.prototype.toString.call(cMember).slice(8,-1)) {
						throw new Error(commonErrMsg + "Invalid member type in :" + name + "! Expecting: " + Object.prototype.toString.call(iMember).slice(8,-1).toLowerCase());
					}
					
					if (iMember instanceof Function) 
					{
						if (!(cMember instanceof Function)) {
							throw new Error(commonErrMsg + "Different member types in: " + name + "! Expecting a function!");
						} else if (!removedUnusedArgs && iMember.length != cMember.length) {
							throw new Error(commonErrMsg + "Different number of arguments in function '" + name + "'. Expecting " + iMember.length + "!");
						}
					}
				}
				else
				{
					throw new Error(commonErrMsg + "Different member types in: " + name + "! Expecting type " + (typeof iMember));
				}
			}
		}
		
		if (ifaceProperties)
		{
			var cProperties = Class.getProperties(cls);
			for (var name in ifaceProperties) 
			{
				if (!(name in cProperties)) {
					throw new Error(commonErrMsg + "Missing property: " + name + "!");
				}
				
				var iProperty = ifaceProperties[name];
				var cProperty = cProperties[name];

				// "apply" has not outer visibility
				// "init" has not outer visibility
				// "type" is value compared
				// all others are just tested for pure existence.

				if (iProperty.type !== cProperty.type) {
					throw new Error(commonErrMsg + "Invalid property: " + name + "! Different types! Expecting " + iProperty.type + "!");
				}

				if ("nullable" in iProperty && !("nullable" in cProperty)) {
					throw new Error(commonErrMsg + "Invalid property: " + name + "! Missing 'nullable' definition!");
				}

				if ("fire" in iProperty && !("fire" in cProperty)) {
					throw new Error(commonErrMsg + "Invalid property: " + name + "! Missing 'fire' definition!");
				}

				if ("group" in iProperty && !("group" in cProperty)) {
					throw new Error(commonErrMsg + "Invalid property: " + name + "! Missing 'group' definition!");
				}
				
				if ("themeable" in iProperty && !("themeable" in cProperty)) {
					throw new Error(commonErrMsg + "Invalid property: " + name + "! Missing 'themeable' definition!");
				}
				
				if ("inheritable" in iProperty && !("inheritable" in cProperty)) {
					throw new Error(commonErrMsg + "Invalid property: " + name + "! Missing 'inheritable' definition!");
				}
			}
		}

		if (ifaceEvents)
		{
			var cEvents = Class.getEvents(cls);
			for (var name in ifaceEvents) 
			{
				if (!(name in cEvents)) {
					throw new Error(commonErrMsg + "Missing event: " + name + "!");
				}
			}
		}
	};


	/**
	 * Whether the given object is a Interface
	 *
	 * @return {Boolean} Whether the given argument is an valid Interface.
	 */
	var isInterface = Interface.isInterface = function(iface) {
		return !!(iface && typeof iface == "object" && iface.__isInterface);
	};
	
	
	// Add assertion for interface type
	jasy.Test.add(isInterface, "isInterface", "Invalid interface!");
	
})();