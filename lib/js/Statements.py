# ***** BEGIN LICENSE BLOCK *****
# Version: MPL 1.1/GPL 2.0/LGPL 2.1
#
# The contents of this file are subject to the Mozilla Public License Version
# 1.1 (the "License"); you may not use this file except in compliance with
# the License. You may obtain a copy of the License at
# http://www.mozilla.org/MPL/
#
# Software distributed under the License is distributed on an "AS IS" basis,
# WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
# for the specific language governing rights and limitations under the
# License.
#
# The Original Code is the Narcissus JavaScript engine, written in Javascript.
#
# The Initial Developer of the Original Code is
# Brendan Eich <brendan@mozilla.org>.
# Portions created by the Initial Developer are Copyright (C) 2004
# the Initial Developer. All Rights Reserved.
#
# The Python version of the code was created by JT Olds <jtolds@xnet5.com>,
# and is a direct translation from the Javascript version.
#
# Alternatively, the contents of this file may be used under the terms of
# either the GNU General Public License Version 2 or later (the "GPL"), or
# the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
# in which case the provisions of the GPL or the LGPL are applicable instead
# of those above. If you wish to allow use of your version of this file only
# under the terms of either the GPL or the LGPL, and not to allow others to
# use your version of this file under the terms of the MPL, indicate your
# decision by deleting the provisions above and replace them with the notice
# and other provisions required by the GPL or the LGPL. If you do not delete
# the provisions above, a recipient may use your version of this file under
# the terms of any one of the MPL, the GPL or the LGPL.
#
# ***** END LICENSE BLOCK ***** */

"""
 PyNarcissus

 A lexical scanner and parser. JS implemented in JS, ported to Python.
"""

from js.Node import Node
from js.Lang import *
from js.Tokenizer import Token

DECLARED_FORM = 0
EXPRESSED_FORM = 1
STATEMENT_FORM = 2


class SyntaxError(Exception):
    def __init__(self, message, tokenizer):
        Exception.__init__(self, "Syntax error: %s\n%s:%s" % (message, tokenizer.filename, tokenizer.lineno))


# Used as a status container during tree-building for every function body and the global body
class CompilerContext(object):
    def __init__(self, inFunction):
        #######################
        # PUBLIC
        #######################

        # collect all functions and variables which are declared inside this context
        self.functions = []
        self.variables = []

        #######################
        # PRIVATE
        #######################

        # Whether this is inside a function, mostly true, only for top-level scope it's false
        self.inFunction = inFunction
        
        # 
        self.statementStack = []

        #
        self.bracketLevel = 0
        self.curlyLevel = 0
        self.parenLevel = 0
        self.hookLevel = 0
        
        # Configure strict ecmascript mode
        self.ecmaStrictMode = False
        
        # Status flag during parsing
        self.inForLoopInit = False


# This produces the root node of each file, basically a modified block node
def Script(tokenizer, compilerContext):
    node = Statements(tokenizer, compilerContext)
    
    # change type from "block" to "script" for script root
    node.type = "script"

    # copy over context declarations into script node
    node.functions = compilerContext.functions
    node.variables = compilerContext.variables

    return node
    

# Processed all statements of a block
def Statements(tokenizer, compilerContext):
    node = Node(tokenizer, "block")
    compilerContext.statementStack.append(node)

    # Process children until reaching end
    while not tokenizer.done and tokenizer.peek() != "right_curly":
        node.append(Statement(tokenizer, compilerContext))

    compilerContext.statementStack.pop()
    return node


# Returns the block node
def Block(tokenizer, compilerContext):
    tokenizer.mustMatch("left_curly")
    node = Statements(tokenizer, compilerContext)
    tokenizer.mustMatch("right_curly")
    return node


# Statement stack and nested statement handler
def nest(tokenizer, compilerContext, node, func, end=None):
    compilerContext.statementStack.append(node)
    node = func(tokenizer, compilerContext)
    compilerContext.statementStack.pop()
    
    if end: 
        tokenizer.mustMatch(end)
    
    return node    


