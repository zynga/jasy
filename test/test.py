#!/usr/bin/env python3

import sys, os, unittest

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, "lib"))
sys.path.insert(0, jasyroot)

import jasy.js.parse.Parser as Parser
import jasy.js.parse.ScopeScanner as ScopeScanner

import jasy.js.Permutation as Permutation
import jasy.js.output.Compressor as Compressor

import jasy.js.clean.DeadCode as DeadCode
import jasy.js.clean.Unused as Unused

import jasy.js.optimize.LocalVariables as LocalVariables
import jasy.js.optimize.BlockReducer as BlockReducer
import jasy.js.optimize.CombineDeclarations as CombineDeclarations
import jasy.js.optimize.CryptPrivates as CryptPrivates



class TestParser(unittest.TestCase):
    
    def process(self, code):
        return Parser.parse(code).toXml(False)
    
    
    


class TestCompressor(unittest.TestCase):

    def process(self, code):
        return Compressor.compress(Parser.parse(code))
        
    def test_and(self):
        self.assertEqual(self.process('x && y'), 'x&&y;')

    def test_arithm(self):
        self.assertEqual(self.process('i++; j-- + 3;'), 'i++;j--+3;')

    def test_arithm_increment(self):
        self.assertEqual(self.process('x++ + y; x + ++y; x++ + ++y'), 'x++ +y;x+ ++y;x++ + ++y;')

    def test_arithm_decrement(self):
        self.assertEqual(self.process('x-- - y; x - --y; x-- - --y'), 'x-- -y;x- --y;x-- - --y;')

    def test_array_number(self):
        self.assertEqual(self.process('var data1 = [ 1, 2, 3 ];'), 'var data1=[1,2,3];')

    def test_array_string(self):
        self.assertEqual(self.process('var data2 = [ "hello" ];'), 'var data2=["hello"];')

    def test_array_sparse(self):
        self.assertEqual(self.process('var data3 = [ 1, , , 4, , 6 ];'), 'var data3=[1,,,4,,6];')
        
    def test_array_comprehension(self):
        self.assertEqual(self.process('exec([i for (i in obj) if (i > 3)]);'), 'exec([i for(i in obj)if(i>3)]);')

    def test_bitwise_and(self):
        self.assertEqual(self.process('z = x & y;'), 'z=x&y;')

    def test_block_separate(self):
        self.assertEqual(self.process('{ x = 1; y = 2; }'), '{x=1;y=2}')

    def test_block_empty(self):
        self.assertEqual(self.process('if (true) {}'), 'if(true){}')

    def test_call_singlearg(self):
        self.assertEqual(self.process('hello("hello world");'), 'hello("hello world");')

    def test_call_multiargs(self):
        self.assertEqual(self.process('multi(1, 2, 3);'), 'multi(1,2,3);')

    def test_call_destruct(self):
        self.assertEqual(self.process('[a, b] = f();'), '[a,b]=f();')

    def test_const(self):
        self.assertEqual(self.process('const foo = 3;'), 'const foo=3;')

    def test_const_multi(self):
        self.assertEqual(self.process('const foo = 3, bar = 4;'), 'const foo=3,bar=4;')

    def test_continue(self):
        self.assertEqual(self.process('while(x) { continue; }'), 'while(x){continue}')

    def test_continue_label(self):
        self.assertEqual(self.process('dist: while(y) { continue dist; }'), 'dist:while(y){continue dist};')

    def test_declaration(self):
        self.assertEqual(self.process('var a, b=5, c;'), 'var a,b=5,c;')

    def test_declaration_destruct(self):
        self.assertEqual(self.process('var [d, e] = destruct(), x;'), 'var [d,e]=destruct(),x;')

    def test_delete(self):
        self.assertEqual(self.process('delete obj.key;'), 'delete obj.key;')

    def test_destruct_assign(self):
        self.assertEqual(self.process('[first, second] = [second, first];'), '[first,second]=[second,first];')

    def test_destruct_for(self):
        self.assertEqual(self.process('for (var [name, value] in Iterator(obj)) {}'), 'for(var [name,value] in Iterator(obj)){}')

    def test_destruct_for_let(self):
        self.assertEqual(self.process('for (let [name, value] in Iterator(obj)) {}'), 'for(let [name,value] in Iterator(obj)){}')

    def test_do_while(self):
        self.assertEqual(self.process('do{ something; } while(true);'), 'do{something}while(true);')

    def test_dot(self):
        self.assertEqual(self.process('parent.child.weight;'), 'parent.child.weight;')

    def test_expression_closure(self):
        self.assertEqual(self.process('node.onclick = function(x) x * x'), 'node.onclick=function(x)x*x;')

    def test_for_multiinit(self):
        self.assertEqual(self.process('for(x = 0, l = foo.length; x < l; x++) {}'), 'for(x=0,l=foo.length;x<l;x++){}')

    def test_for_simple(self):
        self.assertEqual(self.process('for (var i=0; i<100; i++) {}'), 'for(var i=0;i<100;i++){}')

    def test_for_each(self):
        self.assertEqual(self.process('for each (var item in obj) { sum += item; }'), 'for each(var item in obj){sum+=item}')

    def test_for_in(self):
        self.assertEqual(self.process('for (var key in map) { }'), 'for(var key in map){}')

    def test_function_expressed(self):
        self.assertEqual(self.process('x = function() { i++ };'), 'x=function(){i++};')

    def test_function_declared(self):
        self.assertEqual(self.process('function y() { i++ }'), 'function y(){i++}')

    def test_generator_expression(self):
        self.assertEqual(self.process('handleResults(i for (i in obj));'), 'handleResults(i for(i in obj));')
        
    def test_generator_expression_guard(self):
        self.assertEqual(self.process('handleResults(i for (i in obj) if (i > 3));'), 'handleResults(i for(i in obj)if(i>3));')

    def test_getter(self):
        self.assertEqual(self.process('var obj={get name() { return myName; }};'), 'var obj={get name(){return myName}};')

    def test_setter(self):
        self.assertEqual(self.process('var obj={set name(value) { myName = value; }};'), 'var obj={set name(value){myName=value}};')

    def test_hook_assign(self):
        self.assertEqual(self.process('x = test1 ? case1 = 1 : case2 = 2;'), 'x=test1?case1=1:case2=2;')

    def test_hook_left_child(self):
        self.assertEqual(self.process('test1 ? test2 ? res1 : res2 : res3;'), 'test1?test2?res1:res2:res3;')

    def test_hook_right_child(self):
        self.assertEqual(self.process('test1 ? res1 : test2 ? res2 : res3;'), 'test1?res1:test2?res2:res3;')

    def test_hook_simple(self):
        self.assertEqual(self.process('test1 ? res1 : res2;'), 'test1?res1:res2;')

    def test_hook_two_children(self):
        self.assertEqual(self.process('test1 ? test2 ? res1 : res2 : test3 ? res3 : res4;'), 'test1?test2?res1:res2:test3?res3:res4;')

    def test_if_else_noblocks(self):
        self.assertEqual(self.process('if (foo) hello(); else quit();'), 'if(foo)hello();else quit();')
        
    def test_if_else(self):
        self.assertEqual(self.process('if (bar) { hello(); } else { quit(); }'), 'if(bar){hello()}else{quit()}')

    def test_if_else_if_noblocks(self):
        self.assertEqual(self.process('if (foo) hello(); else if (x) quit();'), 'if(foo)hello();else if(x)quit();')

    def test_if_else_if(self):
        self.assertEqual(self.process('if (bar) { hello(); } else if (x) { quit(); }'), 'if(bar){hello()}else if(x){quit()}')

    def test_if_empty(self):
        self.assertEqual(self.process('if(foo && bar) {}'), 'if(foo&&bar){}')

    def test_if_not_else(self):
        self.assertEqual(self.process('if (!bar) { first; } else { second; }'), 'if(!bar){first}else{second}')

    def test_if_not(self):
        self.assertEqual(self.process('if (!bar) { first; }'), 'if(!bar){first}')

    def test_if_noblock(self):
        self.assertEqual(self.process('if (foo) hello();'), 'if(foo)hello();')

    def test_if(self):
        self.assertEqual(self.process('if (bar) { hello(); }'), 'if(bar){hello()}')

    def test_in(self):
        self.assertEqual(self.process('"foo" in obj;'), '"foo"in obj;')

    def test_increment_prefix(self):
        self.assertEqual(self.process('++i;'), '++i;')

    def test_increment_postfix(self):
        self.assertEqual(self.process('i++;'), 'i++;')

    def test_index(self):
        self.assertEqual(self.process('list[12];'), 'list[12];')

    def test_let_definition(self):
        self.assertEqual(self.process('if (x > y) { let gamma = 12.7 + y; }'), 'if(x>y){let gamma=12.7+y}')
        
    def test_let_expression(self):
        self.assertEqual(self.process('write(let(x = x + 10, y = 12) x + y + "<br>");'), 'write(let(x=x+10,y=12)x+y+"<br>");')

    def test_let_statement(self):
        self.assertEqual(self.process('let (x = x+10, y = 12) { print(x+y); }'), 'let(x=x+10,y=12){print(x+y)}')

    def test_new(self):
        self.assertEqual(self.process('var obj = new Object;'), 'var obj=new Object;')

    def test_new_args(self):
        self.assertEqual(self.process('var arr = new Array(1,2,3);'), 'var arr=new Array(1,2,3);')

    def test_new_args_empty(self):
        self.assertEqual(self.process('var obj = new Object();'), 'var obj=new Object;')
        
    def test_new_args_empty_dot_call(self):
        self.assertEqual(self.process('var x = new Date().doSomething();'), 'var x=new Date().doSomething();')

    def test_new_args_empty_dot_call_paren(self):
        self.assertEqual(self.process('var x = (new Date).doSomething();'), 'var x=(new Date).doSomething();')

    def test_new_dot_call(self):
        self.assertEqual(self.process('var x = new Date(true).doSomething();'), 'var x=new Date(true).doSomething();')

    def test_number_float(self):
        self.assertEqual(self.process('4.3;'), '4.3;')

    def test_number_float_short(self):
        self.assertEqual(self.process('.3;'), '.3;')

    def test_number_float_zero_prefix(self):
        self.assertEqual(self.process('0.5;'), '.5;')

    def test_number_hex(self):
        self.assertEqual(self.process('0xF0;'), '0xF0;')

    def test_number_int(self):
        self.assertEqual(self.process('3 + 6.0;'), '3+6;')
            
    def test_number_max(self):
        self.assertEqual(self.process('1.7976931348623157e+308;'), '1.7976931348623157e+308;')

    def test_number_min(self):
        self.assertEqual(self.process('5e-324;'), '5e-324;')            

    def test_tofixed(self):
        self.assertEqual(self.process('0..toFixed();'), '0..toFixed();')

    def test_object_init(self):
        self.assertEqual(self.process('var x = { vanilla : "vanilla", "default" : "enclosed" };'), 'var x={vanilla:"vanilla","default":"enclosed"};')

    def test_object_init_trail(self):
        self.assertEqual(self.process('var x = { vanilla : "vanilla", };'), 'var x={vanilla:"vanilla"};')

    def test_or(self):
        self.assertEqual(self.process('x || y'), 'x||y;')

    def test_regexp(self):
        self.assertEqual(self.process('var x = /[a-z]/g.exec(foo);'), 'var x=/[a-z]/g.exec(foo);')

    def test_return(self):
        self.assertEqual(self.process('function y() { return 1; }'), 'function y(){return 1}')

    def test_return_empty(self):
        self.assertEqual(self.process('function x() { return; }'), 'function x(){return}')

    def test_return_array(self):
        self.assertEqual(self.process('function z() { return [ 1, 2, 3 ]; }'), 'function z(){return[1,2,3]}')

    def test_strict(self):
        self.assertEqual(self.process('function test() { "use strict"; var x = 4+5; }'), 'function test(){"use strict";var x=4+5}')

    def test_string_escape(self):
        self.assertEqual(self.process(r'var x="abc\ndef";'), r'var x="abc\ndef";')

    def test_string(self):
        self.assertEqual(self.process(r'var x = "hello" + "world";'), r'var x="hello"+"world";')

    def test_string_quotes(self):
        self.assertEqual(self.process(r'var x = "hello" + " \"world\"";'), r'var x="hello"+" \"world\"";')

    def test_switch(self):
        self.assertEqual(self.process('switch(x) { case 1: case 2: r = 2; case 3: r = 3; break; default: r = null; }'), 'switch(x){case 1:case 2:r=2;case 3:r=3;break;default:r=null}')

    def test_throw(self):
        self.assertEqual(self.process('throw new Error("Ooops");'), 'throw new Error("Ooops");')            

    def test_trycatch_guard(self):
        self.assertEqual(self.process('try{ x=1; } catch (ex1 if ex1 instanceof MyError) { alert(ex1); } catch (ex2) { alert(ex2); }'), 'try{x=1}catch(ex1 if ex1 instanceof MyError){alert(ex1)}catch(ex2){alert(ex2)}')

    def test_trycatch(self):
        self.assertEqual(self.process('try{ x=1; } catch (ex) { alert(ex); }'), 'try{x=1}catch(ex){alert(ex)}')

    def test_unary(self):
        self.assertEqual(self.process('var x = -1 * +3;'), 'var x=-1*+3;')

    def test_unicode(self):
        # Should be allowed in UTF-8 documents
        self.assertEqual(self.process(r'var x = "\u00A9 Netscape Communications";'), r'var x="© Netscape Communications";')

    def test_while_comma_condition(self):
        self.assertEqual(self.process('while (x=1, x<3){ x++; }'), 'while(x=1,x<3){x++}')            

    def test_while(self):
        self.assertEqual(self.process('while (true) { x++; }'), 'while(true){x++}')





