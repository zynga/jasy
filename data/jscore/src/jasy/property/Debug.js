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
Module("jasy.property.Debug",
{
	/**
	 * Validates the incoming parameters of a setter method
	 * 
	 * @param obj {Object} Object which is modified
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
					//qx.core.Type.check(value, check, obj);
				} catch(ex) {
					throw new Error("Could not set() property " + name + " of object " + obj + ": " + ex);
				}
			}
		}
	},
	

	/**
	 * Validates the incoming parameters of a resetter method
	 * 
	 * @param obj {Object} Object which is modified
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
	 * @param obj {Object} Object which is queried
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
	}
});