def Statement(tokenizer, compilerContext):
    tokenType = tokenizer.get()

    # Cases for statements ending in a right curly return early, avoiding the
    # common semicolon insertion magic after this switch.
    if tokenType == "function":
        if len(compilerContext.statementStack) > 1:
            type = STATEMENT_FORM
        else:
            type = DECLARED_FORM
        return FunctionDefinition(tokenizer, compilerContext, True, type)

    elif tokenType == "left_curly":
        node = Statements(tokenizer, compilerContext)
        tokenizer.mustMatch("right_curly")
        return node

    elif tokenType == "if":
        node = Node(tokenizer)
        node.condition = ParenExpression(tokenizer, compilerContext)
        compilerContext.statementStack.append(node)
        node.thenPart = Statement(tokenizer, compilerContext)
        if tokenizer.match("else"):
            node.elsePart = Statement(tokenizer, compilerContext)
        else:
            node.elsePart = None
        compilerContext.statementStack.pop()
        return node

    elif tokenType == "switch":
        node = Node(tokenizer)
        tokenizer.mustMatch("left_paran")
        node.discriminant = Expression(tokenizer, compilerContext)
        tokenizer.mustMatch("right_paran")
        node.cases = []
        node.defaultIndex = -1
        compilerContext.statementStack.append(node)
        tokenizer.mustMatch("left_curly")
        while True:
            tokenType = tokenizer.get()
            if tokenType == "right_curly": break

            if tokenType in ("default", "case"):
                if tokenType == "default" and node.defaultIndex >= 0:
                    raise SyntaxError("More than one switch default", tokenizer)
                n2 = Node(tokenizer)
                if tokenType == "default":
                    node.defaultIndex = len(node.cases)
                else:
                    n2.caseLabel = Expression(tokenizer, compilerContext, "colon")
            else:
                raise SyntaxError("Invalid switch case", tokenizer)
            tokenizer.mustMatch("colon")
            n2.statements = Node(tokenizer, "block")
            while True:
                tokenType = tokenizer.peek()
                if(tokenType == "case" or tokenType == "default" or tokenType == "right_curly"): break
                n2.statements.append(Statement(tokenizer, compilerContext))
            node.cases.append(n2)
        compilerContext.statementStack.pop()
        return node

    elif tokenType == "for":
        node = Node(tokenizer)
        n2 = None
        node.isLoop = True
        tokenizer.mustMatch("left_paran")
        tokenType = tokenizer.peek()
        if tokenType != "semicolon":
            compilerContext.inForLoopInit = True
            if tokenType == "var" or tokenType == "const":
                tokenizer.get()
                n2 = Variables(tokenizer, compilerContext)
            else:
                n2 = Expression(tokenizer, compilerContext)
            compilerContext.inForLoopInit = False

        if n2 and tokenizer.match("in"):
            node.type = "for_in"
            if n2.type == "var":
                if len(n2) != 1:
                    raise SyntaxError("Invalid for..in left-hand side",
                            tokenizer.filename, n2.lineno)

                # NB: n2[0].type == INDENTIFIER and n2[0].value == n2[0].name
                node.iterator = n2[0]
                node.varDecl = n2
            else:
                node.iterator = n2
                node.varDecl = None
            node.object = Expression(tokenizer, compilerContext)
        else:
            if n2:
                node.setup = n2
            else:
                node.setup = None
                
            tokenizer.mustMatch("semicolon")
            
            if tokenizer.peek() == "semicolon":
                node.condition = None
            else:
                node.condition = Expression(tokenizer, compilerContext)
                
            tokenizer.mustMatch("semicolon")
            
            if tokenizer.peek() == "right_paran":
                node.update = None
            else:
                node.update = Expression(tokenizer, compilerContext)
                
        tokenizer.mustMatch("right_paran")
        node.body = nest(tokenizer, compilerContext, node, Statement)
        return node

    elif tokenType == "while":
        node = Node(tokenizer)
        node.isLoop = True
        node.condition = ParenExpression(tokenizer, compilerContext)
        node.body = nest(tokenizer, compilerContext, node, Statement)
        return node

    elif tokenType == "do":
        node = Node(tokenizer)
        node.isLoop = True
        node.body = nest(tokenizer, compilerContext, node, Statement, "while")
        node.condition = ParenExpression(tokenizer, compilerContext)
        if not compilerContext.ecmaStrictMode:
            # <script language="JavaScript"> (without version hints) may need
            # automatic semicolon insertion without a newline after do-while.
            # See http://bugzilla.mozilla.org/show_bug.cgi?id=238945.
            tokenizer.match("semicolon")
            return node

    elif tokenType in ("break", "continue"):
        node = Node(tokenizer)
        if tokenizer.peekOnSameLine() == "identifier":
            tokenizer.get()
            node.label = tokenizer.token.value
        ss = compilerContext.statementStack
        i = len(ss)
        label = getattr(node, "label", None)
        if label:
            while True:
                i -= 1
                if i < 0:
                    raise SyntaxError("Label not found", tokenizer)
                if getattr(ss[i], "label", None) == label: break
        else:
            while True:
                i -= 1
                if i < 0:
                    if tokenType == "break":
                        raise SyntaxError("Invalid break", tokenizer)
                    else:
                        raise SyntaxError("Invalid continue", tokenizer)
                if (getattr(ss[i], "isLoop", None) or (tokenType == "break" and ss[i].type == "switch")):
                    break
        node.target = ss[i]

    elif tokenType == "try":
        node = Node(tokenizer)
        node.tryBlock = Block(tokenizer, compilerContext)
        node.catchClauses = []
        while tokenizer.match("catch"):
            n2 = Node(tokenizer)
            tokenizer.mustMatch("left_paran")
            n2.varName = tokenizer.mustMatch("identifier").value
            if tokenizer.match("if"):
                if compilerContext.ecmaStrictMode:
                    raise SyntaxError("Illegal catch guard", tokenizer)
                if node.catchClauses and not node.catchClauses[-1].guard:
                    raise SyntaxError("Guarded catch after unguarded", tokenizer)
                n2.guard = Expression(tokenizer, compilerContext)
            else:
                n2.guard = None
            tokenizer.mustMatch("right_paran")
            n2.block = Block(tokenizer, compilerContext)
            node.catchClauses.append(n2)
        if tokenizer.match("finally"):
            node.finallyBlock = Block(tokenizer, compilerContext)
        if not node.catchClauses and not getattr(node, "finallyBlock", None):
            raise SyntaxError("Invalid try statement", tokenizer)
        return node

    elif tokenType in ("catch", "finally"):
        raise SyntaxError(tokens[tokenType] + " without preceding try", tokenizer)

    elif tokenType == "throw":
        node = Node(tokenizer)
        node.exception = Expression(tokenizer, compilerContext)

    elif tokenType == "return":
        if not compilerContext.inFunction:
            raise SyntaxError("Invalid return", tokenizer)
        node = Node(tokenizer)
        tokenType = tokenizer.peekOnSameLine()
        if tokenType not in ("end", "newline", "semicolon", "right_curly"):
            node.value = Expression(tokenizer, compilerContext)

    elif tokenType == "with":
        node = Node(tokenizer)
        node.object = ParenExpression(tokenizer, compilerContext)
        node.body = nest(tokenizer, compilerContext, node, Statement)
        return node

    elif tokenType in ("var", "const"):
        node = Variables(tokenizer, compilerContext)

    elif tokenType == "debugger":
        node = Node(tokenizer)

    elif tokenType in ("newline", "semicolon"):
        node = Node(tokenizer, "semicolon")
        node.expression = None
        return node

    else:
        if tokenType == "identifier":
            tokenizer.scanOperand = False
            tokenType = tokenizer.peek()
            tokenizer.scanOperand = True
            if tokenType == "colon":
                label = tokenizer.token.value
                ss = compilerContext.statementStack
                i = len(ss) - 1
                while i >= 0:
                    if getattr(ss[i], "label", None) == label:
                        raise SyntaxError("Duplicate label", tokenizer)
                    i -= 1
                tokenizer.get()
                node = Node(tokenizer, "label")
                node.label = label
                node.statement = nest(tokenizer, compilerContext, node, Statement)
                return node

        node = Node(tokenizer, "semicolon")
        tokenizer.unget()
        node.expression = Expression(tokenizer, compilerContext)
        node.end = node.expression.end

    if tokenizer.lineno == tokenizer.token.lineno:
        tokenType = tokenizer.peekOnSameLine()
        if tokenType not in ("end", "newline", "semicolon", "right_curly"):
            raise SyntaxError("Missing ; before statement", tokenizer)
    tokenizer.match("semicolon")
    return node


