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
import jasy.js.optimize.BlockReducer as BlockReducer



class Tests(unittest.TestCase):

    def process(self, code):
        node = Parser.parse(code)
        BlockReducer.optimize(node)
        return Compressor.Compressor().compress(node)

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

    def test_combine_inner_out(self):
        self.assertEqual(self.process('var s=x+"foo"+"bar"'), 'var s=x+"foobar";')

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
        
    def test_if_empty_else_two(self):
        self.assertEqual(self.process(
            '''
            function wrapper()
            {
              if(something && otherthing)
              {
              }
              else
              {
                while(x); 
              }
            }
            '''),
            'function wrapper(){if(!(something&&otherthing))while(x);}'
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
        
    def test_parens_numberoper(self):
        self.assertEqual(self.process('''(23).pad(2);'''), '(23).pad(2);')
        
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



if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)    

