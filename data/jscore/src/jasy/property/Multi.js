/*
==================================================================================================
  Jasy - JavaScript Tooling Framework
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

(function()
{
	/*
	---------------------------------------------------------------------------
	  INTERNAL DATA
	---------------------------------------------------------------------------
	*/

	/** {Integer} Number of properties created. For debug proposes. */
	var MultiCounter = 0;

	/** {Integer} Maps multi property names to global property IDs */
	var propertyNameToId = {};

	/**
	 * {Map} Configuration for property fields
	 */
	var priorityToFieldConfig =
	{
		// Override
		4 : {},

		// User (aka Instance-specific value)
		3: {},

		// Theme, see {@link jasy.property.IThemeable}
		2: {
			get : "getThemedValue"
		},

		// Inheritance, see {@link jasy.property.IInheritable}
		1 : {
			get : "getInheritedValue"
		}
	};

	/**
	 * Maps the name of a field to its priority
	 *
	 */
	var fieldToPriority =
	{
		inherited : 1,
		theme : 2,
		user : 3,
		override : 4
	};

	// Shared variables (constants)
	var initKeyPrefix = "$$init-";
	var store = "$$data";

	// Improve compressibility
	var Undefined;
	var PropertyUtil = jasy.property.Util;


	/*
	---------------------------------------------------------------------------
		INTERNALS INHERITANCE
	---------------------------------------------------------------------------
	*/

	/**
	 * Updates children of a object where the given property has been modified.
	 *
	 * @param obj {qx.core.Object} Object which was modified
	 * @param newValue {var} Current newValue
	 * @param oldValue {var} Old value
	 * @param config {Map} Property configuration
	 */
	var changeInheritedHelper = function(obj, newValue, oldValue, config)
	{
		// TODO: Improved this lookup via $$children
		if (!obj._getChildren) {
			return;
		}
		var children = obj._getChildren();
		var length = children.length;
		if (!length) {
			return;
		}

		var inheritedPriority = fieldToPriority.inherited;

		var propertyName=config.name, propertyApply=config.apply, propertyEvent=config.event;
		var propertyId = propertyNameToId[propertyName];
		var propertyInitKey = initKeyPrefix + propertyName;

		var child, childData, childOldPriority, childOldValue, childOldGetter, childNewValue;
		var Util = jasy.property.Util;

		for (var i=0, l=children.length; i<l; i++)
		{
			child = children[i];

			// Block child if it does not support the changed property
			if (!Util.getPropertyDefinition(child.constructor, propertyName)) {
				continue;
			}

			childData = child[store];
			if (!childData) {
				childData = child[store] = {};
			}

			// Quick lookup (higher priority value exist)
			childOldPriority = childData[propertyId];
			if (childOldPriority !== Undefined && childOldPriority > inheritedPriority) {
				continue;
			}


			//
			// Compute child's old value
			//

			if (childOldPriority === inheritedPriority)
			{
				childOldValue = oldValue;
			}
			else if (childOldPriority !== Undefined)
			{
				childOldGetter = priorityToFieldConfig[childOldPriority].get;
				if (childOldGetter) {
					childOldValue = child[childOldGetter](propertyName);
				} else {
					childOldValue = child[propertyId+childOldPriority];
				}
			}
			else
			{
				childOldValue = child[propertyInitKey];
			}


			//
			// Compute child's new value
			//

			childNewValue = newValue;
			if (childNewValue === Undefined)
			{
				childNewValue = child[propertyInitKey];
				childData[propertyId] = Undefined;
			}
			else
			{
				// Remember that we use the inherited value here
				childData[propertyId] = inheritedPriority;
			}


			//
			// Publish change
			//

			if (childNewValue !== childOldValue)
			{
				// Call apply
				if (propertyApply) {
					child[propertyApply](childNewValue, childOldValue, propertyName);
				}

				// Fire event
				if (propertyEvent) {
					child.fireDataEvent(propertyEvent, childNewValue, childOldValue);
				}

				// Go into recursion
				changeInheritedHelper(child, childNewValue, childOldValue, config);
			}
		}
	};



	/*
	---------------------------------------------------------------------------
		CLASS DEFINITION
	---------------------------------------------------------------------------
	*/

	/**
	 * Multi-level property which support multiple values per property with integrated priorization. The following fields
	 * are available for properties depending on their configuration:
	 *
	 * # Inheritable
	 * # Theme
	 * # User
	 * # Override
	 *
	 * Higher values mean higher priority e.g. user values override themed values. There is an additional value
	 * which is the init value and is stored property-wide (read: class specific - not instance specific).
	 *
	 * Additional configuration flags (compared to simple properties):
	 *
	 * <ul>
	 * <li><strong>inheritable</strong>: Whether the property value should be inheritable. If the property does not have a
	 *	 user defined or an init value, the property will try to get the value from the parent of the current object.</li>
	 * <li><strong>themeable</strong>: Whether the property allows a themable value read dynamically from a theming system.
	 *	 The object containing this property needs to implement a method <code>getThemedValue</code>.</li>
	 * </ul>
	 *
	 * @break {qx.core.ValidationError}
	 */
	Module("jasy.property.Multi",
	{
		/*
		---------------------------------------------------------------------------
			PUBLIC API
		---------------------------------------------------------------------------
		*/

		/**
		 * Adds a new multi-field property to the given class.
		 *
		 * Please note that you need to define one of "init" or "nullable". Otherwise you might get errors during runtime
		 * function calls.
		 *
		 * @param clazz {Class} The class to modify
		 * @param name {String} Name of the property. Camel-case. No special characters.
		 * @param config {Map} Configuration for the property to being created
		 */
		create : function(config)
		{
			/*
			---------------------------------------------------------------------------
				 INTRO: IDENTICAL BETWEEN SIMPLE AND MULTI
			---------------------------------------------------------------------------
			*/

			// Increase counter
			MultiCounter++;

			// Generate property ID
			// Identically named property might store data on the same field as in this case this is typically on different
			// classes. We reserve four slots for storing instance-specific data: inheritance, theme, user and override
			var propertyId = propertyNameToId[name];
			if (!propertyId)
			{
				propertyId = propertyNameToId[name] = jasy.property.Core.ID;

				// Number of fields + meta field to store where we store the data
				jasy.property.Core.ID += 5;
			}

			var name = config.name;
			var members = {};

			// Shorthands: Better compression/obfuscation/performance
			var propertyNullable = config.nullable;
			var propertyInit = config.init;
			var propertyEvent = config.event;
			var propertyApply = config.apply;
			var propertyValidate = config.validate;
			var propertyInheritable = config.inheritable;



			/*
			---------------------------------------------------------------------------
				 FACTORY METHODS :: SETTER
			---------------------------------------------------------------------------
			*/

			var setter = function(modifyPriority)
			{
				return function(newValue)
				{
					var context = this;

					if (jasy.Env.isSet("debug")) {
						jasy.property.Debug.checkSetter(context, config, arguments);
					}

					var data = context[store];
					if (!data) {
						data = context[store] = {};
					}
					else
					{
						// Read old value
						var oldPriority = data[propertyId];
						if (oldPriority !== Undefined)
						{
							var oldGetter = priorityToFieldConfig[oldPriority].get;
							if (oldGetter) {
								var oldValue = context[oldGetter](name);
							} else {
								var oldValue = data[propertyId+oldPriority];
							}
						}
					}

					// context.debug("Save " + name + "[" + modifyPriority + "]=" + newValue);

					// Store new value
					data[propertyId+modifyPriority] = newValue;

					// Ignore lower-priority changes
					if (oldPriority === Undefined || oldPriority <= modifyPriority)
					{
						// Whether the storage field was changed
						if (oldPriority !== modifyPriority) {
							data[propertyId] = modifyPriority;
						}

						// Fallback to init value on prototype chain (when supported)
						// This is always the value on the current class, not explicitely the class which creates the property.
						// This is mainly for supporting init value overrides with "refined" properties
						if (oldValue === Undefined && propertyInit !== Undefined) {
							oldValue = propertyInit;
						}

						// this.debug("Value Compare: " + newValue + " !== " + oldValue);
						// Whether the value has been modified
						if (newValue !== oldValue)
						{
							// Call apply
							if (propertyApply) {
								context[propertyApply](newValue, oldValue, config.name);
							}

							// Fire event
							if (propertyEvent) {
								context.fireDataEvent(propertyEvent, newValue, oldValue);
							}

							// Inheritance support
							if (propertyInheritable) {
								changeInheritedHelper(context, newValue, oldValue, config);
							}
						}
					}

					return newValue;
				};
			};



			/*
			---------------------------------------------------------------------------
				 FACTORY METHODS :: RESETTER
			---------------------------------------------------------------------------
			*/

			var resetter = function(modifyPriority)
			{
				return function(value)
				{
					var context = this;

					if (jasy.Env.isSet("debug")) {
						jasy.property.Debug.checkResetter(context, config, arguments);
					}

					var data = context[store];

					// context.debug("Delete " + name + "[" + modifyPriority + "]");

					// Only need to react when current field is resetted
					var oldPriority = data[propertyId];
					if (oldPriority === modifyPriority)
					{
						// Read old value
						var oldValue = data[propertyId+oldPriority];

						// We lost the current value, now we need to find the next stored value
						var newValue, newGetter;
						for (var newPriority=modifyPriority-1; newPriority>0; newPriority--)
						{
							newGetter = priorityToFieldConfig[newPriority].get;
							if (newGetter) {
								newValue = context[newGetter] ? context[newGetter](name) : Undefined;
							} else {
								newValue = data[propertyId+newPriority];
							}

							if (newValue !== Undefined) {
								break;
							}
						}

						// No value has been found
						if (newValue === Undefined)
						{
							newPriority = Undefined;

							// Let's try the class-wide init value
							if (propertyInit !== Undefined) {
								newValue = propertyInit;
							}
							else if (jasy.Env.isSet("debug"))
							{
								// Still no value. We warn about that the property is not nullable.
								if (!propertyNullable) {
									context.error("Missing value for: " + name + " (during reset())");
								}
							}
						}

						// Update current field
						data[propertyId] = newPriority;
					}

					// Remove value from store
					// This is placed here, because we need to keep the old value first and only want to do this when needed.
					// Do not use delete operator for performance reasons: just modifying the value to undefined is enough.
					data[propertyId+modifyPriority] = Undefined;

					// Only need to react when current field is resetted
					if (oldPriority === modifyPriority && oldValue !== newValue)
					{
						// Call apply
						if (propertyApply) {
							context[propertyApply](newValue, oldValue, config.name);
						}

						// Fire event
						if (propertyEvent) {
							context.fireDataEvent(propertyEvent, newValue, oldValue);
						}

						// Inheritance support
						if (propertyInheritable) {
							changeInheritedHelper(context, newValue, oldValue, config);
						}
					}
				};
			};




			/*
			---------------------------------------------------------------------------
				 FACTORY METHODS :: GETTER
			---------------------------------------------------------------------------
			*/

			var getter = function()
			{
				var context = this;

				if (jasy.Env.isSet("debug")) {
					jasy.property.Debug.checkGetter(context, config, arguments);
				}

				var data = context[store];

				var currentPriority = data && data[propertyId];
				if (currentPriority === Undefined)
				{
					// Fallback to init value on prototype chain (when supported)
					// This is always the value on the current class, not explicitely the class which creates the property.
					// This is mainly for supporting init value overrides with "refined" properties
					if (propertyInit !== Undefined) {
						return propertyInit;
					}

					// Alternatively chose null, if possible
					if (propertyNullable) {
						return null;
					}

					if (jasy.Env.isSet("debug"))
					{
						context.error("Missing value for: " + name +
							" (during get()). Either define an init value, make the property nullable or define a fallback value.");
					}

					return;
				}

				// Special get() support for themable/inheritable properties
				var currentGetter = priorityToFieldConfig[currentPriority].get;
				if (currentGetter)
				{
					if (jasy.Env.isSet("debug"))
					{
						var value = context[currentGetter](name);
						if (value === Undefined) {
							throw new Error("Ooops. Invalid value at getter: " + name + " in " + context + " via getter: " + currentGetter);
						}

						return value;
					}
					else
					{
						return context[currentGetter](name);
					}
				}
				else
				{
					return data[propertyId+currentPriority];
				}
			};



			/*
			---------------------------------------------------------------------------
				 FACTORY METHODS :: ATTACH METHODS
			---------------------------------------------------------------------------
			*/

			members.get = getter;

			// There are exactly two types of init methods:
			// 1. Initializing the value given in the property configuration (calling apply methods, firing events, etc.)
			// 2. Initializing the value during instance creation (useful for instance-specific non-shared values)
			if (propertyInit !== Undefined)
			{
				members.init = function()
				{
					var context = this;
					var data = context[store];
					if (data)
					{
						// Check whether there is already another value assigned.
						// In this case the whole function could be left early.
						var oldPriority = data[propertyId];
						if (oldPriority !== Undefined) {
							return;
						}
					}

					// Call apply
					if (propertyApply) {
						context[propertyApply](propertyInit, Undefined, config.name);
					}

					// Fire event
					if (propertyEvent) {
						context.fireDataEvent(propertyEvent, propertyInit, Undefined);
					}

					// Inheritance support
					if (propertyInheritable) {
						changeInheritedHelper(context, propertyInit, Undefined, config);
					}
				};
			}

			members.set = setter(3);
			members.reset = resetter(3);
		},


		/**
		 * Returns a value from a specific field for the given property - ignoring the priorities.
		 *
		 * @param obj {qx.core.Object} Any object with the given property
		 * @param propertyName {String} Name of the property to query
		 * @param field {String} One of "init", "inheritance", "theme", "user" or "override"
		 */
		getSingleValue : function(obj, propertyName, field)
		{
			var key = propertyNameToId[propertyName] + fieldToPriority[field];
			if (jasy.Env.isSet("debug"))
			{
				if (typeof key != "number" || isNaN(key)) {
					throw new Error("Invalid property or field: " + propertyName + ", " + field);
				}
			}

			return obj[store][key];
		},


		/**
		 * Imports a list of values. Useful for batch-applying a whole set of properties. Supports
		 * <code>undefined</code> values to reset properties.
		 *
		 * @param obj {qx.ui.core.Widget} Any widget
		 * @param values {Map} Map of properties to apply
		 * @param oldValues {Map} Map of old property values. Just used for comparision.
		 *		Required for theme changes. In case of a state change the old value is not available otherwise.
		 * @param field {String} Storage field to modify
		 */
		importData : function(obj, values, oldValues, field)
		{
			// Check existence of data structure
			var data = obj[store];
			if (!data) {
				data = obj[store] = {};
			}

			// Commonly used variables
			var modifyPriority = fieldToPriority[field];

			var propertyName, propertyId, newValue, oldValue, oldPriority, propertyInit;

			// Import every given property
			for (propertyName in values)
			{
				propertyId = propertyNameToId[propertyName];

				if (jasy.Env.isSet("debug"))
				{
					if (propertyId === undefined) {
						throw new Error(obj + ": Invalid property to import: " + propertyName);
					}
				}

				// Ignore if there is a higher priorized value
				// Earliest return option: Higher priorized value set
				oldPriority = data[propertyId];
				if (oldPriority > modifyPriority) {
					continue;
				}

				newValue = values[propertyName];

				// If nothing is set at the moment and no new value is given then simply ignore the property for the moment
				if (oldPriority === Undefined && newValue === Undefined) {
					continue;
				}

				// Read out old value
				if (oldPriority != null)
				{
					if (oldValues && oldPriority == modifyPriority) {
						oldValue = oldValues[propertyName];
					}
					else
					{
						var oldGetter = priorityToFieldConfig[oldPriority].get;
						if (oldGetter) {
							oldValue = obj[oldGetter] ? obj[oldGetter](propertyName) : Undefined;
						} else {
							oldValue = data[propertyId+oldPriority];
						}
					}
				}
				else
				{
					oldValue = Undefined;
				}

				// Compare old and new value
				// Second earliest return option: New value given and identical to old
				if (oldValue === newValue) {
					continue;
				}

				// Reset implementation block
				if (newValue === Undefined)
				{
					// We lost the current value, now we need to find the next stored value
					var newValue, newGetter;

					for (var newPriority=modifyPriority-1; newPriority>0; newPriority--)
					{
						newGetter = priorityToFieldConfig[newPriority].get;
						if (newGetter) {
							newValue = obj[newGetter] ? obj[newGetter](propertyName) : Undefined;
						} else {
							newValue = data[propertyId+newPriority];
						}

						if (newValue !== Undefined) {
							break;
						}
					}

					// No value has been found
					if (newValue === Undefined)
					{
						newPriority = Undefined;

						// Let's try the property-wide init value
						if (propertyInit !== Undefined)
						{
							newValue = propertyInit;
						}
						else if (jasy.Env.isSet("debug"))
						{
							// Still no value. We warn about that the property is not nullable.
							var config = PropertyUtil.getPropertyDefinition(obj.constructor, propertyName);
							if (!config.nullable) {
								obj.error("Missing value for: " + propertyName + " (during reset() - from theme system)");
							}
						}
					}

					// Be sure that priority is right
					data[propertyId] = newPriority;
				}

				// Set implementation block
				else if (oldPriority != modifyPriority)
				{
					data[propertyId] = modifyPriority;
				}

				// Call change helper
				// Third earlist "return" option, ok, not really a return option, but we at least omit useless change calls
				// when values are identical
				if (newValue !== oldValue)
				{
					var config = PropertyUtil.getPropertyDefinition(obj.constructor, propertyName);

					// Call apply
					if (config.apply) {
						obj[config.apply](newValue, oldValue, config.name);
					}

					// Fire event
					if (config.event) {
						obj.fireDataEvent(config.event, newValue, oldValue);
					}

					// Inheritance support
					if (config.inheritable) {
						changeInheritedHelper(obj, newValue, oldValue, config);
					}
				}
			}
		},



		/*
		---------------------------------------------------------------------------
			PUBLIC INHERITANCE API
		---------------------------------------------------------------------------
		*/

		/**
		 * Returns a list of all inheritable properties supported by the given class.
		 *
		 * You may choose to access inheritable properties via:
		 * obj.__inheritables || jasy.property.Multi.getInheritableProperties(obj)
		 * for better performance.
		 *
		 * @param clazz {Class} Class to query
		 * @return {Map} All inheritable property names and a dictionary for faster lookup
		 */
		getInheritableProperties : function(clazz)
		{
			var result = clazz.__inheritables = {};

			// Find all local properties which are inheritable
			var props = clazz.$$properties;
			if (props)
			{
				for (var name in props)
				{
					if (props[name].inheritable) {
						result[name] = props[name];
					}
				}
			}

			var superClass = clazz.superclass;
			if (superClass && superClass !== Object)
			{
				var remote = superClass.__inheritables || this.getInheritableProperties(superClass);
				for (var name in remote) {
					result[name] = remote[name];
				}
			}

			return result;
		},


		/**
		 * Process an object whenever the parent has changed.
		 *
		 * Should be called by the object itself which was modified. Required are both parents, the old and the new one
		 * to make this work correctly. All given objects need to support the "$$parent" and "$$data" object fields.
		 *
		 * This function is quite optimized for reduced additional function calls. The only expensive scenarios are when
		 * a property is currently inherited or the new parent offers a value which needs to aquired using a get()
		 * call (e.g. themed or itself inherited). This means it is basically cheap for initial application creation,
		 * but is more expensive as soon as the application is running and objects are moved around dynamically.
		 *
		 * @param obj {qx.core.Object} The modified object
		 * @param newParent {qx.core.Object} The current parent
		 * @param oldParent {qx.core.Object} The new parent
		 */
		moveObject : function(obj, newParent, oldParent)
		{
			// Fast compare (e.g. both null - should not happen, but still)
			if (newParent == oldParent) {
				return;
			}

			// Runtime variables
			var inheritedPriority,
				clazz, properties, propertyName, propertyId, propertyConfig,
				data, oldPriority, oldValue, newValue,
				newParentData, newParentPriority, newParentGetter;

			// Fill with shared values through processing of all properties
			inheritedPriority = fieldToPriority.inherited;

			// Cache data field from object
			data = obj[store];
			if (!data) {
				data = obj[store] = {};
			}

			// Cache data field from new parent
			newParentData = newParent ? newParent[store] : Undefined;

			// Iterate through all inheritable properties
			clazz = obj.constructor;
			properties = clazz.__inheritables || this.getInheritableProperties(clazz);
			for (propertyName in properties)
			{
				propertyId = propertyNameToId[propertyName];


				//
				// READ OLD VALUE
				//

				oldPriority = data ? data[propertyId] : Undefined;
				if (oldPriority === Undefined)
				{
					// Fallback to class-wide init value
					oldValue = properties[propertyName].init;
				}
				else if (oldPriority == inheritedPriority)
				{
					// If we have used an inherited value, just ask the old parent for its value
					oldValue = oldParent.get(propertyName);
				}
				else
				{
					// Higher priority field exists
					continue;
				}


				//
				// READ NEW VALUE
				//

				// Read new parent's value
				newValue = Undefined;
				if (newParent)
				{
					newParentPriority = newParentData ? newParentData[propertyId] : Undefined;
					if (newParentPriority === Undefined)
					{
						// try to read old value from init value
						parentConstructor = newParent.constructor;
						parentProperties = parentConstructor.__inheritables || this.getInheritableProperties(parentConstructor);
						newValue = parentProperties[propertyName].init;
					}
					else
					{
						// Deal with special getters (value comes from inheritable/themeable)
						newParentGetter = priorityToFieldConfig[newParentPriority].get;
						if (newParentGetter) {
							newValue = newParent[newParentGetter] ? newParent[newParentGetter](propertyName) : Undefined;
						} else {
							newValue = newParentData[propertyId+newParentPriority];
						}

						if (newValue === Undefined) {
							newValue = newParent[propertyInitKey];
						}
					}
				}

				// In cases where we have no new parent or the new parent don't has a value
				// itself as well, then we try to use our init value as the new value
				if (newValue === Undefined)
				{
					newValue = obj[propertyInitKey];

					if (data[propertyId] !== Undefined) {
						data[propertyId] = Undefined;
					}
				}
				else
				{
					data[propertyId] = inheritedPriority;
				}



				//
				// PERFORM CHANGES
				//

				// Compare values
				if (newValue !== oldValue)
				{
					// obj.debug("Refresh: " + propertyName + ": " + oldValue + " => " + newValue);

					propertyConfig = properties[propertyName];

					// Call apply
					if (propertyConfig.apply) {
						obj[propertyConfig.apply](newValue, oldValue, propertyName);
					}

					// Fire event
					if (propertyConfig.event) {
						obj.fireDataEvent(propertyConfig.event, newValue, oldValue);
					}

					// Update children
					changeInheritedHelper(obj, newValue, oldValue, propertyConfig);
				}
			}
		}
	});
})();