# Process a function declaration
def FunctionDefinition(tokenizer, compilerContext, requireName, functionForm):
    f = Node(tokenizer)
    if f.type != "function":
        if f.value == "get":
            f.type = "getter"
        else:
            f.type = "setter"
    if tokenizer.match("identifier"):
        f.name = tokenizer.token.value
    elif requireName:
        raise SyntaxError("Missing function identifier", tokenizer)

    tokenizer.mustMatch("left_paran")
    f.params = []
    while True:
        tokenType = tokenizer.get()
        if tokenType == "right_paran": break
        if tokenType != "identifier":
            raise SyntaxError("Missing formal parameter", tokenizer)
        f.params.append(tokenizer.token.value)
        if tokenizer.peek() != "right_paran":
            tokenizer.mustMatch("comma")

    tokenizer.mustMatch("left_curly")
    x2 = CompilerContext(True)
    f.body = Script(tokenizer, x2)
    tokenizer.mustMatch("right_curly")
    f.end = tokenizer.token.end

    f.functionForm = functionForm
    if functionForm == DECLARED_FORM:
        compilerContext.functions.append(f)
    return f


# Processes a variable block
def Variables(tokenizer, compilerContext):
    node = Node(tokenizer)
    while True:
        tokenizer.mustMatch("identifier")
        n2 = Node(tokenizer)
        n2.name = n2.value
        
        if tokenizer.match("assign"):
            if tokenizer.token.assignOp:
                raise SyntaxError("Invalid variable initialization", tokenizer)
            n2.initializer = Expression(tokenizer, compilerContext, "comma")
            
        n2.readOnly = not not (node.type == "const")
        
        node.append(n2)
        compilerContext.variables.append(n2)
        if not tokenizer.match("comma"): break
    return node


