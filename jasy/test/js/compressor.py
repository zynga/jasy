#!/usr/bin/env python3

import sys, os, unittest, logging

# Extend PYTHONPATH with local 'lib' folder
if __name__ == "__main__":
    jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir, os.pardir))
    sys.path.insert(0, jasyroot)
    print("Running from %s..." % jasyroot)

import jasy.js.parse.Parser as Parser
import jasy.js.output.Compressor as Compressor


class Tests(unittest.TestCase):

    def process(self, code):
        return Compressor.Compressor().compress(Parser.parse(code))
        
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

    def test_regexp_in_array(self):
        self.assertEqual(self.process('var x = [/[a-z]/];'), 'var x=[/[a-z]/];')

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

        # Low Unicode escapes are encoded as Unicode text
        ret = self.process(r'"[\t\n\u000b\f\r \u00a0]"')
        self.assertEqual(ret, r'"[\t\n\u000b\f\r  ]";')
        
        # High Unicode escapes are encoded as ASCII with escape sequences
        ret = self.process(r'"[\t\n\u000b\f\r \u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\ufeff]"')
        self.assertEqual(ret, r'"[\t\n\u000b\f\r \u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\ufeff]";')

    def test_while_comma_condition(self):
        self.assertEqual(self.process('while (x=1, x<3){ x++; }'), 'while(x=1,x<3){x++}')            

    def test_while(self):
        self.assertEqual(self.process('while (true) { x++; }'), 'while(true){x++}')
                     
        

if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)

