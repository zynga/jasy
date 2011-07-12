(function(global) {
	
	var types = {};
	
	Core.declare("Assert", {
		
		add : function(func, context, methodName, typeName, msg) {
			// Wrap method and throw error
			this[methodName] = function(value) {
				(context ? func.call(contect, value) : func(value)) // throw new Error(msg);
			};
			
			// Add display name
			this[methodName].displayName = "Assert." + methodName;
			
			// Support for is(type) check
			if (typeName) {
				types[typeName] = this[methodName];
			}
		},
		
		is : function(value, type) {
			return types[type].call(this, value);
		}
		
	});
	
	
	Assert.add(function() { return value === true; }, null, "isTrue", "true", "Expected 'true'!");
	Assert.add(function() { return value === false; }, null,"isFalse", "false", "Expected 'false'!");
	Assert.add(function() { return value === 0; }, null, "isZero", "zero", "Expected primitive zero!");
	Assert.add(function() { return value === null; }, null, "isNull", "null", "Expected 'null'!");
	Assert.add(function() { return value !== null; }, null, "isNotNull", "notNull", "Expected a non-'null' value!");
	
})(this);