# ???
def ParenExpression(tokenizer, compilerContext):
    tokenizer.mustMatch("left_paran")
    node = Expression(tokenizer, compilerContext)
    tokenizer.mustMatch("right_paran")
    return node


opPrecedence = {
    "semicolon": 0,
    "comma": 1,
    "assign": 2, "hook": 2, "colon": 2,
    # the above all have to have the same precedence, see bug 330975.
    "or": 4,
    "and": 5,
    "bitwise_or": 6,
    "bitwise_xor": 7,
    "bitwise_and": 8,
    "eq": 9, "ne": 9, "strict_eq": 9, "strict_ne": 9,
    "lt": 10, "le": 10, "ge": 10, "gt": 10, "in": 10, "instanceof": 10,
    "lsh": 11, "rsh": 11, "ursh": 11,
    "plus": 12, "minus": 12,
    "mul": 13, "div": 13, "mod": 13,
    "delete": 14, "void": 14, "typeof": 14,
    # "pre_increment": 14, "pre_decrement": 14,
    "not": 14, "bitwise_not": 14, "unary_plus": 14, "unary_minus": 14,
    "increment": 15, "decrement": 15,     # postfix
    "new": 16,
    "dot": 17
}

# Map operator type code to precedence
#for i in opPrecedence.copy():
#    opPrecedence[globals()[i]] = opPrecedence[i]



