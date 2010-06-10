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

from narcissus.Node import Node
from narcissus.Lang import *
from narcissus.Tokenizer import Token

DECLARED_FORM = 0
EXPRESSED_FORM = 1
STATEMENT_FORM = 2

class CompilerContext(object):
    def __init__(self, inFunction):
        self.inFunction = inFunction
        self.stmtStack = []
        self.funDecls = []
        self.varDecls = []
        self.bracketLevel = 0
        self.curlyLevel = 0
        self.parenLevel = 0
        self.hookLevel = 0
        self.ecmaStrictMode = False
        self.inForLoopInit = False


def Script(tokenizer, compilerContext):
    node = Statements(tokenizer, compilerContext)
    
    # change type from BLOCK to SCRIPT for script root
    node.type_ = SCRIPT

    # copy over context declarations into script node
    node.funDecls = compilerContext.funDecls
    node.varDecls = compilerContext.varDecls

    return node
    
    
def Statements(tokenizer, compilerContext):
    node = Node(tokenizer, BLOCK)
    compilerContext.stmtStack.append(node)

    while not tokenizer.done and tokenizer.peek() != RIGHT_CURLY:
        node.append(Statement(tokenizer, compilerContext))

    compilerContext.stmtStack.pop()
    return node


def Block(tokenizer, x):
    tokenizer.mustMatch(LEFT_CURLY)
    n = Statements(tokenizer, x)
    tokenizer.mustMatch(RIGHT_CURLY)
    return n
    
    
# Statement stack and nested statement handler.
def nest(tokenizer, x, node, func, end=None):
    x.stmtStack.append(node)
    n = func(tokenizer, x)
    x.stmtStack.pop()
    if end: tokenizer.mustMatch(end)
    return n    
    

