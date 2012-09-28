#!/usr/bin/env python3

import sys, os, unittest, logging

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir))
sys.path.insert(0, jasyroot)

import jasy.core.Text as Text


class Tests(unittest.TestCase):

    def test_basics(self):
        
        self.assertEqual(Text.markdownToHtml("*emphased*"), "<p><em>emphased</em></p>\n")
        self.assertEqual(Text.markdownToHtml("**bold**"), "<p><strong>bold</strong></p>\n")

        self.assertEqual(Text.markdownToHtml("# Header 1"), "<h1>Header 1</h1>\n")
        self.assertEqual(Text.markdownToHtml("## Header 2"), "<h2>Header 2</h2>\n")
        self.assertEqual(Text.markdownToHtml("### Header 3"), "<h3>Header 3</h3>\n")
        self.assertEqual(Text.markdownToHtml("#### Header 4"), "<h4>Header 4</h4>\n")
        self.assertEqual(Text.markdownToHtml("##### Header 5"), "<h5>Header 5</h5>\n")
        self.assertEqual(Text.markdownToHtml("###### Header 6"), "<h6>Header 6</h6>\n")
    


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)
