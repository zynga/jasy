var global = this;
$(function() {
	
	/*
	---------------------------------------------------------------------------
		FIX
	---------------------------------------------------------------------------
	*/
	
	module("Fix");
	
	asyncTest("setTimeout with arguments", 1, function() {
		setTimeout(function(arg) {
			equals(arg, "hello");
			start();
		}, 10, "hello");
	});

	asyncTest("setImmediate", 1, function() {
		setImmediate(function() {
			ok(true, "always fine");
			start();
		});
	});

	asyncTest("requestAnimationFrame", 1, function() {
		requestAnimationFrame(function() {
			ok(true, "always fine");
			start();
		});
	});
	
	test("Object.keys", function() {
		var keys = Object.keys({toString:null, hello:null, foo:1}).sort().join(",");
		equals(keys, "foo,hello,toString");
	});


	
	
	/*
	---------------------------------------------------------------------------
		EXT
	---------------------------------------------------------------------------
	*/
	
	module("Ext");

	test("Object.values", function() {
		var values = Object.values({x:1, y:2, z:3}).sort().join(",");
		equals(values, "1,2,3");
	});
	
	test("Array.max", function() {
		equals([1,4,23,3].max(), 23);
		equals([10,10,10].max(), 10);
		equals([].max(), -Infinity);
	});

	test("Array.min", function() {
		equals([1,4,23,3].min(), 1);
		equals([10,10,10].min(), 10);
		equals([].min(), Infinity);
	});
	
	test("Array.contains", function() {
		var arr1 = [1,2,3,5,6,7];
		ok(arr1.contains(3));
		ok(!arr1.contains(4));
		ok(arr1.contains(5));
		
		var arr2 = ["true","1",3,false];
		ok(!arr2.contains(true));
		ok(!arr2.contains(1));
		ok(!arr2.contains("3"));
		ok(!arr2.contains("false"));

		ok(arr2.contains("true"));
		ok(arr2.contains("1"));
		ok(arr2.contains(3));
		ok(arr2.contains(false));
	});

	test("Array.removeRange", function() {
		var arr = [1,2,3,4,5,6,7,8,9];
		equals(arr.removeRange(1), 8);
		equals(arr.join(","), "1,3,4,5,6,7,8,9");

		var arr = [1,2,3,4,5,6,7,8,9];
		equals(arr.removeRange(1, 1), 8);
		equals(arr.join(","), "1,3,4,5,6,7,8,9");

		var arr = [1,2,3,4,5,6,7,8,9];
		equals(arr.removeRange(1, 3), 6);
		equals(arr.join(","), "1,5,6,7,8,9");

		var arr = [1,2,3,4,5,6,7,8,9];
		equals(arr.removeRange(1, -3), 3);
		equals(arr.join(","), "1,8,9");
	});




	/*
	---------------------------------------------------------------------------
		NAMES
	---------------------------------------------------------------------------
	*/
	
	module("Names", {
		teardown : function() {
			delete global.foo;
			delete global.abc;
		}
	});
	
	test("Creating global", function() {
		Module.declareName('foo', 3);
		equals(global.foo, 3);
	});

	test("Creating namespace", function() {
		Module.declareName('abc.def', 5);
		equals(global.abc.def, 5);
	});
	
	

	/*
	---------------------------------------------------------------------------
		MODULES
	---------------------------------------------------------------------------
	*/
	
	module("Modules", {
		teardown : function() {
			delete global.abc;
		}
	});
	
	test("Creating empty module", function() {
		Module("abc.Module1", {});
		equals(Module.isModule(abc.Module1), true);
		equals(abc.Module1.moduleName, "abc.Module1");
		equals(abc.Module1.toString(), "[Module abc.Module1]");
	});

	test("Module validation", function() {
		equals(Module.isModule({}), false);
		equals(Module.isModule(3), false);
		equals(Module.isModule(null), false);
		equals(Module.isModule({__isModule:true}), false);
	});
	
	test("Creating method module", function() {
		Module("abc.Module2", {
			method1 : function() {},
			method2 : function() {},
			method3 : function() {}
		});
		equals(Module.isModule(abc.Module2), true);
		ok(abc.Module2.method1 instanceof Function);
		ok(abc.Module2.method2 instanceof Function);
		ok(abc.Module2.method3 instanceof Function);
		equals(abc.Module2.method1.displayName, "abc.Module2.method1");
		equals(abc.Module2.method2.displayName, "abc.Module2.method2");
		equals(abc.Module2.method3.displayName, "abc.Module2.method3");
	});
	
	test("Checking module name", function() {
		raises(function() {
			Module("", {});
		});
		raises(function() {
			Module(true, {});
		});
		raises(function() {
			Module(" SpaceVoodoo ", {});
		});
		raises(function() {
			Module("has space", {});
		});
		raises(function() {
			Module("firstLow", {});
		});
		raises(function() {
			Module("two..Dots", {});
		});
	});
	
	
	
	/*
	---------------------------------------------------------------------------
		CLASSES :: CORE
	---------------------------------------------------------------------------
	*/
	
	module("ClassesCore", {
		teardown : function() {
			Module.clearName("abc.Class1");
			Module.clearName("abc.Class2");
			Module.clearName("abc.Class3");
		}
	});

	test("Invalid config", function() {
		raises(function() {
			Class("abc.Class1");
		});
		raises(function() {
			Class("abc.Class2", 42);
		})
		raises(function() {
			Class("abc.Class3", {
				unallowedKey : "foo"
			});
		});
	});

	test("Creating empty class", function() {
		Class("abc.Class1", {});
		equals(Class.isClass(abc.Class1), true);
		equals(abc.Class1.className, "abc.Class1");
		equals(abc.Class1.toString(), "[Class abc.Class1]");
	});
	
	
	
	/*
	---------------------------------------------------------------------------
		CLASSES :: MEMBERS
	---------------------------------------------------------------------------
	*/	
	
	module("ClassesMembers", {
		teardown : function() {
			Module.clearName("members.Class1");
			Module.clearName("members.Include1");
			Module.clearName("members.Include2");
		}
	});
	
	
	/**
	 * Two classes which should be mixed into another one define the same member. 
	 * A conflict arises, as both could not be merged into the target class.
	 */
	test("Conflicting member functions", function() {
		Class("members.Include1", {
			members : {
				foo : function() {}
			}
		});
		Class("members.Include2", {
			members : {
				foo : function() {}
			}
		});

		raises(function() {
			Class("members.Join", {
				include : [members.Include1, members.Include2]
			});
		});
	});
	
	
	/**
	 * Two classes which should be mixed into another one define the same member.
	 * A conflict arises, as both could not be merged into the target class.
	 */
	test("Conflicting member data", function() {
		Class("members.Include1", {
			members : {
				foo : 1
			}
		});
		Class("members.Include2", {
			members : {
				foo : 2
			}
		});

		raises(function() {
			Class("members.Join", {
				include : [members.Include1, members.Include2]
			});
		});
	});	
	
	
	/**
	 * Two classes which should be mixed into another one define the same member. 
	 * The conflict is prevented as the affected member is also defined locally. So
	 * the author of the including class is aware of the conflict and could call the
	 * original methods if that makes sense.
	 */
	test("Conflicting member functions, correctly merged", function() {
		Class("members.Include1", {
			members : {
				foo : function() {}
			}
		});
		Class("members.Include2", {
			members : {
				foo : function() {}
			}
		});

		Class("members.Join", {
			include : [members.Include1, members.Include2],
			
			members : {
				// Merge manually
				foo : function() {
					members.Include1.prototype.foo.call(this);
					members.Include2.prototype.foo.call(this);
					
					doSomethingElse();
				}
			}
		});
		
		ok(true);
	});
	
	
	/**
	 * Two classes which should be mixed into another one define the same member. 
	 * The conflict is tried being prevented as the affected member is also defined locally. But as
	 * it is not a function this is not regarded as solved. The individual included classes might
	 * require that this member is a function!
	 */
	test("Conflicting member functions, not merged correctly", function() {
		Class("members.Include1", {
			members : {
				foo : function() {}
			}
		});
		Class("members.Include2", {
			members : {
				foo : function() {}
			}
		});

		raises(function() {
			Class("members.Join", {
				include : [members.Include1, members.Include2],
			
				members : {
					// Invalid merge
					foo : null
				}
			});
		});
	});	
	
	
	/**
	 * Two classes which should be mixed into another one define the same member. 
	 * The conflict is tried to being prevented as the affected member is also defined locally. 
	 * But this is not allowed for private members.
	 */
	test("Conflicting member functions with failed private merge", function() {
		Class("members.Include1", {
			members : {
				__foo : function() {}
			}
		});
		Class("members.Include2", {
			members : {
				__foo : function() {}
			}
		});

		raises(function() {
			Class("members.Join", {
				include : [members.Include1, members.Include2],
			
				members : {
					// Private merge... not allowed
					__foo : function() {
						members.Include1.prototype.foo.call(this);
						members.Include2.prototype.foo.call(this);
					
						doSomethingElse();
					}
				}
			});
		});
	});	
	


	/*
	---------------------------------------------------------------------------
		CLASSES :: EVENTS
	---------------------------------------------------------------------------
	*/
	
	module("ClassesEvents", {
		teardown : function() {
			Module.clearName("events.Keyboard");
			Module.clearName("events.Mouse");
			Module.clearName("events.Widget");
			Module.clearName("events.Widget2");
		}
	});
	
		
	/**
	 * Basic event declaration with additional test to mixin classes.
	 */
	
	// Prepare event classes
	Class("MouseEvent", {});
	Class("KeyEvent", {});
	Class("TouchEvent", {});
	Class("DataEvent", {});

	
	test("Events", function() {
		Class("events.Mouse", {
			events : {
				click : MouseEvent,
				mousedown : MouseEvent,
				mouseup : MouseEvent
			}
		});
		
		var eventMap = Class.getEvents(events.Mouse);
		ok(Assert.isMap(eventMap), "Events should be a returned as a map");
		equals(eventMap.click, MouseEvent, "No click event found");
		
		Class("events.Keyboard", {
			events : {
				keydown : KeyEvent,
				keyup : KeyEvent,
			}
		});
		
		Class("events.Widget", {
			include : [events.Mouse, events.Keyboard]
		});
		
		var full = Object.keys(Class.getEvents(events.Widget)).join(",");
		equals(full, "click,mousedown,mouseup,keydown,keyup", "Merge of events failed");

		Class("events.Widget2", {
			include : [events.Mouse, events.Keyboard],
			events : {
				custom : DataEvent
			}
		});

		var full = Object.keys(Class.getEvents(events.Widget2)).join(",");
		equals(full, "custom,click,mousedown,mouseup,keydown,keyup", "Merge of events with own events failed");
	});
	
	
	
	test("Event Conflicts", function() {
		Class("events.Mouse", {
			events : {
				click : MouseEvent,
				mousedown : MouseEvent,
				mouseup : MouseEvent
			}
		});
		
		Class("events.Keyboard", {
			events : {
				keydown : KeyEvent,
				keyup : KeyEvent,
			}
		});
		
		Class("events.Widget", {
			include : [events.Mouse, events.Keyboard],
			
			events : {
				// This override should be okay
				click : MouseEvent
			}
		});
		
		Class("events.Touch", {
			events : {
				click : TouchEvent,
				tap : TouchEvent
			}
		});		
		
		var full = Object.keys(Class.getEvents(events.Widget)).join(",");
		equals(full, "click,mousedown,mouseup,keydown,keyup", "Merge of events failed");
		
		raises(function() {
			Class("events.Widget2", {
				// This should fail, two click events in include list
				include : [events.Mouse, events.Keyboard, events.Touch]
			});		
		})
	});
	
	
	
	/*
	---------------------------------------------------------------------------
		CLASSES :: PROPERTIES
	---------------------------------------------------------------------------
	*/
	
	module("ClassesProperties", {
		teardown : function() {
			Module.clearName("properties.Text");
			Module.clearName("properties.Dimension");
			Module.clearName("properties.Label");
		}
	});	
	
	test("Create Properties", function() 
	{
		Class("properties.Text", 
		{
			construct : function(element) {
				this.__textElement = element;
			},
			
			properties : 
			{
				wrap : 
				{
					type : "Boolean",
					apply : function(value, old) {
						this.__textElement.style.whiteSpace = value ? "" : "no-wrap"
					}
				},
				
				color : 
				{
					type : "Color",
					fire : "changeColor",
					apply : function(value, old) {
						this.__textElement.style.color = value;
					},
				},
				
				fontFamily : 
				{
					type : ["sans-serif", "serif", "monospace"],
					fire : "changeFontFamily",
					apply : function(value, old) {
						this.__textElement.style.fontFamily = value;
					}
				},
				
				lineHeight : 
				{
					type : "Integer",
					fire : "changeLineHeight",
					apply : function(value, old) {
						this.__textElement.style.lineHeight = value;
					}
				}
			},
			
			members : 
			{
				destruct : function() {
					this.__textElement = null;
				}
			}
		});
		
		ok(Assert.isClass(properties.Text));

		ok(Assert.isFunction(properties.Text.prototype.getWrap));
		ok(Assert.isFunction(properties.Text.prototype.getColor));
		ok(Assert.isFunction(properties.Text.prototype.getFontFamily));
		ok(Assert.isFunction(properties.Text.prototype.getLineHeight));

		ok(Assert.isFunction(properties.Text.prototype.setWrap));
		ok(Assert.isFunction(properties.Text.prototype.setColor));
		ok(Assert.isFunction(properties.Text.prototype.setFontFamily));
		ok(Assert.isFunction(properties.Text.prototype.setLineHeight));

		equals(properties.Text.prototype.getWrap.displayName, "properties.Text.getWrap");
		equals(properties.Text.prototype.setWrap.displayName, "properties.Text.setWrap");
		equals(properties.Text.prototype.resetWrap.displayName, "properties.Text.resetWrap");

		equals(properties.Text.prototype.setLineHeight.length, 1);
		equals(properties.Text.prototype.getLineHeight.length, 0);
		equals(properties.Text.prototype.resetLineHeight.length, 0);
		

		Class("properties.Dimension", 
		{
			properties : 
			{
				width : {
					type : "Integer"
				},
				
				height : {
					type : "Integer"
				}
			}
		});

		ok(Assert.isClass(properties.Dimension));


		Class("properties.Label", 
		{
			include : [properties.Text, properties.Dimension],
			
			construct : function() {
				this.__labelElement = document.createElement("label");
				
				properties.Text.call(this, this.__labelElement);
				
				this.setLineHeight(2);
			},
			
			members :
			{
				destruct : function() 
				{
					properties.Text.prototype.destruct.call(this);
					this.__labelElement = null;
				}
			}
		});
		
		ok(Assert.isClass(properties.Label));
		
		
		
	})
	
	
	
});
