/*
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * For classes which use inheritable properties.
 */
Interface("jasy.property.IThemeable",
{
	members : 
	{
		/**
		 * Returns the themed value of the given property
		 */
		getThemedValue : function(property) {}
	}
});
