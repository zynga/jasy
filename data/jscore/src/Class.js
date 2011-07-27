/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

// Include ES5 support if not natively supported
if(!Permutation.isSet("es5")) 
{
	// These classes don't really exist, so we need to protect the access.
	try{
		es5.Array;
		es5.Date;
		es5.String;
		es5.JSON;
	} catch(ex) {};
}

(function(global, undef) {
	var genericToString = function() {
		return "[class " + this.className + "]";
	};
	
	var isClassValue = +new Date;

	
	
	if (Permutation.isSet("debug"))
	{
		var checkMixinMemberConflicts = function(include, members, name) 
		{
			// Simplifies routine
			if (!members) {
				members = {};
			}

			var allIncludeMembers = {};
			for (var i=0, l=include.length; i<l; i++) 
			{
				var includedClass = include[i];
				var includedMembers = Object.keys(includedClass.prototype);

				for(var j=0, jl=includedMembers.length; j<jl; j++) 
				{
					var key = includedMembers[j];

					if (members.hasOwnProperty(key)) 
					{
						// Private member conflict with including class (must fail, always)
						if (key.substring(0,2) == "__") {
							throw new Error("Included class " + includedClass.className + " overwrites private member of class " + name);
						}

						// members are allowed to override protected and public members of any included class
					}

					if (allIncludeMembers.hasOwnProperty(key)) 
					{
						// Private members conflict between included classes (must fail, always)
						if (key.substring(0,2) == "__") {
							throw new Error("Included class " + includedClass.className + " overwrites private member of other included class " + allIncludeMembers[key].className + " in class " + name);
						}

						// If both included classes define this key as a function check whether 
						// the members section has a function as well (which might call both of them).
						if (key in members && members[key] instanceof Function && includedClass.prototype[key] instanceof Function && allIncludeMembers[key].prototype[key] instanceof Function) {
							// pass
						} else {
							throw new Error("Included class " + includedClass.className + " overwrites member " + key + " of other included class " + allIncludeMembers[key].className + " in class " + name);
						}
					}

					allIncludeMembers[key] = includedClass;
				}
			}
		};

		// Events between included classes must not collide
		// Including class can override any event 
		var checkMixinEventConflicts = function(include, events, name) 
		{
			var allIncludeEvents = {};
			for (var i=0, l=include.length; i<l; i++) 
			{
				var includedClass = include[i];
				var includedEvents = includedClass.__events;

				for (var eventName in includedEvents) {
					if (eventName in allIncludeEvents) {
						throw new Error("Included class " + includedClass.className + " overwrites event of other included class " + allIncludeEvents[key].className + " in class " + name);
					}

					allIncludeEvents[eventName] = includedClass;
				}
			}
		};


		// Properties between included classes must not collide
		// Including class can override any property
		var checkMixinPropertyConflicts = function(include, properties, name) 
		{
			var allIncludeProperties = {};
			for (var i=0, l=include.length; i<l; i++) 
			{
				var includedClass = include[i];
				var includedProperties = includedClass.__properties;

				for (var propertyName in includedProperties) {
					if (propertyName in allIncludeProperties) {
						throw new Error("Included class " + includedClass.className + " overwrites event of other included class " + allIncludeEvents[key].className + " in class " + name);
					}

					allIncludeProperties[propertyName] = includedClass;
				}
			}
		};
	}
	
	
	var propertyJoinableNames = {};
	
	
	
	Module.declareName("Class", function(name, config) 
	{
		if (Permutation.isSet("debug")) 
		{
			Assert.assertModuleName(name, "Invalid class name " + name + "!");
			Assert.assertMap(config, "Invalid class configuration in " + name);
			Assert.assertHasAllowedKeysOnly(config, ["construct","events","members","properties","include","implement"], 
				"Invalid configuration in class " + name + "! Unallowed key(s) found!");
			
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

		// Attach events and properties data (use cryptic private fields for class storage)
		var events = construct.__events = config.events || {};
		var properties = construct.__properties = config.properties || {};
		
		// Prototype (stuff attached to all instances)
		var proto = construct.prototype;
	
	
	
		// ------------------------------------
		//   LOCALS
		// ------------------------------------
	
		// Add properties
		var properties = construct.__properties = config.properties || {};
		for (var propertyName in properties) 
		{
			var propertyConfig = properties[propertyName];
			
			// Inject property name into config
			propertyConfig.name = propertyName;

			// Create members via specific property implementation 
			if (config.group) {
				var propertyMembers = jasy.property.Group.create(propertyConfig);
			} else if (config.themeable || config.inheritable || jasy.property.Core.RUNTIME_OVERRIDE) {	
				var propertyMembers = jasy.property.Multi.create(propertyConfig);
			} else {
				var propertyMembers = jasy.property.Simple.create(propertyConfig);
			}
			
			// Prepare function names
			var propertyMethodPostfix = propertyJoinableNames[propertyName];
			if (propertyMethodPostfix === undef) 
			{
				propertyMethodPostfix = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
				propertyJoinableNames[propertyName] = propertyMethodPostfix;
			}
			
			// Attach property methods
			for (var propertyMemberKey in propertyMembers) 
			{
				var propertyMemberName = propertyMemberKey + propertyMethodPostfix;
				var propertyMember = propertyMembers[propertyMemberKey];
				
				proto[propertyMemberName] = propertyMember;
				propertyMember.displayName = name + "." + propertyMemberName;
			}
		}
		
		
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
		
		
	
	
		// ------------------------------------
		//   MIXINS
		// ------------------------------------
	
		// Insert other classes
		var include = config.include;
		if (include) 
		{
			if (Permutation.isSet("debug")) 
			{
				for (var i=0, l=include.length; i<l; i++) {
					Assert.assertClass(include[i], "Class " + name + " includes invalid class " + include[i] + " at position: " + i + "!");
				}
				
				checkMixinMemberConflicts(include, members, name);
				checkMixinEventConflicts(include, events, name);
				checkMixinPropertyConflicts(include, properties, name);
			}

			for (var i=0, l=include.length; i<l; i++) 
			{
				var includedClass = include[i];
				
				// Just remap members. Validation already happended in debug mode.
				// Function name keeps to be the same after inclusion. Still refering to original class.
				var includeMembers = includedClass.prototype;
				for (var key in includeMembers) {
					proto[key] = includeMembers[key];
				}
				
				// Just copy over the property data. Methods are already in member section.
				var includeProperties = includedClass.__properties;
				for (var key in includeProperties) {
					properties[key] = includeProperties[key];
				}

				// Events is just data to copy over.
				var includeEvents = includedClass.__events;
				for (var key in includeEvents) {
					events[key] = includeEvents[key];
				}
			}
		}
		
		

		// ------------------------------------
		//   INTERFACES
		// ------------------------------------
	
		if (Permutation.isSet("debug")) 
		{
			var implement = config.implement;
			if (implement) 
			{
				var iface;
				for (var i=0, l=implement.length; i<l; i++) 
				{
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
		
		
		// ------------------------------------
		//   FINISH
		// ------------------------------------
		
		// Attach to namespace
		Module.declareName(name, construct, true);
	});


	/**
	 * Resolves a given Class name
	 *
	 * @param className {String} Name to resolve
	 * @return {Object} Returns the Class stored under the given name
	 */
	Class.getByName = function(className) {
		if (Permutation.isSet("debug")) {
			Assert.assertString(className);
		}
		
		var obj = Module.resolveName(className);
		return isClass(obj) ? obj : null;
	};


	/**
	 * Returns the events supported by the given class
	 *
	 * @param cls {Class} Class to query
	 * @return {Map} Map of all events and their type
	 */
	Class.getEvents = function(cls) {
		if (Permutation.isSet("debug")) {
			Assert.assertClass(cls);
		}
		
		return cls.__events;
	};
	
	
	/**
	 * Returns the properties supported by the given class
	 *
	 * @param cls {Class} Class to query
	 * @return {Map} Map of all properties and their configuration
	 */
	Class.getProperties = function(cls) {
		if (Permutation.isSet("debug")) {
			Assert.assertClass(cls);
		}
		
		return cls.__properties;
	};	


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
		if (Permutation.isSet("debug")) {
			Assert.assertClass(cls, "Class to check for including class is itself not a class!");
			Assert.assertClass(incCls, "Class to check for being included is not a class!");
		}
		
		return cls.__includes.indexOf(incCls) != -1;
	};
	
	
	// Add assertions
	Assert.add(isClass, "isClass", "Invalid class!");
	Assert.add(includesClass, "includesClass", "Does not include class %1!");
	
})(this);
