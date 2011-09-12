#!/usr/bin/env python3

import sys, os, unittest

# Extend PYTHONPATH with 'lib'
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir))
sys.path.insert(0, jasyroot)

import jasy.parser.Parser as Parser
import jasy.process.Compressor as Compressor

import jasy.process.Variables as Variables
import jasy.optimizer.LocalVariables as LocalVariables


def parse(code):
    return Parser.parse(code).toXml(False)
    
def compress(code):
    return Compressor.compress(Parser.parse(code))

def variableoptimize(code):
    node = Parser.parse(code)
    Variables.scan(node)
    LocalVariables.optimize(node, node.stats)
    return Compressor.compress(node)




class TestCompressor(unittest.TestCase):

    def setUp(self):
        pass
        
    def test_and(self):
        self.assertEqual(compress('x && y'), 'x&&y;')

    def test_arithm(self):
        self.assertEqual(compress('i++; j-- + 3;'), 'i++;j--+3;')

    def test_array_number(self):
        self.assertEqual(compress('var data1 = [ 1, 2, 3 ];'), 'var data1=[1,2,3];')

    def test_array_string(self):
        self.assertEqual(compress('var data2 = [ "hello" ];'), 'var data2=["hello"];')

    def test_array_sparse(self):
        self.assertEqual(compress('var data3 = [ 1, , , 4, , 6 ];'), 'var data3=[1,,,4,,6];')
        
    def test_array_comprehension(self):
        self.assertEqual(compress('exec([i for (i in obj) if (i > 3)]);'), 'exec([i for(i in obj)if(i>3)]);')

    def test_bitwise_and(self):
        self.assertEqual(compress('z = x & y;'), 'z=x&y;')

    def test_block_separate(self):
        self.assertEqual(compress('{ x = 1; y = 2; }'), '{x=1;y=2}')

    def test_block_empty(self):
        self.assertEqual(compress('if (true) {}'), 'if(true){}')

    def test_call_singlearg(self):
        self.assertEqual(compress('hello("hello world");'), 'hello("hello world");')

    def test_call_multiargs(self):
        self.assertEqual(compress('multi(1, 2, 3);'), 'multi(1,2,3);')

    def test_call_destruct(self):
        self.assertEqual(compress('[a, b] = f();'), '[a,b]=f();')

    def test_const(self):
        self.assertEqual(compress('const foo = 3;'), 'const foo=3;')

    def test_const_multi(self):
        self.assertEqual(compress('const foo = 3, bar = 4;'), 'const foo=3,bar=4;')

    def test_continue(self):
        self.assertEqual(compress('while(x) { continue; }'), 'while(x){continue}')

    def test_continue_label(self):
        self.assertEqual(compress('dist: while(y) { continue dist; }'), 'dist:while(y){continue dist};')

    def test_declaration(self):
        self.assertEqual(compress('var a, b=5, c;'), 'var a,b=5,c;')

    def test_declaration_destruct(self):
        self.assertEqual(compress('var [d, e] = destruct(), x;'), 'var [d,e]=destruct(),x;')

    def test_delete(self):
        self.assertEqual(compress('delete obj.key;'), 'delete obj.key;')

    def test_destruct_assign(self):
        self.assertEqual(compress('[first, second] = [second, first];'), '[first,second]=[second,first];')

    def test_destruct_for(self):
        self.assertEqual(compress('for (var [name, value] in Iterator(obj)) {}'), 'for(var [name,value] in Iterator(obj)){}')

    def test_destruct_for_let(self):
        self.assertEqual(compress('for (let [name, value] in Iterator(obj)) {}'), 'for(let [name,value] in Iterator(obj)){}')

    def test_do_while(self):
        self.assertEqual(compress('do{ something; } while(true);'), 'do{something}while(true);')

    def test_dot(self):
        self.assertEqual(compress('parent.child.weight;'), 'parent.child.weight;')

    def test_expression_closure(self):
        self.assertEqual(compress('node.onclick = function(x) x * x'), 'node.onclick=function(x)x*x;')

    def test_for_multiinit(self):
        self.assertEqual(compress('for(x = 0, l = foo.length; x < l; x++) {}'), 'for(x=0,l=foo.length;x<l;x++){}')

    def test_for_simple(self):
        self.assertEqual(compress('for (var i=0; i<100; i++) {}'), 'for(var i=0;i<100;i++){}')

    def test_for_each(self):
        self.assertEqual(compress('for each (var item in obj) { sum += item; }'), 'for each(var item in obj){sum+=item}')

    def test_for_in(self):
        self.assertEqual(compress('for (var key in map) { }'), 'for(var key in map){}')

    def test_function_expressed(self):
        self.assertEqual(compress('x = function() { i++ };'), 'x=function(){i++};')

    def test_function_declared(self):
        self.assertEqual(compress('function y() { i++ }'), 'function y(){i++}')

    def test_generator_expression(self):
        self.assertEqual(compress('handleResults(i for (i in obj));'), 'handleResults(i for(i in obj));')
        
    def test_generator_expression_guard(self):
        self.assertEqual(compress('handleResults(i for (i in obj) if (i > 3));'), 'handleResults(i for(i in obj)if(i>3));')

    def test_getter(self):
        self.assertEqual(compress('var obj={get name() { return myName; }};'), 'var obj={get name(){return myName}};')

    def test_setter(self):
        self.assertEqual(compress('var obj={set name(value) { myName = value; }};'), 'var obj={set name(value){myName=value}};')

    def test_hook_assign(self):
        self.assertEqual(compress('x = test1 ? case1 = 1 : case2 = 2;'), 'x=test1?case1=1:case2=2;')

    def test_hook_left_child(self):
        self.assertEqual(compress('test1 ? test2 ? res1 : res2 : res3;'), 'test1?test2?res1:res2:res3;')

    def test_hook_right_child(self):
        self.assertEqual(compress('test1 ? res1 : test2 ? res2 : res3;'), 'test1?res1:test2?res2:res3;')

    def test_hook_simple(self):
        self.assertEqual(compress('test1 ? res1 : res2;'), 'test1?res1:res2;')

    def test_hook_two_children(self):
        self.assertEqual(compress('test1 ? test2 ? res1 : res2 : test3 ? res3 : res4;'), 'test1?test2?res1:res2:test3?res3:res4;')

    def test_if_else_noblocks(self):
        self.assertEqual(compress('if (foo) hello(); else quit();'), 'if(foo)hello();else quit();')
        
    def test_if_else(self):
        self.assertEqual(compress('if (bar) { hello(); } else { quit(); }'), 'if(bar){hello()}else{quit()}')

    def test_if_else_if_noblocks(self):
        self.assertEqual(compress('if (foo) hello(); else if (x) quit();'), 'if(foo)hello();else if(x)quit();')

    def test_if_else_if(self):
        self.assertEqual(compress('if (bar) { hello(); } else if (x) { quit(); }'), 'if(bar){hello()}else if(x){quit()}')

    def test_if_empty(self):
        self.assertEqual(compress('if(foo && bar) {}'), 'if(foo&&bar){}')

    def test_if_not_else(self):
        self.assertEqual(compress('if (!bar) { first; } else { second; }'), 'if(!bar){first}else{second}')

    def test_if_not(self):
        self.assertEqual(compress('if (!bar) { first; }'), 'if(!bar){first}')

    def test_if_noblock(self):
        self.assertEqual(compress('if (foo) hello();'), 'if(foo)hello();')

    def test_if(self):
        self.assertEqual(compress('if (bar) { hello(); }'), 'if(bar){hello()}')

    def test_in(self):
        self.assertEqual(compress('"foo" in obj;'), '"foo"in obj;')

    def test_increment_prefix(self):
        self.assertEqual(compress('++i;'), '++i;')

    def test_increment_postfix(self):
        self.assertEqual(compress('i++;'), 'i++;')

    def test_index(self):
        self.assertEqual(compress('list[12];'), 'list[12];')

    def test_let_definition(self):
        self.assertEqual(compress('if (x > y) { let gamma = 12.7 + y; }'), 'if(x>y){let gamma=12.7+y}')
        
    def test_let_expression(self):
        self.assertEqual(compress('write(let(x = x + 10, y = 12) x + y + "<br>");'), 'write(let(x=x+10,y=12)x+y+"<br>");')

    def test_let_statement(self):
        self.assertEqual(compress('let (x = x+10, y = 12) { print(x+y); }'), 'let(x=x+10,y=12){print(x+y)}')

    def test_new(self):
        self.assertEqual(compress('var obj = new Object;'), 'var obj=new Object;')

    def test_new_args(self):
        self.assertEqual(compress('var arr = new Array(1,2,3);'), 'var arr=new Array(1,2,3);')

    def test_new_args_empty(self):
        self.assertEqual(compress('var obj = new Object();'), 'var obj=new Object;')

    def test_number_float(self):
        self.assertEqual(compress('4.3;'), '4.3;')

    def test_number_float_short(self):
        self.assertEqual(compress('.3;'), '.3;')

    def test_number_float_zero_prefix(self):
        self.assertEqual(compress('0.5;'), '.5;')

    def test_number_hex(self):
        self.assertEqual(compress('0xF0;'), '0xF0;')

    def test_number_int(self):
        self.assertEqual(compress('3 + 6.0;'), '3+6;')
            
    def test_number_max(self):
        self.assertEqual(compress('1.7976931348623157e+308;'), '1.7976931348623157e+308;')

    def test_number_min(self):
        self.assertEqual(compress('5e-324;'), '5e-324;')            

    def test_tofixed(self):
        self.assertEqual(compress('0..toFixed();'), '0..toFixed();')

    def test_object_init(self):
        self.assertEqual(compress('var x = { vanilla : "vanilla", "default" : "enclosed" };'), 'var x={vanilla:"vanilla","default":"enclosed"};')

    def test_object_init_trail(self):
        self.assertEqual(compress('var x = { vanilla : "vanilla", };'), 'var x={vanilla:"vanilla"};')

    def test_or(self):
        self.assertEqual(compress('x || y'), 'x||y;')

    def test_regexp(self):
        self.assertEqual(compress('var x = /[a-z]/g.exec(foo);'), 'var x=/[a-z]/g.exec(foo);')

    def test_return(self):
        self.assertEqual(compress('function y() { return 1; }'), 'function y(){return 1}')

    def test_return_empty(self):
        self.assertEqual(compress('function x() { return; }'), 'function x(){return}')

    def test_return_array(self):
        self.assertEqual(compress('function z() { return [ 1, 2, 3 ]; }'), 'function z(){return[1,2,3]}')

    def test_strict(self):
        self.assertEqual(compress('function imStrict() { "use strict"; var x = 4+5; }'), 'function imStrict(){"use strict";var x=4+5}')

    def test_string_escape(self):
        self.assertEqual(compress(r'var x="abc\ndef";'), r'var x="abc\ndef";')

    def test_string(self):
        self.assertEqual(compress(r'var x = "hello" + "world";'), r'var x="hello"+"world";')

    def test_string_quotes(self):
        self.assertEqual(compress(r'var x = "hello" + " \"world\"";'), r'var x="hello"+" \"world\"";')

    def test_switch(self):
        self.assertEqual(compress('switch(x) { case 1: case 2: r = 2; case 3: r = 3; break; default: r = null; }'), 'switch(x){case 1:case 2:r=2;case 3:r=3;break;default:r=null}')

    def test_throw(self):
        self.assertEqual(compress('throw new Error("Ooops");'), 'throw new Error("Ooops");')            

    def test_trycatch_guard(self):
        self.assertEqual(compress('try{ x=1; } catch (ex1 if ex1 instanceof MyError) { alert(ex1); } catch (ex2) { alert(ex2); }'), 'try{x=1}catch(ex1 if ex1 instanceof MyError){alert(ex1)}catch(ex2){alert(ex2)}')

    def test_trycatch(self):
        self.assertEqual(compress('try{ x=1; } catch (ex) { alert(ex); }'), 'try{x=1}catch(ex){alert(ex)}')

    def test_unary(self):
        self.assertEqual(compress('var x = -1 * +3;'), 'var x=-1*+3;')

    def test_unicode(self):
        # Should be allowed in UTF-8 documents
        self.assertEqual(compress(r'var x = "\u00A9 Netscape Communications";'), r'var x="© Netscape Communications";')

    def test_while_comma_condition(self):
        self.assertEqual(compress('while (x=1, x<3){ x++; }'), 'while(x=1,x<3){x++}')            

    def test_while(self):
        self.assertEqual(compress('while (true) { x++; }'), 'while(true){x++}')