class TestLocalVariables(unittest.TestCase):

    def process(self, code):
        node = Parser.parse(code)
        ScopeScanner.scan(node)
        LocalVariables.optimize(node)
        return Compressor.compress(node)

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




class TestBlockReducer(unittest.TestCase):

    def process(self, code):
        node = Parser.parse(code)
        BlockReducer.optimize(node)
        return Compressor.compress(node)

    def test_combine_mixed(self):
        self.assertEqual(self.process('var str = 4 + 3 + "x"'), 'var str="7x";')

    def test_combine_number(self):
        self.assertEqual(self.process('var adds = 4 * (5+6);'), 'var adds=44;')

    def test_combine_number_omit(self):
        self.assertEqual(self.process('var third = 1/3;'), 'var third=1/3;')

    def test_combine_string(self):
        self.assertEqual(self.process('var result = "first second third " + "fourth fivs sixs";'), 'var result="first second third fourth fivs sixs";')

    def test_combine_mixed_empty(self):
        self.assertEqual(self.process('4 + 3 + "x"'), '')

    def test_elseinline_return(self):
        self.assertEqual(self.process(
            '''
            function x()
            {
              if (something)
              {
                x++;
                while(warm) {}
                return x;
              }
              else
              {
                y++;
              }
            }
            '''),
            'function x(){if(something){x++;while(warm);return x}y++}'
        ) 
               

    def test_elseinline_throw(self):
        self.assertEqual(self.process(
            '''
            function x()
            {
              if (something)
              {
                x++;
                while(warm) {}
                throw new Error("Wrong data!");
              }
              else
              {
                y++;
              }
            }
            '''),
            'function x(){if(something){x++;while(warm);throw new Error("Wrong data!")}y++}'
        )
        
    
    def test_elseinline_elseif(self):
        self.assertEqual(self.process(
            '''
            function x()
            {
              if(something)
              {
                while(a);
                return 0;
              }
              else if(xxx)
              {
                while(b);
                return 1;
              }
              else
              {
                while(c);
                return 2;
              }
            }            
            '''),
            'function x(){if(something){while(a);return 0}if(xxx){while(b);return 1}while(c);return 2}'
        )
        
        
    def test_elseinline_elseif_nolast(self):
        self.assertEqual(self.process(
            '''
            function x()
            {
              if(something)
              {
                while(a);
                return 0;
              }
              else if(xxx)
              {
                while(b);
                return 1;
              }
              else
              {
                i++;
              }
            }            
            '''),
            'function x(){if(something){while(a);return 0}if(xxx){while(b);return 1}i++}'
        ) 
        
        
    def test_elseinline_cascaded(self):
        self.assertEqual(self.process(
            '''
            function x()
            {
              if(something)
              {
                while(x);
                return 0;
              }
              else if(xxx)
              {
                if(test2())
                {
                  while(x);
                  return 1;
                }
                else if(test3())
                {
                  while(x);
                  return 2;
                }
                else
                {
                  while(x);
                  return 3;
                }
              }
              else
              {
                while(x);
                return 4;
              }
            }
            '''),
            'function x(){if(something){while(x);return 0}if(xxx){if(test2()){while(x);return 1}if(test3()){while(x);return 2}while(x);return 3}while(x);return 4}'
        )        

     

    def test_if_deep_if(self):
        self.assertEqual(self.process(
            '''
            if(something)
            {
              for(g in h)
              {
                x++;
                if(otherthing){
                  y++;
                  while(bar);
                }
              }
            }
            '''),
            'if(something)for(g in h){x++;if(otherthing){y++;while(bar);}}'
        )        

    def test_loop_brackets(self):
        self.assertEqual(self.process(
            '''
            while(true)
            {
              retVal = !!callback(elems[i],i);

              if (inv!==retVal) {
                ret.push(elems[i])
              }
            }
            '''),
            'while(true)retVal=!!callback(elems[i],i),inv!==retVal&&ret.push(elems[i]);'
        )

    def test_switch_return(self):
        self.assertEqual(self.process(
            '''
            function wrapper(code)
            {
              switch(code)
              {
                case null:
                case 0:
                  return true;

                case -1:
                  return false;
              }
            }
            '''),
            'function wrapper(code){switch(code){case null:case 0:return true;case -1:return false}}'
        )        

    def test_if_else_cascaded(self):
        self.assertEqual(self.process(
            '''
            if(something)
            {
              if (condition)
              {
                somethingCase1a();
                somethingCase1b();
              }
              else
              {
                somethingCase2a();
                somethingCase2b();
              }
            }
            else
            {
              otherStuffA();
              otherStuffB();
            }
            '''),
            'something?condition?(somethingCase1a(),somethingCase1b()):(somethingCase2a(),somethingCase2b()):(otherStuffA(),otherStuffB());'
        )
        
    def test_if_else_expression(self):
        self.assertEqual(self.process(
            '''
            if(foo)
            {
              x++;
            }
            else
            {
              x--;
            }
            '''),
            'foo?x++:x--;'
        )        

    def test_if_else_both_empty(self):
        self.assertEqual(self.process(
            '''
            function wrapper()
            {
              if(something)
              {}
              else
              {}
            }
            '''),
            'function wrapper(){something}'
        )

    def test_if_else_empty(self):
        self.assertEqual(self.process(
            '''
            function wrapper()
            {
              if(something)
              {
                while(x);
              }
              else
              {}
            }
            '''),
            'function wrapper(){if(something)while(x);}'
        )        

    def test_if_else_while_if(self):
        self.assertEqual(self.process(
            '''
            if(first)
            {
              while(second) 
              {
                if(x)
                {
                  x++;
                }
              }
            }
            else
            {
              y++;
            }
            '''),
            'if(first)while(second)x&&x++;else y++;'
        )        

    def test_if_empty_else(self):
        self.assertEqual(self.process(
            '''
            function wrapper()
            {
              if(something)
              {
              }
              else
              {
                while(x); 
              }
            }
            '''),
            'function wrapper(){if(!something)while(x);}'
        )        

    def test_ifoptimize_assign_late(self):
        self.assertEqual(self.process(
            '''
            if(something) {
              x++;
              x=4;
            }
            '''),
            'something&&(x++,x=4);'
        )

    def test_ifoptimize_assign(self):
        self.assertEqual(self.process(
            '''
            if (something) {
              x = 4;
            }
            '''),
            'something&&(x=4);'
        )        

    def test_ifoptimize_crazy(self):
        self.assertEqual(self.process(
            'if (X && !this.isRich()) { {}; }'),
            'X&&!this.isRich();'
        )

    def test_ifoptimize_empty(self):
        self.assertEqual(self.process(
            'if(something){}'),
            'something;'
        )        

    def test_mergeassign_assign(self):
        self.assertEqual(self.process(
            '''
            if(foo)
            {
              x = 5;
            }
            else
            {
              x = 7;
            }
            '''),
            'x=foo?5:7;'
        )

    def test_mergeassign_assign_plus(self):
        self.assertEqual(self.process(
            '''
            if(something) {
              x += 3;
            } else {
              x += 4;
            }
            '''),
            'x+=something?3:4;'
        )        

    def test_mergeassign_object(self):
        self.assertEqual(self.process(
            '''
            if(something) {
              obj.foo.bar = "hello";
            } else {
              obj.foo.bar = "world";
            }
            '''),
            'obj.foo.bar=something?"hello":"world";'
        )
    
    def test_mergereturn(self):
        self.assertEqual(self.process(
            '''
            function ret()
            {
              if(something) {
                return "hello";
              } else {
                return "world";
              }
            }
            '''),
            'function ret(){return something?"hello":"world"}'
        )

    def test_parens_arithm(self):
        self.assertEqual(self.process(
            'x=(4*5)+4;'),
            'x=24;'
        )        

    def test_parens_assign(self):
        self.assertEqual(self.process(
            'doc = (context ? context.ownerDocument || context : document);'),
            'doc=context?context.ownerDocument||context:document;'
        )

    def test_parens_condition(self):
        self.assertEqual(self.process(
            '''
            while ( (fn = readyList[ i++ ]) ) {
              fn.call( document, jQuery );
            }
            '''),
            'while(fn=readyList[i++])fn.call(document,jQuery);'
        )        

    def test_parens_directexec(self):
        self.assertEqual(self.process(
            '(function(){ x++; })();'),
            '(function(){x++})();'
        )

    def test_parens_new(self):
        self.assertEqual(self.process(
            'var x = (new some.special.Item).setText("Hello World");'),
            'var x=(new some.special.Item).setText("Hello World");'
        )        

    def test_parens_new_args(self):
        self.assertEqual(self.process(
            'var x = new some.special.Item("param").setText("Hello World");'),
            'var x=new some.special.Item("param").setText("Hello World");'
        )        

    def test_parens_return(self):
        self.assertEqual(self.process(
            '''
            function x() {
              return (somemethod() && othermethod() != null);
            }
            '''),
            'function x(){return somemethod()&&othermethod()!=null}'
        )
        
    def test_single_command_if_block(self):
        self.assertEqual(self.process(
            '''
            if (!abc) {
              abc = {
                setup: function() {
                  if (cde) {
                    x();
                  } else {
                    return false;
                  }
                }
              };
            }
            '''),
            'abc||(abc={setup:function(){if(cde)x();else return false}});'
        )

    def test_strict(self):
        self.assertEqual(self.process(
            '''
            function foo() {

              "use strict";

              doSomething();

            }

            foo();
            '''),
            'function foo(){"use strict";doSomething()}foo();'
        )



