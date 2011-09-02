(function(global) {
	
	// defineProperty exists in IE8 but will error when trying to define a property on
	// native objects. IE8 does not have defineProperies, however, so this check saves a try/catch block.
	if(Object.defineProperty && Object.defineProperties)
	{
		var addMember = function(target, name, method) 
		{
			Object.defineProperty(target, name, 
			{
				value: method, 
				configurable: true, 
				enumerable: false, 
				writeable: true 
			});
		};
	}
	else 
	{
		var addMember = function(target, name, method) {
			target[name] = method;
		};
	};

	var addObjectMethods = function(globalName, members) 
	{
		var prefix = globalName + ".";
		if (jasy.Env.isSet("debug")) {
			jasy.Test.assertHasKey(global, globalName)
		}

		var construct = global[globalName];
		for (var name in members) 
		{
			var func = members[name];
			if (jasy.Env.isSet("debug")) {
				jasy.Test.assertFunction(func);
			}
			func.displayName = prefix + name;

			addMember(construct, name, func);
		}
	};

	var addPrototypeMethods = function(globalName, members) 
	{
		var prefix = globalName + ".prototype.";
		if (jasy.Env.isSet("debug")) {
			jasy.Test.assertHasKey(global, globalName);
		}

		var proto = global[globalName].prototype;
		if (jasy.Env.isSet("debug")) {
			jasy.Test.assertNotNull(proto);
		}

		for (var name in members) 
		{
			var func = members[name];
			if (jasy.Env.isSet("debug")) {
				jasy.Test.assertFunction(func);
			}
			func.displayName = prefix + name;

			addMember(proto, name, func);
		}
	};
	
	addObjectMethods("Object", 
	{
		/**
		 * 
		 */
		addObjectMethods : addObjectMethods,

		/**
		 * 
		 */
		addPrototypeMethods : addPrototypeMethods
	});
	
})(this);


Object.addPrototypeMethods("Object", 
{
	/**
	 * Creates a new object with prefilled content. Keys come from 
	 * the given array. The value is always the same, defaults to true,
	 * but is also configurable.
	 * 
	 * @param keys {Array} Keys as a list of keys
	 * @param value {var ? true} Value to use for all keys
	 * @return {Map} Newly created map with the given keys
	 */
	fromArray : function(keys, value) 
	{
		if (arguments.length == 1) {
			value = true;
		}
		
		var obj = {};
		for (var i=0, l=keys.length; i<l; i++) {
			obj[keys[i]] = value;
		}
		
		return obj;
	},
	
	/**
	 * Returns all the values of the given object as an array.
	 *
	 * @param object {Map} Object to return values from
	 * @return {Array} List of all values
	 */
	values : function(object) 
	{
		return Object.keys(object).map(function(key) {
			return object[key];
		});
	}
});