def Statement(tokenizer, x):
    tt = tokenizer.get()

    # Cases for statements ending in a right curly return early, avoiding the
    # common semicolon insertion magic after this switch.
    if tt == FUNCTION:
        if len(x.stmtStack) > 1:
            type_ = STATEMENT_FORM
        else:
            type_ = DECLARED_FORM
        return FunctionDefinition(tokenizer, x, True, type_)

    elif tt == LEFT_CURLY:
        n = Statements(tokenizer, x)
        tokenizer.mustMatch(RIGHT_CURLY)
        return n

    elif tt == IF:
        n = Node(tokenizer)
        n.condition = ParenExpression(tokenizer, x)
        x.stmtStack.append(n)
        n.thenPart = Statement(tokenizer, x)
        if tokenizer.match(ELSE):
            n.elsePart = Statement(tokenizer, x)
        else:
            n.elsePart = None
        x.stmtStack.pop()
        return n

    elif tt == SWITCH:
        n = Node(tokenizer)
        tokenizer.mustMatch(LEFT_PAREN)
        n.discriminant = Expression(tokenizer, x)
        tokenizer.mustMatch(RIGHT_PAREN)
        n.cases = []
        n.defaultIndex = -1
        x.stmtStack.append(n)
        tokenizer.mustMatch(LEFT_CURLY)
        while True:
            tt = tokenizer.get()
            if tt == RIGHT_CURLY: break

            if tt in (DEFAULT, CASE):
                if tt == DEFAULT and n.defaultIndex >= 0:
                    raise tokenizer.newSyntaxError("More than one switch default")
                n2 = Node(tokenizer)
                if tt == DEFAULT:
                    n.defaultIndex = len(n.cases)
                else:
                    n2.caseLabel = Expression(tokenizer, x, COLON)
            else:
                raise tokenizer.newSyntaxError("Invalid switch case")
            tokenizer.mustMatch(COLON)
            n2.statements = Node(tokenizer, BLOCK)
            while True:
                tt = tokenizer.peek()
                if(tt == CASE or tt == DEFAULT or tt == RIGHT_CURLY): break
                n2.statements.append(Statement(tokenizer, x))
            n.cases.append(n2)
        x.stmtStack.pop()
        return n

    elif tt == FOR:
        n = Node(tokenizer)
        n2 = None
        n.isLoop = True
        tokenizer.mustMatch(LEFT_PAREN)
        tt = tokenizer.peek()
        if tt != SEMICOLON:
            x.inForLoopInit = True
            if tt == VAR or tt == CONST:
                tokenizer.get()
                n2 = Variables(tokenizer, x)
            else:
                n2 = Expression(tokenizer, x)
            x.inForLoopInit = False

        if n2 and tokenizer.match(IN):
            n.type_ = FOR_IN
            if n2.type_ == VAR:
                if len(n2) != 1:
                    raise SyntaxError("Invalid for..in left-hand side",
                            tokenizer.filename, n2.lineno)

                # NB: n2[0].type_ == INDENTIFIER and n2[0].value == n2[0].name
                n.iterator = n2[0]
                n.varDecl = n2
            else:
                n.iterator = n2
                n.varDecl = None
            n.object = Expression(tokenizer, x)
        else:
            if n2:
                n.setup = n2
            else:
                n.setup = None
            tokenizer.mustMatch(SEMICOLON)
            if tokenizer.peek() == SEMICOLON:
                n.condition = None
            else:
                n.condition = Expression(tokenizer, x)
            tokenizer.mustMatch(SEMICOLON)
            if tokenizer.peek() == RIGHT_PAREN:
                n.update = None
            else:
                n.update = Expression(tokenizer, x)
        tokenizer.mustMatch(RIGHT_PAREN)
        n.body = nest(tokenizer, x, n, Statement)
        return n

    elif tt == WHILE:
        n = Node(tokenizer)
        n.isLoop = True
        n.condition = ParenExpression(tokenizer, x)
        n.body = nest(tokenizer, x, n, Statement)
        return n

    elif tt == DO:
        n = Node(tokenizer)
        n.isLoop = True
        n.body = nest(tokenizer, x, n, Statement, WHILE)
        n.condition = ParenExpression(tokenizer, x)
        if not x.ecmaStrictMode:
            # <script language="JavaScript"> (without version hints) may need
            # automatic semicolon insertion without a newline after do-while.
            # See http://bugzilla.mozilla.org/show_bug.cgi?id=238945.
            tokenizer.match(SEMICOLON)
            return n

    elif tt in (BREAK, CONTINUE):
        n = Node(tokenizer)
        if tokenizer.peekOnSameLine() == IDENTIFIER:
            tokenizer.get()
            n.label = tokenizer.token.value
        ss = x.stmtStack
        i = len(ss)
        label = getattr(n, "label", None)
        if label:
            while True:
                i -= 1
                if i < 0:
                    raise tokenizer.newSyntaxError("Label not found")
                if getattr(ss[i], "label", None) == label: break
        else:
            while True:
                i -= 1
                if i < 0:
                    if tt == BREAK:
                        raise tokenizer.newSyntaxError("Invalid break")
                    else:
                        raise tokenizer.newSyntaxError("Invalid continue")
                if (getattr(ss[i], "isLoop", None) or (tt == BREAK and
                        ss[i].type_ == SWITCH)):
                    break
        n.target = ss[i]

    elif tt == TRY:
        n = Node(tokenizer)
        n.tryBlock = Block(tokenizer, x)
        n.catchClauses = []
        while tokenizer.match(CATCH):
            n2 = Node(tokenizer)
            tokenizer.mustMatch(LEFT_PAREN)
            n2.varName = tokenizer.mustMatch(IDENTIFIER).value
            if tokenizer.match(IF):
                if x.ecmaStrictMode:
                    raise tokenizer.newSyntaxError("Illegal catch guard")
                if n.catchClauses and not n.catchClauses[-1].guard:
                    raise tokenizer.newSyntaxError("Gaurded catch after unguarded")
                n2.guard = Expression(tokenizer, x)
            else:
                n2.guard = None
            tokenizer.mustMatch(RIGHT_PAREN)
            n2.block = Block(tokenizer, x)
            n.catchClauses.append(n2)
        if tokenizer.match(FINALLY):
            n.finallyBlock = Block(tokenizer, x)
        if not n.catchClauses and not getattr(n, "finallyBlock", None):
            raise tokenizer.newSyntaxError("Invalid try statement")
        return n

    elif tt in (CATCH, FINALLY):
        raise tokenizer.newSyntaxError(tokens[tt] + " without preceding try")

    elif tt == THROW:
        n = Node(tokenizer)
        n.exception = Expression(tokenizer, x)

    elif tt == RETURN:
        if not x.inFunction:
            raise tokenizer.newSyntaxError("Invalid return")
        n = Node(tokenizer)
        tt = tokenizer.peekOnSameLine()
        if tt not in (END, NEWLINE, SEMICOLON, RIGHT_CURLY):
            n.value = Expression(tokenizer, x)

    elif tt == WITH:
        n = Node(tokenizer)
        n.object = ParenExpression(tokenizer, x)
        n.body = nest(tokenizer, x, n, Statement)
        return n

    elif tt in (VAR, CONST):
        n = Variables(tokenizer, x)

    elif tt == DEBUGGER:
        n = Node(tokenizer)

    elif tt in (NEWLINE, SEMICOLON):
        n = Node(tokenizer, SEMICOLON)
        n.expression = None
        return n

    else:
        if tt == IDENTIFIER:
            tokenizer.scanOperand = False
            tt = tokenizer.peek()
            tokenizer.scanOperand = True
            if tt == COLON:
                label = tokenizer.token.value
                ss = x.stmtStack
                i = len(ss) - 1
                while i >= 0:
                    if getattr(ss[i], "label", None) == label:
                        raise tokenizer.newSyntaxError("Duplicate label")
                    i -= 1
                tokenizer.get()
                n = Node(tokenizer, LABEL)
                n.label = label
                n.statement = nest(tokenizer, x, n, Statement)
                return n

        n = Node(tokenizer, SEMICOLON)
        tokenizer.unget()
        n.expression = Expression(tokenizer, x)
        n.end = n.expression.end

    if tokenizer.lineno == tokenizer.token.lineno:
        tt = tokenizer.peekOnSameLine()
        if tt not in (END, NEWLINE, SEMICOLON, RIGHT_CURLY):
            raise tokenizer.newSyntaxError("Missing ; before statement")
    tokenizer.match(SEMICOLON)
    return n

