/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

if (!Date.isDate) {
	(function(toString){
		/**
		 * Whether the given value is a date.
		 *
		 * @signature function(value)
		 * @param value {var} Value to test
		 * @return {Boolean} Whether the given value is a date
		 */
		Date.isDate = function(value) {
			return value != null && toString.call(value) == "[object Date]";
		}
	})(Object.prototype.toString);
}
