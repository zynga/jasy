#!/usr/bin/env python3

import sys, os, unittest, logging, pkg_resources

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, os.pardir, os.pardir))
sys.path.insert(0, jasyroot)

import jasy.js.parse.Parser as Parser


        
class Tests(unittest.TestCase):

    def process(self, code):
        node = Parser.parse(code)
        return node
        
        

    #
    # SINGLE COMMENTS
    #        
    
    def test_single(self):
        
        parsed = self.process('''
        
        // Single Comment
        singleCommentCmd();
        
        ''')
        
        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)
        
        self.assertEqual(parsed[0].comments[0].variant, "single")
        self.assertEqual(parsed[0].comments[0].text, "Single Comment")
        

    def test_single_unbound(self):

        parsed = self.process('''
        // Single Comment
        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        self.assertEqual(parsed.comments[0].variant, "single")
        self.assertEqual(parsed.comments[0].text, "Single Comment")        


    def test_single_unbound_nobreak(self):

        parsed = self.process('''// Single Comment''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        self.assertEqual(parsed.comments[0].variant, "single")
        self.assertEqual(parsed.comments[0].text, "Single Comment")        

        
    def test_single_two(self):

        parsed = self.process('''

        // Single1 Comment
        // Single2 Comment
        singleCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 2)

        self.assertEqual(parsed[0].comments[0].variant, "single")
        self.assertEqual(parsed[0].comments[0].text, "Single1 Comment")

        self.assertEqual(parsed[0].comments[1].variant, "single")
        self.assertEqual(parsed[0].comments[1].text, "Single2 Comment")
        
        
        
    #
    # SINGLE COMMENTS :: CONTEXT
    #
        
    def test_single_context_inline(self):

        parsed = self.process('''singleCommentCmd(); // Single Inline Comment''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "single")
        self.assertEqual(parsed[0].comments[0].context, "inline")
        
        
    def test_single_context_block_before(self):

        parsed = self.process('''
        singleCommentCmd(); 
        // Single Block Comment
        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "single")
        self.assertEqual(parsed[0].comments[0].context, "block")   
        
        
    def test_single_context_block_after(self):

        parsed = self.process('''
        // Single Block Comment
        singleCommentCmd(); 
        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "single")
        self.assertEqual(parsed[0].comments[0].context, "block")
        
        
    def test_single_context_section(self):

        parsed = self.process('''
        
        // Single Section Comment
        singleCommentCmd(); 
        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "single")
        self.assertEqual(parsed[0].comments[0].context, "section")
        
        
        
    #
    # MULTI COMMENTS
    #
        
    def test_multi(self):

        parsed = self.process('''

        /* Multi Comment */
        multiCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "multi")
        self.assertEqual(parsed[0].comments[0].text, "Multi Comment")        
        
        
    def test_multi_unbound(self):

        parsed = self.process('''
        /* Multi Comment */
        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        self.assertEqual(parsed.comments[0].variant, "multi")
        self.assertEqual(parsed.comments[0].text, "Multi Comment")        
        
        
    def test_multi_unbound_nobreak(self):

        parsed = self.process('''/* Multi Comment */''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        self.assertEqual(parsed.comments[0].variant, "multi")
        self.assertEqual(parsed.comments[0].text, "Multi Comment")        
        
        
    def test_multi_two(self):

        parsed = self.process('''

        /* Multi Comment1 */
        /* Multi Comment2 */
        multiCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 2)

        self.assertEqual(parsed[0].comments[0].variant, "multi")
        self.assertEqual(parsed[0].comments[0].text, "Multi Comment1")
        
        self.assertEqual(parsed[0].comments[1].variant, "multi")
        self.assertEqual(parsed[0].comments[1].text, "Multi Comment2")
        
        
    def test_multi_multiline(self):

        parsed = self.process('''

        /* Multi
           Comment
           Test */
        multiCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "multi")
        self.assertEqual(parsed[0].comments[0].text, "   Multi\n   Comment\n   Test")
        
        
    def test_multi_multiline_otherbreaks(self):

        parsed = self.process('''

        /*
          Multi
          Comment
          Test 
        */
        multiCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "multi")
        self.assertEqual(parsed[0].comments[0].text, "  Multi\n  Comment\n  Test")
    
    
    
    #
    # MULTI COMMENTS :: CONTEXT
    #
            
    def test_multi_context_inline(self):

        parsed = self.process('''multiCommentCmd(); /* Multi Inline Comment */''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "multi")
        self.assertEqual(parsed[0].comments[0].context, "inline")
        
        
    def test_multi_context_inline_multiline(self):

        parsed = self.process('''
        multiCommentCmd(); /* 
          Multi Inline Comment 
        */''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "multi")
        self.assertEqual(parsed[0].comments[0].context, "inline")        


    def test_multi_context_block_before(self):

        parsed = self.process('''
        multiCommentCmd(); 
        /* Multi Block Comment */
        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "multi")
        self.assertEqual(parsed[0].comments[0].context, "block")   


    def test_multi_context_block_after(self):

        parsed = self.process('''
        /* Multi Block Comment */
        multiCommentCmd(); 
        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "multi")
        self.assertEqual(parsed[0].comments[0].context, "block")


    def test_multi_context_section(self):

        parsed = self.process('''

        /* Multi Section Comment */
        multiCommentCmd(); 
        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "multi")
        self.assertEqual(parsed[0].comments[0].context, "section")    
    
    


    #
    # PROTECTED COMMENTS
    #

    def test_protected(self):

        parsed = self.process('''

        /*! Protected Comment */
        protectedCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "protected")
        self.assertEqual(parsed[0].comments[0].text, "Protected Comment")    


    def test_protected_newline(self):

        parsed = self.process('''

        /*! 
        Protected Comment 
        */
        protectedCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "protected")
        self.assertEqual(parsed[0].comments[0].text, "Protected Comment")
            

    def test_protected_jquery(self):

        parsed = self.process('''

        /*!
         * jQuery JavaScript Library v@VERSION
         * http://jquery.com/
         *
         * Copyright 2011, John Resig
         * Dual licensed under the MIT or GPL Version 2 licenses.
         * http://jquery.org/license
         *
         * Includes Sizzle.js
         * http://sizzlejs.com/
         * Copyright 2011, The Dojo Foundation
         * Released under the MIT, BSD, and GPL Licenses.
         *
         * Date: @DATE
         */

        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        self.assertEqual(parsed.comments[0].variant, "protected")
        self.assertEqual(parsed.comments[0].text, "jQuery JavaScript Library v@VERSION\nhttp://jquery.com/\n\nCopyright 2011, John Resig\nDual licensed under the MIT or GPL Version 2 licenses.\nhttp://jquery.org/license\n\nIncludes Sizzle.js\nhttp://sizzlejs.com/\nCopyright 2011, The Dojo Foundation\nReleased under the MIT, BSD, and GPL Licenses.\n\nDate: @DATE")



    #
    # ATTACHMENT
    #
    
    def test_missing_node(self):

        parsed = self.process('''

        /** Root Doc */
        core.Class("xxx", {
          members : {
            foo : function() {
              /** TODO */
            }
          }
          /** END */
        })

        ''')

        self.assertEqual(parsed.type, "script")
        
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)
        self.assertEqual(parsed[0].comments[0].variant, "doc")
        self.assertEqual(parsed[0].comments[0].text, "Root Doc")


    


    #
    # DOC COMMENTS
    #
    
    def test_doc(self):

        parsed = self.process('''

        /** Doc Comment */
        docCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "doc")
        self.assertEqual(parsed[0].comments[0].html, "<p>Doc Comment</p>\n")
        self.assertEqual(parsed[0].comments[0].text, "Doc Comment")
        
        
    def test_doc_unbound(self):

        parsed = self.process('''
        /** Doc Comment */
        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        self.assertEqual(parsed.comments[0].variant, "doc")
        self.assertEqual(parsed.comments[0].html, "<p>Doc Comment</p>\n")
        self.assertEqual(parsed.comments[0].text, "Doc Comment")
        
        
    def test_doc_unbound_nobreak(self):

        parsed = self.process('''/** Doc Comment */''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        self.assertEqual(parsed.comments[0].variant, "doc")
        self.assertEqual(parsed.comments[0].html, "<p>Doc Comment</p>\n")
        self.assertEqual(parsed.comments[0].text, "Doc Comment")


    def test_doc_multiline(self):

        parsed = self.process('''

        /**
         * Doc Comment
         */
        docCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "doc")
        self.assertEqual(parsed[0].comments[0].html, "<p>Doc Comment</p>\n")
        self.assertEqual(parsed[0].comments[0].text, "Doc Comment")
        

    def test_doc_multiline_three(self):

        parsed = self.process('''

        /**
         * Doc Comment Line 1
         * Doc Comment Line 2
         * Doc Comment Line 3
         */
        docCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "doc")
        self.assertEqual(parsed[0].comments[0].html, "<p>Doc Comment Line 1\nDoc Comment Line 2\nDoc Comment Line 3</p>\n")
        self.assertEqual(parsed[0].comments[0].text, "Doc Comment Line 1\nDoc Comment Line 2\nDoc Comment Line 3")
        
        
        
    def test_doc_multiline_clean(self):

        parsed = self.process('''

        /**
        Doc Comment
        */
        docCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "doc")
        self.assertEqual(parsed[0].comments[0].html, "<p>Doc Comment</p>\n")
        self.assertEqual(parsed[0].comments[0].text, "Doc Comment")


    def test_doc_multiline_clean_three(self):

        parsed = self.process('''

        /**
        Doc Comment Line 1
        Doc Comment Line 2
        Doc Comment Line 3
        */
        docCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "doc")
        self.assertEqual(parsed[0].comments[0].html, "<p>Doc Comment Line 1\nDoc Comment Line 2\nDoc Comment Line 3</p>\n")
        self.assertEqual(parsed[0].comments[0].text, "Doc Comment Line 1\nDoc Comment Line 2\nDoc Comment Line 3")


    #
    # DOC COMMENTS :: RETURN
    #

    def test_doc_return(self):

        parsed = self.process('''

        /**
         * {Number} Returns the sum of x and y.
         */

        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]

        self.assertEqual(comment.variant, "doc")
        self.assertEqual(comment.html, "<p>Returns the sum of x and y.</p>\n")
        self.assertEqual(comment.text, "Returns the sum of x and y.")
        self.assertEqual(comment.returns[0]["name"], "Number")
        
        
    def test_doc_return_twotypes(self):

        parsed = self.process('''

        /**
         * {Number | String} Returns the sum of x and y.
         */

        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]

        self.assertEqual(comment.variant, "doc")
        self.assertEqual(comment.html, "<p>Returns the sum of x and y.</p>\n")
        self.assertEqual(comment.text, "Returns the sum of x and y.")
        self.assertEqual(comment.returns[0]["name"], "Number")
        self.assertEqual(comment.returns[1]["name"], "String")
    
    
    
    #
    # DOC COMMENTS :: TAGS
    #

    def test_doc_tags(self):
        
        parsed = self.process('''
        
        /**
         * Hello World
         *
         * #deprecated #public #use(future) #use(current)
         */
        
        ''')
        
        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]

        self.assertEqual(comment.variant, "doc")
        self.assertEqual(comment.html, "<p>Hello World</p>\n")
        self.assertEqual(comment.text, "Hello World")
        
        self.assertEqual(comment.tags["deprecated"], True)
        self.assertEqual(comment.tags["public"], True)
        self.assertEqual(type(comment.tags["use"]), set)
        self.assertEqual("future" in comment.tags["use"], True)
        self.assertEqual("current" in comment.tags["use"], True)
        self.assertEqual("xxx" in comment.tags["use"], False)
        
    
    
    def test_doc_tags_clean(self):

        parsed = self.process('''

        /**
         * #deprecated #public #use(future) #use(current)
         */

        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]

        self.assertEqual(comment.variant, "doc")
        self.assertEqual(comment.text, "")
    
        self.assertEqual(comment.tags["deprecated"], True)
        self.assertEqual(comment.tags["public"], True)
        self.assertEqual(type(comment.tags["use"]), set)
        self.assertEqual("future" in comment.tags["use"], True)
        self.assertEqual("current" in comment.tags["use"], True)
        self.assertEqual("xxx" in comment.tags["use"], False)

    
    
    #
    # DOC COMMENTS :: LINKS
    #

    def test_doc_links(self):

        parsed = self.process('''
        
        /**
         * Link to cool {z.core.Style} class. Looks at this method {core.io.Asset#toUri} to translate local
         * asset IDs to something usable in the browser.
         */

        ''')
        
        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]
        
        self.assertEqual(comment.html, '<p>Link to cool <a href="#z.core.Style"><code>z.core.Style</code></a> class. Looks at this method <a href="#core.io.Asset~toUri"><code>core.io.Asset#toUri</code></a> to translate local\nasset IDs to something usable in the browser.</p>\n')
        self.assertEqual(comment.text, 'Link to cool z.core.Style class. Looks at this method core.io.Asset#toUri to translate local\nasset IDs to something usable in the browser.')
    
    
    def test_doc_links_primitive(self):

        parsed = self.process('''

        /**
         * You can either use {String} or {Map} types as primitive data types.
         */

        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]

        self.assertEqual(comment.html, '<p>You can either use <a href="#String"><code>String</code></a> or <a href="#Map"><code>Map</code></a> types as primitive data types.</p>\n')
        self.assertEqual(comment.text, 'You can either use String or Map types as primitive data types.')    


    def test_doc_links_type(self):

        parsed = self.process('''

        /**
         * Just execute the {member:#update} method to fire the event {event:#update}.
         */

        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]

        self.assertEqual(comment.html, '<p>Just execute the <a href="#member:~update"><code>update</code></a> method to fire the event <a href="#event:~update"><code>update</code></a>.</p>\n')
        self.assertEqual(comment.text, 'Just execute the update method to fire the event update.')


    
    #
    # DOC COMMENTS :: PARAMS
    #
    
    def test_doc_params(self):

        parsed = self.process('''
        
        /**
         * {Boolean} Returns whether @x {Number} is bigger than @y {Number}. The optional @cache {Boolean?false} controls whether caching should be enabled.
         * Also see @extra {String | Array ?} which is normally pretty useless
         */

        ''')
        
        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]
    
        self.assertEqual(comment.variant, "doc")
        self.assertEqual(comment.html, '<p>Returns whether <code class="param">x</code> is bigger than <code class="param">y</code>. The optional <code class="param">cache</code> controls whether caching should be enabled.\nAlso see <code class="param">extra</code> which is normally pretty useless</p>\n')
        self.assertEqual(comment.text, 'Returns whether x is bigger than y. The optional cache controls whether caching should be enabled.\nAlso see extra which is normally pretty useless')
        
        self.assertEqual(type(comment.params), dict)

        self.assertEqual(type(comment.params["x"]), dict)
        self.assertEqual(type(comment.params["y"]), dict)
        self.assertEqual(type(comment.params["cache"]), dict)
        self.assertEqual(type(comment.params["extra"]), dict)

        self.assertEqual(comment.params["x"]["type"][0]["name"], "Number")
        self.assertEqual(comment.params["y"]["type"][0]["name"], "Number")
        self.assertEqual(comment.params["cache"]["type"][0]["name"], "Boolean")
        self.assertEqual(comment.params["extra"]["type"][0]["name"], "String")
        self.assertEqual(comment.params["extra"]["type"][1]["name"], "Array")
        self.assertEqual(comment.params["cache"]["type"][0]["builtin"], True)
        self.assertEqual(comment.params["extra"]["type"][0]["builtin"], True)
        self.assertEqual(comment.params["extra"]["type"][1]["builtin"], True)

        self.assertNotIn("optional", comment.params["x"])
        self.assertNotIn("optional", comment.params["y"])
        self.assertIn("optional", comment.params["cache"])
        self.assertIn("optional", comment.params["extra"])

        self.assertNotIn("default", comment.params["x"])
        self.assertNotIn("default", comment.params["y"])
        self.assertEqual(comment.params["cache"]["default"], "false")
        self.assertNotIn("default", comment.params["extra"])
        
        
        
    def test_doc_params_dynamic(self):

        parsed = self.process('''

        /**
         * {Number} Returns the sum of all given @number {Number...} parameters.
         */

        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]

        self.assertEqual(comment.variant, "doc")

        self.assertEqual(type(comment.params), dict)
        self.assertEqual(type(comment.params["number"]), dict)
        self.assertEqual(comment.params["number"]["type"][0]["name"], "Number")
        self.assertNotIn("optional", comment.params["number"])
        self.assertTrue(comment.params["number"]["dynamic"])
        self.assertNotIn("default", comment.params["number"])
        
        
        
    def test_doc_params_dynamic_default(self):

        parsed = self.process('''

        /**
         * {Number} Returns the sum of all given @number {Number...?0} parameters.
         */

        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]

        self.assertEqual(comment.variant, "doc")

        self.assertEqual(type(comment.params), dict)
        self.assertEqual(type(comment.params["number"]), dict)
        self.assertEqual(comment.params["number"]["type"][0]["name"], "Number")
        self.assertEqual(comment.params["number"]["type"][0]["builtin"], True)
        self.assertTrue(comment.params["number"]["optional"])
        self.assertTrue(comment.params["number"]["dynamic"])
        self.assertEqual(comment.params["number"]["default"], "0")
        
        
        
    def test_doc_params_dynamic_multi(self):

        parsed = self.process('''

        /**
         * {Number} Returns the sum of all given @number {Number|Integer...} parameters.
         */

        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]

        self.assertEqual(comment.variant, "doc")

        self.assertEqual(type(comment.params), dict)
        self.assertEqual(type(comment.params["number"]), dict)
        self.assertEqual(comment.params["number"]["type"][0]["name"], "Number")
        self.assertEqual(comment.params["number"]["type"][1]["name"], "Integer")
        self.assertNotIn("optional", comment.params["number"])
        self.assertTrue(comment.params["number"]["dynamic"])
        self.assertNotIn("default", comment.params["number"])
        
        
        
    def test_doc_params_dynamic_multi_spacey(self):

        parsed = self.process('''

        /**
         * {Number} Returns the sum of all given @number {Number | Integer ... } parameters.
         */

        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]

        self.assertEqual(comment.variant, "doc")

        self.assertEqual(type(comment.params), dict)
        self.assertEqual(type(comment.params["number"]), dict)
        self.assertEqual(comment.params["number"]["type"][0]["name"], "Number")
        self.assertEqual(comment.params["number"]["type"][1]["name"], "Integer")
        self.assertNotIn("optional", comment.params["number"])
        self.assertTrue(comment.params["number"]["dynamic"])
        self.assertNotIn("default", comment.params["number"])       
        
        
        
    def test_doc_params_namespaced(self):

        parsed = self.process('''

        /**
         * {Boolean} Returns whether @x {core.Number} is bigger than @y {core.Number}. The optional @cache {core.Boolean?false} controls whether caching should be enabled.
         * Also see @extra {core.String | core.Array ?} which is normally pretty useless
         */

        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]

        self.assertEqual(comment.variant, "doc")
        self.assertEqual(comment.html, '<p>Returns whether <code class="param">x</code> is bigger than <code class="param">y</code>. The optional <code class="param">cache</code> controls whether caching should be enabled.\nAlso see <code class="param">extra</code> which is normally pretty useless</p>\n')
        self.assertEqual(comment.text, 'Returns whether x is bigger than y. The optional cache controls whether caching should be enabled.\nAlso see extra which is normally pretty useless')

        self.assertEqual(type(comment.params), dict)

        self.assertEqual(type(comment.params["x"]), dict)
        self.assertEqual(type(comment.params["y"]), dict)
        self.assertEqual(type(comment.params["cache"]), dict)
        self.assertEqual(type(comment.params["extra"]), dict)

        self.assertEqual(comment.params["x"]["type"][0]["name"], "core.Number")
        self.assertEqual(comment.params["y"]["type"][0]["name"], "core.Number")
        self.assertEqual(comment.params["cache"]["type"][0]["name"], "core.Boolean")
        self.assertEqual(comment.params["extra"]["type"][0]["name"], "core.String")
        self.assertEqual(comment.params["extra"]["type"][1]["name"], "core.Array")

        self.assertNotIn("optional", comment.params["x"])
        self.assertNotIn("optional", comment.params["y"])
        self.assertEqual(comment.params["cache"]["optional"], True)
        self.assertEqual(comment.params["extra"]["optional"], True)

        self.assertNotIn("default", comment.params["x"])
        self.assertNotIn("default", comment.params["y"])
        self.assertEqual(comment.params["cache"]["default"], "false")
        self.assertNotIn("default", comment.params["extra"])        
        
        
    def test_doc_params_lazytypes(self):

        parsed = self.process('''

        /**
         * {Boolean} Returns whether @x is bigger than @y.
         *
         * Parameters:
         *
         * - @x {Number}
         * - @y {Number}
         * - @cache {Boolean?false}
         * - @extra {String | Array ?}
         */

        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]

        self.assertEqual(comment.variant, "doc")
        self.assertEqual(comment.html, '<p>Returns whether <code class="param">x</code> is bigger than <code class="param">y</code>.</p>\n\n<p>Parameters:</p>\n\n<ul>\n<li><code class="param">x</code></li>\n<li><code class="param">y</code></li>\n<li><code class="param">cache</code></li>\n<li><code class="param">extra</code></li>\n</ul>\n')
        
        self.assertEqual(comment.text, 'Returns whether x is bigger than y.\n\nParameters:\n\n- x\n- y\n- cache\n- extra')
        
        self.assertEqual(type(comment.params), dict)

        self.assertEqual(type(comment.params["x"]), dict)
        self.assertEqual(type(comment.params["y"]), dict)
        self.assertEqual(type(comment.params["cache"]), dict)
        self.assertEqual(type(comment.params["extra"]), dict)

        self.assertEqual(comment.params["x"]["type"][0]["name"], "Number")
        self.assertEqual(comment.params["y"]["type"][0]["name"], "Number")
        self.assertEqual(comment.params["cache"]["type"][0]["name"], "Boolean")
        self.assertEqual(comment.params["extra"]["type"][0]["name"], "String")
        self.assertEqual(comment.params["extra"]["type"][1]["name"], "Array")

        self.assertNotIn("optional", comment.params["x"])
        self.assertNotIn("optional", comment.params["y"])
        self.assertEqual(comment.params["cache"]["optional"], True)
        self.assertEqual(comment.params["extra"]["optional"], True)

        self.assertNotIn("default", comment.params["x"])
        self.assertNotIn("default", comment.params["y"])
        self.assertEqual(comment.params["cache"]["default"], "false")
        self.assertNotIn("default", comment.params["extra"])
        
        
        
    def test_doc_params_firstloose(self):

        parsed = self.process('''

        /**
         * {Boolean} Returns whether @x {String ? 13} is bigger than @y.
         *
         * Parameters:
         *
         * - @x {Number}
         * - @y {Number}
         */

        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]

        self.assertEqual(comment.variant, "doc")
        self.assertEqual(comment.html, '''<p>Returns whether <code class="param">x</code> is bigger than <code class="param">y</code>.</p>\n\n<p>Parameters:</p>\n\n<ul>\n<li><code class="param">x</code></li>\n<li><code class="param">y</code></li>\n</ul>\n''')

        self.assertEqual(type(comment.params), dict)

        self.assertEqual(type(comment.params["x"]), dict)
        self.assertEqual(type(comment.params["y"]), dict)

        self.assertEqual(comment.params["x"]["type"][0]["name"], "Number")
        self.assertEqual(comment.params["y"]["type"][0]["name"], "Number")

        self.assertNotIn("optional", comment.params["x"])
        self.assertNotIn("optional", comment.params["y"])

        self.assertNotIn("default", comment.params["x"])
        self.assertNotIn("default", comment.params["y"])
        
        
    def test_doc_params_firstwin(self):

        parsed = self.process('''

        /**
         * {Boolean} Returns whether @x {Number ? 13} is bigger than @y.
         *
         * Parameters:
         *
         * - @x
         * - @y {Number}
         */

        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]

        self.assertEqual(comment.variant, "doc")
        self.assertEqual(comment.html, '<p>Returns whether <code class="param">x</code> is bigger than <code class="param">y</code>.</p>\n\n<p>Parameters:</p>\n\n<ul>\n<li><code class="param">x</code></li>\n<li><code class="param">y</code></li>\n</ul>\n')

        self.assertEqual(type(comment.params), dict)

        self.assertEqual(type(comment.params["x"]), dict)
        self.assertEqual(type(comment.params["y"]), dict)

        self.assertEqual(comment.params["x"]["type"][0]["name"], "Number")
        self.assertEqual(comment.params["y"]["type"][0]["name"], "Number")

        self.assertTrue(comment.params["x"]["optional"])
        self.assertNotIn("optional", comment.params["y"])

        self.assertEqual(comment.params["x"]["default"], "13")
        self.assertNotIn("default", comment.params["y"])
        
    
    def test_doc_params_maps(self):

        parsed = self.process('''

        /**
         * Additional arguments can be passed in via @options {Object?}:
         *
         * - @options.x {String}
         * - @options.y {Number}
         */

        ''')

        self.assertEqual(parsed.type, "script")
        self.assertEqual(isinstance(parsed.comments, list), True)
        self.assertEqual(len(parsed.comments), 1)

        comment = parsed.comments[0]

        self.assertEqual(comment.variant, "doc")
        self.assertEqual(comment.html, '<p>Additional arguments can be passed in via <code class="param">options</code>:</p>\n\n<ul>\n<li><code class="param">options.x</code></li>\n<li><code class="param">options.y</code></li>\n</ul>\n')

        self.assertEqual(type(comment.params), dict)

        self.assertEqual(type(comment.params["options"]), dict)

        self.assertEqual(type(comment.params["options"]["fields"]), dict)
        self.assertEqual(comment.params["options"]["type"][0]["name"], "Object")

        self.assertEqual(type(comment.params["options"]["fields"]["x"]), dict)
        self.assertEqual(type(comment.params["options"]["fields"]["y"]), dict)

        self.assertEqual(comment.params["options"]["fields"]["x"]["type"][0]["name"], "String")
        self.assertEqual(comment.params["options"]["fields"]["y"]["type"][0]["name"], "Number")

    
    #
    # DOC COMMENTS :: MARKDOWN
    #
    
    def test_doc_markdown_formatting(self):

        parsed = self.process('''

        /**
         * This is some **important** text about *Jasy*.
         */
        docCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "doc")
        self.assertEqual(parsed[0].comments[0].html, "<p>This is some <strong>important</strong> text about <em>Jasy</em>.</p>\n")    
    
    
    def test_doc_markdown_smartypants(self):

        parsed = self.process('''

        /**
         * Text formatting with 'quotes' is pretty nice, too...
         *
         * It possible to use "different styles" here -- to improve clarity.
         *
         * Still it keeps code like `this.foo()` intact.
         *
         * It's also capable of detecting these things: "Joe's Restaurant".
         */
        docCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "doc")
        self.assertEqual(parsed[0].comments[0].html, "<p>Text formatting with &#39;quotes&#39; is pretty nice, too&hellip;</p>\n\n<p>It possible to use &ldquo;different styles&rdquo; here &ndash; to improve clarity.</p>\n\n<p>Still it keeps code like <code>this.foo()</code> intact.</p>\n\n<p>It&#39;s also capable of detecting these things: &ldquo;Joe&#39;s Restaurant&rdquo;.</p>\n")
    
    
    

    #
    # DOC COMMENTS :: CODE
    #

    def test_doc_markdown_code(self):

        parsed = self.process('''

        /**
         * Some code example:
         *
         *     if (this.isEnabled()) {
         *       self.callCommand("reload", true);
         *     }
         */
        docCommentCmd();

        ''')
        
        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "doc")
        self.assertEqual(parsed[0].comments[0].html, '<p>Some code example:</p>\n\n<table class="highlighttable"><tr><td class="linenos"><div class="linenodiv"><pre>1\n2\n3</pre></div></td><td class="code"><div class="highlight"><pre><span class="k">if</span> <span class="p">(</span><span class="k">this</span><span class="p">.</span><span class="nx">isEnabled</span><span class="p">())</span> <span class="p">{</span>\n  <span class="nx">self</span><span class="p">.</span><span class="nx">callCommand</span><span class="p">(</span><span class="o">&amp;</span><span class="nx">quot</span><span class="p">;</span><span class="nx">reload</span><span class="o">&amp;</span><span class="nx">quot</span><span class="p">;,</span> <span class="kc">true</span><span class="p">);</span>\n<span class="p">}</span>\n</pre></div>\n</td></tr></table>\n')
        
        
    def test_doc_markdown_code_single_blockquote(self):

        parsed = self.process('''

        /**
         * Some code example:
         *
         *     self.callCommand("reload", true);
         */
        docCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "doc")
        self.assertEqual(parsed[0].comments[0].html, '<p>Some code example:</p>\n\n<table class="highlighttable"><tr><td class="linenos"><div class="linenodiv"><pre>1</pre></div></td><td class="code"><div class="highlight"><pre><span class="nx">self</span><span class="p">.</span><span class="nx">callCommand</span><span class="p">(</span><span class="o">&amp;</span><span class="nx">quot</span><span class="p">;</span><span class="nx">reload</span><span class="o">&amp;</span><span class="nx">quot</span><span class="p">;,</span> <span class="kc">true</span><span class="p">);</span>\n</pre></div>\n</td></tr></table>\n')    
        
        
    def test_doc_markdown_code_single_inline(self):

        parsed = self.process('''

        /**
         * Some code example: `self.callCommand("reload", true);`
         */
        docCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "doc")
        self.assertEqual(parsed[0].comments[0].html, '<p>Some code example: <code>self.callCommand(&quot;reload&quot;, true);</code></p>\n')            


    def test_doc_markdown_code_html(self):

        parsed = self.process('''

        /**
         * ## HTML example:
         *
         * ```html
         * <title>My Title</title>
         * <link rel="stylesheet" type="text/css" src="style.css"/>
         * <script type="text/javascript">alert("Loaded");</script>
         * ```
         */
        docCommentCmd();

        ''')

        self.assertEqual(parsed[0].type, "semicolon")
        self.assertEqual(isinstance(parsed[0].comments, list), True)
        self.assertEqual(len(parsed[0].comments), 1)

        self.assertEqual(parsed[0].comments[0].variant, "doc")
        self.assertEqual(parsed[0].comments[0].html, '<h2>HTML example:</h2>\n\n<table class="highlighttable"><tr><td class="linenos"><div class="linenodiv"><pre>1\n2\n3</pre></div></td><td class="code"><div class="highlight"><pre><span class="nt">&lt;title&gt;</span>My Title<span class="nt">&lt;/title&gt;</span>\n<span class="nt">&lt;link</span> <span class="na">rel=</span><span class="s">&amp;quot;stylesheet&amp;quot;</span> <span class="na">type=</span><span class="s">&amp;quot;text/css&amp;quot;</span> <span class="na">src=</span><span class="s">&amp;quot;style.css&amp;quot;/</span><span class="nt">&gt;</span>\n<span class="nt">&lt;script </span><span class="na">type=</span><span class="s">&amp;quot;text/javascript&amp;quot;</span><span class="nt">&gt;</span><span class="nx">alert</span><span class="p">(</span><span class="o">&amp;</span><span class="nx">quot</span><span class="p">;</span><span class="nx">Loaded</span><span class="o">&amp;</span><span class="nx">quot</span><span class="p">;);</span><span class="nt">&lt;/script&gt;</span>\n</pre></div>\n</td></tr></table>\n')




if __name__ == '__main__':
    logging.getLogger().setLevel(logging.ERROR)
    suite = unittest.TestLoader().loadTestsFromTestCase(Tests)
    unittest.TextTestRunner(verbosity=2).run(suite)      
    
