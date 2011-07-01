Module("jasy.property.Property", {
	
  ID : 0,
	
	/** {Integer} Number of properties created. For debug proposes. */
	__counter : 0,

	/** {Integer} Maps simple property names to global property IDs */
	__propertyNameToId : {},


	/**
	 * Adds a new property to the given class.
	 * 
	 * Please note that you need to define one of "init" or "nullable". Otherwise you
	 * might get errors during runtime function calls.
	 *	
	 * @param clazz {Class} The class to modify
	 * @param name {String} Name of the property. Camel-case. No special characters.
	 * @param config {Map} Configuration for the property to being created
	 */
	add : function(members, name, config)
	{
		/*
		---------------------------------------------------------------------------
			 INTRO
		---------------------------------------------------------------------------
		*/

		// Improve compressibility
		var Undefined;
		var SimpleProperty = this;
		var fireDataEvent = "fireDataEvent";
		var dataStore = "$$data";

		// Often used variables
		var db, id, members, initKey;

		// Increase counter
		SimpleProperty.__counter++;

		// Generate property ID
		// Identically named property might store data on the same field
		// as in this case this is typicall on different classes.
		db = SimpleProperty.__propertyNameToId;
		id = db[name];
		if (!id) 
		{
			id = db[name] = SimpleProperty.ID;
			SimpleProperty.ID++
		}

		// Store init value (shared data between instances)
		if (config.init !== Undefined) 
		{
			initKey = "$$init-" + name;
			members[initKey] = config.init;
		}

		// Precalc
		var Bootstrap=qx.Bootstrap, up=(Bootstrap.$$firstUp[name] || Bootstrap.firstUp(name));

		// Shorthands: Better compression/obfuscation/performance
		var propertyNullable=config.nullable, propertyEvent=config.event, 
			propertyApply=config.apply, propertyValidate=config.validate;




		/*
		---------------------------------------------------------------------------
			 FACTORY METHODS :: GET
		---------------------------------------------------------------------------
		*/			

		members["get" + up] = function() 
		{
			var context, data, value;
			context = this;

			if (qx.core.Variant.isSet("qx.debug", "on")) {
				qx.core.property.Debug.checkGetter(context, config, arguments);
			}

			data = context[dataStore];
			if (data) {
				value = data[id];
			}

			if (value === Undefined) 
			{
				if (initKey) {
					return context[initKey];
				}

				if (qx.core.Variant.isSet("qx.debug", "on"))
				{
					if (!propertyNullable) {
						context.error("Missing value for: " + name + " (during get())");
					}
				}	 

				value = null;
			}

			return value;
		};



		/*
		---------------------------------------------------------------------------
			 FACTORY METHODS :: INIT
		---------------------------------------------------------------------------
		*/

		if (initKey)
		{
			members["init" + up] = function()
			{
				var context=this, data=context[dataStore];

				// Check whether there is already local data (which is higher prio than init data)
				if (!data || data[id] === Undefined) 
				{
					// Call apply
					if (propertyApply) {
						context[propertyApply](context[initKey], Undefined, name);
					}

					// Fire event
					if (propertyEvent) {
						context[fireDataEvent](propertyEvent, context[initKey], Undefined);
					}
				}
			};
		}



		/*
		---------------------------------------------------------------------------
			 FACTORY METHODS :: SET
		---------------------------------------------------------------------------
		*/			

		members["set" + up] = function(value)
		{
			var context, data, old;
			context = this;

			if (qx.core.Variant.isSet("qx.debug", "on")) {
				qx.core.property.Debug.checkSetter(context, config, arguments);
			}

			if (propertyValidate) {
				qx.core.Type.check(value, propertyValidate, context, qx.core.ValidationError);
			}

			data = context[dataStore];
			if (!data) {
				data = context[dataStore] = {};
			} else {
				old = data[id];
			}

			if (value !== old) 
			{
				if (old === Undefined && initKey) {
					old = context[initKey];
				}

				data[id] = value;

				if (propertyApply) {
					context[propertyApply](value, old, name);
				}

				if (propertyEvent) {
					context[fireDataEvent](propertyEvent, value, old);
				}
			}

			return value;
		};



		/*
		---------------------------------------------------------------------------
			 FACTORY METHODS :: RESET
		---------------------------------------------------------------------------
		*/			

		members["reset" + up] = function()
		{
			var context, data, old, value;
			context = this;

			if (qx.core.Variant.isSet("qx.debug", "on")) {
				qx.core.property.Debug.checkResetter(context, config, arguments);
			}

			data = context[dataStore];
			if (!data) {
				return;
			}

			old = data[id];
			value = Undefined;

			if (old !== value) 
			{
				data[id] = value;

				if (initKey) {
					value = context[initKey];
				}
				else if (qx.core.Variant.isSet("qx.debug", "on"))
				{
					// Still no value. We warn about that the property is not nullable.
					if (!propertyNullable) {
						context.error("Missing value for: " + name + " (during reset())");
					}
				}		 

				if (propertyApply) {
					context[propertyApply](value, old, name);
				}

				if (propertyEvent) {
					context[fireDataEvent](propertyEvent, value, old);
				}
			}
		};	 



		/*
		---------------------------------------------------------------------------
			 FACTORY METHODS :: GOODIES
		---------------------------------------------------------------------------
		*/			

		if (config.check === "Boolean") 
		{
			members["toggle" + up] = function() {
				this["set" + up](!this["get" + up]());
			}

			members["is" + up] = members["get" + up];
		}
	
	
})