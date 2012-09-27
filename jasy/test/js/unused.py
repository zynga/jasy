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


        
class Tests(unittest.TestCase):

    def process(self, code):
        node = Parser.parse(code)
        Unused.cleanup(node)
        return Compressor.Compressor().compress(node)

    def test_var_single(self):
        """ y is unused. Removed whole var block. """
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var x = 4;
              var y = 5;
              func(x);
            }
            '''),
            'function wrapper(){var x=4;func(x)}'
        )        

    def test_var_multi_last(self):
        """ y is unused. Removes list entry. """
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var x = 4, y = 5;
              func(x);
            }
            '''),
            'function wrapper(){var x=4;func(x)}'
        )        

    def test_var_multi_first(self):
        """ y is unused. Removes list entry."""
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var y = 5, x = 4;
              func(x);
            }
            '''),
            'function wrapper(){var x=4;func(x)}'
        )        

    def test_var_dep_closure(self):
        """ Removes y first and in a second run removes x as well. """
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var x = 4;
              var y = function() {
                return x;
              };
            }
            '''),
            'function wrapper(){}'
        )
        

    def test_var_ief(self):
        """  """
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var exec = (function() {
                return 4+5;
              })();
            }
            '''),
            'function wrapper(){(function(){return 4+5})()}'
        )        
        
    def test_var_ief_middle(self):
        """  """
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var a, exec = (function() {
                return 4+5;
              })(), b;
            }
            '''),
            'function wrapper(){(function(){return 4+5})()}'
        )
        
    def test_var_ief_end(self):
        """  """
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var a, exec = (function() {
                return 4+5;
              })();
            }
            '''),
            'function wrapper(){(function(){return 4+5})()}'
        )        
        
        

    def test_var_ief_noparens(self):
        """  """
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var exec = function() {
                return 4+5;
              }();
            }
            '''),
            'function wrapper(){(function(){return 4+5})()}'
        )        

    def test_var_ief_noparens_middle(self):
        """  """
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var a, exec = function() {
                return 4+5;
              }(), b;
            }
            '''),
            'function wrapper(){(function(){return 4+5})()}'
        )

    def test_var_ief_noparens_end(self):
        """  """
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var a, exec = function() {
                return 4+5;
              }();
            }
            '''),
            'function wrapper(){(function(){return 4+5})()}'
        )        
        
        
        
    def test_object(self):
        """ Non expressions must be protected with parens. """
        
        self.assertEqual(self.process(
        '''
        function abc() {
           var obj = {
               x:1
           };
        };
        '''
        ), 
        'function abc(){({x:1})};')
        
    def test_object_multi(self):
        """ Non expressions must be protected with parens. """

        self.assertEqual(self.process(
        '''
        function abc() {
           var obj1 = {
               x:1
           }, obj2 = {
               x:2
           };
        };
        '''
        ), 
        'function abc(){({x:1});({x:2})};')        

    def test_object_multi_others(self):
        """ Non expressions must be protected with parens. """

        self.assertEqual(self.process(
        '''
        function abc() {
           var obj1 = {
               x:1
           }, str = "hello", obj2 = {
               x:2
           }, nr = 3.14;
           return str;
        };
        '''
        ), 
        'function abc(){({x:1});var str="hello";({x:2});return str};')

    def test_var_dep_blocks(self):
        """ y contains operation so could not be removed and x is still in use. """
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var x = 4;
              var y = x + 5;
            }
            '''),
            'function wrapper(){var x=4;x+5}'
        )

    def test_params_first(self):
        """ x is unused but could not be removed. """
        self.assertEqual(self.process(
            '''
            function a(x, y) {
              return y + 1;
            }
            '''),
            'function a(x,y){return y+1}'
        )        

    def test_params_middle(self):
        """ y is unused but could not be removed. """
        self.assertEqual(self.process(
            '''
            function a(x, y, z) {
              return x + z;
            }
            '''),
            'function a(x,y,z){return x+z}'
        )
        
    def test_params_last(self):
        """ y is unused and can be removed """
        self.assertEqual(self.process(
            '''
            function a(x, y) {
              return x + 1;
            }
            '''),
            'function a(x){return x+1}'
        )        

    def test_func_named_called(self):
        self.assertEqual(self.process(
            '''
            function wrapper() {
              function x() {}
              x();
            }
            '''),
            'function wrapper(){function x(){}x()}'
        )        

    def test_func_named_unused(self):
        self.assertEqual(self.process(
            '''
            function wrapper() {
              function x() {}
            }
            '''),
            'function wrapper(){}'
        )
        
    def test_func_called(self):
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var x = function() {}
              x();
            }
            '''),
            'function wrapper(){var x=function(){};x()}'
        )        

    def test_func_unused(self):
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var x = function() {}
            }
            '''),
            'function wrapper(){}'
        )

    def test_func_named_direct_called(self):
        self.assertEqual(self.process(
            '''
            function wrapper() {
              (function x() { 
                return 3; 
              })();
            }
            '''),
            'function wrapper(){(function(){return 3})()}'
        )        

    def test_var_vs_named(self):
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var x = function y() {};
              x();
            }            
            '''),
            'function wrapper(){var x=function(){};x()}'
        ) 
        
    def test_var_vs_named_inner(self):
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var x = function y() {
                setTimeout(y, 100);
              };
              x();
            }            
            '''),
            'function wrapper(){var x=function y(){setTimeout(y,100)};x()}'
        )        
        
    def test_named_vs_var(self):
        self.assertEqual(self.process(
            '''
            function wrapper() {
              var x = function y() {};

              // This might be an error: y is not defined in this context.
              // At least not here in this code.
              y();
            }
            '''),
            'function wrapper(){y()}'
        )               

    def test_var_same_inner_outer(self):
        self.assertEqual(self.process(
            '''
            var x = 1;
            function wrapper() {
              var x = 2;
            }
            '''),
            'var x=1;function wrapper(){}'
        )

    def test_named_func_same_inner_outer(self):
        self.assertEqual(self.process(
            '''
            function x() {};
            function wrapper() {
              function x() {};
            }            
            '''),
            'function x(){};function wrapper(){}'
        )        

    def test_global_var(self):
        self.assertEqual(self.process(
            '''
            var x = 4;
            '''),
            'var x=4;'
        )        
        
    def test_global_func(self):
        self.assertEqual(self.process(
            '''
            function x() {};
            '''),
            'function x(){};'
        )        
        
    def test_func_expressed_form_named_inner(self):
        self.assertEqual(self.process(
            '''
            function wrapper() {
              // y is only known inside the y-method
              var x = function y() {
                y();
              };
              x();
            }
            '''),
            'function wrapper(){var x=function y(){y()};x()}'
        )        

    def test_func_expressed_form_named(self):
        self.assertEqual(self.process(
            '''
            function wrapper() {
              // y is only known inside the y-method
              var x = function y() {
                // but not used
                z();
              };
              x();
            }
            '''),
            'function wrapper(){var x=function(){z()};x()}'
        )        
    
    def test_outdent_multi_var(self):
        self.assertEqual(self.process(
            '''
            var a = function d(b) {
              var c = d(), x = 3, y = x, z = y;
            };            
            '''),
            'var a=function d(){d()};'
        )        

    def test_outdent_multi_var(self):
        self.assertEqual(self.process(
            '''
            var a = function d(b) {
              var c = d(), g = 3, x = b(), y = x, z = y;
            };            
            '''),
            'var a=function d(b){d();b()};'
        )        

    def test_outdent(self):
        self.assertEqual(self.process(
            '''
            var a = function d(b) {
              var c = d();
            };
            '''),
            'var a=function d(){d()};'
        )
        
        



if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)