def FunctionDefinition(tokenizer, x, requireName, functionForm):
    f = Node(tokenizer)
    if f.type_ != FUNCTION:
        if f.value == "get":
            f.type_ = GETTER
        else:
            f.type_ = SETTER
    if tokenizer.match(IDENTIFIER):
        f.name = tokenizer.token.value
    elif requireName:
        raise tokenizer.newSyntaxError("Missing function identifier")

    tokenizer.mustMatch(LEFT_PAREN)
    f.params = []
    while True:
        tt = tokenizer.get()
        if tt == RIGHT_PAREN: break
        if tt != IDENTIFIER:
            raise tokenizer.newSyntaxError("Missing formal parameter")
        f.params.append(tokenizer.token.value)
        if tokenizer.peek() != RIGHT_PAREN:
            tokenizer.mustMatch(COMMA)

    tokenizer.mustMatch(LEFT_CURLY)
    x2 = CompilerContext(True)
    f.body = Script(tokenizer, x2)
    tokenizer.mustMatch(RIGHT_CURLY)
    f.end = tokenizer.token.end

    f.functionForm = functionForm
    if functionForm == DECLARED_FORM:
        x.funDecls.append(f)
    return f

def Variables(tokenizer, x):
    n = Node(tokenizer)
    while True:
        tokenizer.mustMatch(IDENTIFIER)
        n2 = Node(tokenizer)
        n2.name = n2.value
        if tokenizer.match(ASSIGN):
            if tokenizer.token.assignOp:
                raise tokenizer.newSyntaxError("Invalid variable initialization")
            n2.initializer = Expression(tokenizer, x, COMMA)
        n2.readOnly = not not (n.type_ == CONST)
        n.append(n2)
        x.varDecls.append(n2)
        if not tokenizer.match(COMMA): break
    return n

def ParenExpression(tokenizer, x):
    tokenizer.mustMatch(LEFT_PAREN)
    n = Expression(tokenizer, x)
    tokenizer.mustMatch(RIGHT_PAREN)
    return n


