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
#    * Sebastian Werner (wpbasti)
#
################################################################################

from js.input import tree

ATOMS = ["string", "number", "identifier"]

SINGLE_LEFT_OPERATORS = ["NOT", "BITNOT", "ADD", "SUB", "INC", "DEC"]

SINGLE_RIGHT_OPERATORS = ["INC", "DEC"]

MULTI_TOKEN_OPERATORS = ["HOOK", "ADD", "SUB", "MUL", "DIV", "MOD", \
    "LT", "LE", "GT", "GE", "EQ", "NE", "SHEQ", "SHNE", \
    "AND", "OR", "BITOR", "BITXOR", "BITAND", "POWEROF", \
    "LSH", "RSH", "URSH"]

MULTI_PROTECTED_OPERATORS = ["INSTANCEOF", "IN"]

ASSIGN_OPERATORS = ["ASSIGN", "ASSIGN_ADD", "ASSIGN_SUB", "ASSIGN_MUL", \
    "ASSIGN_DIV", "ASSIGN_MOD", "ASSIGN_BITOR", "ASSIGN_BITXOR", "ASSIGN_BITAND", \
    "ASSIGN_LSH", "ASSIGN_RSH", "ASSIGN_URSH"]

LOOP_KEYWORDS = ["WHILE", "IF", "FOR", "WITH"]


##
# Represents the tokens of a file as a stream.
#
class TokenStream(object):
    ##
    # Some nice short description of foo(); this can contain html and
    # {@link #foo Links} to items in the current file.
    #
    # @param     tokens   Array of Tokenizer.token that will be represented by
    #                     the new object
    # @return             The new object instance
    # @defreturn          TokenStream
    #
    def __init__ (self, tokens):
        self.tokens = tokens
        self.parsepos = -1

    def curr (self):
        """Returns the current token."""
        return self.tokens[self.parsepos]

    def currType (self):
        return self.curr()["type"]

    def currDetail (self):
        return self.curr()["detail"]

    def currSource (self):
        return self.curr()["source"]

    def currLine (self):
        return self.curr()["line"]

    def currColumn (self):
        return self.curr()["column"]

    def currIsType (self, tokenType, tokenDetail = None):
        if self.currType() != tokenType:
            return False
        else:
            if tokenDetail == None:
                return True
            elif type(tokenDetail) == list:
                return self.currDetail() in tokenDetail
            else:
                return self.currDetail() == tokenDetail

    def expectCurrType (self, tokenType, tokenDetail = None):
        if not self.currIsType(tokenType, tokenDetail):
            expectedDesc = tokenType
            if type(tokenDetail) == str:
                expectedDesc += "/" + tokenDetail
            raiseSyntaxException(self.curr(), expectedDesc)

    def finished (self):
        # NOTE: the last token is end of file
        return self.parsepos >= len(self.tokens) - 1
        
        

    ##
    # Iterator that returns the next token. Also takes special care if the next
    # token is a comment.
    #
    # @param     item     a tree.Node item (might be used to attach comment nodes)
    # @param     after    ??
    # @return             the next (non-comment) token or the EOF token
    # @defreturn          tokenizer.token
    #
    def next (self, item=None, after=False):
        length = len(self.tokens)

        token = None
        while self.parsepos < length - 1:
            self.parsepos += 1

            token = self.tokens[self.parsepos]

            # EOL treatment
            if token["type"] == "eol":
                pass

            # Comment treatment
            elif token["type"] == "comment":
                commentNode = createCommentNode(token)
                if item:
                    item.addChild(commentNode)
                else:
                    print "WARN: Could not handle comment"

            # Code treatment
            else:
                break

        if token == None:
            return self.tokens[length - 1]
        else:
            return token



class SyntaxException (Exception):
    pass



##
# Creates a new item tree node from token
#
def createItemNode(type, stream):
    itemNode = tree.Node(type)
    itemNode.set("line", stream.currLine())
    itemNode.set("column", stream.currColumn())

    return itemNode

