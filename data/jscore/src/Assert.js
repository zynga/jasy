(function(global, undef) {
	
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
	
	
	Assert.add(function(value) { return typeof value == "boolean"; }, "isBoolean", "Not boolean!");
	Assert.add(function(value) { return value === true; }, "isTrue", "Not 'true'!");
	Assert.add(function(value) { return value === false; },"isFalse", "Not 'false'!");

	Assert.add(function(value) { return typeof value == "string"; }, "isString", "Not a string!");
	Assert.add(function(value) { return typeof value == "string" && value.length > 0; }, "isNonEmptyString", "Not a non empty string!");

	Assert.add(function(value) { return typeof value == "number" && isFinite(value); }, "isNumber", "Not a number!");
	Assert.add(function(value) { return value === 0; }, "isZero", "Not zero!");
	Assert.add(function(value) { return parseInt(value) === value; }, "isInteger", "Not an integer!");

	Assert.add(function(value) { return typeof value == "object"; }, "isObject", "Not an object!");
	Assert.add(function(value) { return value === null; }, "isNull", "Not 'null'!");
	Assert.add(function(value) { return value !== null; }, "isNotNull", "Is 'null'!");

	Assert.add(function(value) { return stringToClass[toString.call(value)] == "Object"; }, "isMap", "Not a map (plain object)!");
	Assert.add(function(value) { return stringToClass[toString.call(value)] == "Array"; }, "isArray", "Not an array!");
	Assert.add(function(value) { return stringToClass[toString.call(value)] == "Function"; }, "isFunction", "Not a function!");
	Assert.add(function(value) { return stringToClass[toString.call(value)] == "RegExp"; }, "isRegExp", "Not a regular expression!");
	Assert.add(function(value) { return stringToClass[toString.call(value)] == "Date"; }, "isDate", "Not a date object!");
	
	Assert.add(function(value) { return value && value.nodeType != undef; }, "isNode", "Not a node!");
	Assert.add(function(value) { return value && value.nodeType == 1; }, "isElement", "Not an element!");
	Assert.add(function(value) { return value && value.nodeType == 3; }, "isTextNode", "Not a text node!");
	Assert.add(function(value) { return value && value.nodeType == 9; }, "isDocument", "Not a document!");
	
	

})(this);

