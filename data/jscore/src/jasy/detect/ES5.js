/* 
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

// The "es5" package contains:
//
// - Array.isArray
// - Array.prototype.forEach
// - Array.prototype.map
// - Array.prototype.filter
// - Array.prototype.every
// - Array.prototype.some
// - Array.prototype.reduce
// - Array.prototype.reduceRight
// - Array.prototype.indexOf
// - Array.prototype.lastIndexOf
// 
// - Date.prototype.toISOString
// - Date.prototype.toJSON
// 
// - String.prototype.trim
// 
// - JSON.parse
// - JSON.stringify
//
// These ES5 methods are already fixed by loading the whole "fix" package:
//
// - Date.now
// - Object.keys
// - Function.prototype.bind

Module("jasy.detect.ES5", {
	// If this results in false, we should load the ES5 package to fix missing features.
	// Don't include Function.bind() as this is natively not supported widely and would mean to include a lot of code just for it.
	VALUE : !!(Array.isArray && Array.prototype.map && Date.prototype.toISOString && String.prototype.trim && this.JSON)
});


