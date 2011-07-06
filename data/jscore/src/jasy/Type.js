/* 
==================================================================================================
  Jasy - JavaScript Tooling Refined
  Copyright 2010-2011 Sebastian Werner
==================================================================================================
*/

/**
 * Convenient type check API with focus on a small base set features, mainly as
 * used by the property system, and an additional possibility to register
 * new types dynamically.
 * 
 * Built-in support:
 * 
 * * All native types e.g. String, Number, Boolean, Function, ...
 * * Node types. Currently: Node, Element and Document
 * * Special numeric values: Integer, PositiveNumber and PositiveInteger
 * * Check whether the value matches the given regular expression
 * * Instanceof checks (when classname is given)
 * * Implementation checks (when interface is given)
 * 
 * Plus:
 * 
 * * Lists of possible values e.g. ["top","bottom"]
 * * Custom check functions e.g. function(value) { return xxx } (should return boolean)
 *
 * @name {Type}
 * @break {Class}
 * @break {Interface}
 */
(function(global) 
{
	var builtins =
	{
		"String" : 1,
		"Number" : 1,
		"Function" : 1,
		"RegExp" : 1,
		"Date" : 1,
		"Boolean" : 1,
		"Array" : 1,
		"Object" : 1,
		"Error" : 1
	};
	
	var primitives =
	{
		"String" : "string",
		"Number" : "number",
		"Boolean" : "boolean"
	};
	
	var builtinString =
	{
		"[object String]": "String",
		"[object Array]": "Array",
		"[object Object]": "Object",
		"[object RegExp]": "RegExp",
		"[object Number]": "Number",
		"[object Boolean]": "Boolean",
		"[object Date]": "Date",
		"[object Function]": "Function",
		"[object Error]": "Error"
	};
	
	var classLike =
	{
		"Module" : 1,
		"Class" : 1,
		"Interface" : 1
	};
	
	var nodeLike =
	{
		"Node" : 1,
		"Element" : 1,
		"Document" : 1
	};
	
	var addons = {};
	
	
	Module("jasy.Type", 
	{
		/**
		 * Registers new types to the class.
		 * 
		 * The function should return <code>false</code> whenever the value is invalid.
		 * 
		 * @param type {String} Identifier of the type. Should be camel-case (with first character being uppercase)
		 * @param method {Function} Pointer to function to call
		 * @param context {Object} Context to call the function in
		 */
		add : function(type, method, context)
		{
			if (jasy.Permutation.isSet("debug") && addons[type]) {
				throw new Error("Type if already registered by another class: " + type);
			}

			addons[type] = {
				method : method,
				context : context
			};
		},


		/**
		 * Advanced type checks offered by the property system, made available
		 * widely for usage in other scenarios as well. 
		 * 
		 * Just call the method with the value and any of the property 
		 * system supported checks and the method throws an error whenever
		 * the incoming value does not conform.
		 * 
		 * @param value {var} Any value
		 * @param check {String} Any supported check e.g. native type, class name, ...
		 * @param context {Object?window} Only useful when function-checks are used. Defines the context
		 *		in this the function is being called.
		 */
		check : function(value, check, context)
		{
			var result, nativeCheck, variant, type, hack, nodeType, clazz, construct, iface, mixin, addon, i, l;

			if (value == null) 
			{
				result = check == "Null";

				if (jasy.Permutation.isSet("debug") && !result) {
					throw new Error("Value: '" + value + "' is null but needs to be: " + check + "!");
				}
			}

			else if (typeof check == "string")
			{
				// Check basic native types
				if (builtins[check]) 
				{
					type = primitives[check];
					if (type) {
						result = typeof value == type;
					} 

					if (!result) {
						result = builtinString[Object.prototype.toString.call(value)] == check;
					}

					if (result && check == "Number") {
						result = isFinite(value);
					}

					if (jasy.Permutation.isSet("debug") && !result) {
						throw new Error("Value: '" + value + "' is not type of: " + check + "!");
					}
				}

				// Check node types
				else if (nodeLike[check])
				{
					nodeType = value.nodeType;
					result = nodeType != null && 
						(check == "Node" || (nodeType == 1 && check == "Element") || (nodeType == 9 && check == "Document"));

					if (jasy.Permutation.isSet("debug") && !result) {
						throw new Error("Value: '" + value + "' is not type of " + check + "!");
					} 
				}

				// Check class like types
				else if (classLike[check]) 
				{
					result = value.$$type == check;

					if (jasy.Permutation.isSet("debug") && !result) {
						throw new Error("Value: '" + value + "' is not type of " + check + "!");
					}
				}

				else
				{
					// Check classes, interfaces, mixins
					clazz = Core.resolve(check);
					if (clazz) 
					{
						result = value.hasOwnProperty && value instanceof clazz;

						if (jasy.Permutation.isSet("debug") && !result) {
							throw new Error("Value: '" + value + "' is not an instance of " + check + "!");
						}
					}
					else
					{
						construct = value.constructor;
						iface = Core.resolve(check);
						if (iface) 
						{
							result = qx.Bootstrap.hasInterface(construct, iface);

							if (jasy.Permutation.isSet("debug") && !result) {
								throw new Error("Value: '" + value + "' do not implement interface: " + check + "!");
							}
						} 
						else
						{
							mixin = Core.resolve(check);
							if (mixin) 
							{
								result = qx.Class && qx.Class.hasMixin(construct, mixin);

								if (jasy.Permutation.isSet("debug") && !result) {
									throw new Error("Value: '" + value + "' does not include mixin: " + check + "!");
								}
							}
						}
					}
				} 

				// Support dynamically added checks as well
				if (result == null)
				{
					addon = addons[check];
					if (addon) {
						result = addon.method.call(addon.context||global, value);
					}
				}				
			}

			// Multi value lists 
			else if (check instanceof Array)
			{
				if (check.indexOf) 
				{
					result = check.indexOf(value) != -1;
				}
				else
				{
					result = false;
					for (i=0, l=check.length; i<l; i++) 
					{
						if (value === check[i]) 
						{
							result = true;
							break;
						}
					}
				}

				if (jasy.Permutation.isSet("debug") && !result) {
					throw new Error("Value: '" + value + "' is not listed in possible values: " + check);
				}
			}

			// Custom regexps
			else if (check instanceof RegExp)
			{
				z.Type.check(value, "String");
				result = check.match(value);

				if (jasy.Permutation.isSet("debug") && !result) {
					throw new Error("Value: '" + value + "' does not match regular expression: " + check);
				}
			}

			// Custom functions
			else if (check instanceof Function) 
			{
				try 
				{
					result = check.call(context||global, value);

					// If function has no return value, but did not throw an exception
					// than we think it's OK.
					if (result == null) {
						result = true;
					}
				} 
				catch(ex) 
				{
					if (jasy.Permutation.isSet("debug")) {
						throw new Error("Value: '" + value + "' is not accepted by check routine: " + ex);
					} else {
						result = false;
					}
				}

				if (jasy.Permutation.isSet("debug") && !result) {
					throw new Error("Value: '" + value + "' is not accepted by check routine.");
				}
			}

			// Done
			if (result == null || result == false)
			{
				if (!Error) {
					Error = global.Error;
				}

				if (result == null) {
					throw new Error("Unsupported check: " + check);
				} else {
					throw new Error("Value: '" + value + "' does not validates as: " + check);
				}
			}
		}
	});
})(this);

