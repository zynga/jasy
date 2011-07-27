/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

(function(global, toString, undef) {
	
	var Assert = global.Assert = 
	{
		/**
		 * Adds a new assertion check
		 *
		 * @param func {Function} Function for the test. Must return boolean.
		 * @param methodName {String} Name of the method to attach.
		 * @param assertMsg {}
		 *
		 */
		add : function(func, methodName, assertMsg) 
		{
			if(!func) {
				throw new Error("Invalid function during adding assertion for " + methodName);
			}
			
			// Attach given method as is to assertion
			this[methodName] = func;
			if(func.displayName == null) {
				func.displayName = "Assert." + methodName;
			}

			// Build assert method name
			var assertName = "assert";
			if (methodName.substring(0,2) == "is") {
				assertName += methodName.substring(2);
			} else {
				assertName += methodName.charAt(0).toUpperCase() + methodName.substring(1);
			}
			
			// Wrap method throw error for simplified throwing of exceptions in type checks
			if (func.length == 1) 
			{
				this[assertName] = function(value, customMsg) 
				{
					if (!func(value)) {
						throw new TypeError('Value: "' + value + '": ' + (customMsg||assertMsg));
					}
				};
			}
			else 
			{
				this[assertName] = function(value, test, customMsg) 
				{
					if (!func(value, test)) 
					{
						var msg = (customMsg||assertMsg).replace("%1", ""+test);
						throw new TypeError('Value: "' + value + '": ' + msg);
					}
				};
			}
			
			this[assertName].displayName = "Assert." + assertName;
		}
	};
	
	Assert.add(function(value) { return typeof value == "boolean"; }, "isBoolean", "Not boolean!");
	Assert.add(function(value) { return value === true; }, "isTrue", "Not 'true'!");
	Assert.add(function(value) { return value === false; },"isFalse", "Not 'false'!");
	Assert.add(function(value) { return typeof value == "string"; }, "isString", "Not a string!");
	Assert.add(function(value) { return typeof value == "number" && isFinite(value); }, "isNumber", "Not a number!");
	Assert.add(function(value) { return parseInt(value) === value; }, "isInteger", "Not an integer!");
	Assert.add(function(value) { return value != null; }, "isNotNull", "Is null!");

	Assert.add(function(value, match) {
		return value == match;
	}, "isEqual", "Is not equal!");

	Assert.add(function(value) {
		var type = typeof value;
		return value == null || type == "boolean" || type == "number" || type == "string";
	}, "isPrimitive", "Not a primitive value!");

	Assert.add(function(value) {
		return value != null && typeof value == "object";
	}, "isObject", "Not an object!");

	// Make not use of instanceof operator as it has a memory leak in IE and also does not work cross frame.
	// Memory leak: http://ajaxian.com/archives/working-aroung-the-instanceof-memory-leak
	// Cross frame: http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/

	Assert.add(function(value) {
		return value != null && toString.call(value) == "[object Array]";
	}, "isArray", "Not an array!");

	Assert.add(function(value) {
		return value != null && toString.call(value) == "[object Function]";
	}, "isFunction", "Not a function!");
	
	var objectOrFunction = { 
		"[object Object]" : 1, 
		"[object Function]" : 1 
	};
	
	Assert.add(function(value) {
		return value != null && !!objectOrFunction[toString.call(value)];
	}, "isFunction", "Not a function!");
	
	Assert.add(function(value) {
		return value != null && toString.call(value) == "[object RegExp]";
	}, "isRegExp", "Not a regular expression!");

	Assert.add(function(value) {
		return value != null && toString.call(value) == "[object Object]";
	}, "isMap", "Not a map (plain object)!");
	
	Assert.add(function(value, keys) 
	{
		Assert.assertMap(value);
		Assert.assertArray(keys);
		
		var valueKeys = Object.keys(value);
		for (var i=0, l=valueKeys.length; i<l; i++) 
		{
			var key = valueKeys[i];
			if (keys.indexOf(key) == -1) {
				return false;
			}
		}
		
		return true;
	}, "hasAllowedKeysOnly", "Defines a key %1 which is not allowed being used!");

	Assert.add(function(value, regexp) { 
		return typeof value == "string" && !!value.match(regexp); 
	}, "matchesRegExp", "Does not match regular expression %1!");
	
	Assert.add(function(value, list) {
		return list.indexOf(value) != -1;
	}, "isInList", "Is not in specified list!");
	
	Assert.add(function(value, clazz) {
		// Use instanceof here, but be memory safe in IE
		return value != null && value.hasOwnProperty && value instanceof clazz;
	}, "isInstanceOf", "Is not a instance of %1!");	

	Assert.add(function(obj, key) {
		return obj != null && key in obj;
	}, "hasKey", "Missing key %1!");
	
})(this, Object.prototype.toString);