##
# Creates a new comment tree node from token
#
def createCommentNode(token):
    commentNode = tree.Node("comment")
    commentNode.set("line", token["line"])
    commentNode.set("column", token["column"])
    commentNode.set("text", token["source"])
    commentNode.set("detail", token["detail"])

    return commentNode



def raiseSyntaxException (token, expectedDesc = None):
    if expectedDesc:
        msg = "Expected " + expectedDesc + " but found "
    else:
        msg = "Unexpected "

    msg += token["type"]

    if token["detail"]:
        msg += "/" + token["detail"]

    msg += ": '" + token["source"] + ", line:" + str(token["line"]) + \
        ", column:" + str(token["column"])

    raise SyntaxException(msg)



##
# Main worker; creates AST from token array
#
# @param     tokenArr array of JavaScript tokens, as generated by tokenizer.py
# @return             tree.Node - the root node of the AST
#
def createSyntaxTree (tokenArr):
    """Creates a syntax tree from a token stream.

    tokens: the token stream."""

    stream = TokenStream(tokenArr)
    stream.next()

    rootBlock = tree.Node("file")

    while not stream.finished():
        rootBlock.addChild(readStatement(stream))

    return rootBlock



def readExpression (stream, **kwargs):
    if not 'inStatementList' in kwargs:
        kwargs['inStatementList'] = True  # this means: allow list expressions .. , ..
    return readStatement(stream, True, **kwargs)



