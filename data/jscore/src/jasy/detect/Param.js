/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

Module("jasy.detect.Param",
{
	/**
	 * Returns the value of the given parameter
	 *
	 * @param name {String} Parameter name
	 * @return {String} Parameter value
	 */
	get : (function() 
	{
		var items = location.search.substring(1).split("&");
		var map = {};
		
		var translate = 
		{
			"true" : true,
			"false" : false,
			"null" : null
		};
		
		for (var i=0, l=items.length; i<l; i++) 
		{
			var item = items[i];
			var pos = item.indexOf("=");
			
			var name = pos == -1 ? item : item.substring(0, pos);
			var value = pos == -1 ? true : item.substring(pos+1);
			
			if (value in translate) {
				value = translate[value];
			} else if ("" + parseFloat(value, 10) == value) {
				value = parseFloat(value, 10);
			}
		
			map[name] = value;
		}
		
		// Cleanup temporary reference types
		items = translate = null;
		
		return function get(name) {
			return name in map ? map[name] : null;
		}
	})()
});
