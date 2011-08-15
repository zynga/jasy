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
		if (Env.isSet("debug")) {
			Assert.assertHasKey(global, globalName)
		}

		var construct = global[globalName];
		for (var name in members) 
		{
			var func = members[name];
			if (Env.isSet("debug")) {
				Assert.assertFunction(func);
			}
			func.displayName = prefix + name;

			addMember(construct, name, func);
		}
	};

	var addPrototypeMethods = function(globalName, members) 
	{
		var prefix = globalName + ".prototype.";
		if (Env.isSet("debug")) {
			Assert.assertHasKey(global, globalName);
		}

		var proto = global[globalName].prototype;
		if (Env.isSet("debug")) {
			Assert.assertNotNull(proto);
		}

		for (var name in members) 
		{
			var func = members[name];
			if (Env.isSet("debug")) {
				Assert.assertFunction(func);
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
	values : function(object) 
	{
		return Object.keys(object).map(function(key) {
			return object[key];
		});
	}
});

