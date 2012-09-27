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
import jasy.js.optimize.CombineDeclarations as CombineDeclarations


class Tests(unittest.TestCase):

    def process(self, code):
        node = Parser.parse(code)
        ScopeScanner.scan(node)
        CombineDeclarations.optimize(node)
        return Compressor.Compressor().compress(node)


    def test_combine_basic(self):
        self.assertEqual(self.process(
            '''
            var foo=3;
            var bar=4;
            foo++;
            var baz=foo+bar;
            '''),
            'var foo=3,bar=4,baz;foo++;baz=foo+bar;'
        )        

    def test_combine_closure_innerfirst(self):
        self.assertEqual(self.process(
            '''
            function inner() 
            {
              var innerVarA = 5;
              var innerVarB = 10;
              doSomething();
              var innerVarC = 15;
            }
            var after;
            var afterInit = 6;
            '''),
            'function inner(){var innerVarA=5,innerVarB=10,innerVarC;doSomething();innerVarC=15}var after,afterInit=6;'
        )

    def test_combine_closure(self):
        self.assertEqual(self.process(
            '''
            var before = 4;
            function inner() 
            {
              var innerVarA = 5;
              var innerVarB = 10;
              doSomething();
              var innerVarC = 15;
            }
            var after;
            var afterInit = 6;
            '''),
            'var before=4,after,afterInit;function inner(){var innerVarA=5,innerVarB=10,innerVarC;doSomething();innerVarC=15}afterInit=6;'
        )

    def test_combine_complex(self):
        self.assertEqual(self.process(
            '''
            var foo=3;
            var bar=4;
            foo++;
            {
              var baz=foo+bar;
              var next;
            }
            '''),
            'var foo=3,bar=4,baz,next;foo++;{baz=foo+bar}'
        )        

    def test_combine_destruct_assign(self):
        self.assertEqual(self.process(
            '''
            function wrapper()
            {
              var desFirst=3;
              while(x);
              var [desFirst, desSecond] = destruct();
            }
            '''),
            'function wrapper(){var desFirst=3,desSecond;while(x);[desFirst,desSecond]=destruct()}'
        )

    def test_combine_destruct(self):
        self.assertEqual(self.process(
            '''
            function wrapper()
            {
              var desFirst=3, desSecond;
              var [desFirst, desSecond] = destruct();
            }
            '''),
            'function wrapper(){var desFirst=3,[desFirst,desSecond]=destruct()}'
        )        

    def test_combine_doubles(self):
        self.assertEqual(self.process(
            '''
            var foo=3;
            var foo=4;
            '''),
            'var foo=3,foo=4;'
        )

    def test_combine_doubles_break(self):
        self.assertEqual(self.process(
            '''
            var foo = 3;
            var bar = 2;
            x();
            var foo = 4;
            '''),
            'var foo=3,bar=2;x();foo=4;'
        )        

    def test_combine_doubles_for(self):
        self.assertEqual(self.process(
            '''
            for(var key in obj) {}
            for(var key in obj2) {}
            for(var key2 in obj) {}
            '''),
            'var key,key2;for(key in obj){}for(key in obj2){}for(key2 in obj){}'
        )
        
    def test_combine_doubles_oneassign(self):
        self.assertEqual(self.process(
            '''
            var foo=3;
            var foo;
            '''),
            'var foo=3;'
        )
        

if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)

