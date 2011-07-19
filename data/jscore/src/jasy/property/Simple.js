/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

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
	/** {Integer} Number of properties created. For debug proposes. */
	__counter : 0,
	
	/** {Integer} Maps simple property names to global property IDs */
	__propertyNameToId : {},


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
		
		// Improve compressibility
		var undef;
		var SimpleProperty = this;
		var dataStore = "$$data";

		// Often used variables
		var db, id;
		
		// Increase counter
		SimpleProperty.__counter++;
		
		// Generate property ID
		// Identically named property might store data on the same field
		// as in this case this is typicall on different classes.
		db = SimpleProperty.__propertyNameToId;
		id = db[name];
		if (!id) 
		{
			id = db[name] = jasy.property.Core.ID;
			jasy.property.Core.ID++;
		}
		
		// Precalc
		var Bootstrap=qx.Bootstrap, up=(Bootstrap.$$firstUp[name] || Bootstrap.firstUp(name));
			 
		// Shorthands: Better compression/obfuscation/performance
		var propertyNullable = config.nullable;
		var propertyInit = config.init;
		var propertyEvent = config.event;
		var propertyApply = config.apply;



		/*
		---------------------------------------------------------------------------
			 FACTORY METHODS :: GET
		---------------------------------------------------------------------------
		*/
		
		var get = function get() 
		{
			var context, data, value;
			context = this;		 
			
			if (Permutation.isSet("debug")) {
				jasy.property.Debug.checkGetter(context, config, arguments);
			}
			 
			data = context[dataStore];
			if (data) {
				value = data[id];
			}
			
			if (value === undef) 
			{
				if (propertyInit !== undef) {
					return propertyInit;
				}
				
				if (Permutation.isSet("debug"))
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
					
		if (propertyInit !== undef)
		{
			member.init = function()
			{
				var context=this, data=context[dataStore];
				
				// Check whether there is already local data (which is higher prio than init data)
				if (!data || data[id] === undef) 
				{
					// Call apply
					if (propertyApply) {
						propertyApply.call(context, propertyInit, undef, name);
					}

					// Fire event
					if (propertyEvent) {
						context.fireEvent(propertyEvent, propertyInit, undef);
					}
				}
			};
		}
		
		
		
		/*
		---------------------------------------------------------------------------
			 FACTORY METHODS :: SET
		---------------------------------------------------------------------------
		*/			
		
		members.set = function set(value)
		{
			var context, data, old;
			context = this;

			if (Permutation.isSet("debug")) {
				jasy.property.Debug.checkSetter(context, config, arguments);
			}
			
			data = context[dataStore];
			if (!data) {
				data = context[dataStore] = {};
			} else {
				old = data[id];
			}

			if (value !== old) 
			{
				if (old === undef && propertyInit !== undef) {
					old = propertyInit;
				}
				
				data[id] = value;

				if (propertyApply) {
					propertyApply.call(context, value, old, name);
				}

				if (propertyEvent) {
					context.fireEvent(propertyEvent, value, old);
				}
			}
			
			return value;
		};
		
		
		
		/*
		---------------------------------------------------------------------------
			 FACTORY METHODS :: RESET
		---------------------------------------------------------------------------
		*/			
		
		members.reset = function reset()
		{
			var context, data, old, value;
			context = this;

			if (Permutation.isSet("debug")) {
				jasy.property.Debug.checkResetter(context, config, arguments);
			}

			data = context[dataStore];
			if (!data) {
				return;
			}
			
			old = data[id];
			value = undef;

			if (old !== value) 
			{
				data[id] = value;
				
				if (propertyInit !== undef) {
					value = propertyInit;
				}
				else if (Permutation.isSet("debug"))
				{
					// Still no value. We warn about that the property is not nullable.
					if (!propertyNullable) {
						context.error("Missing value for: " + name + " (during reset())");
					}
				}		 
				
				if (propertyApply) {
					propertyApply.call(context, value, old, name);
				}

				if (propertyEvent) {
					context.fireEvent(propertyEvent, value, old);
				}
			}
		};
		
		
		
		/*
		---------------------------------------------------------------------------
			 FACTORY METHODS :: GOODIES
		---------------------------------------------------------------------------
		*/
		
		if (config.type === "Boolean") 
		{
			members.toggle = function toggle() {
				return setter.call(this, !getter.call(this));
			};

			members.is = members.get;
		}
		
		return members;
	}
});