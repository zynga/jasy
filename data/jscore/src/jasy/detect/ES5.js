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
// - Date.now
// - Date.prototype.toISOString
// - Date.prototype.toJSON
// 
// - String.prototype.trim
//
// These are already fixed by Core:
//
// - Object.keys
// - Function.prototype.bind

Core.declare("jasy.detect.ES5", {
	// If this results in false, we should load the ES5 package to fix missing features.
	// Don't include Function.bind() as this is natively not supported widely and would mean to include a lot of code just for it.
	VALUE : !!(Array.isArray && Array.prototype.map && Date.now && Date.prototype.toISOString && String.prototype.trim && this.JSON)
});