opArity = {
    "comma": -2,
    "assign": 2,
    "hook": 3,
    "or": 2,
    "and": 2,
    "bitwise_or": 2,
    "bitwise_xor": 2,
    "bitwise_and": 2,
    "eq": 2, "ne": 2, "strict_eq": 2, "strict_ne": 2,
    "lt": 2, "le": 2, "ge": 2, "gt": 2, "in": 2, "instanceof": 2,
    "lsh": 2, "rsh": 2, "ursh": 2,
    "plus": 2, "minus": 2,
    "mul": 2, "div": 2, "mod": 2,
    "delete": 1, "void": 1, "typeof": 1,
    # "pre_increment": 1, "pre_decrement": 1,
    "not": 1, "bitwise_not": 1, "unary_plus": 1, "unary_minus": 1,
    "increment": 1, "decrement": 1,     # postfix
    "new": 1, "new_with_args": 2, "dot": 2, "index": 2, "call": 2,
    "array_init": 1, "object_init": 1, "group": 1
}

# Map operator type code to arity.
#for i in opArity.copy():
#    opArity[globals()[i]] = opArity[i]
    
    
def Expression(tokenizer, compilerContext, stop=None):
    operators = []
    operands = []
    bl = compilerContext.bracketLevel
    cl = compilerContext.curlyLevel
    pl = compilerContext.parenLevel
    hl = compilerContext.hookLevel

    def reduce_():
        node = operators.pop()
        op = node.type
        arity = opArity[op]
        if arity == -2:
            # Flatten left-associative trees.
            left = (len(operands) >= 2 and operands[-2])
            if left.type == op:
                right = operands.pop()
                left.append(right)
                return left
            arity = 2

        # Always use append to add operands to node, to update start and end.
        a = operands[-arity:]
        del operands[-arity:]
        for operand in a:
            node.append(operand)

        # Include closing bracket or postfix operator in [start,end).
        if node.end < tokenizer.token.end:
            node.end = tokenizer.token.end

        operands.append(node)
        return node

    class BreakOutOfLoops(Exception): 
        pass
        
    try:
        while True:
            tokenType = tokenizer.get()
            if tokenType == "end": break
            if (tokenType == stop and compilerContext.bracketLevel == bl and compilerContext.curlyLevel == cl and compilerContext.parenLevel == pl and compilerContext.hookLevel == hl):
                # Stop only if tokenType matches the optional stop parameter, and that
                # token is not quoted by some kind of bracket.
                break
                
            if tokenType == "semicolon":
                # NB: cannot be empty, Statement handled that.
                raise BreakOutOfLoops

            elif tokenType in ("assign", "hook", "colon"):
                if tokenizer.scanOperand:
                    raise BreakOutOfLoops
                while ((operators and opPrecedence.get(operators[-1].type, None) > opPrecedence.get(tokenType)) or (tokenType == "colon" and operators and operators[-1].type == "assign")):
                    reduce_()
                if tokenType == "colon":
                    if operators:
                        node = operators[-1]
                    if not operators or node.type != "hook":
                        raise SyntaxError("Invalid label", tokenizer)
                    compilerContext.hookLevel -= 1
                else:
                    operators.append(Node(tokenizer))
                    if tokenType == "assign":
                        operands[-1].assignOp = tokenizer.token.assignOp
                    else:
                        compilerContext.hookLevel += 1

                tokenizer.scanOperand = True

            elif tokenType in ("in", "comma", "or", "and", "bitwise_or", "bitwise_xor", "bitwise_and", "eq", "ne", 
                "strict_eq", "strict_ne", "lt", "le", "ge", "gt", "instanceof", "lsh", "rsh", "ursh", "plus", "minus", "mul", "div", "mod", "dot"):
                
                # We're treating comma as left-associative so reduce can fold
                # left-heavy comma trees into a single array.
                if tokenType == "in":
                    # An in operator should not be parsed if we're parsing the
                    # head of a for (...) loop, unless it is in the then part of
                    # a conditional expression, or parenthesized somehow.
                    if (compilerContext.inForLoopInit and not compilerContext.hookLevel and not compilerContext.bracketLevel and not compilerContext.curlyLevel and not compilerContext.parenLevel):
                        raise BreakOutOfLoops
                if tokenizer.scanOperand:
                    raise BreakOutOfLoops
                while (operators and opPrecedence.get(operators[-1].type) >= opPrecedence.get(tokenType)):
                    reduce_()
                if tokenType == "dot":
                    tokenizer.mustMatch("identifier")
                    operands.append(Node(tokenizer, "dot", [operands.pop(), Node(tokenizer)]))
                else:
                    operators.append(Node(tokenizer))
                    tokenizer.scanOperand = True

            elif tokenType in ("delete", "void", "typeof", "not", "bitwise_not", "unary_plus", "unary_minus", "new"):
                if not tokenizer.scanOperand:
                    raise BreakOutOfLoops
                operators.append(Node(tokenizer))

            elif tokenType in ("increment", "decrement"):
                if tokenizer.scanOperand:
                    operators.append(Node(tokenizer)) # prefix increment or decrement
                else:
                    # Don't cross a line boundary for postfix {in,de}crement.
                    if (tokenizer.tokens.get((tokenizer.tokenIndex + tokenizer.lookahead - 1) & 3).lineno != tokenizer.lineno):
                        raise BreakOutOfLoops

                    # Use >, not >=, so postfix has higher precedence than
                    # prefix.
                    while (operators and opPrecedence.get(operators[-1].type, None) > opPrecedence.get(tokenType)):
                        reduce_()
                    node = Node(tokenizer, tokenType, [operands.pop()])
                    node.postfix = True
                    operands.append(node)

            elif tokenType == "function":
                if not tokenizer.scanOperand:
                    raise BreakOutOfLoops
                operands.append(FunctionDefinition(tokenizer, compilerContext, False, EXPRESSED_FORM))
                tokenizer.scanOperand = False

            elif tokenType in ("null", "this", "true", "false", "identifier", "number", "string", "regexp"):
                if not tokenizer.scanOperand:
                    raise BreakOutOfLoops
                operands.append(Node(tokenizer))
                tokenizer.scanOperand = False

            elif tokenType == "left_bracket":
                if tokenizer.scanOperand:
                    # Array initializer. Parse using recursive descent, as the
                    # sub-grammer here is not an operator grammar.
                    node = Node(tokenizer, "array_init")
                    while True:
                        tokenType = tokenizer.peek()
                        if tokenType == "right_bracket": break
                        if tokenType == "comma":
                            tokenizer.get()
                            node.append(None)
                            continue
                        node.append(Expression(tokenizer, compilerContext, "comma"))
                        if not tokenizer.match("comma"):
                            break
                    tokenizer.mustMatch("right_bracket")
                    operands.append(node)
                    tokenizer.scanOperand = False
                else:
                    operators.append(Node(tokenizer, "index"))
                    tokenizer.scanOperand = True
                    compilerContext.bracketLevel += 1

            elif tokenType == "right_bracket":
                if tokenizer.scanOperand or compilerContext.bracketLevel == bl:
                    raise BreakOutOfLoops
                while reduce_().type != "index":
                    continue
                compilerContext.bracketLevel -= 1

            elif tokenType == "left_curly":
                if not tokenizer.scanOperand:
                    raise BreakOutOfLoops
                    
                # Object initializer. As for array initializers (see above),
                # parse using recursive descent.
                compilerContext.curlyLevel += 1
                node = Node(tokenizer, "object_init")

                class BreakOutOfObjectInit(Exception): pass
                try:
                    if not tokenizer.match("right_curly"):
                        while True:
                            tokenType = tokenizer.get()
                            if ((tokenizer.token.value == "get" or tokenizer.token.value == "set") and tokenizer.peek == "identifier"):
                                if compilerContext.ecmaStrictMode:
                                    raise SyntaxError("Illegal property accessor", tokenizer)
                                node.append(FunctionDefinition(tokenizer, compilerContext, True, EXPRESSED_FORM))
                            else:
                                if tokenType in ("identifier", "number", "string"):
                                    id_ = Node(tokenizer)
                                elif tokenType == "right_curly":
                                    if compilerContext.ecmaStrictMode:
                                        raise SyntaxError("Illegal trailing ,", tokenizer)
                                    raise BreakOutOfObjectInit
                                else:
                                    raise SyntaxError("Invalid property name", tokenizer)
                                    
                                tokenizer.mustMatch("colon")
                                node.append(Node(tokenizer, "property_init", [id_, Expression(tokenizer, compilerContext, "comma")]))
                            if not tokenizer.match("comma"): break
                        tokenizer.mustMatch("right_curly")
                except BreakOutOfObjectInit, e: 
                    pass
                    
                operands.append(node)
                tokenizer.scanOperand = False
                compilerContext.curlyLevel -= 1

            elif tokenType == "right_curly":
                if not tokenizer.scanOperand and compilerContext.curlyLevel != cl:
                    raise ParseError("PANIC: right curly botch")
                raise BreakOutOfLoops

            elif tokenType == "left_paran":
                if tokenizer.scanOperand:
                    operators.append(Node(tokenizer, "group"))
                    compilerContext.parenLevel += 1
                else:
                    while (operators and opPrecedence.get(operators[-1].type) > opPrecedence["new"]):
                        reduce_()

                    # Handle () now, to regularize the node-ary case for node > 0.
                    # We must set scanOperand in case there are arguments and
                    # the first one is a regexp or unary+/-.
                    if operators:
                        node = operators[-1]
                    else:
                        node = Token()
                        node.type = None
                    tokenizer.scanOperand = True
                    if tokenizer.match("right_paran"):
                        if node.type == "new":
                            operators.pop()
                            node.append(operands.pop())
                        else:
                            node = Node(tokenizer, "call", [operands.pop(), Node(tokenizer, "list")])
                        operands.append(node)
                        tokenizer.scanOperand = False
                    else:
                        if node.type == "new":
                            node.type = "new_with_args"
                        else:
                            operators.append(Node(tokenizer, "call"))
                        compilerContext.parenLevel += 1

            elif tokenType == "right_paran":
                if tokenizer.scanOperand or compilerContext.parenLevel == pl:
                    raise BreakOutOfLoops
                while True:
                    tokenType = reduce_().type
                    if tokenType in ("group", "call", "new_with_args"):
                        break
                if tokenType != "group":
                    if operands:
                        node = operands[-1]
                        if node[1].type != "comma":
                            node[1] = Node(tokenizer, "list", [node[1]])
                        else:
                            node[1].type = "list"
                    else:
                        raise ParseError, "Unexpected amount of operands"
                compilerContext.parenLevel -= 1

            # Automatic semicolon insertion means we may scan across a newline
            # and into the beginning of another statement. If so, break out of
            # the while loop and let the tokenizer.scanOperand logic handle errors.
            else:
                raise BreakOutOfLoops
                
    except BreakOutOfLoops, e: 
        pass

    if compilerContext.hookLevel != hl:
        raise SyntaxError("Missing : after ?", tokenizer)
    if compilerContext.parenLevel != pl:
        raise SyntaxError("Missing ) in parenthetical", tokenizer)
    if compilerContext.bracketLevel != bl:
        raise SyntaxError("Missing ] in index expression", tokenizer)
    if tokenizer.scanOperand:
        raise SyntaxError("Missing operand", tokenizer)

    tokenizer.scanOperand = True
    tokenizer.unget()
    
    while operators:
        reduce_()
        
    return operands.pop()