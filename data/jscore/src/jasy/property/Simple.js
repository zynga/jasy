/*
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

(function(global, undef)
{
	/** {Integer} Maps simple property names to global property IDs */
	var propertyNameToId = {};

	/** {String} Field where the data is stored */
	var store = "$$data";


	/**
	 * Property handling for simple key/value like properties which might have an optional init value.
	 *
	 * Supports the following configuration keys:
	 *
	 * <ul>
	 * <li><strong>type</strong>: Check the incoming value for the given type or function.</li>
	 * <li><strong>apply</strong>: Link to function to call after a new value has been stored. The signature of the method is
	 *	 <code>function(newValue, oldValue)</code>.</li>
	 * <li><strong>event</strong>: Event to fire after a new value has been stored (and apply has been called). The event
	 *	 type is a {@link jasy.property.Event} which contains both, the old and new value.</li>
	 * <li><strong>init</strong>: Init value for the property. If no value is set or the property gets reset, the getter
	 *	 will return the <code>init</code> value.</li>
	 * <li><strong>nullable</strong>: Whether the property is able to store null values. This also allows the system to
	 *	 return <code>null</code> when no other value is available. Otherwise an error is thrown whenever no value is
	 *	 available.</li>
	 * </ul>
	 */
	Module("jasy.property.Simple",
	{
		/**
		 * Creates a new set of member methods for the given property configuration.
		 *
		 * Please note that you need to define one of "init" or "nullable". Otherwise you
		 * might get errors during runtime function calls.
		 *
		 * @param config {Map} Configuration for the property to being created
		 */
		create : function(config)
		{
			/*
			---------------------------------------------------------------------------
				 INTRO
			---------------------------------------------------------------------------
			*/

			// Shorthands: Better compression/obfuscation/performance
			var propertyName = config.name;
			var propertyNullable = config.nullable;
			var propertyInit = config.init;
			var propertyType = config.type;
			var propertyFire = config.fire;
			var propertyApply = config.apply;

			// Validation
			if (jasy.Env.isSet("debug"))
			{
				jasy.Test.assertHasAllowedKeysOnly(config, ["name","nullable","init","type","fire","apply"],
					"Invalid simple property configuration of '" + propertyName + "'! Unallowed key(s) found!");

				jasy.Test.assertString(propertyName);

				if (propertyNullable !== undef) {
					jasy.Test.assertBoolean(propertyNullable);
				}

				if (propertyType) {
					// TODO
				}

				if (propertyFire) {
					jasy.Test.assertString(propertyFire);
				}

				if (propertyApply) {
					jasy.Test.assertFunction(propertyApply);
				}
			}

			// Generate property ID
			// Identically named property might store data on the same field
			// as in this case this is typicall on different classes.
			var propertyId = propertyNameToId[propertyName];
			if (!propertyId) {
				propertyId = propertyNameToId[propertyName] = (jasy.property.Core.ID++);
			}

			// Prepare return value
			var members = {};



			/*
			---------------------------------------------------------------------------
				 METHODS :: GET
			---------------------------------------------------------------------------
			*/

			members.get = function()
			{
				var context, data, value;
				context = this;

				if (jasy.Env.isSet("debug")) {
					jasy.property.Debug.checkGetter(context, config, arguments);
				}

				data = context[store];
				if (data) {
					value = data[propertyId];
				}

				if (value === undef)
				{
					if (propertyInit !== undef) {
						return propertyInit;
					}

					if (jasy.Env.isSet("debug"))
					{
						if (!propertyNullable) {
							context.error("Missing value for: " + propertyName + " (during get())");
						}
					}

					value = null;
				}

				return value;
			};



			/*
			---------------------------------------------------------------------------
				 METHODS :: INIT
			---------------------------------------------------------------------------
			*/

			if (propertyInit !== undef)
			{
				members.init = function()
				{
					var context=this, data=context[store];

					// Check whether there is already local data (which is higher prio than init data)
					if (!data || data[propertyId] === undef)
					{
						// Call apply
						if (propertyApply) {
							propertyApply.call(context, propertyInit, undef);
						}

						// Fire event
						if (propertyFire) {
							context.fireEvent(propertyFire, propertyInit, undef);
						}
					}
				};
			}



			/*
			---------------------------------------------------------------------------
				 METHODS :: SET
			---------------------------------------------------------------------------
			*/

			members.set = function(value)
			{
				var context=this, data, old;

				if (jasy.Env.isSet("debug")) {
					jasy.property.Debug.checkSetter(context, config, arguments);
				}

				data = context[store];
				if (!data) {
					data = context[store] = {};
				} else {
					old = data[propertyId];
				}

				if (value !== old)
				{
					if (old === undef && propertyInit !== undef) {
						old = propertyInit;
					}

					data[propertyId] = value;

					if (propertyApply) {
						propertyApply.call(context, value, old);
					}

					if (propertyFire) {
						context.fireEvent(propertyFire, value, old);
					}
				}

				return value;
			};



			/*
			---------------------------------------------------------------------------
				 METHODS :: RESET
			---------------------------------------------------------------------------
			*/

			members.reset = function()
			{
				var context, data, old, value;
				context = this;

				if (jasy.Env.isSet("debug")) {
					jasy.property.Debug.checkResetter(context, config, arguments);
				}

				data = context[store];
				if (!data) {
					return;
				}

				old = data[propertyId];
				value = undef;

				if (old !== value)
				{
					data[propertyId] = value;

					if (propertyInit !== undef) {
						value = propertyInit;
					}
					else if (jasy.Env.isSet("debug"))
					{
						// Still no value. We warn about that the property is not nullable.
						if (!propertyNullable) {
							context.error("Missing value for: " + propertyName + " (during reset())");
						}
					}

					if (propertyApply) {
						propertyApply.call(context, value, old);
					}

					if (propertyFire) {
						context.fireEvent(propertyFire, value, old);
					}
				}
			};



			/*
			---------------------------------------------------------------------------
				 DONE
			---------------------------------------------------------------------------
			*/

			return members;
		}
	});
})(this)
