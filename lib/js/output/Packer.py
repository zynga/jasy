#!/usr/bin/env python
################################################################################
#
#  qooxdoo - the new era of web development
#
#  http://qooxdoo.org
#
#  Copyright:
#    2006-2010 1&1 Internet AG, Germany, http://www.1und1.de
#
#  License:
#    LGPL: http://www.gnu.org/licenses/lgpl.html
#    EPL: http://www.eclipse.org/org/documents/epl-v10.php
#    See the LICENSE file in the project's top-level directory for details.
#
#  Authors:
#    * Thomas Herchenroeder (thron7)
#
################################################################################

import sys, string, re
from js.input import lang

class Packer(object):

    symbol_table = {}

    def __init__(self):
        Packer.init_symtab()
        
        

    ##################################################################################
    # CLASS: SYMBOL BASE
    ##################################################################################

    class symbol_base(object):

        @classmethod
        def emit(cls, node):
            str = u""
            if node.type in ["comment", "commentsBefore", "commentsAfter"]:
                return str
            
            n   = None
            
            if node.type in Packer.symbol_table:
                n = Packer.symbol_table[node.type]()
                str += n.opening(node)
            
            if node.hasChildren():
                for child in node.children:
                    str += cls.emit(child)
            if n:
                str += n.closing(node)

            # some other stuff
            if node.hasParent():

                # Add comma dividers between statements in these parents
                if node.parent.type in ["array", "params", "expressionList"]:
                    if not node.isLastChild(True):
                        str += u","
                    else:
                        # close the last child of a file/block-level expressionList with semicolon
                        if node.parent.type == "expressionList" and node.parent.parent.type in ["file", "block"]:
                            str += ";"

                # Semicolon handling
                elif node.type in ["group", "block", "assignment", "call", "operation", "definitionList", "return", "break", "continue", "delete", "accessor", "instantiation", "throw", "variable", "emptyStatement"]:

                    # Default semicolon handling
                    if node.parent.type in ["block", "file"]:
                        str += ";"

                    # Special handling for switch statements
                    elif node.parent.type == "statement" and node.parent.parent.type == "switch" and node.parent.parent.get("switchType") == "case":
                        str += ";"

                    # Special handling for loops (e.g. if) without blocks {}
                    elif (node.parent.type in ["statement", "elseStatement"] and not node.parent.hasChild("block") and node.parent.parent.type == "loop"):
                        str += ";"

            return str

        # tokens -> string
        def opening(self, node):
            raise NotImplementedError("You need to override 'opening' method")

        def closing(self, node):
            raise NotImplementedError("You need to override 'closing' method")





    ##################################################################################
    # SYMBOL BASE
    ##################################################################################

    @staticmethod
    def symbol(id, bp=0):
        try:
            s = Packer.symbol_table[id]
        except KeyError:
            class s(Packer.symbol_base):
                pass
            s.__name__ = "symbol-" + id # for debugging
            s.id = id
            Packer.symbol_table[id] = s
        return s

    # decorator

    @staticmethod
    def method(s):
        assert issubclass(s, Packer.symbol_base)
        def bind(fn):
            setattr(s, fn.__name__, fn)
        return bind




    ##################################################################################
    # GRAMMAR
    ##################################################################################

    @classmethod
    def init_symtab(cls):
        symbol = cls.symbol
        method = cls.method

        symbol("accessor")

        @method(symbol("accessor"))
        def opening(s, node):         # 's' is 'self'
            r = u''
            return r

        @method(symbol("accessor"))
        def closing(s, node):
            r = u''
            if node.hasParent() and node.parent.type == "variable" and not node.isLastChild(True):
                r += "."
            return r


        symbol("array")

        @method(symbol("array"))
        def opening(s, node):
            r = u''
            r += "["
            return r

        @method(symbol("array"))
        def closing(s, node):
            r = u''
            r += "]"
            return r


        symbol("assignment")

        @method(symbol("assignment"))
        def opening(s, node):
            r = u''
            if node.parent.type == "definition":
                r += cls.packOperator(node.get("operator", False))
            return r

        @method(symbol("assignment"))
        def closing(s, node):
            return u""


        symbol("block")

        @method(symbol("block"))
        def opening(s, node):
            return "{"

        @method(symbol("block"))
        def closing(s, node):
            return "}"


        symbol("break")

        @method(symbol("break"))
        def opening(s, node):
            r = "break"
            if node.get("label", False):
                r += node.get("label", False)
            return r

        @method(symbol("break"))
        def closing(s, node):
            return u""


        symbol("call")

        @method(symbol("call"))
        def opening(s, node):
            r = u''
            return r

        @method(symbol("call"))
        def closing(s, node):
            return u""


        symbol("case")

        @method(symbol("case"))
        def opening(s, node):
            r = u''
            r += "case"
            return r

        @method(symbol("case"))
        def closing(s, node):
            return ":"


        symbol("catch")

        @method(symbol("catch"))
        def opening(s, node):
            r = u''
            r += "catch"
            return r

        @method(symbol("catch"))
        def closing(s, node):
            return u""



        symbol("comment")

        @method(symbol("comment"))
        def opening(s, node):
            r = u''
            return r

        @method(symbol("comment"))
        def closing(s, node):
            return u""



        symbol("constant")

        @method(symbol("constant"))
        def opening(s, node):
            r = u''
            if node.get("constantType") == "string":
                if node.get("detail") == "singlequotes":
                    r += "'"
                else:
                    r += '"'
                r += node.get("value")
                if node.get("detail") == "singlequotes":
                    r += "'"
                else:
                    r += '"'
            else:
                r += node.get("value")
            return r

        @method(symbol("constant"))
        def closing(s, node):
            return u""


        #
        # CONTINUE
        #

        symbol("continue")

        @method(symbol("continue"))
        def opening(s, node):
            r = "continue"
            if node.get("label", False):
                r += node.get("label", False)
            return r

        @method(symbol("continue"))
        def closing(s, node):
            return u""


        #
        # DEFAULT
        #

        symbol("default")

        @method(symbol("default"))
        def opening(s, node):
            r = u''
            r += "default"
            r += ":"
            return r

        @method(symbol("default"))
        def closing(s, node):
            return u""


        symbol("definition")

        @method(symbol("definition"))
        def opening(s, node):
            r = u''
            if node.parent.type != "definitionList":
                r += "var"
            r += node.get("identifier")
            return r

        @method(symbol("definition"))
        def closing(s, node):
            r = u''
            if node.hasParent() and node.parent.type == "definitionList" and not node.isLastChild(True):
                r += ","
            return r


        symbol("definitionList")

        @method(symbol("definitionList"))
        def opening(s, node):
            r = "var"
            return r

        @method(symbol("definitionList"))
        def closing(s, node):
            return u""


        symbol("delete")

        @method(symbol("delete"))
        def opening(s, node):
            r = "delete"
            return r

        @method(symbol("delete"))
        def closing(s, node):
            return u""


        symbol("elseStatement")

        @method(symbol("elseStatement"))
        def opening(s, node):
            r = u''
            r += "else"

            # This is a elseStatement without a block around (a set of {})
            if not node.hasChild("block"):
                r += u" "
            return r

        @method(symbol("elseStatement"))
        def closing(s, node):
            return u""


        symbol("emptyStatement")

        @method(symbol("emptyStatement"))
        def opening(s, node):
            r = u''
            return r

        @method(symbol("emptyStatement"))
        def closing(s, node):
            return u""


        symbol("expression")

        @method(symbol("expression"))
        def opening(s, node):
            r = u''
            if node.parent.type == "loop":
                loopType = node.parent.get("loopType")

                # only do-while loops
                if loopType == "DO":
                    r += "while"

                # open expression block of IF/WHILE/DO-WHILE/FOR statements
                r += "("

            elif node.parent.type == "catch":
                # open expression block of CATCH statement
                r += "("

            elif node.parent.type == "switch" and node.parent.get("switchType") == "case":
                # open expression block of SWITCH statement
                r += "("
            return r

        @method(symbol("expression"))
        def closing(s, node):
            r = u''
            if node.parent.type == "loop":
                r += ")"

                # e.g. a if-construct without a block {}
                if node.parent.getChild("statement").hasChild("block"):
                    pass

                elif node.parent.getChild("statement").hasChild("emptyStatement"):
                    pass

                elif node.parent.type == "loop" and node.parent.get("loopType") == "DO":
                    pass

            elif node.parent.type == "catch":
                r += ")"

            elif node.parent.type == "switch" and node.parent.get("switchType") == "case":
                r += ")"

                r += "{"
            return r


        symbol("file")

        @method(symbol("file"))
        def opening(s, node):
            return u''

        @method(symbol("file"))
        def closing(s, node):
            return u''


        symbol("finally")

        @method(symbol("finally"))
        def opening(s, node):
            return "finally"

        @method(symbol("finally"))
        def closing(s, node):
            return u""


        symbol("first")

        @method(symbol("first"))
        def opening(s, node):
            r = u''
            # for loop
            if node.parent.type == "loop" and node.parent.get("loopType") == "FOR":
                r += "("

            # operation
            elif node.parent.type == "operation":
                # operation (var a = -1)
                if node.parent.get("left", False) == True:
                    r += cls.packOperator(node.parent.get("operator"))
            return r

        @method(symbol("first"))
        def closing(s, node):
            r = u''
            # for loop
            if node.parent.type == "loop" and node.parent.get("loopType") == "FOR":
                if node.parent.get("forVariant") == "iter":
                    r += ";"

            # operation
            elif node.parent.type == "operation" and node.parent.get("left", False) != True:
                r += cls.packOperator(node.parent.get("operator"))
            return r


        symbol("function")

        @method(symbol("function"))
        def opening(s, node):
            r = "function"
            functionName = node.get("name", False)
            if functionName != None:
                r += functionName
            return r

        @method(symbol("function"))
        def closing(s, node):
            return u""


        symbol("group")

        @method(symbol("group"))
        def opening(s, node):
            return "("

        @method(symbol("group"))
        def closing(s, node):
            r = u''
            r += ")"
            return r


        symbol("identifier")

        @method(symbol("identifier"))
        def opening(s, node):
            name = node.get("name", False)
            if name != None:
                return name
            return u""

        @method(symbol("identifier"))
        def closing(s, node):
            r = u''
            if node.hasParent() and node.parent.type == "variable" and not node.isLastChild(True):
                r += "."
            elif node.hasParent() and node.parent.type == "label":
                r += ":"
            return r


        symbol("instantiation")

        @method(symbol("instantiation"))
        def opening(s, node):
            r = "new"
            return r


        @method(symbol("instantiation"))
        def closing(s, node):
            return u""


        symbol("key")

        @method(symbol("key"))
        def opening(s, node):
            r = u''
            if node.parent.type == "accessor":
                r += "["
            return r

        @method(symbol("key"))
        def closing(s, node):
            r = u''
            if node.hasParent() and node.parent.type == "accessor":
                r += "]"
            return r


        symbol("keyvalue")

        @method(symbol("keyvalue"))
        def opening(s, node):
            r = u''
            keyString = node.get("key")
            keyQuote = node.get("quote", False)

            if keyQuote != None:
                # print "USE QUOTATION"
                if keyQuote == "doublequotes":
                    keyString = '"' + keyString + '"'
                else:
                    keyString = "'" + keyString + "'"

            r += keyString
            r += ":"
            return r

        @method(symbol("keyvalue"))
        def closing(s, node):
            r = u''
            if node.hasParent() and node.parent.type == "map" and not node.isLastChild(True):
                r += ","
            return r



        symbol("left")

        @method(symbol("left"))
        def opening(s, node):
            r = u''
            return r

        @method(symbol("left"))
        def closing(s, node):
            r = u''
            if node.hasParent() and node.parent.type == "assignment":
                r += cls.packOperator(node.parent.get("operator", False))
            return r


        symbol("loop")

        @method(symbol("loop"))
        def opening(s, node):
            r = u''
            # Additional new line before each loop
            if not node.isFirstChild(True) and not node.getChild("commentsBefore", False):
                prev = node.getPreviousSibling(False, True)

            loopType = node.get("loopType")

            if loopType == "IF":
                r += "if"

            elif loopType == "WHILE":
                r += "while"

            elif loopType == "FOR":
                r += "for"

            elif loopType == "DO":
                r += "do"

            elif loopType == "WITH":
                r += "with"

            else:
                print "Warning: Unknown loop type: %s" % loopType

            return r

        @method(symbol("loop"))
        def closing(s, node):
            r = u''
            if node.get("loopType") == "DO":
                r += ";"
            return r


        symbol("map")

        @method(symbol("map"))
        def opening(s, node):
            r = u''
            r += "{"
            return r

        @method(symbol("map"))
        def closing(s, node):
            return "}"


        symbol("operand")

        @method(symbol("operand"))
        def opening(s, node):
            return u""

        @method(symbol("operand"))
        def closing(s, node):
            return u""


        symbol("operation")

        @method(symbol("operation"))
        def opening(s, node):
            r = u''
            return r

        @method(symbol("operation"))
        def closing(s, node):
            return u""


        symbol("params")

        @method(symbol("params"))
        def opening(s, node):
            r = u''
            r += "("
            return r

        @method(symbol("params"))
        def closing(s, node):
            return ")"


        symbol("return")

        @method(symbol("return"))
        def opening(s, node):
            r = "return"
            if node.hasChildren():
                r += u" "
            return r

        @method(symbol("return"))
        def closing(s, node):
            return u""


        symbol("right")

        @method(symbol("right"))
        def opening(s, node):
            r = u''
            if node.parent.type == "accessor":
                r += "."
            return r

        @method(symbol("right"))
        def closing(s, node):
            return u""


        symbol("second")

        @method(symbol("second"))
        def opening(s, node):
            r = u''
            # for loop
            if node.parent.type == "loop" and node.parent.get("loopType") == "FOR":
                if not node.parent.hasChild("first"):
                    r += "(;"

            return r

        @method(symbol("second"))
        def closing(s, node):
            r = u''
            # for loop
            if node.parent.type == "loop" and node.parent.get("loopType") == "FOR":
                r += ";"

            # operation
            elif node.parent.type == "operation":
                # (?: hook operation)
                if node.parent.get("operator") == "HOOK":
                    r += ":"
            return r


        symbol("statement")

        @method(symbol("statement"))
        def opening(s, node):
            r = u''
            # for loop
            if node.parent.type == "loop" and node.parent.get("loopType") == "FOR":
                if node.parent.get("forVariant") == "iter":
                    if not node.parent.hasChild("first") and not node.parent.hasChild("second") and not node.parent.hasChild("third"):
                        r += "(;;";

                    elif not node.parent.hasChild("second") and not node.parent.hasChild("third"):
                        r += ";"

                r += ")"
            return r

        @method(symbol("statement"))
        def closing(s, node):
            return u""


        symbol("switch")

        @method(symbol("switch"))
        def opening(s, node):
            r = u''
            # Additional new line before each switch/try
            if not node.isFirstChild(True) and not node.getChild("commentsBefore", False):
                prev = node.getPreviousSibling(False, True)
                # No separation after case statements
                if prev != None and prev.type in ["case", "default"]:
                    pass
            if node.get("switchType") == "catch":
                r += "try"
            elif node.get("switchType") == "case":
                r += "switch"
            return r

        @method(symbol("switch"))
        def closing(s, node):
            r = u''
            if node.get("switchType") == "case":
                r += "}"
            return r


        symbol("third")

        @method(symbol("third"))
        def opening(s, node):
            r = u''
            # for loop
            if node.parent.type == "loop" and node.parent.get("loopType") == "FOR":
                if not node.parent.hasChild("second"):
                    if node.parent.hasChild("first"):
                        r += ";"
                    else:
                        r += "(;;"

            # operation
            elif node.parent.type == "operation":
                pass
            return r

        @method(symbol("third"))
        def closing(s, node):
            return u""


        symbol("throw")

        @method(symbol("throw"))
        def opening(s, node):
            r = "throw"
            return r


        @method(symbol("throw"))
        def closing(s, node):
            return u""


        symbol("variable")

        @method(symbol("variable"))
        def opening(s, node):
            r = u''
            return r

        @method(symbol("variable"))
        def closing(s, node):
            return u""


        symbol("void")

        @method(symbol("void"))
        def opening(s, node):
            r = u''
            r += "void"
            r += "("
            return r

        @method(symbol("void"))
        def closing(s, node):
            r = u''
            r += ")"
            return r




    # --------------------------------------------------------------------------
    # -- Helper for symbol methods ---------------------------------------------
    # --------------------------------------------------------------------------


    @staticmethod
    def packOperator(name):
        s = u''

        if name == None:
            s += "="

        elif name in ["TYPEOF", "INSTANCEOF", "IN"]:
            if name in ["INSTANCEOF", "IN"]:
                s += u" "            
            
            s += name.lower()

        else:
            for key in lang.TOKENS:
                if lang.TOKENS[key] == name:
                    s += key

        if name in ["TYPEOF", "INSTANCEOF", "IN"]:
            s += u" "

        return s


    @staticmethod
    def pack(node):
        return Packer.symbol_base.emit(node)