class TestCombineDeclarations(unittest.TestCase):

    def process(self, code):
        node = Parser.parse(code)
        ScopeScanner.scan(node)
        CombineDeclarations.optimize(node)
        return Compressor.compress(node)


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
        
        
        
class TestRemoveUnused(unittest.TestCase):

    def process(self, code):
        node = Parser.parse(code)
        Unused.cleanup(node)
        return Compressor.compress(node)        

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
        
        


class TestRenamePrivates(unittest.TestCase):

    def process(self, code, contextId=""):
        node = Parser.parse(code)
        CryptPrivates.optimize(node, contextId)
        return Compressor.compress(node)        

    def test_assign(self):
        self.assertEqual(self.process(
            '''
            this.__field1 = 123;
            ''', 1),
            'this.__mJ02j=123;'
        )
        
    def test_assign_long(self):
        self.assertEqual(self.process(
            '''
            this.__titleBarBackgroundColor = "red";
            ''', 1),
            'this.__clbJJO="red";'
        )        
            
    def test_global_obj_file1(self):
        self.assertEqual(self.process(
            '''
            var obj = {
              __x : 123,
              __y : 456
            };
            alert(obj.__x + ":" + obj.__y);
            ''', 1),
            'var obj={__bLHVk:123,__bLYYn:456};alert(obj.__bLHVk+":"+obj.__bLYYn);'
        )        

    def test_global_obj_file2(self):
        self.assertEqual(self.process(
            '''
            var obj = {
              __x : 123,
              __y : 456
            };
            alert(obj.__x + ":" + obj.__y);
            ''', 2),
            'var obj={__bMw4r:123,__bMN7u:456};alert(obj.__bMw4r+":"+obj.__bMN7u);'
        )
        
    def test_remote(self):
        self.assertRaises(CryptPrivates.Error, self.process, 
            '''
            alert(RemoteObj.__x);
            ''')

    def test_localvar(self):
        self.assertEqual(self.process(
            '''
            var __x = 4;
            alert(__x);
            '''),
            'var __x=4;alert(__x);'
        )
    
    def test_localvar_undeclared(self):
        self.assertEqual(self.process(
            '''
            alert(__y);
            '''),
            'alert(__y);'
        )        

    def test_local_deep(self):
        self.assertEqual(self.process(
            '''
            var obj = {
              __field : {
                __sub : true
              }
            };
            
            alert(obj.__field.__sub);
            '''),
            'var obj={__ihERj:{__dZ1y9:true}};alert(obj.__ihERj.__dZ1y9);'
        )

    def test_access_same_named_external(self):
        """ 
        Is is somehow an unsupported edge case which is not supported correctly yet.
        Normally one would expect that the access to __field on RemoteObj would raise an error.
        At least it breaks this wrong access because this field is renamed based on file name as well.
        """
        self.assertEqual(self.process(
            '''
            var obj = {
              __field : true
            };
            alert(RemoteObj.__field);
            '''),
            'var obj={__ihERj:true};alert(RemoteObj.__ihERj);'
        )        

    def test_mixin(self):
        self.assertEqual(self.process(
            '''
            var source = {
              __field1 : 123,
              __field2 : 456
            };
            
            var target = {
              __field1 : 789
            };
            
            for (var key in source) {
              target[key] = source[key];
            }
            '''),
            'var source={__kZWNQ:123,__k0dQT:456};var target={__kZWNQ:789};for(var key in source){target[key]=source[key]}'
        )   
    
    
    

