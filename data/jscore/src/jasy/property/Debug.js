/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * This helper class is only included into debug builds and do the 
 * generic property checks defined using the property configuration.
 */
qx.Bootstrap.define("qx.core.property.Debug",
{
	statics :
	{
		/**
		 * Validates the incoming parameters of a setter method
		 * 
		 * @param obj {qx.core.Object} Object which is modified
		 * @param config {Map} Property configuration
		 * @param args {arguments} List of all arguments send to the setter
		 */
		checkSetter : function(obj, config, args)
		{
			var name = config.name;

			if (args.length == 0) {
				throw new Error("Called set() method of property " + name + " on object " + obj + " with no arguments!");
			}
			
			if (args.length > 1) 
			{
				obj.warn("Called set() method of property " + name + " on object " + obj + " with too many arguments!");
				obj.trace();
			}
			
			var value = args[0];
			if (value == null)
			{
				if (!config.nullable) {
					throw new Error("Property " + name + " in object " + obj + " is not nullable!");
				}
			}
			else
			{
				var check = config.check;
				if (check)
				{
					try {
						qx.core.Type.check(value, check, obj);
					} catch(ex) {
						throw new Error("Could not set() property " + name + " of object " + obj + ": " + ex);
					}
				}
			}
		},
		

		/**
		 * Validates the incoming parameters of a resetter method
		 * 
		 * @param obj {qx.core.Object} Object which is modified
		 * @param config {Map} Property configuration
		 * @param args {arguments} List of all arguments send to the setter
		 */
		checkResetter : function(obj, config, args)
		{
			if (args.length != 0) 
			{
				obj.warn("Called reset method of property " + config.name + " on " + obj + " with too many arguments!");
				obj.trace();
			}			 
		},
		
		
		/**
		 * Validates the incoming parameters of a getter method
		 * 
		 * @param obj {qx.core.Object} Object which is queried
		 * @param config {Map} Property configuration
		 * @param args {arguments} List of all arguments send to the setter
		 */
		checkGetter : function(obj, config, args)
		{
			if (args.length != 0) 
			{
				obj.warn("Called get method of property " + config.name + " on " + obj + " with too many arguments!");
				obj.trace();
			}			 
		},
		
		
		/**
		 * Supported keys for property defintions
		 *
		 * @internal
		 */
		__propertyKeys :qx.core.Variant.select("qx.debug",
		{
			"on" : 
			{
				name				: "string",		// String
				inheritable : "boolean",	// Boolean
				nullable		: "boolean",	// Boolean
				themeable		: "boolean",	// Boolean
				refine			: "boolean",	// Boolean
				init				: null,				// var
				apply				: "string",		// String
				event				: "string",		// String
				check				: null,				// Array, String, RegExp, Function
				validate		: null				// Array, String, RegExp, Function
			},

			"default" : null
		}),


		/**
		 * Supported keys for property group definitions
		 *
		 * @internal
		 */
		__propertyGroupKeys : qx.core.Variant.select("qx.debug",
		{
			"on" : 
			{
				name			: "string",		// String
				group			: "object",		// Array
				shorthand : "boolean",	// Boolean
				themeable : "boolean"		// Boolean
			},

			"default" : null
		}),


		/**
		 * Validates a property configuration
		 * 
		 * @signature function(clazz, name, config, patch)
		 * @param clazz {Class} class to add property to
		 * @param name {String} name of the property
		 * @param config {Map} configuration map
		 * @param patch {Boolean ? false} enable refine/patch?
		 */
		validateConfig : qx.core.Variant.select("qx.debug",
		{
			"on": function(clazz, name, config, patch)
			{
				var Util = qx.core.property.Util;
				var has = Util.hasProperty(clazz, name);

				if (has)
				{
					var existingProperty = Util.getPropertyDefinition(clazz, name);

					if (config.refine && existingProperty.init === undefined) {
						throw new Error("Could not refine a init value if there was previously no init value defined. Property '" + name + "' of class '" + clazz.classname + "'.");
					}
				}

				if (!has && config.refine) {
					throw new Error("Could not refine non-existent property: " + name + "!");
				}

				if (has && !patch) {
					throw new Error("Class " + clazz.classname + " already has a property: " + name + "!");
				}

				if (has && patch)
				{
					if (!config.refine) {
						throw new Error('Could not refine property "' + name + '" without a "refine" flag in the property definition! This class: ' + clazz.classname + ', original class: ' + Util.getByProperty(clazz, name).classname + '.');
					}

					for (var key in config)
					{
						if (key !== "init" && key !== "refine") {
							throw new Error("Class " + clazz.classname + " could not refine property: " + name + "! Key: " + key + " could not be refined!");
						}
					}
				}

				var allowed = config.group ? this.__propertyGroupKeys : this.__propertyKeys;
				for (var key in config)
				{
					if (allowed[key] === undefined) {
						throw new Error('The configuration key "' + key + '" of property "' + name + '" in class "' + clazz.classname + '" is not allowed!');
					}

					if (config[key] === undefined) {
						throw new Error('Invalid key "' + key + '" of property "' + name + '" in class "' + clazz.classname + '"! The value is undefined: ' + config[key]);
					}

					if (allowed[key] !== null && typeof config[key] !== allowed[key]) {
						throw new Error('Invalid type of key "' + key + '" of property "' + name + '" in class "' + clazz.classname + '"! The type of the key must be "' + allowed[key] + '"!');
					}
				}
			},

			"default" : null
		})		
	}
});