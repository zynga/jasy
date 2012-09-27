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
import jasy.js.optimize.LocalVariables as LocalVariables



class Tests(unittest.TestCase):

    def process(self, code):
        node = Parser.parse(code)
        ScopeScanner.scan(node)
        LocalVariables.optimize(node)
        return Compressor.Compressor().compress(node)

    def test_basic(self):
        self.assertEqual(self.process(
            'function test(para1, para2) { var result = para1 + para2; return result; }'), 
            'function test(b,c){var a=b+c;return a}'
        )

    def test_args(self):
        self.assertEqual(self.process(
            '''
            function wrapper(obj, foo, hello) { 
              obj[foo]().hello; 
            }
            '''), 
            'function wrapper(a,b,c){a[b]().hello}'
        )

    def test_accessor_names(self):
        self.assertEqual(self.process(
          '''
          function outer(alpha, beta, gamma) 
          { 
            function inner() {} 
            var result = alpha * beta + gamma; 
            var doNot = result.alpha.beta.gamma; 
            return result * outer(alpha, beta, gamma); 
          }
          '''), 
          'function outer(b,c,a){function f(){}var d=b*c+a;var e=d.alpha.beta.gamma;return d*outer(b,c,a)}'
        )
        
    def test_bind(self):
        self.assertEqual(self.process(
            '''
            function bind(func, self, varargs) 
            { 
              return this.create(func, { 
                self : self, 
                args : null 
              }); 
            };
            '''),
            'function bind(a,b,c){return this.create(a,{self:b,args:null})};'
        )

    def test_closure(self):
        self.assertEqual(self.process(
            '''
            (function(global)
            {
              var foo;
              var bar = function()
              {
                var baz = foo;

              }
            })(this);
            '''),
            '(function(c){var a;var b=function(){var b=a}})(this);'
        )

    def test_conflict_generatedname(self):
        self.assertEqual(self.process(
            '''
            function wrapper()
            {
              var first=4;
              var a=5;
            }
            '''),
            'function wrapper(){var a=4;var b=5}'
        )

    def test_conflict_param_var(self):
        self.assertEqual(self.process(
            '''
            function x(config){
              var config = 3;
            }
            '''),
            'function x(a){var a=3}'
        )

    def test_conflict_same_name(self):
        self.assertEqual(self.process(
            '''
            function wrapper()
            {
              var first=4;
              var first=5;
            }
            '''),
            'function wrapper(){var a=4;var a=5}'
        )

    def test_declaration(self):
        self.assertEqual(self.process(
            '''
            function wrapper()
            {
              var first, second=5, third;
              var [desFirst, desSecond]=destruct(), after;
            }
            '''),
            'function wrapper(){var c,f=5,e;var [a,b]=destruct(),d}'
        )

    def test_exception_catchvar(self):
        self.assertEqual(self.process(
            '''
            function wrapper()
            {
              var x = 1, y = x+2;
              try
              {
                something();
              }
              catch(ex)
              {
                var inCatch = 3;
                alert(ex);
              }
            }
            '''),
            'function wrapper(){var b=1,d=b+2;try{something()}catch(a){var c=3;alert(a)}}'
        )

    def test_exception(self):
        self.assertEqual(self.process(
            '''
            function wrapper(param1)
            {
              var b = "hello";

              try{
                access.an.object[param1];

              } 
              catch(except)
              {
                alert(except + param1)
              }
            }            
            '''),
            'function wrapper(a){var c="hello";try{access.an.object[a]}catch(b){alert(b+a)}}'
        )

    def test_function(self):
        self.assertEqual(self.process(
            '''
            (function(global)
            {
              var x = doScrollCheck();
              function doScrollCheck() {
                doScrollCheck();
              }
            })(window);
            '''),
            '(function(b){var c=a();function a(){a()}})(window);'
        )

    def test_inline_access(self):
        self.assertEqual(self.process(
            '''
            function wrapper()
            {
              var d, a=d;
            }
            '''),
            'function wrapper(){var a,b=a}'
        )

    def test_let_definition(self):
        self.assertEqual(self.process(
            '''
            function wrapper()
            {
              if (x > y) {  
                let gamma = 12.7 + y;  
                i = gamma * x;  
              } 
            }
            '''),
            'function wrapper(){if(x>y){let a=12.7+y;i=a*x}}'
        )

    def test_let_expression(self):
        self.assertEqual(self.process(
            r'''
            function wrapper()
            {
              var x = 5;  
              var y = 0;  
              document.write(let(x = x + 10, y = 12) x + y + "<br>\n");  
              document.write(x+y + "<br>\n");  
            }            
            '''),
            r'function wrapper(){var a=5;var b=0;document.write(let(a=a+10,b=12)a+b+"<br>\n");document.write(a+b+"<br>\n")}'
        )

    def test_let_statement(self):
        self.assertEqual(self.process(
            r'''
            function wrapper()
            {
              var x = 5;
              var y = 0;

              let (x = x+10, y = 12, z=3) {
                print(x+y+z + "\n");
              }

              print((x + y) + "\n");
            }
            '''),
            r'function wrapper(){var a=5;var b=0;let(a=a+10,b=12,c=3){print(a+b+c+"\n")}print((a+b)+"\n")}'
        )
        
    def test_reuse_different(self):
        self.assertEqual(self.process(
            '''
            function run()
            {
              var first = function() {
                var inFirst = 1;
              };

              var second = function() {
                var inSecond = 2;
              };

            }
            '''),
            'function run(){var a=function(){var a=1};var b=function(){var a=2}}'
        )

    def test_reuse_names(self):
        self.assertEqual(self.process(
            '''
            function run()
            {
              var first = function() {
                var a = 1;
              };

              var second = function() {
                var a = 2;
              };

            }
            '''),
            'function run(){var a=function(){var a=1};var b=function(){var a=2}}'
        )



if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)
