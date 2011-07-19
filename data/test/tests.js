var global = this;
$(function() {
	
	/*
	---------------------------------------------------------------------------
		EXT
	---------------------------------------------------------------------------
	*/
	
	module("Ext");
	
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
		CLASSES
	---------------------------------------------------------------------------
	*/
	
	module("Classes", {
		teardown : function() {
			Module.clearName("abc.Class1");
			Module.clearName("abc.Class2");
			Module.clearName("abc.Class3");
			Module.clearName("conflict.Class1");
			Module.clearName("conflict.Include1");
			Module.clearName("conflict.Include2");
			Module.clearName("events.Keyboard");
			Module.clearName("events.Mouse");
			Module.clearName("events.Widget");
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


	
	
	
	/**
	 * Two classes which should be mixed into another one define the same member. 
	 * A conflict arises, as both could not be merged into the target class.
	 */
	test("Conflicting member functions", function() {
		Class("conflict.Include1", {
			members : {
				foo : function() {}
			}
		});
		Class("conflict.Include2", {
			members : {
				foo : function() {}
			}
		});

		raises(function() {
			Class("conflict.Join", {
				include : [conflict.Include1, conflict.Include2]
			});
		});
	});
	
	
	/**
	 * Two classes which should be mixed into another one define the same member.
	 * A conflict arises, as both could not be merged into the target class.
	 */
	test("Conflicting member data", function() {
		Class("conflict.Include1", {
			members : {
				foo : 1
			}
		});
		Class("conflict.Include2", {
			members : {
				foo : 2
			}
		});

		raises(function() {
			Class("conflict.Join", {
				include : [conflict.Include1, conflict.Include2]
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
		Class("conflict.Include1", {
			members : {
				foo : function() {}
			}
		});
		Class("conflict.Include2", {
			members : {
				foo : function() {}
			}
		});

		Class("conflict.Join", {
			include : [conflict.Include1, conflict.Include2],
			
			members : {
				// Merge manually
				foo : function() {
					conflict.Include1.prototype.foo.call(this);
					conflict.Include2.prototype.foo.call(this);
					
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
		Class("conflict.Include1", {
			members : {
				foo : function() {}
			}
		});
		Class("conflict.Include2", {
			members : {
				foo : function() {}
			}
		});

		raises(function() {
			Class("conflict.Join", {
				include : [conflict.Include1, conflict.Include2],
			
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
		Class("conflict.Include1", {
			members : {
				__foo : function() {}
			}
		});
		Class("conflict.Include2", {
			members : {
				__foo : function() {}
			}
		});

		raises(function() {
			Class("conflict.Join", {
				include : [conflict.Include1, conflict.Include2],
			
				members : {
					// Private merge... not allowed
					__foo : function() {
						conflict.Include1.prototype.foo.call(this);
						conflict.Include2.prototype.foo.call(this);
					
						doSomethingElse();
					}
				}
			});
		});
	});	
	
	
	
	
	/**
	 * Basic event declaration with additional test to mixin classes.
	 */
	test("Events", function() {
		Class("events.Mouse", {
			events : {
				click : "MouseEvent",
				mousedown : "MouseEvent",
				mouseup : "MouseEvent"
			}
		});
		
		var eventMap = Class.getEvents(events.Mouse);
		ok(Assert.isMap(eventMap), "Events should be a returned as a map");
		equals(eventMap.click, "MouseEvent", "No click event found");
		
		Class("events.Keyboard", {
			events : {
				keydown : "KeyEvent",
				keyup : "KeyEvent",
			}
		});
		
		Class("events.Widget", {
			include : [events.Mouse, events.Keyboard]
		});
		
		var full = Object.keys(Class.getEvents(events.Widget)).join(",");
		equals(full, "click,mousedown,mouseup,keydown,keyup", "Merge of events failed");
	});
	
	
	
	test("Event Conflicts", function() {
		Class("events.Mouse", {
			events : {
				click : "MouseEvent",
				mousedown : "MouseEvent",
				mouseup : "MouseEvent"
			}
		});
		
		Class("events.Keyboard", {
			events : {
				keydown : "KeyEvent",
				keyup : "KeyEvent",
			}
		});		
		
		Class("events.Widget", {
			include : [events.Mouse, events.Keyboard],
			
			events : {
				"click" : "CrazyClick"
			}
		});
		
		console.debug(Class.getEvents(events.Widget))
	});	
	
});
