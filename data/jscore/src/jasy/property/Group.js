/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * Internal class for handling of dynamic property groups. Should only be used
 * through the methods provided by {@link qx.Class}.
 *
 * For a complete documentation of properties take a
 * look at http://qooxdoo.org/documentation/developer_manual/properties. 
 *
 * Property groups are defined in a similar way but support a different set of keys:
 *
 * <table>
 *   <tr><th>Name</th><th>Type</th><th>Description</th></tr>
 *   <tr><th>group</th><td>String[]</td><td>
 *     A list of property names which should be set using the propery group.
 *   </td></tr>
 *   <tr><th>themeable</th><td>Boolean</td><td>
 *     Whether this property can be set using themes.
 *   </td></tr>
 *   <tr><th>shorthand</th><td>Boolean</td><td>
 *     If enabled, the properties can be set using a CSS like shorthand mode e.g. 
 *     expanding two given values into 4 applied values.
 *   </td></tr>
 * </table>
 */
Module("jasy.property.Group",
{
	/**
	 * Expand shorthand definition to a four element list.
	 * This is an utility function for padding/margin and all other shorthand handling.
	 *
	 * @param input {Array|arguments} array or arguments object with one to four elements
	 * @return {Array} an array with four elements
	 */
	expandShortHand : function(input)
	{
		var result = input instanceof Array ? input.concat() : Array.prototype.slice.call(input);

		// Copy Values (according to the length)
		switch(result.length)
		{
			case 1:
				result[1] = result[2] = result[3] = result[0];
				break;

			case 2:
				result[2] = result[0];
				// no break here

			case 3:
				result[3] = result[1];
		}

		// Return list with 4 items
		return result;
	},
	
			
	/**
	 * Creates a new property group and returns the corresponding methods.
	 * 
	 * @param config {Map} Property configuration map
	 */
	create : function(config)
	{
		var upname = qx.Bootstrap.firstUp(name);
		var members = clazz.prototype;
		var shorthand = config.shorthand;
		var group = config.group;
		var length = group.length;
		var self = this;
		var members = {};
		
		members.set = function(first, second, third, fourth)
		{
			var data = first instanceof Array ? first : arguments;
			if (shorthand) {
				data = self.expandShortHand(data);
			}

			var map = {};
			for (var i=0; i<length; i++) {
				map[group[i]] = data[i];
			}

			this.set(map);
		};

		members.reset = function()
		{
			for (var i=0; i<length; i++) {
				this.reset(group[i]);
			}
		};
		
		return members;
	}
});