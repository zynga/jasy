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
 * <li><strong>check</strong>: Check the incoming value for the given type or function.</li>
 * <li><strong>apply</strong>: Method to call after a new value has been stored. The signature of the method is 
 *	 <code>function(newValue, oldValue, propertyName)</code>.</li>
 * <li><strong>event</strong>: Event to fire after a new value has been stored (and apply has been called). The event
 *	 type is a {@link qx.event.type.Data} which contains both, the old and new value (using getData/getOldData).</li>
 * <li><strong>init</strong>: Init value for the property. If no value is set or the property gets reset, the getter
 *	 will return the <code>init</code> value.</li>
 * <li><strong>nullable</strong>: Whether the property is able to store null values. This also allows the system to
 *	 return <code>null</code> when no other value is available. Otherwise an error is thrown whenever no value is 
 *	 available.</li>
 * <li><strong>refine</strong>: Refinements are used to alter the init value of a property. No other changes are
 *	 allowed/supported as the generated member methods are shared between classes/objects.</li>
 * </ul>
 *
 * @break {qx.core.ValidationError}
 */
qx.Bootstrap.define("qx.core.property.Simple",
{
	statics :
	{
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
		add : function(clazz, name, config)
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
				id = db[name] = qx.core.property.Core.ID;
				qx.core.property.Core.ID++
			}
						
			// Store init value (shared data between instances)
			members = clazz.prototype;
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
		}
	}
});