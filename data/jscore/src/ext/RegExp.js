/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * Whether the given value is an regular expression.
 *
 * @param value {var} Value to test
 * @return {Boolean} Whether the given value is an regular expression
 */
RegExp.isRegExp = function isRegExp(value) {
	return value instanceof RegExp;
};

Assert.add(RegExp.isRegExp, "isRegExp", "Not a regular expression!");
