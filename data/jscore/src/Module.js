/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * Define a module with static methods
 * 
 * @param name {String} Name of Module
 * @param members {Map} Data structure containing the members
 */
Core.declare("Module", function(name, members) {
	Core.declare(name, members);
});
