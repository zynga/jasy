/* 
==================================================================================================
	Jasy - JavaScript Tooling Framework
	Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

(function(global, toString, undef) 
{
	if (!global.jasy) {
		global.jasy = {};
	}
	
	/**
	 * Test module
	 *
	 * It also bundles all fixes under "fix/" before starting with the real code.
	 *
	 * @require {fix.ArrayIndexOf}
	 * @require {fix.Console}
	 * @require {fix.DateNow}
	 * @require {fix.DocumentHead}
	 * @require {fix.ExecScript}
	 * @require {fix.FunctionBind}
	 * @require {fix.HTML5Markup}
	 * @require {fix.ObjectKeys}
	 * @require {fix.SetTimeoutArgs}
	 */
	var Test = jasy.Test = 
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
				func.displayName = "jasy.Test." + methodName;
			}

			// Build assert method name
			var assertName = "assert";
			if (methodName.substring(0, 2) == "is") {
				assertName += methodName.slice(2);
			} else {
				assertName += methodName.charAt(0).toUpperCase() + methodName.slice(1);
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
			
			this[assertName].displayName = "jasy.Test." + assertName;
		}
	};
	
	Test.add(function(value) { return typeof value == "boolean"; }, "isBoolean", "Not boolean!");
	Test.add(function(value) { return value === true; }, "isTrue", "Not 'true'!");
	Test.add(function(value) { return value === false; },"isFalse", "Not 'false'!");
	Test.add(function(value) { return typeof value == "string"; }, "isString", "Not a string!");
	Test.add(function(value) { return typeof value == "number" && isFinite(value); }, "isNumber", "Not a number!");
	Test.add(function(value) { return parseInt(value) === value; }, "isInteger", "Not an integer!");
	Test.add(function(value) { return value != null; }, "isNotNull", "Is null!");

	Test.add(function(value, match) {
		return value == match;
	}, "isEqual", "Is not equal!");

	Test.add(function(value) {
		var type = typeof value;
		return value == null || type == "boolean" || type == "number" || type == "string";
	}, "isPrimitive", "Not a primitive value!");

	Test.add(function(value) {
		return value != null && typeof value == "object";
	}, "isObject", "Not an object!");
	
	// Via: https://github.com/dperini/nwmatcher/blob/master/src/nwmatcher.js#L182-190
	var nativeCompare = (document.appendChild + '').replace(/appendChild/g, '');
	Test.add(function(object, method) {
		var m = object && object[method] || false;
		return m && typeof m != 'string' &&
			nativeCompare == (m + '').replace(new RegExp(method, 'g'), '');
	}, "isNative", "Not a native method!");

	// Make not use of instanceof operator as it has a memory leak in IE and also does not work cross frame.
	// Memory leak: http://ajaxian.com/archives/working-aroung-the-instanceof-memory-leak
	// Cross frame: http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/

	var toStringMap = {};
	"Array Function RegExp Object".replace(/\w+/g, function(cls) {
		toStringMap[cls] = "[object " + cls + "]";
	});

	Test.add(function(value) {
		return value != null && toString.call(value) == toStringMap.Array;
	}, "isArray", "Not an array!");

	Test.add(function(value) {
		return value != null && toString.call(value) == toStringMap.Function;
	}, "isFunction", "Not a function!");
	
	Test.add(function(value) {
		return value != null && toString.call(value) == toStringMap.RegExp;
	}, "isRegExp", "Not a regular expression!");

	Test.add(function(value) {
		return value != null && toString.call(value) == toStringMap.Object;
	}, "isMap", "Not a map (plain object)!");

	var objectOrFunction = { 
		"object" : 1, 
		"function" : 1 
	};
	
	Test.add(function(value) {
		return value != null && objectOrFunction[typeof value] == 1;
	}, "isObjectOrFunction", "Not a function or object!");
	
	Test.add(function(value, keys) 
	{
		Test.assertMap(value);
		Test.assertArray(keys);
		
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

	Test.add(function(value, regexp) { 
		return typeof value == "string" && !!value.match(regexp); 
	}, "matchesRegExp", "Does not match regular expression %1!");
	
	Test.add(function(value, list) {
		return list.indexOf(value) != -1;
	}, "isInList", "Is not in specified list!");
	
	Test.add(function(value, clazz) {
		// Use instanceof here, but be memory safe in IE
		return value != null && value.hasOwnProperty && value instanceof clazz;
	}, "isInstanceOf", "Is not a instance of %1!"); 

	Test.add(function(obj, key) {
		return obj != null && key in obj;
	}, "hasKey", "Missing key %1!");
	
})(this, Object.prototype.toString);
