#
# JavaScript Tools - Parser Module
# License: MPL 1.1/GPL 2.0/LGPL 2.1
# Authors: 
#   - Brendan Eich <brendan@mozilla.org> (Original JavaScript) (2004)
#   - JT Olds <jtolds@xnet5.com> (Python Translation) (2009)
#   - Sebastian Werner <info@sebastian-werner.net> (Refactoring Python) (2010)
#

from js.Node import Node
from js.Tokenizer import Token

__all__ = [ "parse", "parseExpression" ]

DECLARED_FORM = 0
EXPRESSED_FORM = 1
STATEMENT_FORM = 2


def parse(tokenizer):
    root = Script(tokenizer, CompilerContext(False))
    if not tokenizer.done:
        raise SyntaxError("Invalid end of file", tokenizer)
    return root
    
    
# Utility method to parse expression, basically useful to replace specific nodes
# with other generated nodes etc.
def parseExpression(tokenizer):
    node = Expression(tokenizer, CompilerContext(False))    
    node.fromExpression = True
    return node


class SyntaxError(Exception):
    def __init__(self, message, tokenizer):
        Exception.__init__(self, "Syntax error: %s\n%s:%s" % (message, tokenizer.filename, tokenizer.line))


# Used as a status container during tree-building for every function body and the global body
class CompilerContext(object):
    # inFunction is used to check if a return stm appears in a valid context.
    def __init__(self, inFunction):
        #######################
        # PUBLIC
        #######################

        # collect all defined and used variables
        self.declares = []
        self.accesses = []

        #######################
        # PRIVATE
        #######################

        # Whether this is inside a function, mostly true, only for top-level scope it's false
        self.inFunction = inFunction
        
        # The elms of statementStack are used to find the target label of CONTINUEs and
        # BREAKs. Its length is used in function definitions.
        self.statementStack = []

        #
        self.bracketLevel = 0
        self.curlyLevel = 0
        self.parenLevel = 0
        self.hookLevel = 0
        
        # Configure strict ecmascript 3 mode
        self.ecma3OnlyMode = False
        
        # Status flag during parsing
        self.inForLoopInit = False


