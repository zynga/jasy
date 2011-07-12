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
		}
		
	});
	
	// Alias for better compression
	var cls = Assert;
	
	cls.add(function(value) { return typeof value == "boolean"; }, "isBoolean", "Expected a boolean!");
	cls.add(function(value) { return value === true; }, "isTrue", "Expected 'true'!");
	cls.add(function(value) { return value === false; },"isFalse", "Expected 'false'!");

	cls.add(function(value) { return typeof value == "string"; }, "isString", "Expected a string!");
	cls.add(function(value) { return typeof value == "string" && value.length > 0; }, "isNonEmptyString", "Expected a non empty string!");

	cls.add(function(value) { return typeof value == "number"; }, "isNumber", "Expected a number!");
	cls.add(function(value) { return value === 0; }, "isZero", "Expected primitive zero!");

	cls.add(function(value) { return typeof value == "object"; }, "isObject", "Expected an object!");
	cls.add(function(value) { return value === null; }, "isNull", "Expected 'null'!");
	cls.add(function(value) { return value !== null; }, "isNotNull", "Expected a non-'null' value!");
	cls.add(function(value) { return typeof value == "object" && value.constructor === global.Object; }, "isMap", "Expected a map (plain object)!");
	cls.add(function(value) { return typeof value == "object" && value.constructor === global.Array; }, "isArray", "Expected an array!");

	cls.add(function(value) { return typeof value == "function" && value.constructor === global.Function; }, "isFunction", "Expected a function!");
	cls.add(function(value) { return typeof value == "function" && value.constructor === global.RepExp; }, "isRegExp", "Expected a regular expression!");
	
	

})(this);

