/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

(function(slice) 
{
	/**
	 * Expand shorthand definition to a four element list.
	 * This is an utility function for padding/margin and all other shorthand handling.
	 *
	 * @param data {Array} array with one to four items
	 * @return {Array} an array with four items
	 */
	var expandShortHand = function(data)
	{
		// Copy Values (according to the length)
		switch(data.length)
		{
			case 1:
				data[1] = data[2] = data[3] = data[0];
				break;

			case 2:
				data[2] = data[0];
				// no break here

			case 3:
				data[3] = data[1];
		}

		// Return list with 4 items
		return data;
	};
	
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
		 * Creates a new property group and returns the corresponding methods.
		 * 
		 * @param config {Map} Property configuration map
		 */
		create : function(config)
		{
			var shorthand = config.shorthand;
			var group = config.group;
			var length = group.length;
			var self = this;
			
			return {
				set : function(first, second, third, fourth)
				{
					var data = arguments.length > 1 ? arguments : first;
					if (shorthand) {
						data = expandShortHand(slice.call(data));
					}

					var map = {};
					for (var i=0; i<length; i++) {
						map[group[i]] = data[i];
					}

					this.set(map);
				},
				
				get : function()
				{
					for (var i=0; i<length; i++) {
						this.reset(group[i]);
					}
				}
			};
		}
	});
})(Array.prototype.slice);
