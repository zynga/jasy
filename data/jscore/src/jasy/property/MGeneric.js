/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

(function() 
{
	var setters = {};
	var getters = {};
	
	var up = function(name) {
		return name.charAt(0).toUpperCase() + name.slice(1);
	};
	
	
	/**
	 * Generic setter/getter support for property API.
	 */
	Class("jasy.property.MGeneric",
	{
		members : 
		{
			/**
			 * Generic setter. Supports two possible use cases:
			 *
			 * <code>
			 * set(property, value);
			 * set({
			 *   property: value
			 * });
			 * </code>
			 *
			 * @param property {String | Map} Name of property or map of key values
			 * @param value {var} Any value
			 * @return {var} Returns the value from the setter (if single property is used)
			 */
			set : function(property, value) 
			{
				if (arguments.length == 2) 
				{
					if (jasy.Env.isSet("debug")) {
						jasy.Test.assertString(property);
					}

					var method = setters[property];
					if (!method) {
						method = setters[property] = "set" + up(property);
					}
					
					return this[method](value);
				} 
				else
				{
					if (jasy.Env.isSet("debug")) {
						jasy.Test.assertMap(property);
					}
					
					for (var name in property) 
					{
						var method = setters[name];
						if (!method) {
							method = setters[name] = "set" + up(name);
						}

						this[method](property[name]);
					}
				}
			},


			/**
			 * Generic getter. Supports two possible use cases:
			 *
			 * <code>
			 * get(property);
			 * get(["width", "height"]);
			 * </code>
			 *
			 * @param property {String | Map} Name of property or map of key values
			 * @param value {var} Any value
			 * @return {var} Returns the value from the setter (if single property is used)
			 */
			get : function(property) 
			{
				if (typeof property == "string") 
				{
					if (jasy.Env.isSet("debug")) {
						jasy.Test.assertString(property);
					}

					var method = getters[property];
					if (!method) {
						method = getters[property] = "get" + up(property);
					}
					
					return this[method]();
				} 
				else 
				{
					if (jasy.Env.isSet("debug")) {
						jasy.Test.assertArray(property);
					}
					
					var ret = {};
					
					for (var i=0, l=property.length; i<l; i++) 
					{
						
						var name = property[i];
						var method = getters[name];
						if (!method) {
							method = getters[name] = "get" + up(name);
						}

						ret[name] = this[method]();
					}
					
					return ret;
				}
			}
		}
	});
})();

