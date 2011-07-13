(function(global) {
	
	var types = {};
	
	Core.declare("Assert", {
		
		/**
		 * Adds a new assertion check
		 *
		 * @param func {Function} Function for the test. Must return boolean.
		 * @param methodName {String} Name of the method to attach.
		 * 
		 *
		 */
		add : function(func, methodName, msg) {
			// Wrap method and throw error
			this[methodName] = function(value) {
				if (!func(value)) {
					throw new Error(msg);
				}
			};
			
			// Add display name
			this[methodName].displayName = "Assert." + methodName;
			
			// Support for is(value, type) check
			if (methodName.slice(0,2) == "is") {
				var typeName = methodName.slice(2,3).toLowerCase() + methodName.slice(3);
				types[typeName] = func;
			}
		},
		
		is : function(value, type) {
			return types[type](value);
		},
		
		getClassName : function(value) {
			return stringToClass[toString.call(value)];
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
	
	var getClassName = Assert.getClassName;
	
	
	Assert.add(function(value) { return typeof value == "boolean"; }, "isBoolean", "Expected a boolean!");
	Assert.add(function(value) { return value === true; }, "isTrue", "Expected 'true'!");
	Assert.add(function(value) { return value === false; },"isFalse", "Expected 'false'!");

	Assert.add(function(value) { return typeof value == "string"; }, "isString", "Expected a string!");
	Assert.add(function(value) { return typeof value == "string" && value.length > 0; }, "isNonEmptyString", "Expected a non empty string!");

	Assert.add(function(value) { return typeof value == "number"; }, "isNumber", "Expected a number!");
	Assert.add(function(value) { return value === 0; }, "isZero", "Expected primitive zero!");

	Assert.add(function(value) { return typeof value == "object"; }, "isObject", "Expected an object!");
	Assert.add(function(value) { return value === null; }, "isNull", "Expected 'null'!");
	Assert.add(function(value) { return value !== null; }, "isNotNull", "Expected a non-'null' value!");

	Assert.add(function(value) { return getClassName(value) == "Object"; }, "isMap", "Expected a map (plain object)!");
	Assert.add(function(value) { return getClassName(value) == "Array"; }, "isArray", "Expected an array!");
	Assert.add(function(value) { return getClassName(value) == "Function"; }, "isFunction", "Expected a function!");
	Assert.add(function(value) { return getClassName(value) == "RegExp"; }, "isRegExp", "Expected a regular expression!");
	Assert.add(function(value) { return getClassName(value) == "Date"; }, "isDate", "Expected a date object!");

})(this);