def readStatement (stream, expressionMode = False, overrunSemicolon = True, inStatementList = False):
    item = None

    # print "PROGRESS: %s - %s (%s) [expr=%s]" % (stream.currType(), stream.currDetail(), stream.currLine(), expressionMode)

    if currIsIdentifier(stream, True):
        # statement starts with an identifier
        variable = readVariable(stream, True)
        variable = readObjectOperation(stream, variable)

        if stream.currIsType("punctuator", ASSIGN_OPERATORS):
            # This is an assignment
            item = createItemNode("assignment", stream)
            item.set("operator", stream.currDetail())
            stream.next(item)

            item.addListChild("left", variable)
            item.addListChild("right", readExpression(stream))
        elif stream.currIsType("punctuator", "COLON") and not expressionMode:
            # This is a label
            item = variable
            item.type = "label"
            stream.next(variable)
        else:
            # Something else comes after the variable -> It's a sole variable
            item = variable

    elif stream.currIsType("reserved", "FUNCTION"):
        item = createItemNode("function", stream)
        stream.next(item)

        # Read optional function name
        if stream.currIsType("name") or stream.currIsType("builtin"):
            item.set("name", stream.currSource())
            stream.next(item)

        readParamList(item, stream)
        item.addListChild("body", readBlock(stream))

        # Check for direct execution: function() {}()
        if stream.currIsType("punctuator", "LP"):
            # The function is executed directly
            functionItem = item
            item = createItemNode("call", stream)
            item.addListChild("operand", functionItem)
            readParamList(item, stream)
            item = readObjectOperation(stream, item)
    elif stream.currIsType("reserved", "VOID"):
        item = createItemNode("void", stream)
        item.set("left", True)
        stream.next(item)
        item.addListChild("first", readExpression(stream))
    elif stream.currIsType("punctuator", "LP"):
        igroup = createItemNode("group", stream)
        stream.next(igroup)
        igroup.addChild(readStatement(stream, expressionMode))
        #igroup.addChild(readExpression(stream, ))   # -- should be like this, but it doesn't work!?
        stream.expectCurrType("punctuator", "RP")
        stream.next(igroup, True)
        oper = readObjectOperation(stream, igroup)

        # supports e.g. (this.editor.object || this.editor.iframe).style.marginTop = null;
        if stream.currIsType("punctuator", ASSIGN_OPERATORS):
            # This is an assignment
            item = createItemNode("assignment", stream)
            item.set("operator", stream.currDetail())
            stream.next(item)

            item.addListChild("left", oper)
            item.addListChild("right", readExpression(stream))
        else:
            # Something else comes after the variable -> It's a sole variable
            item = oper

    elif stream.currIsType("string"):
        item = createItemNode("constant", stream)
        item.set("constantType", "string")
        item.set("value", stream.currSource())
        item.set("detail", stream.currDetail())
        stream.next(item, True)
        # This is a member accessor (E.g. "bla.blubb")
        item = readObjectOperation(stream, item)
    elif stream.currIsType("number"):
        item = createItemNode("constant", stream)
        item.set("constantType", "number")
        item.set("value", stream.currSource())
        item.set("detail", stream.currDetail())
        stream.next(item, True)
        # This is a member accessor (E.g. "bla.blubb")
        item = readObjectOperation(stream, item)
    elif stream.currIsType("regexp"):
        item = createItemNode("constant", stream)
        item.set("constantType", "regexp")
        item.set("value", stream.currSource())
        stream.next(item, True)
        # This is a member accessor (E.g. "bla.blubb")
        item = readObjectOperation(stream, item)
    elif expressionMode and (stream.currIsType("reserved", "TRUE") or stream.currIsType("reserved", "FALSE")):
        item = createItemNode("constant", stream)
        item.set("constantType", "boolean")
        item.set("value", stream.currSource())
        stream.next(item, True)
    elif expressionMode and stream.currIsType("reserved", "NULL"):
        item = createItemNode("constant", stream)
        item.set("constantType", "null")
        item.set("value", stream.currSource())
        stream.next(item, True)
    elif expressionMode and stream.currIsType("punctuator", "LC"):
        item = readMap(stream)
        if stream.currIsType("punctuator", "LB") or stream.currIsType("punctuator", "DOT"):  # {...}[] or {...}.___
            item = readObjectOperation(stream, item)
    #elif expressionMode and stream.currIsType("punctuator", "LB"):
    elif stream.currIsType("punctuator", "LB"):
        item = readArray(stream)
        if stream.currIsType("punctuator", "LB"):
            item = readObjectOperation(stream, item)
    elif stream.currIsType("punctuator", SINGLE_LEFT_OPERATORS):
        item = createItemNode("operation", stream)
        item.set("operator", stream.currDetail())
        item.set("left", True)
        stream.next(item)
        item.addListChild("first", readExpression(stream))
    elif stream.currIsType("reserved", "TYPEOF"):
        item = createItemNode("operation", stream)
        item.set("operator", "TYPEOF")
        item.set("left", True)
        stream.next(item)
        item.addListChild("first", readExpression(stream))
    elif stream.currIsType("reserved", "NEW"):
        item = readInstantiation(stream)
        item = readObjectOperation(stream, item)
    elif not expressionMode and stream.currIsType("reserved", "VAR"):
        item = createItemNode("definitionList", stream)
        stream.next(item)
        finished = False
        while not finished:
            if not currIsIdentifier(stream, False):
                raiseSyntaxException(stream.curr(), "identifier")

            childitem = createItemNode("definition", stream)
            childitem.set("identifier", stream.currSource())
            stream.next(childitem)
            if stream.currIsType("punctuator", "ASSIGN"):
                assign = createItemNode("assignment", stream)
                childitem.addChild(assign)
                stream.next(assign)
                assign.addChild(readExpression(stream))

            item.addChild(childitem)

            # Check whether anothe definition follows, e.g. "var a, b=1, c=4"
            if stream.currIsType("punctuator", "COMMA"):
                stream.next(item)
            else:
                finished = True

    elif not expressionMode and stream.currIsType("reserved", LOOP_KEYWORDS):
        item = readLoop(stream)
    elif not expressionMode and stream.currIsType("reserved", "DO"):
        item = readDoWhile(stream)
    elif not expressionMode and stream.currIsType("reserved", "SWITCH"):
        item = readSwitch(stream)
    elif not expressionMode and stream.currIsType("reserved", "TRY"):
        item = readTryCatch(stream)
    elif not expressionMode and stream.currIsType("punctuator", "LC"):
        item = readBlock(stream)
    elif not expressionMode and stream.currIsType("reserved", "RETURN"):
        item = createItemNode("return", stream)
        stream.next(item)
        # NOTE: The expression after the return keyword is optional
        if not stream.currIsType("punctuator", "SEMICOLON") and not stream.currIsType("punctuator", "RC"):
            item.addListChild("expression", readExpression(stream))
    elif not expressionMode and stream.currIsType("reserved", "THROW"):
        item = createItemNode("throw", stream)
        stream.next(item)
        item.addListChild("expression", readExpression(stream))
    elif stream.currIsType("reserved", "DELETE"):
        # this covers both statement and expression context!
        item = createItemNode("delete", stream)
        item.set("left", True)
        stream.next(item)
        item.addListChild("expression", readExpression(stream))
    elif not expressionMode and stream.currIsType("reserved", "BREAK"):
        item = createItemNode("break", stream)
        stream.next(item)
        # NOTE: The label after the break keyword is optional
        if not stream.hadEolBefore() and stream.currIsType("name"):
            item.set("label", stream.currSource())
            # As the label is an attribute, we need to put following comments into after
            # to differenciate between comments before and after the label
            stream.next(item, True)
    elif not expressionMode and stream.currIsType("reserved", "CONTINUE"):
        item = createItemNode("continue", stream)
        stream.next(item)
        # NOTE: The label after the continue keyword is optional
        if not stream.hadEolBefore() and stream.currIsType("name"):
            item.set("label", stream.currSource())
            stream.next(item, True)

    if not item:
        if stream.currIsType("punctuator", "SEMICOLON") and not expressionMode:
            # This is an empty statement
            item = createItemNode("emptyStatement", stream)
            stream.next(item)
        else:
            if expressionMode:
                expectedDesc = "expression"
            else:
                expectedDesc = "statement"
            raiseSyntaxException(stream.curr(), expectedDesc)

    advanced = False # currently unused - I wanted to use this to detect recursive processing, but it somehow doesn't work
    # check whether this is an operation
    if (stream.currIsType("punctuator", MULTI_TOKEN_OPERATORS) 
    or stream.currIsType("reserved", MULTI_PROTECTED_OPERATORS) 
    or (stream.currIsType("punctuator", SINGLE_RIGHT_OPERATORS) and not stream.hadEolBefore())):
        advanced = True
        # its an operation -> We've already parsed the first operand (in item)
        parsedItem = item

        oper = stream.currDetail()

        item = createItemNode("operation", stream)
        item.addListChild("first", parsedItem)
        item.set("operator", oper)
        stream.next(item)

        if oper in MULTI_TOKEN_OPERATORS or oper in MULTI_PROTECTED_OPERATORS:
            # It's a multi operator -> There must be a second argument
            item.addListChild("second", readExpression(stream))
            if oper == "HOOK":
                # It's a "? :" operation -> There must be a third argument
                stream.expectCurrType("punctuator", "COLON")
                stream.next(item)
                item.addListChild("third", readExpression(stream))

        # Deep scan on single right operators e.g. if(i-- > 4)
        if oper in SINGLE_RIGHT_OPERATORS and stream.currIsType("punctuator", MULTI_TOKEN_OPERATORS) and expressionMode:
            paroper = stream.currDetail()

            paritem = createItemNode("operation", stream)
            paritem.addListChild("first", item)
            paritem.set("operator", paroper)
            stream.next(item)

            if paroper in MULTI_TOKEN_OPERATORS or paroper in MULTI_PROTECTED_OPERATORS:
                # It's a multi operator -> There must be a second argument
                paritem.addListChild("second", readExpression(stream))
                if paroper == "HOOK":
                    # It's a "? :" operation -> There must be a third argument
                    stream.expectCurrType("punctuator", "COLON")
                    stream.next(item)
                    paritem.addListChild("third", readExpression(stream))

            # return parent item
            item = paritem



    # check whether this is a combined statement, e.g. "bla(), i++"
    if stream.currIsType("punctuator", "COMMA"):
        advanced = True
        if not inStatementList:  # only create a list node if this is the beginning
            expressionList = createItemNode("expressionList", stream)
            expressionList.addChild(item)
            while stream.currIsType("punctuator", "COMMA"):
                stream.next(expressionList)
                if expressionMode:
                    expressionList.addChild(readStatement(stream, True, False, True))
                else:
                    expressionList.addChild(readStatement(stream, False, False, True))
            item = expressionList

    # go over the optional semicolon
    if  stream.currIsType("punctuator", "SEMICOLON") and not expressionMode and overrunSemicolon:
        advanced = True
        stream.next(item, True)

    #if expressionMode and not advanced: # we have an item but couldn't use the next token in stream
    if expressionMode and stream.currType() in ATOMS : # we have an item but couldn't use the next token in stream
        # must be an invalid expression
        raiseSyntaxException(stream.curr(), "operator or terminator")

    return item