# This produces the root node of each file or function body, basically a modified block node
def Script(tokenizer, compilerContext):
    node = Statements(tokenizer, compilerContext)
    
    # change type from "block" to "script" for script root
    node.type = "script"

    # copy over context declarations/accesses into script node
    # node.declares = compilerContext.declares
    node.accesses = compilerContext.accesses

    # LETs may add varDecls to blocks.
    if not "declares" in node:
        node.declares = []
    
    node.declares.extend(compilerContext.declares)

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

    if tokenType == "let":
        node = LetForm(tokenizer, compilerContext, STATEMENT_FORM)
        if node.type == "let_stm":
            return node
            
        # exps in stm context are semi nodes
        if node.type == "let_exp":
            node2 = Node(tokenizer, "semicolon")
            node2.expression = node
            node = node2
            node.end = node.expression.end

    # Cases for statements ending in a right curly return early, avoiding the
    # common semicolon insertion magic after this switch.
    elif tokenType == "function":
        # DECLARED_FORM extends fundefs of the context, STATEMENT_FORM doesn't.
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
        node.append(ParenExpression(tokenizer, compilerContext), "condition")
        compilerContext.statementStack.append(node)
        node.append(Statement(tokenizer, compilerContext), "thenPart")

        if tokenizer.match("else"):
            node.append(Statement(tokenizer, compilerContext), "elsePart")
            
        compilerContext.statementStack.pop()
        return node

    elif tokenType == "switch":
        # This allows CASEs after a DEFAULT, which is in the standard.
        node = Node(tokenizer)
        node.append(ParenExpression(tokenizer, compilerContext), "discriminant")
        
        cases = Node(tokenizer, "cases")
        node.append(cases)
        node.cases = cases
        node.defaultIndex = -1
        compilerContext.statementStack.append(node)
        tokenizer.mustMatch("left_curly")
        
        while True:
            tokenType = tokenizer.get()
            
            if tokenType == "right_curly": 
                break

            if tokenType in ("default", "case"):
                if tokenType == "default" and node.defaultIndex >= 0:
                    raise SyntaxError("More than one switch default", tokenizer)
                childNode = Node(tokenizer)
                if tokenType == "default":
                    node.defaultIndex = len(cases)
                else:
                    childNode.append(Expression(tokenizer, compilerContext, "colon"), "label")
            else:
                raise SyntaxError("Invalid switch case", tokenizer)
                
            tokenizer.mustMatch("colon")
            childNode.append(Node(tokenizer, "block"), "statements")
            
            while True:
                tokenType = tokenizer.peek()

                if tokenType in ("case", "default", "right_curly"):
                    break
                    
                childNode.statements.append(Statement(tokenizer, compilerContext))
                
            cases.append(childNode)
            
        compilerContext.statementStack.pop()
        return node

    elif tokenType == "for":
        node = Node(tokenizer)
        childNode = None
        node.isLoop = True

        # JavaScript 1.6 "for each(key in list)"
        if tokenizer.match("identifier"):
            if tokenizer.token.value != "each":
                raise SyntaxError("Illegal identifier after for", tokenizer)
            else:
                node.foreach = True
        
        tokenizer.mustMatch("left_paren")
        tokenType = tokenizer.peek()
        
        if tokenType != "semicolon":
            compilerContext.inForLoopInit = True
            
            if tokenType == "var" or tokenType == "const":
                tokenizer.get()
                childNode = Variables(tokenizer, compilerContext)
            elif tokenType == "let":
                tokenizer.get()
                childNode = Variables(tokenizer, compilerContext, "local decls")
                # don't confuse w/ n.varDecl used by for/in.
                node.varDecls = []
                node.varDecls.extend(childNode)
            else:
                childNode = Expression(tokenizer, compilerContext)
                
            compilerContext.inForLoopInit = False

        if childNode and tokenizer.match("in"):
            node.type = "for_in"
            node.append(childNode)
            
            if childNode.type == "var" or childNode.type == "let":
                if len(childNode) != 1:
                    raise SyntaxError("Invalid for..in left-hand side", tokenizer)

                node.iterator = childNode[0]
                node.varDecl = childNode
            
            else:
                oldchildNode = childNode
                while childNode.type == "group":
                    childNode = childNode[0] # strip parens

                if childNode.type != "identifier" and childNode.type != "call" and childNode.type != "dot" and childNode.type != "index":
                    raise SyntaxError("Invalid for..in left-hand side", tokenizer)
                
                node.iterator = oldchildNode                
                node.varDecl = None
                
            node.append(Expression(tokenizer, compilerContext), "object")
            
        else:
            # classic for loop
            if node.foreach:
                raise SyntaxError("Illegal for-each syntax", tokenizer)
                         
            if childNode:
                node.append(childNode, "setup")
            else:
                node.setup = None
                
            tokenizer.mustMatch("semicolon")
            
            if tokenizer.peek() == "semicolon":
                node.condition = None
            else:
                node.append(Expression(tokenizer, compilerContext), "condition")
                
            tokenizer.mustMatch("semicolon")
            
            if tokenizer.peek() == "right_paren":
                node.update = None
            else:
                node.append(Expression(tokenizer, compilerContext), "update")
                
        tokenizer.mustMatch("right_paren")
        node.append(nest(tokenizer, compilerContext, node, Statement), "body")
        
        return node

    elif tokenType == "while":
        node = Node(tokenizer)
        
        node.isLoop = True
        node.append(ParenExpression(tokenizer, compilerContext), "condition")
        node.append(nest(tokenizer, compilerContext, node, Statement), "body")
        
        return node

    elif tokenType == "do":
        node = Node(tokenizer)
        node.isLoop = True
        node.append(nest(tokenizer, compilerContext, node, Statement, "while"), "body")
        node.append(ParenExpression(tokenizer, compilerContext), "condition")
        if not compilerContext.ecma3OnlyMode:
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
        
        statementStack = compilerContext.statementStack
        i = len(statementStack)
        label = getattr(node, "label", None)
        
        if label:
            while True:
                i -= 1
                if i < 0:
                    raise SyntaxError("Label not found", tokenizer)
                if getattr(statementStack[i], "label", None) == label: 
                    break
                    
                # Both break and continue to label need to be handled specially
                # within a labeled loop, so that they target that loop. If not in
                # a loop, then break targets its labeled statement. Labels can be
                # nested so we skip all labels immediately enclosing the nearest
                # non-label statement.
                while i < len(statementStack)-1 and statementStack[i+1].type == "label":
                    i+=1                    
                if i < len(statementStack)-1 and getattr(statementStack[i+1], "isLoop", None):
                    i+=1
                elif tokenType == "continue":
                    raise SyntaxError("Invalid continue", tokenizer)      
                
        else:
            while True:
                i -= 1
                if i < 0:
                    if tokenType == "break":
                        raise SyntaxError("Invalid break", tokenizer)
                    else:
                        raise SyntaxError("Invalid continue", tokenizer)
                        
                if getattr(statementStack[i], "isLoop", None) or (tokenType == "break" and statementStack[i].type == "switch"):
                    break
                    
        node.target = statementStack[i] # cycle in the AST

    elif tokenType == "try":
        node = Node(tokenizer)
        node.append(Block(tokenizer, compilerContext), "tryBlock")
        catches = Node(tokenizer, "catches")
        node.append(catches)
        node.catches = catches

        while tokenizer.match("catch"):
            childNode = Node(tokenizer)
            tokenizer.mustMatch("left_paren")
            childNode.varName = tokenizer.mustMatch("identifier").value
            tokenizer.mustMatch("right_paren")
            childNode.append(Block(tokenizer, compilerContext), "block")
            catches.append(childNode)
            
        if tokenizer.match("finally"):
            node.append(Block(tokenizer, compilerContext), "finallyBlock")
            
        if not catches and not getattr(node, "finallyBlock", None):
            raise SyntaxError("Invalid try statement", tokenizer)
            
        return node

    elif tokenType in ("catch", "finally"):
        raise SyntaxError(tokenType + " without preceding try", tokenizer)

    elif tokenType == "throw":
        node = Node(tokenizer)
        node.append(Expression(tokenizer, compilerContext), "exception")

    elif tokenType == "return":
        if not compilerContext.inFunction:
            raise SyntaxError("Invalid return", tokenizer)
            
        node = Node(tokenizer)
        tokenType = tokenizer.peekOnSameLine()
        
        if tokenType not in ("end", "newline", "semicolon", "right_curly"):
            node.append(Expression(tokenizer, compilerContext), "value")

    elif tokenType == "with":
        node = Node(tokenizer)
        node.append(ParenExpression(tokenizer, compilerContext), "object")
        node.append(nest(tokenizer, compilerContext, node, Statement), "body")
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
                statementStack = compilerContext.statementStack
                i = len(statementStack) - 1
                
                while i >= 0:
                    if getattr(statementStack[i], "label", None) == label:
                        raise SyntaxError("Duplicate label", tokenizer)
                    i -= 1
                
                tokenizer.get()
                
                node = Node(tokenizer, "label")
                node.label = label
                node.append(nest(tokenizer, compilerContext, node, Statement), "statement")
                
                return node

        # expression statement.
        # We unget the current token to parse the expr as a whole.
        node = Node(tokenizer, "semicolon")
        tokenizer.unget()
        node.append(Expression(tokenizer, compilerContext), "expression")
        node.end = node.expression.end

    # semicolon-insertion magic
    if tokenizer.line == tokenizer.token.line:
        tokenType = tokenizer.peekOnSameLine()
        if tokenType not in ("end", "newline", "semicolon", "right_curly"):
            raise SyntaxError("Missing ; before statement. Found %s" % tokenType, tokenizer)
            
    tokenizer.match("semicolon")
    return node


