/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

(function() 
{
	var FormItem = jasy.bom.FormItem;
	
	Module("jasy.bom.Form",
	{
		serialize: function(form) {
			return filter(form.elements, FormItem.isSuccessful).map(FormItem.serialize).join("&");
		}
	});
})