def currIsIdentifier (stream, allowThis):
    det = stream.currDetail()
    return stream.currIsType("name") or stream.currIsType("builtin") \
        or (stream.currIsType("reserved") and allowThis and det == "THIS")



def readVariable (stream, allowArrays):
    # Note: keywords may be used as identifiers, too
    item = createItemNode("variable", stream)

    done = False
    firstIdentifier = True
    while not done:
        if not currIsIdentifier(stream, firstIdentifier):
            raiseSyntaxException(stream.curr(), "identifier")

        identifier = createItemNode("identifier", stream)
        identifier.set("name", stream.currSource())
        stream.next(identifier)

        if allowArrays:
            while stream.currIsType("punctuator", "LB"):
                accessor = createItemNode("accessor", stream)
                stream.next(accessor)
                accessor.addChild(identifier)
                accessor.addListChild("key", readExpression(stream))

                stream.expectCurrType("punctuator", "RB")
                stream.next(accessor, True)

                identifier = accessor

        item.addChild(identifier)

        firstIdentifier = False

        if stream.currIsType("punctuator", "DOT"):
            stream.next(item)
        else:
            done = True

    return item



def readObjectOperation(stream, operand, onlyAllowMemberAccess = False):
    if stream.currIsType("punctuator", "DOT"):
        # This is a member accessor (E.g. "bla.blubb")
        item = createItemNode("accessor", stream)
        stream.next(item)
        item.addListChild("left", operand)

        # special mode for constants which should be assigned to an accessor first
        if operand.type == "constant":
            item.addListChild("right", readVariable(stream, False))
            item = readObjectOperation(stream, item)
        else:
            item.addListChild("right", readObjectOperation(stream, readVariable(stream, False)))

    elif stream.currIsType("punctuator", "LP"):
        # This is a function call (E.g. "bla(...)")
        item = createItemNode("call", stream)
        item.addListChild("operand", operand)
        readParamList(item, stream)
        item = readObjectOperation(stream, item)
    elif stream.currIsType("punctuator", "LB"):
        # This is an array access (E.g. "bla[...]")
        item = createItemNode("accessor", stream)
        stream.next(item)
        item.addListChild("identifier", operand)
        item.addListChild("key", readExpression(stream))

        stream.expectCurrType("punctuator", "RB")
        stream.next(item, True)
        item = readObjectOperation(stream, item)
    else:
        item = operand

    return item



