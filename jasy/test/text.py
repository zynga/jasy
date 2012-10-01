#!/usr/bin/env python3

import sys, os, unittest, logging

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir))
sys.path.insert(0, jasyroot)

import jasy.core.Text as Text


class Tests(unittest.TestCase):

    def test_markdown(self):
        
        self.assertEqual(Text.markdownToHtml("*emphased*"), "<p><em>emphased</em></p>\n")
        self.assertEqual(Text.markdownToHtml("**bold**"), "<p><strong>bold</strong></p>\n")

        self.assertEqual(Text.markdownToHtml("# Header 1"), "<h1>Header 1</h1>\n")
        self.assertEqual(Text.markdownToHtml("## Header 2"), "<h2>Header 2</h2>\n")
        self.assertEqual(Text.markdownToHtml("### Header 3"), "<h3>Header 3</h3>\n")
        self.assertEqual(Text.markdownToHtml("#### Header 4"), "<h4>Header 4</h4>\n")
        self.assertEqual(Text.markdownToHtml("##### Header 5"), "<h5>Header 5</h5>\n")
        self.assertEqual(Text.markdownToHtml("###### Header 6"), "<h6>Header 6</h6>\n")

        self.assertEqual(Text.markdownToHtml("""
Paragraph 1

Paragraph 2
        """), "<p>Paragraph 1</p>\n\n<p>Paragraph 2</p>\n")

        self.assertEqual(Text.markdownToHtml("""
- Item 1
- Item 2
- Item 3
        """), "<ul>\n<li>Item 1</li>\n<li>Item 2</li>\n<li>Item 3</li>\n</ul>\n")        

        self.assertEqual(Text.markdownToHtml("""
1. Item 1
2. Item 2
3. Item 3
        """), "<ol>\n<li>Item 1</li>\n<li>Item 2</li>\n<li>Item 3</li>\n</ol>\n")


        self.assertEqual(Text.highlightCodeBlocks(Text.markdownToHtml("""
```js
alert("hello");
```
        """)), 
'''<table class="highlighttable"><tr><td class="linenos"><div class="linenodiv"><pre>1</pre></div></td><td class="code"><div class="highlight"><pre><span class="nx">alert</span><span class="p">(</span><span class="s2">"hello"</span><span class="p">);</span>
</pre></div>
</td></tr></table>
''')


if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)
