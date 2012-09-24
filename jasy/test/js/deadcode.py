#!/usr/bin/env python3

import sys, os, unittest, logging

# Extend PYTHONPATH with local 'lib' folder
if __name__ == "__main__":
    jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir, os.pardir))
    sys.path.insert(0, jasyroot)
    print("Running from %s..." % jasyroot)

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

    def test_if_equal_true(self):
        self.assertEqual(self.process('if (2==2) x++;'), 'x++;')
        
    def test_if_equal_false(self):
        self.assertEqual(self.process('if (2==3) x++;'), '')

    def test_if_identical_true(self):
        self.assertEqual(self.process('if (2===2) x++;'), 'x++;')

    def test_if_identical_false(self):
        self.assertEqual(self.process('if (2===3) x++;'), '')
        
    def test_if_not_trueish(self):
        self.assertEqual(self.process('if (!true) x++;'), '')
        
    def test_if_not_falsy(self):
        self.assertEqual(self.process('if (!false) x++;'), 'x++;')
        
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

    def test_if_trueish_or_trueish(self):
        self.assertEqual(self.process('if (true || true) x++;'), 'x++;')

    def test_if_falsy_or_falsy(self):
        self.assertEqual(self.process('if (false || false) x++;'), '')

    def test_if_trueish_or_falsy(self):
        self.assertEqual(self.process('if (true || false) x++;'), 'x++;')

    def test_if_falsy_or_trueish(self):
        self.assertEqual(self.process('if (false || true) x++;'), 'x++;')

    def test_if_unknown_or_falsy(self):
        self.assertEqual(self.process('if (x || false) x++;'), 'if(x||false)x++;')

    def test_if_unknown_or_trueish(self):
        self.assertEqual(self.process('if (x || true) x++;'), 'if(x||true)x++;')

    def test_if_falsy_or_unknown(self):
        self.assertEqual(self.process('if (false || x) x++;'), 'if(false||x)x++;')

    def test_if_trueish_or_unknown(self):
        self.assertEqual(self.process('if (true || x) x++;'), 'if(true||x)x++;')


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)    
