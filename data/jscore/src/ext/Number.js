/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
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
	},
	
	
	/**
	 * Executes the given function x-times.
	 *
	 * @param func {Function} Function to execute
	 * @param context {Object?null} Context to call function in
	 */
	times : function(func, context) {
		for (var i=0; i<this; i++) {
			context ? func.call(context) : func();
		}
	},
	
	
	/**
	 * Converts the number to a hex string.
	 *
	 * @return {String} Hex string
	 */
	hex : function() {
		return this.toString(16);
	}
});

