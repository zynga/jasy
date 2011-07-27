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
		var construct = global[globalName];
		if (Permutation.isSet("debug")) {
			Assert.assertNonNull(construct);
		}

		for (var name in members) 
		{
			var func = members[name];
			if (Permutation.isSet("debug")) {
				Assert.assertFunction(func);
			}
			func.displayName = prefix + name;

			addMember(construct, name, func);
		}
	};

	var addPrototypeMethods = function(globalName, members) 
	{
		var prefix = globalName + ".prototype.";
		var proto = global[globalName].prototype;
		if (Permutation.isSet("debug")) {
			Assert.assertFunction(global[globalName]);
		}

		for (var name in members) 
		{
			var func = members[name];
			if (Permutation.isSet("debug")) {
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