# Process a function declaration
def FunctionDefinition(tokenizer, compilerContext, requireName, functionForm):
    node = Node(tokenizer)
    if node.type != "function":
        if node.value == "get":
            node.type = "getter"
        else:
            node.type = "setter"
            
    if tokenizer.match("identifier"):
        node.name = tokenizer.token.value
    elif requireName:
        raise SyntaxError("Missing function identifier", tokenizer)

    tokenizer.mustMatch("left_paren")
    node.params = []
    while True:
        tokenType = tokenizer.get()
        if tokenType == "right_paren": 
            break
            
        if tokenType != "identifier":
            raise SyntaxError("Missing formal parameter", tokenizer)
            
        node.params.append(tokenizer.token.value)
        
        if tokenizer.peek() != "right_paren":
            tokenizer.mustMatch("comma")

    if tokenizer.match("left_curly"):
        node.append(Script(tokenizer, CompilerContext(True)), "body")
        tokenizer.mustMatch("right_curly")
    else:
        # Expression closures (JavaScript 1.8) 
        node.append(Expression(tokenizer, compilerContext, "comma"), "body")
    
    node.end = tokenizer.token.end

    node.functionForm = functionForm
    if functionForm == DECLARED_FORM:
        name = getattr(node, "name", None)
        if name and not name in compilerContext.declares:
            compilerContext.declares.append(name)
    return node


