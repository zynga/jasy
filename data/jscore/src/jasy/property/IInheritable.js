/*
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * For classes which use inheritable properties.
 */
Interface("jasy.property.IInheritable",
{
	members : 
	{
		/**
		 * Returns the inherited value of the given property
		 */
		getInheritedValue : function(property) {}
	}
});