class TestLocalVariables(unittest.TestCase):

    def setUp(self):
        pass

    def test_basic(self):
        self.assertEqual(variableoptimize(
            'function test(para1, para2) { var result = para1 + para2; return result; }'), 
            'function test(b,c){var a=b+c;return a}'
        )

    def test_args(self):
        self.assertEqual(variableoptimize(
            '''
            function wrapper(obj, foo, hello) { 
              obj[foo]().hello; 
            }
            '''), 
            'function wrapper(a,b,c){a[b]().hello}'
        )

    def test_accessor_names(self):
        self.assertEqual(variableoptimize(
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
        self.assertEqual(variableoptimize(
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
        self.assertEqual(variableoptimize(
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
        self.assertEqual(variableoptimize(
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
        self.assertEqual(variableoptimize(
            '''
            function x(config){
              var config = 3;
            }
            '''),
            'function x(a){var a=3}'
        )

    def test_conflict_same_name(self):
        self.assertEqual(variableoptimize(
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
        self.assertEqual(variableoptimize(
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
        self.assertEqual(variableoptimize(
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
        self.assertEqual(variableoptimize(
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
        self.assertEqual(variableoptimize(
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
        self.assertEqual(variableoptimize(
            '''
            function wrapper()
            {
              var d, a=d;
            }
            '''),
            'function wrapper(){var a,b=a}'
        )

    def test_let_definition(self):
        self.assertEqual(variableoptimize(
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
        self.assertEqual(variableoptimize(
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
        self.assertEqual(variableoptimize(
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
        self.assertEqual(variableoptimize(
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
        self.assertEqual(variableoptimize(
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

    def test_(self):
        self.assertEqual(variableoptimize(
            ''),
            ''
        )

    def test_(self):
        self.assertEqual(variableoptimize(
            ''),
            ''
        )

    def test_(self):
        self.assertEqual(variableoptimize(
            ''),
            ''
        )        






if __name__ == '__main__':
    verbosity = 1
    
    print()
    print("======================================================================")
    print("  COMPRESSOR")
    print("======================================================================")
    compressorTests = unittest.TestLoader().loadTestsFromTestCase(TestCompressor)
    unittest.TextTestRunner(verbosity=verbosity).run(compressorTests)

    print()
    print("======================================================================")
    print("  LOCAL VARIABLES")
    print("======================================================================")
    localVariablesTests = unittest.TestLoader().loadTestsFromTestCase(TestLocalVariables)
    unittest.TextTestRunner(verbosity=verbosity).run(localVariablesTests)


    
        
    