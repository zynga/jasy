/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

Object.addPrototypeMethods("String", 
{
	/**
	 * Whether the string contains the given substring
	 *
	 * @param sub {String} Any string
	 * @return {Boolean} Whether the substring was found in the string
	 */
	contains : function(sub) {
		return this.indexOf(sub) != -1;
	},


	/**
	 * Returns a hyphenated copy of the original string e.g.
	 *
	 * * camelCase => camel-case
	 * * HelloWorld => -hello-world
	 *
	 * Via: http://es5.github.com/#x15.5.4.11
	 *
	 * @return {String} Hyphenated string
	 */
	hyphenate : function() {
		return this.replace(/[A-Z]/g,'-$&').toLowerCase();
	},


	/** 
	 * Returns a new string which is a repeated copy of the original one.
	 * 
	 * @param nr {Integer} Number of times to repeat
	 * @return {String} Repeated string
	 */
	repeat : function(nr) 
	{
		// empty array magic
		return Array(nr+1).join(this);
	},
	
	
	/** 
	 * Encodes the string into base 64 encoding.
	 *
	 * @return {String} Encoded string
	 */
	encodeBase64 : function() {
		return btoa(this);
	},
	

	/** 
	 * Decodes the string from base 64 encoding.
	 *
	 * @return {String} Decoded string
	 */
	decodeBase64 : function() {
		return atob(this);
	},
	
	
	/**
	 * Returns true if this string starts with the given substring
	 * 
	 * @return {Boolean} Whether this string starts with the given substring
	 */
	startsWith : function(begin) {
		return begin == this.slice(0, begin.length);
	},
	
	
	/**
	 * Returns true if this string ends with the given substring
	 * 
	 * @return {Boolean} Whether this string ends with the given substring
	 */
	endsWith : function(end) {
		return end == this.slice(-end.length);
	}
});