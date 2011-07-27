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
	 * Returns the sum of all values in the array.
	 *
	 * @return {Number} Sum of all values.
	 */
	sum : function() 
	{
		var sum = 0;
		this.forEach(function(value) {
			sum += value;
		});
		
		return sum;
	},

	
	/**
	 * Inserts the given value at the given position
	 *
	 * @param value {var} Any value
	 * @param pos {Integer?null} Position to insert to (defaults to the end). Supports negative values, too
	 * @return {var} Returns the inserted value
	 */
	insertAt : function(value, pos) 
	{
		pos == null ? this.push(value) : this.splice(pos < 0 ? this.length+pos : pos, 0, value);
		return value;
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
	
	
	/**
	 * Clones the whole array and returns it.
	 *
	 * @return {Array} Cloned array
	 */
	clone : function() 
	{
		// Wrap method for security reaons, so params to concat are safely ignored.
		return this.concat();
	},

	
	/** 
	 * Removes the given value (first only) from the array and returns it.
	 *
	 * @param value {var} Any value
	 * @return {var} The removed value (if it was found, otherwise undefined)
	 */
	remove : function(value) 
	{
		var pos = this.indexOf(value);
		if (pos != -1) 
		{
			this.splice(pos, 1);
			return value;
		}
	},
	
	
	/**
	 * Returns a new array with all elements that are unique in the original array
	 * based on a toString comparison. Uses first item of each from original array.
	 * 
	 * @return {Array} Newly created filtered array
	 */
	unique : function() 
	{
		var strings = {};
		return this.filter(function(value) 
		{
			if (!strings.hasOwnProperty(value)) {
				return strings[value] = true;
			}
		});
	},
	

	/** 
	 * Removes the value at the given index.
	 *
	 * @param index {Integer} Index to delete, supports negative indexes, too
	 * @return {var} Returns the value which was removed (if so)
	 */
	removeAt : function(index) 
	{
		if (Permutation.isSet("debug")) {
			Assert.assertInteger(index, "Param 'index' must be be an integer!");
		}
		
		var ret = this.splice(index<0?this.length+index:index, 1);
		if (ret.length) {
			return ret[0];
		}
	},


	/**
	 * Removes a specific index or range from the array. Also support negative indexes.
	 *
	 * Based on Array Remove - By John Resig (MIT Licensed)
	 * http://ejohn.org/blog/javascript-array-remove/
	 *
	 * @param from {Integer} Start index
	 * @param to {Integer} End index
	 * @return {Integer} Length of modified array
	 */
	removeRange : function(from, to) 
	{
		if (Permutation.isSet("debug")) {
			Assert.assertInteger(from, "Param 'from' must be be an integer!");
			Assert.assertInteger(to, "Param 'to' must be be an integer!");
		}

		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	}
});

