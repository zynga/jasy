#!/usr/bin/env python3

import sys, os, unittest

# Extend PYTHONPATH with 'lib'
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir))
sys.path.insert(0, jasyroot)

from jasy.parser.Parser import parse


class TestParser(unittest.TestCase):
    
    def setUp(self):
        pass
        
        
    def test_function(self):
        self.assertEqual(
            parse("function abc() { return 1; }").toXml(False),
            '<script line="0"><function functionForm="declared_form" line="0" name="abc"><body><script line="0"><return line="0"><value><number line="0" value="1"/></value></return></script></body></function></script>'
        )

        self.assertEqual(
            parse("var abc = function() { return 1; }").toXml(False),
            '<script line="0"><var line="0"><declaration line="0" name="abc" readOnly="false"><initializer><function functionForm="expressed_form" line="0"><body><script line="0"><return line="0"><value><number line="0" value="1"/></value></return></script></body></function></initializer></declaration></var></script>'
        )
        
        self.assertEqual(
            parse("var abc = function abc() { return 1; }").toXml(False),
            '<script line="0"><var line="0"><declaration line="0" name="abc" readOnly="false"><initializer><function functionForm="expressed_form" line="0" name="abc"><body><script line="0"><return line="0"><value><number line="0" value="1"/></value></return></script></body></function></initializer></declaration></var></script>'
        )
        
        
    def test_expression(self):
        
        self.assertEqual(
            parse('a + ++i;').toXml(False),
            '<script line="0"><semicolon line="0"><expression><plus line="0"><identifier line="0" value="a"/><increment line="0"><identifier line="0" value="i"/></increment></plus></expression></semicolon></script>'
        )
        
        
        self.assertEqual(
            parse('a++ + i;').toXml(False),
            '<script line="0"><semicolon line="0"><expression><plus line="0"><increment line="0" postfix="true"><identifier line="0" value="a"/></increment><identifier line="0" value="i"/></plus></expression></semicolon></script>'
        )


class TestCompressor(unittest.TestCase):

    def setUp(self):
        pass
        
        
    def test_123(self):
        pass
        
        


if __name__ == '__main__':
    unittest.main()
    
    