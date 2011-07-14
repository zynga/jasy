(function(global, undef) {
	
	Core.declare("Assert", {
		
		/**
		 * Adds a new assertion check
		 *
		 * @param func {Function} Function for the test. Must return boolean.
		 * @param methodName {String} Name of the method to attach.
		 * @param assertMsg {}
		 *
		 */
		add : function(func, methodName, assertMsg) {
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
			if (func.length == 1) {
				this[assertName] = function(value, customMsg) {
					if (!func(value)) {
						throw new TypeError('Value: "' + value + '": ' + (customMsg||assertMsg));
					}
				};
			} else {
				this[assertName] = function(value, compareTo, customMsg) {
					if (!func(value, compareTo)) {
						throw new TypeError('Value: "' + value + '": ' + (customMsg||assertMsg.replace("%1", ""+compareTo)));
					}
				};
			}
			
			this[assertName].displayName = "Assert." + assertName;
		}
	});
	
	// Alias for better compression
	var Assert = global.Assert;
	var toString = Object.prototype.toString;
	
	// Build mapping list for all native global objects
	var classToString = {
		Object : toString.call({}),
		Array : toString.call([]),
		String : toString.call(''),
		Boolean : toString.call(true),
		Number : toString.call(1),
		Date : toString.call(new Date),
		RegExp : toString.call(/x/),
		Function : toString.call(function(){})
	};
	
	var stringToClass = {};
	for (var cls in classToString) {
		stringToClass[classToString[cls]] = cls;
	}
	
	Assert.add(function(value) {
		var type = typeof value;
		return value == null || type == "boolean" || type == "number" || type == "string";
	}, "isPrimitive", "Not a primitive value!");
	
	Assert.add(function(value) { return typeof value == "boolean"; }, "isBoolean", "Not boolean!");
	Assert.add(function(value) { return value === true; }, "isTrue", "Not 'true'!");
	Assert.add(function(value) { return value === false; },"isFalse", "Not 'false'!");

	Assert.add(function(value) { return typeof value == "string"; }, "isString", "Not a string!");
	Assert.add(function(value) { return typeof value == "string" && value.length > 0; }, "isNonEmptyString", "Not a non empty string!");

	Assert.add(function(value) { return typeof value == "number" && isFinite(value); }, "isNumber", "Not a number!");
	Assert.add(function(value) { return value === 0; }, "isZero", "Not zero!");
	Assert.add(function(value) { return parseInt(value) === value; }, "isInteger", "Not an integer!");

	Assert.add(Object.isObject, "isObject", "Not an object!");
	Assert.add(function(value) { return value === null; }, "isNull", "Not 'null'!");
	Assert.add(function(value) { return value !== null; }, "isNotNull", "Is 'null'!");

	Assert.add(Object.isMap, "isMap", "Not a map (plain object)!");
	Assert.add(Array.isArray, "isArray", "Not an array!");
	Assert.add(Function.isFunction, "isFunction", "Not a function!");
	Assert.add(RegExp.isRegExp, "isRegExp", "Not a regular expression!");
	Assert.add(Date.isDate, "isDate", "Not a date object!");
	
	Assert.add(function(value) { return value && value.nodeType != undef; }, "isNode", "Not a node!");
	Assert.add(function(value) { return value && value.nodeType == 1; }, "isElement", "Not an element!");
	Assert.add(function(value) { return value && value.nodeType == 3; }, "isTextNode", "Not a text node!");
	Assert.add(function(value) { return value && value.nodeType == 9; }, "isDocument", "Not a document!");
	
	Assert.add(function(value, keys) {
		Assert.assertMap(value);
		Assert.assertArray(keys);
		
		var valueKeys = Object.keys(value);
		for (var i=0, l=valueKeys.length; i<l; i++) {
			var key = valueKeys[i];
			if (keys.indexOf(key) == -1) {
				return false;
			}
		}
		return true;
	}, "isDefiningAllowedKeysOnly", "Defines a key %1 which is not allowed being used!");

	Assert.add(function(value, regexp) { 
		return typeof value == "string" && !!value.match(regexp); 
	}, "matchesRegExp", "Does not match regular expression %1!");
	
	Assert.add(function(value, func) { 
		var ret = true;
		try{
			ret = !!func(value);
		} catch(ex) {
			ret = false;
		}
		
		return ret;
	}, "isAcceptedBy", "Is not accepted by defined check function!");
	
	Assert.add(function(value, list) {
		return list.indexOf(value) != -1;
	}, "isInList", "Is not in specified list!");
	
})(this);

