/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

Object.addPrototypeMethods("Number", 
{
	/**
	 * Pads the number to reach the given length
	 *
	 * @param {Integer} Expected string length
	 * @return {String} Padded number as a string
	 */
	pad : function(length) {
		return ("0".repeat(length) + this).slice(-length);
	}
});