opPrecedence = {
    "SEMICOLON": 0,
    "COMMA": 1,
    "ASSIGN": 2, "HOOK": 2, "COLON": 2,
    # The above all have to have the same precedence, see bug 330975.
    "OR": 4,
    "AND": 5,
    "BITWISE_OR": 6,
    "BITWISE_XOR": 7,
    "BITWISE_AND": 8,
    "EQ": 9, "NE": 9, "STRICT_EQ": 9, "STRICT_NE": 9,
    "LT": 10, "LE": 10, "GE": 10, "GT": 10, "IN": 10, "INSTANCEOF": 10,
    "LSH": 11, "RSH": 11, "URSH": 11,
    "PLUS": 12, "MINUS": 12,
    "MUL": 13, "DIV": 13, "MOD": 13,
    "DELETE": 14, "VOID": 14, "TYPEOF": 14,
    # "PRE_INCREMENT": 14, "PRE_DECREMENT": 14,
    "NOT": 14, "BITWISE_NOT": 14, "UNARY_PLUS": 14, "UNARY_MINUS": 14,
    "INCREMENT": 15, "DECREMENT": 15,     # postfix
    "NEW": 16,
    "DOT": 17
}

# Map operator type code to precedence
for i in opPrecedence.copy():
    opPrecedence[globals()[i]] = opPrecedence[i]

opArity = {
    "COMMA": -2,
    "ASSIGN": 2,
    "HOOK": 3,
    "OR": 2,
    "AND": 2,
    "BITWISE_OR": 2,
    "BITWISE_XOR": 2,
    "BITWISE_AND": 2,
    "EQ": 2, "NE": 2, "STRICT_EQ": 2, "STRICT_NE": 2,
    "LT": 2, "LE": 2, "GE": 2, "GT": 2, "IN": 2, "INSTANCEOF": 2,
    "LSH": 2, "RSH": 2, "URSH": 2,
    "PLUS": 2, "MINUS": 2,
    "MUL": 2, "DIV": 2, "MOD": 2,
    "DELETE": 1, "VOID": 1, "TYPEOF": 1,
    # "PRE_INCREMENT": 1, "PRE_DECREMENT": 1,
    "NOT": 1, "BITWISE_NOT": 1, "UNARY_PLUS": 1, "UNARY_MINUS": 1,
    "INCREMENT": 1, "DECREMENT": 1,     # postfix
    "NEW": 1, "NEW_WITH_ARGS": 2, "DOT": 2, "INDEX": 2, "CALL": 2,
    "ARRAY_INIT": 1, "OBJECT_INIT": 1, "GROUP": 1
}

# Map operator type code to arity.
for i in opArity.copy():
    opArity[globals()[i]] = opArity[i]
    
