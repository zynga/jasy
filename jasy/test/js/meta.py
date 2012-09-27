#!/usr/bin/env python3

import sys, os, unittest, logging

# Extend PYTHONPATH with local 'lib' folder
if __name__ == "__main__":
    jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir, os.pardir))
    sys.path.insert(0, jasyroot)
    print("Running from %s..." % jasyroot)

import jasy.js.parse.Parser as Parser
from jasy.js.MetaData import MetaData

        
class Tests(unittest.TestCase):

    def process(self, code):
        tree = Parser.parse(code)
        meta = MetaData(tree)
        return meta
        
        
    def test_other(self):
    
        meta = self.process('''
    
        /**
         * Hello World
         *
         * #deprecated #public #use(future) #use(current)
         */
    
        ''')
    
        self.assertIsInstance(meta, MetaData)
        self.assertEqual(meta.name, None)
        self.assertIsInstance(meta.requires, set)
        self.assertIsInstance(meta.optionals, set)
        self.assertIsInstance(meta.breaks, set)
        self.assertIsInstance(meta.assets, set)
        self.assertEqual(len(meta.requires), 0)
        self.assertEqual(len(meta.optionals), 0)
        self.assertEqual(len(meta.breaks), 0)
        self.assertEqual(len(meta.assets), 0)
        
        
    def test_name(self):

        meta = self.process('''

        /**
         * Hello World
         *
         * #name(my.main.Class)
         */

        ''')

        self.assertIsInstance(meta, MetaData)
        self.assertEqual(meta.name, "my.main.Class")
        self.assertIsInstance(meta.requires, set)
        self.assertIsInstance(meta.optionals, set)
        self.assertIsInstance(meta.breaks, set)
        self.assertIsInstance(meta.assets, set)
        self.assertEqual(len(meta.requires), 0)
        self.assertEqual(len(meta.optionals), 0)
        self.assertEqual(len(meta.breaks), 0)
        self.assertEqual(len(meta.assets), 0)
        
        
    def test_classes(self):

        meta = self.process('''

        /**
         * Hello World
         *
         * #require(my.other.Class)
         * #optional(no.dep.to.Class)
         * #break(depedency.to.Class)
         */

        ''')

        self.assertIsInstance(meta, MetaData)
        self.assertEqual(meta.name, None)
        self.assertIsInstance(meta.requires, set)
        self.assertIsInstance(meta.optionals, set)
        self.assertIsInstance(meta.breaks, set)
        self.assertIsInstance(meta.assets, set)
        self.assertEqual(len(meta.requires), 1)
        self.assertEqual(len(meta.optionals), 1)
        self.assertEqual(len(meta.breaks), 1)
        self.assertEqual(len(meta.assets), 0)
        self.assertEqual(meta.requires, set(["my.other.Class"]))
        self.assertEqual(meta.breaks, set(["depedency.to.Class"]))
        self.assertEqual(meta.optionals, set(["no.dep.to.Class"]))


    def test_assets(self):

        meta = self.process('''

        /**
         * Hello World
         *
         * #asset(projectx/*)
         * #asset(projectx/some/local/url.png)
         * #asset(icons/*post/home.png)
         */

        ''')

        self.assertIsInstance(meta, MetaData)
        self.assertEqual(meta.name, None)
        self.assertIsInstance(meta.requires, set)
        self.assertIsInstance(meta.optionals, set)
        self.assertIsInstance(meta.breaks, set)
        self.assertIsInstance(meta.assets, set)
        self.assertEqual(len(meta.requires), 0)
        self.assertEqual(len(meta.optionals), 0)
        self.assertEqual(len(meta.breaks), 0)
        self.assertEqual(len(meta.assets), 3)
        self.assertEqual(meta.assets, set(["projectx/*", "projectx/some/local/url.png", "icons/*post/home.png"]))
        
        
        
    def test_asset_escape(self):

        meta = self.process('''

        /**
         * Hello World
         *
         * #asset(icons/*\/home.png)
         */

        ''')

        self.assertIsInstance(meta, MetaData)
        
        # Test unescaping
        self.assertEqual(meta.assets, set(["icons/*/home.png"]))
        
        
    
    def test_structured(self):

        meta = self.process('''

        (function(global) {
        
          global.my.Class = function() {
          
            /**
             * #asset(projectx/some/local/url.png)
             */
            var uri = core.io.Asset.toUri("projectx/some/local/url.png");
            
          };
        
        })(this);

        ''')

        self.assertIsInstance(meta, MetaData)
        self.assertEqual(meta.assets, set(["projectx/some/local/url.png"]))        



if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)