# Processes a variable block
def Variables(tokenizer, compilerContext, hint=None):
    node = Node(tokenizer)
    while True:
        peekType = tokenizer.peek()
        if peekType == "left_curly" or peekType == "left_bracket":
            childNode = Expression(tokenizer, compilerContext) # for destructuring
        else:
            tokenizer.mustMatch("identifier")
            childNode = Node(tokenizer)
            childNode.name = childNode.value
        
        if tokenizer.match("assign"):
            if tokenizer.token.assignOp:
                raise SyntaxError("Invalid variable initialization", tokenizer)
            childNode.append(Expression(tokenizer, compilerContext, "comma"), "initializer")
            
        childNode.readOnly = not not (node.type == "const")
        
        node.append(childNode)

        # LETs use "local decls"
        if hint != "local decls":
            if not childNode.value in compilerContext.declares:
                compilerContext.declares.append(childNode.value)

        if not tokenizer.match("comma"): 
            break

    return node
    
    
# doesn't handle lets in the toplevel of forloop heads
def LetForm(tokenizer, compilerContext, form):
    node = Node(tokenizer)
    hasLeftParen = tokenizer.match("left_paren")
    childNode = Variables(tokenizer, compilerContext, "local decls")
    
    # let statement and let expression
    if hasLeftParen:
        tokenizer.mustMatch("right_paren")
        node.varDecls = []
        node.varDecls.extend(childNode)
        
        if form == STATEMENT_FORM and tokenizer.peek() == "right_curly":
            node.type = "let_stm"
            node.append(nest(tokenizer, compilerContext, node, Block), "body")
        else:
            node.type = "let_exp"
            node.append(Expression(tokenizer, compilerContext, COMMA), "body")

    elif form == EXPRESSED_FORM:
        raise SyntaxError("Let-definition used as expression.", tokenizer)
        
    # let definition
    else:
        node.type = "let_def"

        # search context to find enclosing BLOCK
        # a BLOCK *must* be found
        statementStack = compilerContext.statementStack
        i = len(statementStack)
        while (statementStack[--i].type != "block"):
            pass
            
        statement = statementStack[i]
        
        # the vars must go in the correct scope
        if not hasattr(statement, "varDecls"):
            statement.varDecls = []
        statement.varDecls.extend(childNode) 
        
        # but the assignments must stay here
        node.varDecls = []
        node.varDecls.extend(childNode) 

    return node


