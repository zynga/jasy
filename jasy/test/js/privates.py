#!/usr/bin/env python3

import sys, os, unittest, logging

# Extend PYTHONPATH with local 'lib' folder
if __name__ == "__main__":
    jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir, os.pardir))
    sys.path.insert(0, jasyroot)
    print("Running from %s..." % jasyroot)

import jasy.js.parse.Parser as Parser
import jasy.js.output.Compressor as Compressor
import jasy.js.optimize.CryptPrivates as CryptPrivates



class Tests(unittest.TestCase):

    def process(self, code, contextId=""):
        node = Parser.parse(code)
        CryptPrivates.optimize(node, contextId)
        return Compressor.Compressor().compress(node)        

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




if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)