def readParamList (node, stream):
    stream.expectCurrType("punctuator", "LP")

    params = createItemNode("params", stream)
    node.addChild(params)

    stream.next(params)

    firstParam = True
    lastExpr = None
    while not stream.currIsType("punctuator", "RP"):
        if firstParam:
            firstParam = False
        else:
            stream.expectCurrType("punctuator", "COMMA")
            stream.next(lastExpr, True)

        lastExpr = readExpression(stream)
        params.addChild(lastExpr)

    # Has an end defined by the loop above
    # This means that all comments following are after item
    stream.next(params, True)

    return


##
# Parses a block of source code. Most work is delegated to stream.next() and
# readStatement(). Handles opening and closing \"{}\".
#
# @param     stream   TokenStream to parse
# @return             tokenizer.token - next item after the closing \"}\"
#
def readBlock(stream):
    stream.expectCurrType("punctuator", "LC")
    item = createItemNode("block", stream)

    # Iterate through children
    stream.next(item)
    while not stream.currIsType("punctuator", "RC"):
        item.addChild(readStatement(stream))

    # Has an end defined by the loop above
    # This means that all comments following are after item
    stream.next(item, True)

    return item


def readMap(stream):
    stream.expectCurrType("punctuator", "LC")

    item = createItemNode("map", stream)
    stream.next(item)

    # NOTE: We use our own flag for checking whether the array already has entries
    #       and not item.hasChildren(), because item.hasChildren() is also true
    #       when there are comments before the array
    hasEntries = False

    while not stream.currIsType("punctuator", "RC"):
        if hasEntries:
            stream.expectCurrType("punctuator", "COMMA")
            stream.next(item)

        if not currIsIdentifier(stream, True) and not stream.currIsType("string") and not stream.currIsType("number"):
            raiseSyntaxException(stream.curr(), "map key (identifier, string or number)")

        keyvalue = createItemNode("keyvalue", stream)
        keyvalue.set("key", stream.currSource())

        if stream.currIsType("string"):
            keyvalue.set("quote", stream.currDetail())

        stream.next(keyvalue)
        stream.expectCurrType("punctuator", "COLON")
        stream.next(keyvalue, True)
        keyvalue.addListChild("value", readExpression(stream))

        item.addChild(keyvalue)

        hasEntries = True

    # Has an end defined by the loop above
    # This means that all comments following are after item
    stream.next(item, True)

    return item