def Expression(tokenizer, x, stop=None):
    operators = []
    operands = []
    bl = x.bracketLevel
    cl = x.curlyLevel
    pl = x.parenLevel
    hl = x.hookLevel

    def reduce_():
        n = operators.pop()
        op = n.type_
        arity = opArity[op]
        if arity == -2:
            # Flatten left-associative trees.
            left = (len(operands) >= 2 and operands[-2])
            if left.type_ == op:
                right = operands.pop()
                left.append(right)
                return left
            arity = 2

        # Always use append to add operands to n, to update start and end.
        a = operands[-arity:]
        del operands[-arity:]
        for operand in a:
            n.append(operand)

        # Include closing bracket or postfix operator in [start,end).
        if n.end < tokenizer.token.end:
            n.end = tokenizer.token.end

        operands.append(n)
        return n

    class BreakOutOfLoops(Exception): 
        pass
        
    try:
        while True:
            tt = tokenizer.get()
            if tt == END: break
            if (tt == stop and x.bracketLevel == bl and x.curlyLevel == cl and
                    x.parenLevel == pl and x.hookLevel == hl):
                # Stop only if tt matches the optional stop parameter, and that
                # token is not quoted by some kind of bracket.
                break
            if tt == SEMICOLON:
                # NB: cannot be empty, Statement handled that.
                raise BreakOutOfLoops

            elif tt in (ASSIGN, HOOK, COLON):
                if tokenizer.scanOperand:
                    raise BreakOutOfLoops
                while ((operators and opPrecedence.get(operators[-1].type_, None) > opPrecedence.get(tt)) or (tt == COLON and operators and operators[-1].type_ == ASSIGN)):
                    reduce_()
                if tt == COLON:
                    if operators:
                        n = operators[-1]
                    if not operators or n.type_ != HOOK:
                        raise tokenizer.newSyntaxError("Invalid label")
                    x.hookLevel -= 1
                else:
                    operators.append(Node(tokenizer))
                    if tt == ASSIGN:
                        operands[-1].assignOp = tokenizer.token.assignOp
                    else:
                        x.hookLevel += 1

                tokenizer.scanOperand = True

            elif tt in (IN, COMMA, OR, AND, BITWISE_OR, BITWISE_XOR, BITWISE_AND, EQ, NE, 
                STRICT_EQ, STRICT_NE, LT, LE, GE, GT, INSTANCEOF, LSH, RSH, URSH, PLUS, MINUS, MUL, DIV, MOD, DOT):
                
                # We're treating comma as left-associative so reduce can fold
                # left-heavy COMMA trees into a single array.
                if tt == IN:
                    # An in operator should not be parsed if we're parsing the
                    # head of a for (...) loop, unless it is in the then part of
                    # a conditional expression, or parenthesized somehow.
                    if (x.inForLoopInit and not x.hookLevel and not x.bracketLevel and not x.curlyLevel and not x.parenLevel):
                        raise BreakOutOfLoops
                if tokenizer.scanOperand:
                    raise BreakOutOfLoops
                while (operators and opPrecedence.get(operators[-1].type_) >= opPrecedence.get(tt)):
                    reduce_()
                if tt == DOT:
                    tokenizer.mustMatch(IDENTIFIER)
                    operands.append(Node(tokenizer, DOT, [operands.pop(), Node(tokenizer)]))
                else:
                    operators.append(Node(tokenizer))
                    tokenizer.scanOperand = True

            elif tt in (DELETE, VOID, TYPEOF, NOT, BITWISE_NOT, UNARY_PLUS, UNARY_MINUS, NEW):
                if not tokenizer.scanOperand:
                    raise BreakOutOfLoops
                operators.append(Node(tokenizer))

            elif tt in (INCREMENT, DECREMENT):
                if tokenizer.scanOperand:
                    operators.append(Node(tokenizer)) # prefix increment or decrement
                else:
                    # Don't cross a line boundary for postfix {in,de}crement.
                    if (tokenizer.tokens.get((tokenizer.tokenIndex + tokenizer.lookahead - 1)
                            & 3).lineno != tokenizer.lineno):
                        raise BreakOutOfLoops

                    # Use >, not >=, so postfix has higher precedence than
                    # prefix.
                    while (operators and opPrecedence.get(operators[-1].type_,
                            None) > opPrecedence.get(tt)):
                        reduce_()
                    n = Node(tokenizer, tt, [operands.pop()])
                    n.postfix = True
                    operands.append(n)

            elif tt == FUNCTION:
                if not tokenizer.scanOperand:
                    raise BreakOutOfLoops
                operands.append(FunctionDefinition(tokenizer, x, False, EXPRESSED_FORM))
                tokenizer.scanOperand = False

            elif tt in (NULL, THIS, TRUE, FALSE, IDENTIFIER, NUMBER, STRING,
                    REGEXP):
                if not tokenizer.scanOperand:
                    raise BreakOutOfLoops
                operands.append(Node(tokenizer))
                tokenizer.scanOperand = False

            elif tt == LEFT_BRACKET:
                if tokenizer.scanOperand:
                    # Array initializer. Parse using recursive descent, as the
                    # sub-grammer here is not an operator grammar.
                    n = Node(tokenizer, ARRAY_INIT)
                    while True:
                        tt = tokenizer.peek()
                        if tt == RIGHT_BRACKET: break
                        if tt == COMMA:
                            tokenizer.get()
                            n.append(None)
                            continue
                        n.append(Expression(tokenizer, x, COMMA))
                        if not tokenizer.match(COMMA):
                            break
                    tokenizer.mustMatch(RIGHT_BRACKET)
                    operands.append(n)
                    tokenizer.scanOperand = False
                else:
                    operators.append(Node(tokenizer, INDEX))
                    tokenizer.scanOperand = True
                    x.bracketLevel += 1

            elif tt == RIGHT_BRACKET:
                if tokenizer.scanOperand or x.bracketLevel == bl:
                    raise BreakOutOfLoops
                while reduce_().type_ != INDEX:
                    continue
                x.bracketLevel -= 1

            elif tt == LEFT_CURLY:
                if not tokenizer.scanOperand:
                    raise BreakOutOfLoops
                # Object initializer. As for array initializers (see above),
                # parse using recursive descent.
                x.curlyLevel += 1
                n = Node(tokenizer, OBJECT_INIT)

                class BreakOutOfObjectInit(Exception): pass
                try:
                    if not tokenizer.match(RIGHT_CURLY):
                        while True:
                            tt = tokenizer.get()
                            if ((tokenizer.token.value == "get" or
                                    tokenizer.token.value == "set") and
                                    tokenizer.peek == IDENTIFIER):
                                if x.ecmaStrictMode:
                                    raise tokenizer.newSyntaxError("Illegal property "
                                            "accessor")
                                n.append(FunctionDefinition(tokenizer, x, True,
                                        EXPRESSED_FORM))
                            else:
                                if tt in (IDENTIFIER, NUMBER, STRING):
                                    id_ = Node(tokenizer)
                                elif tt == RIGHT_CURLY:
                                    if x.ecmaStrictMode:
                                        raise tokenizer.newSyntaxError("Illegal "
                                                "trailing ,")
                                    raise BreakOutOfObjectInit
                                else:
                                    raise tokenizer.newSyntaxError("Invalid property "
                                            "name")
                                tokenizer.mustMatch(COLON)
                                n.append(Node(tokenizer, PROPERTY_INIT, [id_,
                                        Expression(tokenizer, x, COMMA)]))
                            if not tokenizer.match(COMMA): break
                        tokenizer.mustMatch(RIGHT_CURLY)
                except BreakOutOfObjectInit, e: pass
                operands.append(n)
                tokenizer.scanOperand = False
                x.curlyLevel -= 1

            elif tt == RIGHT_CURLY:
                if not tokenizer.scanOperand and x.curlyLevel != cl:
                    raise ParseError("PANIC: right curly botch")
                raise BreakOutOfLoops

            elif tt == LEFT_PAREN:
                if tokenizer.scanOperand:
                    operators.append(Node(tokenizer, GROUP))
                    x.parenLevel += 1
                else:
                    while (operators and opPrecedence.get(operators[-1].type_) > opPrecedence[NEW]):
                        reduce_()

                    # Handle () now, to regularize the n-ary case for n > 0.
                    # We must set scanOperand in case there are arguments and
                    # the first one is a regexp or unary+/-.
                    if operators:
                        n = operators[-1]
                    else:
                        n = Token()
                        n.type_ = None
                    tokenizer.scanOperand = True
                    if tokenizer.match(RIGHT_PAREN):
                        if n.type_ == NEW:
                            operators.pop()
                            n.append(operands.pop())
                        else:
                            n = Node(tokenizer, CALL, [operands.pop(), Node(tokenizer, LIST)])
                        operands.append(n)
                        tokenizer.scanOperand = False
                    else:
                        if n.type_ == NEW:
                            n.type_ = NEW_WITH_ARGS
                        else:
                            operators.append(Node(tokenizer, CALL))
                        x.parenLevel += 1

            elif tt == RIGHT_PAREN:
                if tokenizer.scanOperand or x.parenLevel == pl:
                    raise BreakOutOfLoops
                while True:
                    tt = reduce_().type_
                    if tt in (GROUP, CALL, NEW_WITH_ARGS):
                        break
                if tt != GROUP:
                    if operands:
                        n = operands[-1]
                        if n[1].type_ != COMMA:
                            n[1] = Node(tokenizer, LIST, [n[1]])
                        else:
                            n[1].type_ = LIST
                    else:
                        raise ParseError, "Unexpected amount of operands"
                x.parenLevel -= 1

            # Automatic semicolon insertion means we may scan across a newline
            # and into the beginning of another statement. If so, break out of
            # the while loop and let the tokenizer.scanOperand logic handle errors.
            else:
                raise BreakOutOfLoops
    except BreakOutOfLoops, e: pass

    if x.hookLevel != hl:
        raise tokenizer.newSyntaxError("Missing : after ?")
    if x.parenLevel != pl:
        raise tokenizer.newSyntaxError("Missing ) in parenthetical")
    if x.bracketLevel != bl:
        raise tokenizer.newSyntaxError("Missing ] in index expression")
    if tokenizer.scanOperand:
        raise tokenizer.newSyntaxError("Missing operand")

    tokenizer.scanOperand = True
    tokenizer.unget()
    while operators:
        reduce_()
    return operands.pop()