#!/usr/bin/env python3

import sys, os, unittest, logging, pkg_resources

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir))
sys.path.insert(0, jasyroot)

import jasy.js.parse.Parser as Parser
import jasy.js.parse.ScopeScanner as ScopeScanner
import jasy.js.output.Compressor as Compressor
import jasy.js.clean.Unused as Unused
import jasy.js.clean.DeadCode as DeadCode


class Tests(unittest.TestCase):

    def process(self, code):
        node = Parser.parse(code)
        DeadCode.cleanup(node)
        return Compressor.Compressor().compress(node)

    def test_if_trueish(self):
        self.assertEqual(self.process('if (true) x++;'), 'x++;')
        
    def test_if_falsy(self):
        self.assertEqual(self.process('if (false) x++;'), '')
        
    def test_if_trueish_and_trueish(self):
        self.assertEqual(self.process('if (true && true) x++;'), 'x++;')

    def test_if_falsy_and_falsy(self):
        self.assertEqual(self.process('if (false && false) x++;'), '')
        
    def test_if_trueish_and_falsy(self):
        self.assertEqual(self.process('if (true && false) x++;'), '')

    def test_if_falsy_and_trueish(self):
        self.assertEqual(self.process('if (false && true) x++;'), '')
        
    def test_if_unknown_and_falsy(self):
        self.assertEqual(self.process('if (x && false) x++;'), '')

    def test_if_unknown_and_trueish(self):
        self.assertEqual(self.process('if (x && true) x++;'), 'if(x&&true)x++;')
        
    def test_if_falsy_and_unknown(self):
        self.assertEqual(self.process('if (false && x) x++;'), '')

    def test_if_trueish_and_unknown(self):
        self.assertEqual(self.process('if (true && x) x++;'), 'if(true&&x)x++;')



if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)    
