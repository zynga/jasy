/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

if (!RegExp.isRegExp) {
	(function(toString){
		/**
		 * Whether the given value is an regular expression.
		 *
		 * @signature function(value)
		 * @param value {var} Value to test
		 * @return {Boolean} Whether the given value is an regular expression
		 */
		RegExp.isRegExp = function(value) {
			return value != null && toString.call(value) == "[object RegExp]";
		}
	})(Object.prototype.toString);
}

