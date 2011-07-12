(function(global) {
	
	var types = {};
	
	Core.declare("Assert", {
		
		add : function(func, methodName, typeName, msg) {
			// Wrap method and throw error
			this[methodName] = function(value) {
				if (!func(value)) {
					throw new Error(msg);
				}
			};
			
			// Add display name
			this[methodName].displayName = "Assert." + methodName;
			
			// Support for is(type) check
			if (typeName) {
				types[typeName] = this[methodName];
			}
		},
		
		is : function(value, type) {
			try{
				return types[type](value);
			} catch(ex) {
				return false;
			}
			
			return true;
		}
		
	});
	
	// Alias for better compression
	var cls = Assert;
	
	cls.add(function(value) { return typeof value == "boolean"; }, "isBoolean", "boolean", "Expected a boolean!");
	cls.add(function(value) { return value === true; }, "isTrue", "true", "Expected 'true'!");
	cls.add(function(value) { return value === false; },"isFalse", "false", "Expected 'false'!");

	cls.add(function(value) { return typeof value == "string"; }, "isString", "string", "Expected a string!");
	cls.add(function(value) { return typeof value == "string" && value.length > 0; }, "isNonEmptyString", "nonEmptyString", "Expected a non empty string!");

	cls.add(function(value) { return typeof value == "number"; }, "isNumber", "number", "Expected a number!");
	cls.add(function(value) { return value === 0; }, "isZero", "zero", "Expected primitive zero!");

	cls.add(function(value) { return typeof value == "object"; }, "isObject", "object", "Expected an object!");
	cls.add(function(value) { return value === null; }, "isNull", "null", "Expected 'null'!");
	cls.add(function(value) { return value !== null; }, "isNotNull", "notNull", "Expected a non-'null' value!");
	cls.add(function(value) { return typeof value == "object" && value.constructor === global.Object; }, "isMap", "map", "Expected a object!");
	cls.add(function(value) { return typeof value == "object" && value.constructor === global.Array; }, "isArray", "array", "Expected a array!");

})(this);

