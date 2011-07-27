/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

Object.addObjectMethods("Array", 
{
	/**
	 * Converts the given arguments object into an array.
	 *
	 * Via: http://jsperf.com/arrayifying-arguments/4
	 *
	 * @param args {arguments} Arguments object to convert
	 * @return {Array} Created array instance
	 */
	fromArguments : function(args) {
		return Array.apply(null, args);
	}
});

Object.addPrototypeMethods("Array", 
{
	/**
	 * Returns the maximum number in the array.
	 *
	 * @return {Number} Maximum number
	 */
	max : function() {
		return Math.max.apply(Math, this);
	},

	/**
	 * Returns the minimum number in the array.
	 *
	 * @return {Number} Minimum number
	 */
	min : function() {
		return Math.min.apply(Math, this);
	},

	/**
	 * Whether the array contains the given value
	 *
	 * @param value {var} Any value
	 * @return {Boolean} Whether the value was found in the array
	 */
	contains : function(value) {
		return ~this.indexOf(value);
	},

	// Array Remove - By John Resig (MIT Licensed)
	// http://ejohn.org/blog/javascript-array-remove/
	removeRange : function(from, to) 
	{
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	}
})