def readArray(stream):
    stream.expectCurrType("punctuator", "LB")

    item = createItemNode("array", stream)
    stream.next(item)

    # NOTE: We use our own flag for checking whether the array already has entries
    #       and not item.hasChildren(), because item.hasChildren() is also true
    #       when there are comments before the array
    hasEntries = False
    while not stream.currIsType("punctuator", "RB"):
        if hasEntries:
            stream.expectCurrType("punctuator", "COMMA")
            stream.next(item)

        item.addChild(readExpression(stream))
        hasEntries = True

    # Has an end defined by the loop above
    # This means that all comments following are after item
    stream.next(item, True)

    # Support constructs like ["foo", "bar" ].join("")
    item = readObjectOperation(stream, item)

    return item



def readInstantiation(stream):
    stream.expectCurrType("reserved", "NEW")

    item = createItemNode("instantiation", stream)
    stream.next(item)

    # Could be a simple variable or a just-in-time function declaration (closure)
    # Read this as expression
    stmnt = readStatement(stream, True, False, True)
    item.addListChild("expression", stmnt)

    return item



def readLoop(stream):
    stream.expectCurrType("reserved", LOOP_KEYWORDS)

    loopType = stream.currDetail()

    item = createItemNode("loop", stream)
    item.set("loopType", loopType)

    stream.next(item)
    stream.expectCurrType("punctuator", "LP")

    if loopType == "FOR":
        stream.next(item)

        if not stream.currIsType("punctuator", "SEMICOLON"):
            # Read the optional first statement
            first = createItemNode("first", stream)
            item.addChild(first)
            first.addChild(readStatement(stream, expressionMode=False, overrunSemicolon=False))

        if stream.currIsType("punctuator", "SEMICOLON"):
            # It's a for (;;) loop
            item.set("forVariant", "iter")

            stream.next(item)
            if not stream.currIsType("punctuator", "SEMICOLON"):
                # Read the optional second expression
                second = createItemNode("second", stream)
                item.addChild(second)
                second.addChild(readStatement(stream, expressionMode=True, inStatementList=False))

            stream.expectCurrType("punctuator", "SEMICOLON")
            stream.next(item)

            if not stream.currIsType("punctuator", "RP"):
                # Read the optional third statement
                third = createItemNode("third", stream)
                item.addChild(third)
                third.addChild(readStatement(stream, expressionMode=False, overrunSemicolon=False))

        elif stream.currIsType("punctuator", "RP"):
            # It's a for ( in ) loop
            item.set("forVariant", "in")
            pass

        else:
            raiseSyntaxException(stream.curr(), "semicolon or in")

        stream.expectCurrType("punctuator", "RP")

    else:
        expr = createItemNode("expression", stream)
        stream.next(expr)
        expr.addChild(readExpression(stream))
        item.addChild(expr)
        stream.expectCurrType("punctuator", "RP")

    # comments should be already completed from the above code
    stmnt = createItemNode("statement", stream)
    item.addChild(stmnt)
    stream.next()
    stmnt.addChild(readStatement(stream))

    if loopType == "IF" and stream.currIsType("reserved", "ELSE"):
        elseStmnt = createItemNode("elseStatement", stream)
        item.addChild(elseStmnt)
        stream.next(elseStmnt)
        elseStmnt.addChild(readStatement(stream))

    return item