class TestInjectValue(unittest.TestCase):

    def process(self, code, contextId=""):
        node = Parser.parse(code)
        permutation = Permutation.Permutation({
            'debug': False,
            'legacy': True,
            'engine': 'webkit',
            'version': 3,
            'fullversion': 3.11
        })
        permutation.patch(node)
        return Compressor.compress(node)    
    
    
    def test_get(self):
        self.assertEqual(self.process(
            'var engine = core.Env.getValue("engine");'),
            'var engine="webkit";'
        )

    def test_if_isset(self):
        self.assertEqual(self.process(
            '''
            if (core.Env.isSet("debug", true)) {
                var x = 1;
            }
            '''),
            'if(false){var x=1}'
        )        

    def test_isset_bool_false(self):
        self.assertEqual(self.process(
            'var debug = core.Env.isSet("debug", true);'),
            'var debug=false;'
        )             
        
    def test_isset_bool_shorthand_false(self):
        self.assertEqual(self.process(
            'var debug = core.Env.isSet("debug");'),
            'var debug=false;'
        )
        
    def test_isset_bool_true(self):
        self.assertEqual(self.process(
            'var legacy = core.Env.isSet("legacy", true);'),
            'var legacy=true;'
        )
        
    def test_isset_bool_shorthand_true(self):
        self.assertEqual(self.process(
            'var legacy = core.Env.isSet("legacy");'),
            'var legacy=true;'
        )             

    def test_isset_typediff(self):
        self.assertEqual(self.process(
            'var legacy = core.Env.isSet("legacy", "foo");'),
            'var legacy=false;'
        )

    def test_isset_lookup(self):
        self.assertEqual(self.process(
            'var legacy = core.Env.isSet("legacy", x);'),
            'var legacy=core.Env.isSet("legacy",x);'
        )        
        
    def test_isset_int_true(self):
        self.assertEqual(self.process(
            'var recent = core.Env.isSet("version", 3);'),
            'var recent=true;'
        )             

    def test_isset_int_false(self):
        self.assertEqual(self.process(
            'var recent = core.Env.isSet("version", 5);'),
            'var recent=false;'
        )

    def test_isset_float_true(self):
        self.assertEqual(self.process(
            'var buggy = core.Env.isSet("fullversion", 3.11);'),
            'var buggy=true;'
        )

    def test_isset_float_false(self):
        self.assertEqual(self.process(
            'var buggy = core.Env.isSet("fullversion", 3.2);'),
            'var buggy=false;'
        )           
        
    def test_isset_str_single(self):
        self.assertEqual(self.process(
            'var modern = core.Env.isSet("engine", "webkit");'),
            'var modern=true;'
        )
        
    def test_isset_str_multi(self):
        self.assertEqual(self.process(
            'var modern = core.Env.isSet("engine", "gecko|webkit");'),
            'var modern=true;'
        )
        
    def test_isset_str_multilong(self):
        self.assertEqual(self.process(
            'var modern = core.Env.isSet("engine", "gecko|webkitbrowser");'),
            'var modern=false;'
        )            

    def test_select(self):
        self.assertEqual(self.process(
            '''
            var prefix = core.Env.select("engine", {
              webkit: "Webkit",
              gecko: "Moz",
              trident: "ms"
            });
            '''),
            'var prefix="Webkit";'
        )

    def test_select_notfound(self):
        self.assertEqual(self.process(
            '''
            var prefix = core.Env.select("engine", {
              gecko: "Moz",
              trident: "ms"
            });            
            '''),
            'var prefix=core.Env.select("engine",{gecko:"Moz",trident:"ms"});'
        )        
        
    def test_select_default(self):
        self.assertEqual(self.process(
            '''
            var prefix = core.Env.select("engine", {
              gecko: "Moz",
              trident: "ms",
              "default": ""
            });            
            '''),
            'var prefix="";'
        )

    def test_select_multi(self):
        self.assertEqual(self.process(
            '''
            var prefix = core.Env.select("engine", {
              "webkit|khtml": "Webkit",
              trident: "ms",
            });            
            '''),
            'var prefix="Webkit";'
        )             

    def test_(self):
        self.assertEqual(self.process(
            '''
            '''),
            ''
        )

    def test_(self):
        self.assertEqual(self.process(
            '''
            '''),
            ''
        )
        
    def test_(self):
        self.assertEqual(self.process(
            '''
            '''),
            ''
        )

    def test_(self):
        self.assertEqual(self.process(
            '''
            '''),
            ''
        )             

    def test_(self):
        self.assertEqual(self.process(
            '''
            '''),
            ''
        )

    def test_(self):
        self.assertEqual(self.process(
            '''
            '''),
            ''
        )
        
    def test_(self):
        self.assertEqual(self.process(
            '''
            '''),
            ''
        )

    def test_(self):
        self.assertEqual(self.process(
            '''
            '''),
            ''
        )             

    def test_(self):
        self.assertEqual(self.process(
            '''
            '''),
            ''
        )

    def test_(self):
        self.assertEqual(self.process(
            '''
            '''),
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

    print()
    print("======================================================================")
    print("  BLOCK REDUCER")
    print("======================================================================")
    blockReducerTests = unittest.TestLoader().loadTestsFromTestCase(TestBlockReducer)
    unittest.TextTestRunner(verbosity=verbosity).run(blockReducerTests)

    print()
    print("======================================================================")
    print("  COMBINE DECLARATIONS")
    print("======================================================================")
    declarationTests = unittest.TestLoader().loadTestsFromTestCase(TestCombineDeclarations)
    unittest.TextTestRunner(verbosity=verbosity).run(declarationTests)

    print()
    print("======================================================================")
    print("  REMOVE UNUSED")
    print("======================================================================")
    unusedTests = unittest.TestLoader().loadTestsFromTestCase(TestRemoveUnused)
    unittest.TextTestRunner(verbosity=verbosity).run(unusedTests)

    print()
    print("======================================================================")
    print("  RENAME PRIVATES")
    print("======================================================================")
    privateTests = unittest.TestLoader().loadTestsFromTestCase(TestRenamePrivates)
    unittest.TextTestRunner(verbosity=verbosity).run(privateTests)
    
    print()
    print("======================================================================")
    print("  INJECT VALUES")
    print("======================================================================")
    injectTests = unittest.TestLoader().loadTestsFromTestCase(TestInjectValue)
    unittest.TextTestRunner(verbosity=verbosity).run(injectTests)    
    