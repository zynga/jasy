/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * Pads the number to reach the given length
 *
 * @return {String} Padded number
 */
Number.prototype.pad = function(nr) {
	return "0".repeat(length) + this.slice(-length);
};

