/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

Module("jasy.bom.FormItem",
{
	isSuccessful: function(item) 
	{
		if (!item.name || item.disabled) {
			return false;
		}
		
		switch (item.type) 
		{
			case "button":
			case "reset":
				return false;
				
			case "radio":
			case "checkbox":
				return item.checked;
				
			case "image":
			case "submit":
				return item == (item.ownerDocument || item.document).activeElement;
		}
		
		return true;
	},
	
	serialize: function(item) {
		return item.name + "=" + encodeURIComponent(item.value);
	}
});