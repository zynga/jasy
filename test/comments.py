import sys, os, unittest

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, "lib"))
sys.path.insert(0, jasyroot)

import jasy.js.parse.Parser as Parser

        
class TestComments(unittest.TestCase):

    def process(self, code):
        node = Parser.parse(code)
        print(node)
        return node
        
    
    def test_single(self):
        
        parsed = self.process('''
        
        // Single Comment
        singleCommentCmd();
        
        ''')
        
        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)
        
        self.assertEqual(parsed[0].comments[0].context, "section")
        self.assertEqual(parsed[0].comments[0].variant, "single")
        self.assertEqual(parsed[0].comments[0].text, "Single Comment")
        
        
    def test_singleTwo(self):

        parsed = self.process('''

        // Single1 Comment
        // Single2 Comment
        singleCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 2)

        self.assertEqual(parsed[0].comments[0].context, "section")
        self.assertEqual(parsed[0].comments[0].variant, "single")
        self.assertEqual(parsed[0].comments[0].text, "Single1 Comment")

        self.assertEqual(parsed[0].comments[1].context, "section")
        self.assertEqual(parsed[0].comments[1].variant, "single")
        self.assertEqual(parsed[0].comments[1].text, "Single2 Comment")
        
        
    def test_multi(self):

        parsed = self.process('''

        /* Multi Comment */
        multiCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].context, "section")
        self.assertEqual(parsed[0].comments[0].variant, "multi")
        self.assertEqual(parsed[0].comments[0].text, " Multi Comment ")        
        
        
    def test_multiTwo(self):

        parsed = self.process('''

        /* Multi Comment1 */
        /* Multi Comment2 */
        multiCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 2)

        self.assertEqual(parsed[0].comments[0].context, "section")
        self.assertEqual(parsed[0].comments[0].variant, "multi")
        self.assertEqual(parsed[0].comments[0].text, " Multi Comment1 ")
        
        self.assertEqual(parsed[0].comments[1].context, "section")
        self.assertEqual(parsed[0].comments[1].variant, "multi")
        self.assertEqual(parsed[0].comments[1].text, " Multi Comment2 ")
        
        
        
    
    def xtest_class_decl(self):
        self.process('''
        /**
         * Class documentation
         */
        core.Class.define("my.custom.Class",
        {
          /**
           * @param x 
           */
          construct : function(x) {

          },


          /* 
          *********************************************
             MEMBERS
          ********************************************* 
          */

          members :
          {
            /**
             * A really nice method
             */
            method : function(/** Object */ param1, /** String */ param2, /** my.other.Class */ param3)
            {
              // multi line
              // single comments
              doSomething();

              /* detected as a section */
              blockElem1();
              blockElem2();
              blockElem3();
              /* detected as a block */
              doElse();

              var complex = 1 * 2 * 3; // inline attached to previous statement
              var simple = 1 * 2;
            }
          }
        });
        ''')
        
        
if __name__ == '__main__':
    tests = unittest.TestLoader().loadTestsFromTestCase(TestComments)
    unittest.TextTestRunner(verbosity=1).run(tests)        
    
