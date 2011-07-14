/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

// Some code is based on the work of:
// ES5 Shim
// MIT License, Copyright (c) 2009, 280 North Inc. http://280north.com/ 

if (!Object.isObject) {
	/**
	 * Whether the given value is an object.
	 *
	 * @signature function(value)
	 * @param value {var} Value to test
	 * @return {Boolean} Whether the given value is an object
	 */
	Object.isObject = function(value) {
		return value != null && typeof value == "object";
	}
}

(function(toString){
	/**
	 * Whether the given value is an trivial object aka map. This blocks
	 * all instances of objects not directly created by the Object constructor.
	 *
	 * @signature function(value)
	 * @param value {var} Value to test
	 * @return {Boolean} Whether the given value is an trivial object aka map.
	 */
	Object.isMap = function(value) {
		return value != null && toString.call(value) == "[object Object]";
	}
})(Object.prototype.toString);


// ES5 15.2.3.14
// http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
if (!Object.keys) {

    var hasDontEnumBug = true,
        dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null})
        hasDontEnumBug = false;

    Object.keys = function keys(object) {

        if (
            typeof object !== "object" && typeof object !== "function"
            || object === null
        )
            throw new TypeError("Object.keys called on a non-object");

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }

        return keys;
    };

}