# An expression placed into parens like for if, while, do and with
def ParenExpression(tokenizer, compilerContext):
    tokenizer.mustMatch("left_paren")
    node = Expression(tokenizer, compilerContext)
    tokenizer.mustMatch("right_paren")
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
    "not": 14, "bitwise_not": 14, "unary_plus": 14, "unary_minus": 14,
    "increment": 15, "decrement": 15,
    "new": 16,
    "dot": 17
}

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
    "not": 1, "bitwise_not": 1, "unary_plus": 1, "unary_minus": 1,
    "increment": 1, "decrement": 1,
    "new": 1, "new_with_args": 2, "dot": 2, "index": 2, "call": 2,
    "array_init": 1, "object_init": 1, "group": 1
}

    
# When scanOperand is true the parser wants an operand (the "default" mode).
# When it's false, the parser is expecting an operator.
def Expression(tokenizer, compilerContext, stop=None):
    operators = []
    operands = []
    bl = compilerContext.bracketLevel
    cl = compilerContext.curlyLevel
    pl = compilerContext.parenLevel
    hl = compilerContext.hookLevel

    # Uses an operator and its operands to construct a whole expression.
    # The result of reduce isn't used by its callers. It's left on the operands
    # stack and it's retrieved from there.
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

        # this always appends to the END!!!! and might be the problem!!!
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

            # Parse let expressions
            elif tokenType == "let":
              # "let" is not an operator, no need to assign precedence to it.
              if not tokenizer.scanOperand:
                raise BreakOutOfLoops
                
              operands.append(LetForm(tokenizer, compilerContext, EXPRESSED_FORM))
              tokenizer.scanOperand = False

            # If we are expecting an operator and find sth else it may not be an error,
            # because of semicolon insertion. So Expression doesn't throw for this.
            # If it turns out to be an error it is detected by various other parts of
            # the code and the msg may be obscure.
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


            elif tokenType == "yield":
                if not compilerContext.inFunction:
                    raise SyntaxError("yield not in function", tokenizer)

                # yield is followed by 0 or 1 expr, so we don't know if we should
                # go to operator or operand mode, we must handle the expr here.
                node = Node(tokenizer)
                
                tokenType = tokenizer.peek()
                if tokenType != "semicolon" and tokenType != "right_curly" and tokenType != "right_paren" and tokenType != "right_bracket" and tokenType != "comma" and tokenType != "colon":
                    node.value = Expression(tokenizer, compilerContext)
                
                operands.push(node)
                Tokenizer.scanOperand = False

                    
            elif tokenType in ("delete", "void", "typeof", "not", "bitwise_not", "unary_plus", "unary_minus", "new"):
                if not tokenizer.scanOperand:
                    raise BreakOutOfLoops
                    
                operators.append(Node(tokenizer))
                

            elif tokenType in ("increment", "decrement"):
                if tokenizer.scanOperand:
                    operators.append(Node(tokenizer)) # prefix increment or decrement
                    
                else:
                    # Don't cross a line boundary for postfix {in,de}crement.
                    if (tokenizer.tokens.get((tokenizer.tokenIndex + tokenizer.lookahead - 1) & 3).line != tokenizer.line):
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

                node = Node(tokenizer)
                if tokenType == "identifier":
                    node.scope = True
                    if not node.value in compilerContext.accesses:
                        compilerContext.accesses.append(node.value)
                operands.append(node)
                tokenizer.scanOperand = False


            elif tokenType == "left_bracket":
                if tokenizer.scanOperand:
                    # Array initializer. Parse using recursive descent, as the
                    # sub-grammer here is not an operator grammar.
                    node = Node(tokenizer, "array_init")
                    elms = 0
                    while True:
                        elms += 1
                        tokenType = tokenizer.peek()
                        if tokenType == "right_bracket": 
                            break
                            
                        if tokenType == "comma":
                            tokenizer.get()
                            node.append(None)
                            continue
                            
                        node.append(Expression(tokenizer, compilerContext, "comma"))
                        
                        # array comprehensions
                        if tokenizer.match("for"): 
                            if elms != 1:
                                raise SyntaxError("Invalid comprehension", tokenizer)
                                
                            forInNode = Node(tokenizer, "for_in")
                            if tokenizer.match("identifier"):
                                if tokenizer.token.value != "each":
                                    raise SyntaxError("Invalid comprehension", tokenizer)
                                else:
                                    node.foreach = True

                            tokenizer.mustMatch(LEFT_PAREN)

                            # compilerContext.inForLoopInit = true; => won't work because this FOR
                            # may be inside another expression => parenLevel != 0
                            innerContext = CompilerContext(compilerContext.inFunction)
                            innerContext.inForLoopInit = True
                            
                            iterator = Expression(tokenizer, innerContext)
                            if iterator.type != "identifier":
                                raise SyntaxError("Invalid comprehension", tokenizer)
                                
                            forInNode.append(iterator, "iterator")
                            tokenizer.mustMatch("in")
                            forInNode.append(Expression(tokenizer, compilerContext), "object")
                            tokenizer.mustMatch("right_paren")

                            if tokenizer.match("if"):
                                forInNode.append(Expression(tokenizer, compilerContext), "condition")
                                
                            break   
                        
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

                class BreakOutOfObjectInit(Exception): 
                    pass
                    
                try:
                    if not tokenizer.match("right_curly"):
                        while True:
                            tokenType = tokenizer.get()
                            if ((tokenizer.token.value == "get" or tokenizer.token.value == "set") and tokenizer.peek == "identifier"):
                                if compilerContext.ecma3OnlyMode:
                                    raise SyntaxError("Illegal property accessor", tokenizer)
                                node.append(FunctionDefinition(tokenizer, compilerContext, True, EXPRESSED_FORM))
                            else:
                                if tokenType in ("identifier", "number", "string"):
                                    id_ = Node(tokenizer)
                                elif tokenType == "right_curly":
                                    if compilerContext.ecma3OnlyMode:
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


            elif tokenType == "left_paren":
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
                    
                    if tokenizer.match("right_paren"):
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


            elif tokenType == "right_paren":
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