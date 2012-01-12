import sys, os, unittest

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, "lib"))
sys.path.insert(0, jasyroot)

import jasy.js.parse.Parser as Parser
import jasy.js.api.Data as Data

        
class TestApi(unittest.TestCase):

    def process(self, code):
        node = Parser.parse(code)
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
            bool: true,
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
            now: +new Date,
            formatter: new foo.DateFormatter,
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
        self.assertEqual(data.members["now"]["type"], "Number")
        self.assertEqual(data.members["formatter"]["type"], "Object"),
        self.assertEqual(data.members["voi"]["type"], "undefined"),
        self.assertEqual(data.members["nul"]["type"], "null"),
        self.assertEqual(data.members["type"]["type"], "String"),
        self.assertEqual(data.members["del"]["type"], "Boolean"),
        
        

if __name__ == '__main__':
    tests = unittest.TestLoader().loadTestsFromTestCase(TestApi)
    unittest.TextTestRunner(verbosity=1).run(tests)        

    