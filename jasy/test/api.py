#!/usr/bin/env python3

import sys, os, unittest, logging, pkg_resources

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir))
sys.path.insert(0, jasyroot)


import jasy.js.parse.Parser as Parser
import jasy.js.parse.ScopeScanner as ScopeScanner
import jasy.js.api.Data as Data


class Tests(unittest.TestCase):

    def process(self, code):
        node = Parser.parse(code)
        ScopeScanner.scan(node)
        data = Data.ApiData(node, "test")
        
        return data
        
        
    def test_basic(self):

        data = self.process("""

        core.Class("foo.Bar", {});

        """)

        self.assertIsInstance(data, Data.ApiData)
        
                
    def test_primitives(self):
        
        data = self.process("""
        
        core.Class("foo.Bar", 
        {
          members: {
            pi: 3.14,
            str: "hello world",
            bool: true
          }
        });
        
        """)
        
        self.assertIsInstance(data.members, dict)
        self.assertIn("pi", data.members)
        self.assertIn("str", data.members)
        self.assertIn("bool", data.members)
        self.assertEqual(data.members["pi"]["type"], "Number")
        self.assertEqual(data.members["str"]["type"], "String")
        self.assertEqual(data.members["bool"]["type"], "Boolean")
        
        
        
    def test_override(self):

        data = self.process("""

        core.Class("foo.Bar", 
        {
          members: {
            /** {=Color} */
            background: "#fff",
          }
        });

        """)

        self.assertIsInstance(data.members, dict)
        self.assertIn("background", data.members)
        self.assertEqual(data.members["background"]["type"], "Color")
        
        
    def test_function(self):
        
        data = self.process("""

        core.Class("foo.Bar", 
        {
          members: {
            /**
             * {Number} Computes the sum of @a {Number} and @b {Number}
             */
            func: function(a, b) {
                return a+b;
            }
          }
        });

        """)

        self.assertIsInstance(data.members, dict)
        self.assertIn("func", data.members)
        self.assertEqual(data.members["func"]["type"], "Function")
        self.assertIsInstance(data.members["func"]["params"], dict)
        self.assertIsInstance(data.members["func"]["params"]["a"], dict)
        self.assertIsInstance(data.members["func"]["params"]["b"], dict)
        self.assertEqual(data.members["func"]["params"]["a"]["type"], ["Number"])
        self.assertEqual(data.members["func"]["params"]["b"]["type"], ["Number"])
        self.assertEqual(data.members["func"]["returns"], ["Number"])
        
        
    def test_literal(self):
        
        data = self.process("""
        
        core.Class("foo.Bar", 
        {
          members: {
            map: {foo:1,bar:2},
            array: [1,2,3],
            reg: /[a-z]/g
          }
        });
        
        """)
        
        self.assertIsInstance(data.members, dict)
        self.assertEqual(data.members["map"]["type"], "Map")
        self.assertEqual(data.members["array"]["type"], "Array")
        self.assertEqual(data.members["reg"]["type"], "RegExp")
        
        
    def test_number(self):
        
        data = self.process("""

        core.Class("foo.Bar", 
        {
          members: {
            bitwise: 1 ^ 2,
            shif: 4 >> 3,
            mod: 15 / 4,
            unary: -3,
            increment: i++
          }
        });

        """)        
        
        self.assertIsInstance(data.members, dict)
        self.assertEqual(data.members["bitwise"]["type"], "Number")
        self.assertEqual(data.members["shif"]["type"], "Number")
        self.assertEqual(data.members["mod"]["type"], "Number")
        self.assertEqual(data.members["unary"]["type"], "Number")
        self.assertEqual(data.members["increment"]["type"], "Number")
        
        
    def test_boolean(self):

        data = self.process("""

        core.Class("foo.Bar", 
        {
          members: {
            trueish: 2 == 2,
            falsy: 4 != 4,
            and: window.location && window.document,
            or: document.createElement || document.createDocumentFragment,
            not: !!document.createElement,
            bigger: 3 > 5,
            is: foo instanceof bar
          }
        });

        """)        
        
        self.assertIsInstance(data.members, dict)
        self.assertEqual(data.members["trueish"]["type"], "Boolean")
        self.assertEqual(data.members["falsy"]["type"], "Boolean")
        self.assertEqual(data.members["and"]["type"], "Boolean")
        self.assertEqual(data.members["or"]["type"], "Boolean")
        self.assertEqual(data.members["not"]["type"], "Boolean")
        self.assertEqual(data.members["bigger"]["type"], "Boolean")
        self.assertEqual(data.members["is"]["type"], "Boolean")
        
        
        
    def test_specials(self):

        data = self.process("""

        core.Class("foo.Bar", 
        {
          members: {
            plus: 3 + 4,
            plusstr: 3 + "world",
            plusstr2: 3 + "world" + 4,
            now: +new Date,
            custom: new Global,
            formatter: new foo.DateFormatter,
            date: new Date,
            number: new Number(3),
            voi: void 3,
            nul: null,
            type: typeof 3,
            del: delete obj.x
          }
        });

        """)        

        self.assertIsInstance(data.members, dict)
        self.assertEqual(data.members["plus"]["type"], "Number")
        self.assertEqual(data.members["plusstr"]["type"], "String")
        self.assertEqual(data.members["plusstr2"]["type"], "String")
        self.assertEqual(data.members["now"]["type"], "Number")
        self.assertEqual(data.members["custom"]["type"], "Object")
        self.assertEqual(data.members["formatter"]["type"], "foo.DateFormatter"),
        self.assertEqual(data.members["date"]["type"], "Date"),
        self.assertEqual(data.members["number"]["type"], "Number")
        self.assertEqual(data.members["voi"]["type"], "undefined")
        self.assertEqual(data.members["nul"]["type"], "null")
        self.assertEqual(data.members["type"]["type"], "String")
        self.assertEqual(data.members["del"]["type"], "Boolean")
        
        
    def test_dynamic(self):
        
        data = self.process("""

        core.Class("foo.Bar", 
        {
          members: {

            func: (function() {
     
              /**
               * Returns the sum of @a {Integer} and @b {Integer}
               */
              return function(a, b) {
                return a+b;
              };
    
            })(),
            
            string: (function() {

              /** {=String} Private data */
              return "private";

            })(),
        
            map: (function() {
            
              /** {=Map} A map with `x` and `y`. */
              return {
                foo: 1, 
                bar: 2
              };
            
            })(),

            hook: isSomething() ? 
              /** A function for doing things with @a {voodoo.Hoo} */
              function(a) {} : 
              function(a) {}
        
          }
          
        });

        """)
        
        self.assertIsInstance(data.members, dict)
        
        self.assertEqual(data.members["func"]["type"], "Function")
        self.assertIsInstance(data.members["func"]["params"], dict)
        self.assertEqual(data.members["func"]["params"]["a"]["type"], ["Integer"])
        self.assertEqual(data.members["func"]["params"]["b"]["type"], ["Integer"])
        
        self.assertEqual(data.members["string"]["type"], "String")
        self.assertEqual(data.members["map"]["type"], "Map")
        
        self.assertEqual(data.members["hook"]["type"], "Function")
        self.assertIsInstance(data.members["hook"]["params"], dict)
        self.assertEqual(data.members["hook"]["params"]["a"]["type"], ["voodoo.Hoo"])
        
        
    def test_dynamic_cascaded(self):
        
        data = self.process("""

        core.Class("foo.Bar", {
        
          members: {

            func: (function() {

              var ret = function(c) {
              
                /**
                 * Returns the sum of @a {Integer} and @b {Integer}
                 */
                return function(a, b) {
                  return a+b+c;
                };
              
              }
              
              return ret(3);
    
            })()

          }
          
        });

        """)
        
        self.assertIsInstance(data.members, dict)
        
        self.assertEqual(data.members["func"]["type"], "Function")
        self.assertIsInstance(data.members["func"]["params"], dict)
        self.assertEqual(data.members["func"]["params"]["a"]["type"], ["Integer"])
        self.assertEqual(data.members["func"]["params"]["b"]["type"], ["Integer"])
        
        
        
    def test_dynamic_auto(self):

        data = self.process("""

        core.Class("foo.Bar", 
        {
          members: {

            func: (function() {

              return function(a, b) {
                return a+b;
              };

            })(),

            string: (function() {

              return "private";

            })(),

            map: (function() {

              return {
                foo: 1, 
                bar: 2
              };

            })(),

            hook: isSomething() ? function(a) {} : function(a) {},
            
            hookNull: isEmpty() ? null : function(a) {},
            
            hookMissingType: doTest() ? /** Width to apply */ 14 : 16,
            
            hookCascade: first ? second ? 1 : 2 : 3,

            hookCascadeDeep: first ? second ? 1 : 2 : third ? 3 : 4

          }

        });

        """)

        self.assertIsInstance(data.members, dict)

        self.assertEqual(data.members["func"]["type"], "Function")
        self.assertIsInstance(data.members["func"]["params"], dict)
        self.assertIsInstance(data.members["func"]["params"]["a"], dict)
        self.assertIsInstance(data.members["func"]["params"]["b"], dict)

        self.assertEqual(data.members["string"]["type"], "String")
        self.assertEqual(data.members["map"]["type"], "Map")

        self.assertEqual(data.members["hook"]["type"], "Function")
        self.assertIsInstance(data.members["hook"]["params"], dict)
        self.assertIsInstance(data.members["hook"]["params"]["a"], dict)        

        self.assertEqual(data.members["hookNull"]["type"], "Function")
        self.assertIsInstance(data.members["hookNull"]["params"], dict)
        self.assertIsInstance(data.members["hookNull"]["params"]["a"], dict)        

        self.assertEqual(data.members["hookMissingType"]["type"], "Number")
        self.assertEqual(data.members["hookMissingType"]["doc"], "<p>Width to apply</p>\n")

        self.assertEqual(data.members["hookCascade"]["type"], "Number")
        self.assertEqual(data.members["hookCascadeDeep"]["type"], "Number")
        
        
        
    def test_closure(self):

        data = self.process("""

        /** Returns the sum of @a {Integer} and @b {Integer} */
        var method = function(a, b) {
          return a+b;
        };

        core.Class("foo.Bar", {

          members: {

            func: method

          }

        });

        """)

        self.assertIsInstance(data.members, dict)

        self.assertEqual(data.members["func"]["type"], "Function")
        self.assertIsInstance(data.members["func"]["params"], dict)
        self.assertEqual(data.members["func"]["params"]["a"]["type"], ["Integer"])
        self.assertEqual(data.members["func"]["params"]["b"]["type"], ["Integer"])
        

    def test_closure_namedfunc(self):

        data = self.process("""

        /** Returns the sum of @a {Integer} and @b {Integer} */
        function method(a, b) {
          return a+b;
        };

        core.Class("foo.Bar", {

          members: {

            func: method

          }

        });

        """)

        self.assertIsInstance(data.members, dict)

        self.assertEqual(data.members["func"]["type"], "Function")
        self.assertIsInstance(data.members["func"]["params"], dict)
        self.assertEqual(data.members["func"]["params"]["a"]["type"], ["Integer"])
        self.assertEqual(data.members["func"]["params"]["b"]["type"], ["Integer"])        
        
        
    def test_closure_static(self):

        data = self.process("""

        var pi = 3.14;

        core.Class("foo.Bar", {

          members: {

            stat: pi

          }

        });

        """)

        self.assertIsInstance(data.members, dict)

        self.assertEqual(data.members["stat"]["type"], "Number")
        
        
    def test_closure_static_sum(self):

        data = self.process("""

        var sum = "hello" + 1.23;

        core.Class("foo.Bar", {

          members: {

            stat: sum

          }

        });

        """)

        self.assertIsInstance(data.members, dict)

        self.assertEqual(data.members["stat"]["type"], "String")            
        
        
    def test_closure_static_later(self):

        data = self.process("""

        var pi;
        
        pi = 3.14;

        core.Class("foo.Bar", {

          members: {

            stat: pi

          }

        });

        """)

        self.assertIsInstance(data.members, dict)

        self.assertEqual(data.members["stat"]["type"], "Number")
        
        
    def test_closure_static_hoisting(self):

        data = self.process("""

        pi = 3.14;

        core.Class("foo.Bar", {

          members: {

            stat: pi

          }

        });

        var pi;


        """)

        self.assertIsInstance(data.members, dict)

        self.assertEqual(data.members["stat"]["type"], "Number")                
        
        
    def test_closure_static_doc(self):

        data = self.process("""

        /** {=Color} Bright */
        var white = "#fff";

        core.Class("foo.Bar", {

          members: {

            stat: white

          }

        });

        """)

        self.assertIsInstance(data.members, dict)

        self.assertEqual(data.members["stat"]["type"], "Color")            
        
        
    def test_closure_if_else(self):

        data = self.process("""

        if (browser.isCool()) {
          /** Returns the sum of @a {Integer} and @b {Integer} */
          var method = function(a, b) {
            return Math.sum(a, b);
          };
        } else {
          var method = function(a, b) {
            return a+b;
          };
        }

        core.Class("foo.Bar", {

          members: {

            func: method

          }

        });

        """)

        self.assertIsInstance(data.members, dict)

        self.assertEqual(data.members["func"]["type"], "Function")
        self.assertIsInstance(data.members["func"]["params"], dict)
        self.assertEqual(data.members["func"]["params"]["a"]["type"], ["Integer"])
        self.assertEqual(data.members["func"]["params"]["b"]["type"], ["Integer"])
        
        
        
    def test_closure_hook(self):

        data = self.process("""
        
        /**
         * Requests the given @url {String} from the server
         */
        var corsRequest = function(url) {
          
        };
        
        var xhrRequest = function(url) {
        
        };

        var hook = browser.isCool() ? corsRequest : xhrRequest;

        core.Class("foo.Bar", {

          members: {

            func: hook

          }

        });

        """)

        self.assertIsInstance(data.members, dict)

        self.assertEqual(data.members["func"]["type"], "Function")
        self.assertIsInstance(data.members["func"]["params"], dict)
        self.assertEqual(data.members["func"]["params"]["url"]["type"], ["String"])
        
        
    def test_closure_call(self):

        data = self.process("""

        var variant = function() {
        
          /**
           * Requests the given @url {String} from the server
           */
          var corsRequest = function(url) {
          };

          var xhrRequest = function(url) {
          };            
            
          return browser.isCool() ? corsRequest : xhrRequest;
        
        };

        core.Class("foo.Bar", {

          members: {

            func: variant()

          }

        });

        """)

        self.assertIsInstance(data.members, dict)

        self.assertEqual(data.members["func"]["type"], "Function")
        self.assertIsInstance(data.members["func"]["params"], dict)
        self.assertEqual(data.members["func"]["params"]["url"]["type"], ["String"])
        
        
    
    def test_closure_call_alter(self):

        data = self.process("""

        var variant = (function() {

          /**
           * Requests the given @url {String} from the server
           */
          var corsRequest = function(url) {
          };

          var xhrRequest = function(url) {
          };            

          return browser.isCool() ? corsRequest : xhrRequest;

        })();

        core.Class("foo.Bar", {

          members: {

            func: variant

          }

        });

        """)

        self.assertIsInstance(data.members, dict)

        self.assertEqual(data.members["func"]["type"], "Function")
        self.assertIsInstance(data.members["func"]["params"], dict)
        self.assertEqual(data.members["func"]["params"]["url"]["type"], ["String"])        



    def test_closure_reference(self):

        data = self.process("""

        core.Class("foo.Bar", {

          members: {

            func: foo.bar.baz.boo

          }

        });

        """)

        self.assertIsInstance(data.members, dict)

        self.assertEqual(data.members["func"]["type"], "foo.bar.baz.boo")


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)        

    