def readDoWhile(stream):
    stream.expectCurrType("reserved", "DO")

    item = createItemNode("loop", stream)
    item.set("loopType", "DO")
    stream.next(item)

    stmnt = createItemNode("statement", stream)
    item.addChild(stmnt)
    stmnt.addChild(readStatement(stream))

    stream.expectCurrType("reserved", "WHILE")
    stream.next(item)

    stream.expectCurrType("punctuator", "LP")

    expr = createItemNode("expression", stream)
    item.addChild(expr)
    stream.next(expr)

    expr.addChild(readExpression(stream))

    stream.expectCurrType("punctuator", "RP")
    stream.next(item, True)

    return item


def readSwitch(stream):
    stream.expectCurrType("reserved", "SWITCH")

    item = createItemNode("switch", stream)
    item.set("switchType", "case")

    stream.next(item)
    stream.expectCurrType("punctuator", "LP")

    expr = createItemNode("expression", stream)
    stream.next(expr)
    item.addChild(expr)
    expr.addChild(readExpression(stream))

    stream.expectCurrType("punctuator", "RP")
    stream.next(expr, True)

    stream.expectCurrType("punctuator", "LC")
    stmnt = createItemNode("statement", stream)
    item.addChild(stmnt)
    stream.next(stmnt)

    while not stream.currIsType("punctuator", "RC"):
        if stream.currIsType("reserved", "CASE"):
            caseItem = createItemNode("case", stream)
            stream.next(caseItem)
            caseItem.addListChild("expression", readExpression(stream))
            stmnt.addChild(caseItem)

            stream.expectCurrType("punctuator", "COLON")
            stream.next(caseItem, True)

        elif stream.currIsType("reserved", "DEFAULT"):
            defaultItem = createItemNode("default", stream)
            stmnt.addChild(defaultItem)
            stream.next(defaultItem)

            stream.expectCurrType("punctuator", "COLON")
            stream.next(defaultItem, True)

        else:
            raiseSyntaxException(stream.curr(), "case or default")

        while not stream.currIsType("punctuator", "RC") and not stream.currIsType("reserved", "CASE") and not stream.currIsType("reserved", "DEFAULT"):
            stmnt.addChild(readStatement(stream))

    stream.next(stmnt, True)

    return item


def readTryCatch(stream):
    stream.expectCurrType("reserved", "TRY")

    item = createItemNode("switch", stream)
    item.set("switchType", "catch")
    stream.next(item)

    item.addListChild("statement", readStatement(stream))

    while stream.currIsType("reserved", "CATCH"):
        catchItem = createItemNode("catch", stream)
        stream.next(catchItem)

        stream.expectCurrType("punctuator", "LP")

        exprItem = createItemNode("expression", stream)
        catchItem.addChild(exprItem)
        stream.next(exprItem)
        exprItem.addChild(readExpression(stream))

        stream.expectCurrType("punctuator", "RP")
        stream.next(exprItem, True)

        stmnt = createItemNode("statement", stream)
        catchItem.addChild(stmnt)
        stmnt.addChild(readStatement(stream))

        item.addChild(catchItem)

    if stream.currIsType("reserved", "FINALLY"):
        finallyItem = createItemNode("finally", stream)
        stream.next(finallyItem)

        stmnt = createItemNode("statement", stream)
        finallyItem.addChild(stmnt)
        stmnt.addChild(readStatement(stream))

        item.addChild(finallyItem)

    return item
