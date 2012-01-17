import sys, os, unittest, logging

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, "lib"))
sys.path.insert(0, jasyroot)

import jasy.js.parse.Parser as Parser
from jasy.js.MetaData import MetaData

        
class TestMeta(unittest.TestCase):

    def process(self, code):
        tree = Parser.parse(code)
        meta = MetaData(tree)
        return meta
        
        
    def test_doc_tags(self):
    
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
        

        

if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(TestMeta)
    unittest.TextTestRunner(verbosity=2).run(suite)