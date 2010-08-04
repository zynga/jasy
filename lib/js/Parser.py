#
# JavaScript Tools - Parser Module
# License: MPL 1.1/GPL 2.0/LGPL 2.1
# Authors: 
#   - Brendan Eich <brendan@mozilla.org> (Original JavaScript) (2004-2010)
#   - Sebastian Werner <info@sebastian-werner.net> (Python Port) (2010)
#

from js.Node import Node
from js.Tokenizer import Token
from js.Builder import Builder

#__all__ = [ "parse", "parseExpression" ]
__all__ = [ "parse" ]


class SyntaxError(Exception):
    def __init__(self, message, tokenizer):
        Exception.__init__(self, "Syntax error: %s\n%s:%s" % (message, tokenizer.filename, tokenizer.line))


# Used as a status container during tree-building for every def body and the global body
class CompilerContext(object):
    # inFunction is used to check if a return stm appears in a valid context.
    def __init__(self, inFunction, builder):
        # Whether this is inside a function, mostly True, only for top-level scope it's False
        self.inFunction = inFunction
        
        self.hasEmptyReturn = False
        self.hasReturnWithValue = False
        self.isGenerator = False
        self.blockId = 0
        self.builder = builder
        self.statementStack = []
        self.funDecls = []
        self.varDecls = []
         
        # Status
        self.bracketLevel = 0
        self.curlyLevel = 0
        self.parenLevel = 0
        self.hookLevel = 0
        
        # Configure strict ecmascript 3 mode
        self.ecma3OnlyMode = False
        
        # Status flag during parsing
        self.inForLoopInit = False


def Script(tokenizer, compilerContext):
    """Parses the toplevel and def bodies."""
    node = Statements(tokenizer, compilerContext)
    
    # change type from "block" to "script" for script root
    node.type = "script"

    # copy over data from compiler context
    node.funDecls = compilerContext.funDecls
    node.varDecls = compilerContext.varDecls

    return node
    

def nest(tokenizer, compilerContext, node, func, end):
    """Statement stack and nested statement handler."""
    compilerContext.stmtStack.push(node)
    node = func(tokenizer, compilerContext)
    compilerContext.stmtStack.pop()
    end and tokenizer.mustMatch(end)
    
    return node


def Statements(tokenizer, compilerContext):
    """Parses a list of Statements."""

    builder = compilerContext.builder
    node = builder.BLOCK__build(tokenizer, compilerContext.blockId)
    compilerContext.blockId += 1

    builder.BLOCK__hoistLets(node)
    compilerContext.stmtStack.push(node)

    while not tokenizer.done and tokenizer.peek(True) != RIGHT_CURLY:
        builder.BLOCK__addStatement(node, Statement(tokenizer, compilerContext))

    compilerContext.stmtStack.pop()
    builder.BLOCK__finish(node)

    if node.needsHoisting:
        builder.setHoists(node.id, node.varDecls)
        # Propagate up to the function.
        compilerContext.needsHoisting = True

    return node


def Block(tokenizer, compilerContext):
    tokenizer.mustMatch(LEFT_CURLY)
    node = Statements(tokenizer, compilerContext)
    tokenizer.mustMatch(RIGHT_CURLY)
    
    return node


DECLARED_FORM = 0
EXPRESSED_FORM = 1
STATEMENT_FORM = 2


def Statement(tokenizer, compilerContext):
    """Parses a Statement."""

    tokenType = tokenizer.get(True)
    builder = compilerContext.builder

    # Cases for statements ending in a right curly return early, avoiding the
    # common semicolon insertion magic after this switch.
    
    if tokenType == FUNCTION:
        # DECLARED_FORM extends funDecls of compilerContext, STATEMENT_FORM doesn'tokenizer.
        if len(compilerContext.stmtStack) > 1:
            kind = STATEMENT_FORM
        else:
            kind = DECLARED_FORM
        
        return FunctionDefinition(tokenizer, compilerContext, True, kind)
        
        
    elif tokenType == LEFT_CURLY:
        node = Statements(tokenizer, compilerContext)
        tokenizer.mustMatch(RIGHT_CURLY)
        
        return node
        
        
    elif tokenType == IF:
        node = builder.IF__build(tokenizer)
        builder.IF__setCondition(node, ParenExpression(tokenizer, compilerContext))
        compilerContext.stmtStack.push(node)
        builder.IF__setThenPart(node, Statement(tokenizer, compilerContext))

        if tokenizer.match(ELSE):
            builder.IF__setElsePart(node, Statement(tokenizer, compilerContext))

        compilerContext.stmtStack.pop()
        builder.IF__finish(node)
        
        return node
        
        
    elif tokenType == SWITCH:
        # This allows CASEs after a DEFAULT, which is in the standard.
        node = builder.SWITCH__build(tokenizer)
        builder.SWITCH__setDiscriminant(node, ParenExpression(tokenizer, compilerContext))
        compilerContext.stmtStack.push(node)

        tokenizer.mustMatch(LEFT_CURLY)
        tokenType = tokenizer.get()
        
        while tokenType != RIGHT_CURLY:
            if tokenType == DEFAULT:
                if node.defaultIndex >= 0:
                    raise SyntaxError("More than one switch default", tokenizer)
                    
                childNode = builder.DEFAULT__build(tokenizer)
                builder.SWITCH__setDefaultIndex(node, len(node.cases))
                tokenizer.mustMatch(COLON)
                builder.DEFAULT__initializeStatements(childNode, tokenizer)
                
                while True:
                    tokenType=tokenizer.peek(True)
                    if tokenType == CASE or tokenType == DEFAULT or tokenType == RIGHT_CURLY:
                        break
                    builder.DEFAULT__addStatement(childNode, Statement(tokenizer, compilerContext))
                
                builder.DEFAULT__finish(childNode)
                break

            elif tokenType == CASE:
                childNode = builder.CASE__build(tokenizer)
                builder.CASE__setLabel(childNode, Expression(tokenizer, compilerContext, COLON))
                tokenizer.mustMatch(COLON)
                builder.CASE__initializeStatements(childNode, tokenizer)

                while True:
                    tokenType=tokenizer.peek(True)
                    if tokenType == CASE or tokenType == DEFAULT or tokenType == RIGHT_CURLY:
                        break
                    builder.CASE__addStatement(childNode, Statement(tokenizer, compilerContext))
                
                builder.CASE__finish(childNode)
                break

            else:
                raise SyntaxError("Invalid switch case", tokenizer)

            builder.SWITCH__addCase(node, childNode)
            tokenType = tokenizer.get()

        compilerContext.stmtStack.pop()
        builder.SWITCH__finish(node)

        return node
        

    elif tokenType == FOR:
        node = builder.FOR__build(tokenizer)
        
        if tokenizer.match(IDENTIFIER) and tokenizer.token.value == "each":
            builder.FOR__rebuildForEach(node)
            
        tokenizer.mustMatch(LEFT_PAREN)
        tokenType = tokenizer.peek()
        
        if tokenType != SEMICOLON:
            compilerContext.inForLoopInit = True
            
            if tokenType == VAR or tokenType == CONST:
                tokenizer.get()
                childNode = Variables(tokenizer, compilerContext)
            
            elif tokenType == LET:
                tokenizer.get()
                
                if tokenizer.peek() == LEFT_PAREN:
                    childNode = LetBlock(tokenizer, compilerContext, False)
                    
                else:
                    # Let in for head, we need to add an implicit block
                    # around the rest of the for.
                    forBlock = builder.BLOCK__build(tokenizer, compilerContext.blockId)
                    compilerContext.blockId += 1
                    compilerContext.stmtStack.push(forBlock)
                    childNode = Variables(tokenizer, compilerContext, forBlock)
                
            else:
                childNode = Expression(tokenizer, compilerContext)
            
            compilerContext.inForLoopInit = False

        if childNode and tokenizer.match(IN):
            builder.FOR__rebuildForIn(node)
            builder.FOR__setObject(node, Expression(tokenizer, compilerContext), forBlock)
            
            if childNode.type == VAR or childNode.type == LET:
                if len(childNode) != 1:
                    raise SyntaxError("Invalid for..in left-hand side", tokenizer)

                builder.FOR__setIterator(node, childNode[0], childNode, forBlock)
                
            else:
                builder.FOR__setIterator(node, childNode, null, forBlock)

        else:
            builder.FOR__setSetup(node, childNode)
            tokenizer.mustMatch(SEMICOLON)
            
            if node.isEach:
                raise SyntaxError("Invalid for each..in loop")
                
            builder.FOR__setCondition(node, (tokenizer.peek() == SEMICOLON) ? null : Expression(tokenizer, compilerContext))
            tokenizer.mustMatch(SEMICOLON)
            builder.FOR__setUpdate(node, (tokenizer.peek() == RIGHT_PAREN) ? null : Expression(tokenizer, compilerContext))
        
        tokenizer.mustMatch(RIGHT_PAREN)
        builder.FOR__setBody(node, nest(tokenizer, compilerContext, node, Statement))
        
        if forBlock:
            builder.BLOCK__finish(forBlock)
            compilerContext.stmtStack.pop()
    
        builder.FOR__finish(node)
        return node
        
        
    elif tokenType == WHILE:
        node = builder.WHILE__build(tokenizer)
        
        builder.WHILE__setCondition(node, ParenExpression(tokenizer, compilerContext))
        builder.WHILE__setBody(node, nest(tokenizer, compilerContext, node, Statement))
        builder.WHILE__finish(node)
        
        return node                                    
        
        
    elif tokenType == DO:
        node = builder.DO__build(tokenizer)
        
        builder.DO__setBody(node, nest(tokenizer, compilerContext, node, Statement, WHILE))
        builder.DO__setCondition(node, ParenExpression(tokenizer, compilerContext))
        builder.DO__finish(node)
        
        if not compilerContext.ecmaStrictMode:
            # <script language="JavaScript"> (without version hints) may need
            # automatic semicolon insertion without a newline after do-while.
            # See http://bugzilla.mozilla.org/show_bug.cgi?id=238945.
            tokenizer.match(SEMICOLON)
            return node

        # NO RETURN
      
      
    elif tokenType == BREAK or tokenType == CONTINUE:
        if tokenType == BREAK:
            node = builder.BREAK__build(tokenizer) 
        else:
            node = builder.CONTINUE__build(tokenizer)

        if tokenizer.peekOnSameLine() == IDENTIFIER:
            tokenizer.get()
            
            if tokenType == BREAK:
                builder.BREAK__setLabel(node, tokenizer.token.value)
            else:
                builder.CONTINUE__setLabel(node, tokenizer.token.value)

        ss = compilerContext.stmtStack
        i = len(ss)
        label = node.label

        if label:
            while True:
                i -= 1
                if i < 0:
                    raise SyntaxError("Label not found", tokenizer)
                if ss[i].label == label:
                    break

            # 
            # Both break and continue to label need to be handled specially
            # within a labeled loop, so that they target that loop. If not in
            # a loop, then break targets its labeled statement. Labels can be
            # nested so we skip all labels immediately enclosing the nearest
            # non-label statement.
            # 
            while i < len(ss) - 1 and ss[i+1].type == LABEL:
                i += 1
                
            if i < len(ss) - 1 and ss[i+1].isLoop:
                i += 1
            elif tokenType == CONTINUE:
                raise SyntaxError("Invalid continue", tokenizer)
                
        else:
            while True:
                i -= 1
                if i < 0:
                    raise SyntaxError("Invalid " + ((tokenType == BREAK) ? "break" : "continue"))
                if ss[i].isLoop or (tokenType == BREAK and ss[i].type == SWITCH):
                    break
        
        if tokenType == BREAK:
            builder.BREAK__setTarget(node, ss[i])
            builder.BREAK__finish(node)

        else:
            builder.CONTINUE__setTarget(node, ss[i])
            builder.CONTINUE__finish(node)
        
        # NO RETURN        


    elif tokenType == TRY:
        node = builder.TRY__build(tokenizer)
        builder.TRY__setTryBlock(node, Block(tokenizer, compilerContext))
        
        while tokenizer.match(CATCH):
            childNode = builder.CATCH__build(tokenizer)
            tokenizer.mustMatch(LEFT_PAREN)
            nextTokenType = tokenizer.get()
            
            if nextTokenType == LEFT_BRACKET or nextTokenType == LEFT_CURLY:
                # Destructured catch identifiers.
                tokenizer.unget()
                builder.CATCH__setVarName(childNode, DestructuringExpression(tokenizer, compilerContext, True))
            
            elif nextTokenType == IDENTIFIER:
                builder.CATCH__setVarName(childNode, tokenizer.token.value)
            
            else:
                raise SyntaxError("Missing identifier in catch", tokenizer)

            if tokenizer.match(IF):
                if compilerContext.ecma3OnlyMode:
                    raise SyntaxError("Illegal catch guard", tokenizer)
                    
                if len(node.catchClauses) and not node.catchClauses.top().guard:
                    raise SyntaxError("Guarded catch after unguarded", tokenizer)
                    
                builder.CATCH__setGuard(childNode, Expression(tokenizer, compilerContext))
                
            else:
                builder.CATCH__setGuard(childNode, null)
            
            tokenizer.mustMatch(RIGHT_PAREN)
            
            builder.CATCH__setBlock(childNode, Block(tokenizer, compilerContext))
            builder.CATCH__finish(childNode)
            
            builder.TRY__addCatch(node, childNode)
        
        builder.TRY__finishCatches(node)
        
        if tokenizer.match(FINALLY):
            builder.TRY__setFinallyBlock(node, Block(tokenizer, compilerContext))
            
        if not len(node.catchClauses) and not node.finallyBlock:
            raise SyntaxError("Invalid try statement", tokenizer)
            
        builder.TRY__finish(node)
        return node
        

    elif tokenType == CATCH or tokenType == FINALLY:
        raise SyntaxError(tokens[tokenType] + " without preceding try")


    elif tokenType == THROW:
        node = builder.THROW__build(tokenizer)
        
        builder.THROW__setException(node, Expression(tokenizer, compilerContext))
        builder.THROW__finish(node)
        
        # NO RETURN


    elif tokenType == RETURN:
        node = returnOrYield(tokenizer, compilerContext)
        
        # NO RETURN


    elif tokenType == WITH:
        node = builder.WITH__build(tokenizer)

        builder.WITH__setObject(node, ParenExpression(tokenizer, compilerContext))
        builder.WITH__setBody(node, nest(tokenizer, compilerContext, node, Statement))
        builder.WITH__finish(node)

        return node


    elif tokenType == VAR or tokenType == CONST:
        node = Variables(tokenizer, compilerContext)
        
        # NO RETURN
        

    elif tokenType == LET:
        if tokenizer.peek() == LEFT_PAREN:
            node = LetBlock(tokenizer, compilerContext, True)
        else
            node = Variables(tokenizer, compilerContext)
        
        # NO RETURN
        

    elif tokenType == DEBUGGER:
        node = builder.DEBUGGER__build(tokenizer)
        
        # NO RETURN
        

    elif tokenType == NEWLINE or tokenType == SEMICOLON:
        node = builder.SEMICOLON__build(tokenizer)
        
        builder.SEMICOLON__setExpression(node, null)
        builder.SEMICOLON__finish(tokenizer)
        
        return node


    else:
        if tokenType == IDENTIFIER:
            tokenType = tokenizer.peek()

            # Labeled statement.
            if tokenType == COLON:
                label = tokenizer.token.value
                ss = compilerContext.stmtStack
               
                i = len(ss)-1
                while i >= 0:
                    if ss[i].label == label:
                        raise SyntaxError("Duplicate label")
                    
                    i -= 1
               
                tokenizer.get()
                node = builder.LABEL__build(tokenizer)
                
                builder.LABEL__setLabel(node, label)
                builder.LABEL__setStatement(node, nest(tokenizer, compilerContext, node, Statement))
                builder.LABEL__finish(node)
                
                return node

        # Expression statement.
        # We unget the current token to parse the expression as a whole.
        node = builder.SEMICOLON__build(tokenizer)
        tokenizer.unget()
        builder.SEMICOLON__setExpression(node, Expression(tokenizer, compilerContext))
        node.end = node.expression.end
        builder.SEMICOLON__finish(node)
        
        # NO RETURN
        

    MagicalSemicolon(tokenizer)
    return node



def MagicalSemicolon(tokenizer):
    if tokenizer.lineno == tokenizer.token.lineno:
        tokenType = tokenizer.peekOnSameLine()
    
        if tokenType != END and tokenType != NEWLINE and tokenType != SEMICOLON and tokenType != RIGHT_CURLY:
            raise SyntaxError("Missing ; before statement", tokenizer)
    
    tokenizer.match(SEMICOLON)

    

def returnOrYield(tokenizer, compilerContext):
    builder = compilerContext.builder
    tokenType = tokenizer.token.type

    if tokenType == RETURN:
        if not compilerContext.inFunction:
            raise SyntaxError("Return not in function", tokenizer)
            
        node = builder.RETURN__build(tokenizer)
        
    else:
        if not compilerContext.inFunction:
            raise SyntaxError("Yield not in function", tokenizer)
            
        compilerContext.isGenerator = True
        node = builder.YIELD__build(tokenizer)

    nextTokenType = tokenizer.peek(True)
    if nextTokenType != END and nextTokenType != NEWLINE and nextTokenType != SEMICOLON and nextTokenType != RIGHT_CURLY and (tokenType != YIELD or (nextTokenType != tokenType and nextTokenType != RIGHT_BRACKET and nextTokenType != RIGHT_PAREN and nextTokenType != COLON and nextTokenType != COMMA))):
        if tokenType == RETURN:
            builder.RETURN__setValue(node, Expression(tokenizer, compilerContext))
            compilerContext.hasReturnWithValue = True
        else:
            builder.YIELD__setValue(node, AssignExpression(tokenizer, compilerContext))
        
    elif tokenType == RETURN:
        compilerContext.hasEmptyReturn = True

    # Disallow return v; in generator.
    if compilerContext.hasReturnWithValue and compilerContext.isGenerator:
        raise SyntaxError("Generator returns a value", tokenizer)

    if tokenType == RETURN:
        builder.RETURN__finish(node)
    else:
        builder.YIELD__finish(node)

    return node



def FunctionDefinition(tokenizer, compilerContext, requireName, functionForm):
    builder = compilerContext.builder
    f = builder.FUNCTION__build(tokenizer)
    
    if tokenizer.match(IDENTIFIER):
        builder.FUNCTION__setName(f, tokenizer.token.value)
    elif requireName:
        raise SyntaxError("Missing def identifier", tokenizer)

    tokenizer.mustMatch(LEFT_PAREN)
    
    if not tokenizer.match(RIGHT_PAREN):
        while True:
            tokenType = tokenizer.get()
            if tokenType == LEFT_BRACKET or tokenType == LEFT_CURLY:
                # Destructured formal parameters.
                tokenizer.unget()
                builder.FUNCTION__addParam(f, DestructuringExpression(tokenizer, compilerContext))
                
            elif tokenType == IDENTIFIER:
                builder.FUNCTION__addParam(f, tokenizer.token.value)
                
            else:
                raise SyntaxError("Missing formal parameter", tokenizer)
        
            if not tokenizer.match(COMMA):
                break
        
        tokenizer.mustMatch(RIGHT_PAREN)

    # Do we have an expression closure or a normal body?
    tokenType = tokenizer.get()
    if tokenType != LEFT_CURLY:
        tokenizer.unget()

    x2 = new CompilerContext(True, builder)
    rp = tokenizer.save()
    
    if compilerContext.inFunction:
        # 
        # Inner functions don'tokenizer reset block numbering. They also need to
        # remember which block they were parsed in for hoisting (see comment
        # below).
        # 
        x2.blockId = compilerContext.blockId

    if tokenType != LEFT_CURLY:
        builder.FUNCTION__setBody(f, AssignExpression(tokenizer, compilerContext))
        if compilerContext.isGenerator:
            raise SyntaxError("Generator returns a value", tokenizer)
            
    else:
        builder.FUNCTION__hoistVars(x2.blockId)
        builder.FUNCTION__setBody(f, Script(tokenizer, x2))

    # 
    # To linearize hoisting with nested blocks needing hoists, if a toplevel
    # def has any hoists we reparse the entire thing. Each toplevel
    # def is parsed at most twice.
    # 
    # Pass 1: If there needs to be hoisting at any child block or inner
    # function, the entire def gets reparsed.
    # 
    # Pass 2: It's possible that hoisting has changed the upvars of
    # functions. That is, consider:
    # 
    # def f() {
    #   compilerContext = 0
    #   g()
    #   compilerContext; # compilerContext's forward pointer should be invalidated!
    #   def g() {
    #     compilerContext = 'g'
    #   }
    #   var compilerContext
    # }
    # 
    # So, a def needs to remember in which block it is parsed under
    # (since the def body is _not_ hoisted, only the declaration) and
    # upon hoisting, needs to recalculate all its upvars up front.
    # 
    if x2.needsHoisting:
        # Order is important here! funDecls must come _after_ varDecls!
        builder.setHoists(f.body.id, x2.varDecls.concat(x2.funDecls))

        if compilerContext.inFunction:
            # Propagate up to the parent def if we're an inner function.
            compilerContext.needsHoisting = True
        
        else:
            # Only re-parse toplevel functions.
            x3 = x2
            x2 = new CompilerContext(True, builder)
            tokenizer.rewind(rp)
            
            # Set a flag in case the builder wants to have different behavior
            # on the second pass.
            builder.secondPass = True
            builder.FUNCTION__hoistVars(f.body.id, True)
            builder.FUNCTION__setBody(f, Script(tokenizer, x2))
            builder.secondPass = False

    if tokenType == LEFT_CURLY:
        tokenizer.mustMatch(RIGHT_CURLY)

    f.end = tokenizer.token.end
    f.functionForm = functionForm
    
    if functionForm == DECLARED_FORM:
        compilerContext.funDecls.push(f)
        
    builder.FUNCTION__finish(f, compilerContext)
    
    return f



def Variables(tokenizer, compilerContext, letBlock):
    """Parses a comma-separated list of var declarations (and maybe initializations)."""
    
    builder = compilerContext.builder
    if tokenizer.token.type == VAR:
        build = builder.VAR__build
        addDecl = builder.VAR__addDecl
        finish = builder.VAR__finish
        s = compilerContext
            
    elif tokenizer.token.type == CONST:
        build = builder.CONST__build
        addDecl = builder.CONST__addDecl
        finish = builder.CONST__finish
        s = compilerContext
        
    elif tokenizer.token.type == LET or tokenizer.token.type == LEFT_PAREN:
        build = builder.LET__build
        addDecl = builder.LET__addDecl
        finish = builder.LET__finish
        
        if not letBlock:
            ss = compilerContext.stmtStack
            i = len(ss) - 1
            
            # a BLOCK *must* be found.
            while ss[i].type != BLOCK:
                i -= 1

            # Lets at the def toplevel are just vars, at least in SpiderMonkey.
            if i == 0:
                build = builder.VAR__build
                addDecl = builder.VAR__addDecl
                finish = builder.VAR__finish
                s = compilerContext

            else:
                s = ss[i]
            
        else:
            s = letBlock

    node = build.call(builder, tokenizer)
    initializers = []

    while True:
        tokenType = tokenizer.get()

        # FIXME Should have a special DECLARATION node instead of overloading
        # IDENTIFIER to mean both identifier declarations and destructured
        # declarations.
        childNode = builder.DECL__build(tokenizer)
        
        if tokenType == LEFT_BRACKET or tokenType == LEFT_CURLY:
            # Pass in s if we need to add each pattern matched into
            # its varDecls, else pass in compilerContext.
            data = null

            # Need to unget to parse the full destructured expression.
            tokenizer.unget()
            builder.DECL__setName(childNode, DestructuringExpression(tokenizer, compilerContext, True, s))

            if compilerContext.inForLoopInit and tokenizer.peek() == IN:
                addDecl.call(builder, node, childNode, s)
                continue

            tokenizer.mustMatch(ASSIGN)
            if (tokenizer.token.assignOp)
                raise SyntaxError("Invalid variable initialization", tokenizer)

            # Parse the init as a normal assignment.
            n3 = builder.ASSIGN__build(tokenizer)
            builder.ASSIGN__addOperand(n3, childNode.name)
            builder.ASSIGN__addOperand(n3, AssignExpression(tokenizer, compilerContext))
            builder.ASSIGN__finish(n3)

            # But only add the rhs as the initializer.
            builder.DECL__setInitializer(childNode, n3[1])
            builder.DECL__finish(childNode)
            addDecl.call(builder, node, childNode, s)
            continue

        if tokenType != IDENTIFIER:
            raise SyntaxError("Missing variable name", tokenizer)

        builder.DECL__setName(childNode, tokenizer.token.value)
        builder.DECL__setReadOnly(childNode, node.type == CONST)
        addDecl.call(builder, node, childNode, s)

        if tokenizer.match(ASSIGN):
            if tokenizer.token.assignOp:
                raise SyntaxError("Invalid variable initialization", tokenizer)

            # Parse the init as a normal assignment.
            id = mkIdentifier(childNode.tokenizer, childNode.name, True)
            n3 = builder.ASSIGN__build(tokenizer)
            
            builder.ASSIGN__addOperand(n3, id)
            builder.ASSIGN__addOperand(n3, AssignExpression(tokenizer, compilerContext))
            builder.ASSIGN__finish(n3)
            
            initializers.push(n3)

            # But only add the rhs as the initializer.
            builder.DECL__setInitializer(childNode, n3[1])

        builder.DECL__finish(childNode)
        s.varDecls.push(childNode)
        
        if not tokenizer.match(COMMA):
            break
        
    finish.call(builder, node)
    return node



def LetBlock(tokenizer, compilerContext, isStatement):
    """Does not handle let inside of for loop init."""
    builder = compilerContext.builder

    # tokenizer.token.type must be LET
    node = builder.LET_BLOCK__build(tokenizer)
    tokenizer.mustMatch(LEFT_PAREN)
    builder.LET_BLOCK__setVariables(node, Variables(tokenizer, compilerContext, node))
    tokenizer.mustMatch(RIGHT_PAREN)

    if isStatement and tokenizer.peek() != LEFT_CURLY:
        # If this is really an expression in let statement guise, then we
        # need to wrap the LET_BLOCK node in a SEMICOLON node so that we pop
        # the return value of the expression.
        childNode = builder.SEMICOLON__build(tokenizer)
        builder.SEMICOLON__setExpression(childNode, node)
        builder.SEMICOLON__finish(childNode)
        isStatement = False

    if isStatement:
        childNode = Block(tokenizer, compilerContext)
        builder.LET_BLOCK__setBlock(node, childNode)
        
    else:
        childNode = AssignExpression(tokenizer, compilerContext)
        builder.LET_BLOCK__setExpression(node, childNode)

    builder.LET_BLOCK__finish(node)
    return node



def checkDestructuring(tokenizer, compilerContext, node, simpleNamesOnly, data):
    if node.type == ARRAY_COMP:
        raise SyntaxError("Invalid array comprehension left-hand side")
        
    if node.type != ARRAY_INIT and node.type != OBJECT_INIT:
        return

    builder = compilerContext.builder

    for child in node:
        if child == None:
            continue
        
        if child.type == PROPERTY_INIT:
            lhs = child[0]
            rhs = child[1]
        else:
            lhs = None
            rhs = None
        
        if rhs and (rhs.type == ARRAY_INIT or rhs.type == OBJECT_INIT):
            checkDestructuring(tokenizer, compilerContext, rhs, simpleNamesOnly, data)
            
        if lhs and simpleNamesOnly:
            # In declarations, lhs must be simple names
            if lhs.type != IDENTIFIER:
                raise SyntaxError("Missing name in pattern")
                
            elif data:
                childNode = builder.DECL__build(tokenizer)
                builder.DECL__setName(childNode, lhs.value)

                # Don't need to set initializer because it's just for
                # hoisting anyways.
                builder.DECL__finish(childNode)

                # Each pattern needs to be added to varDecls.
                data.varDecls.push(childNode)


def DestructuringExpression(tokenizer, compilerContext, simpleNamesOnly, data):
    node = PrimaryExpression(tokenizer, compilerContext)
    checkDestructuring(tokenizer, compilerContext, node, simpleNamesOnly, data)

    return node


def GeneratorExpression(tokenizer, compilerContext, e):
    node = builder.GENERATOR__build(tokenizer)

    builder.GENERATOR__setExpression(node, e)
    builder.GENERATOR__setTail(node, comprehensionTail(tokenizer, compilerContext))
    builder.GENERATOR__finish(node)

    return node


def comprehensionTail(tokenizer, compilerContext):
    builder = compilerContext.builder
    
    # tokenizer.token.type must be FOR
    body = builder.COMP_TAIL__build(tokenizer)

    while True:
        node = builder.FOR__build(tokenizer)
        
        # Comprehension tails are always for..in loops.
        builder.FOR__rebuildForIn(node)
        if tokenizer.match(IDENTIFIER):
            # But sometimes they're for each..in.
            if tokenizer.token.value == "each":
                builder.FOR__rebuildForEach(node)
            else:
                tokenizer.unget()

        tokenizer.mustMatch(LEFT_PAREN)
        
        tokenType = tokenizer.get()
        if tokenType == LEFT_BRACKET or tokenType == LEFT_CURLY:
            tokenizer.unget()
            # Destructured left side of for in comprehension tails.
            builder.FOR__setIterator(node, DestructuringExpression(tokenizer, compilerContext), null)
            break

        elif tokenType == IDENTIFIER:
            n3 = builder.DECL__build(tokenizer)
            
            builder.DECL__setName(n3, n3.value)
            builder.DECL__finish(n3)
            
            childNode = builder.VAR__build(tokenizer)
            
            builder.VAR__addDecl(childNode, n3)
            builder.VAR__finish(childNode)
            builder.FOR__setIterator(node, n3, childNode)
            
            # Don't add to varDecls since the semantics of comprehensions is
            # such that the variables are in their own def when
            # desugared.
            break

        else:
            raise SyntaxError("Missing identifier")
        
        tokenizer.mustMatch(IN)
        builder.FOR__setObject(node, Expression(tokenizer, compilerContext))
        tokenizer.mustMatch(RIGHT_PAREN)
        builder.COMP_TAIL__addFor(body, node)
        
        if not tokenizer.match(FOR):
            break

    # Optional guard.
    if (tokenizer.match(IF))
        builder.COMP_TAIL__setGuard(body, ParenExpression(tokenizer, compilerContext))

    builder.COMP_TAIL__finish(body)

    return body


def ParenExpression(tokenizer, compilerContext):
    tokenizer.mustMatch(LEFT_PAREN)

    # Always accept the 'in' operator in a parenthesized expression,
    # where it's unambiguous, even if we might be parsing the init of a
    # for statement.
    oldLoopInit = compilerContext.inForLoopInit
    compilerContext.inForLoopInit = False
    node = Expression(tokenizer, compilerContext)
    compilerContext.inForLoopInit = oldLoopInit

    err = "expression must be parenthesized"
    if tokenizer.match(FOR):
        if node.type == YIELD and not node.parenthesized:
            raise SyntaxError("Yield " + err, tokenizer)
            
        if node.type == COMMA and not node.parenthesized:
            raise SyntaxError("Generator " + err, tokenizer)
            
        node = GeneratorExpression(tokenizer, compilerContext, node)

    tokenizer.mustMatch(RIGHT_PAREN)

    return node


def Expression(tokenizer, compilerContext):
    """Top-down expression parser matched against SpiderMonkey."""
    builder = compilerContext.builder
    node = AssignExpression(tokenizer, compilerContext)

    if tokenizer.match(COMMA):
        childNode = builder.COMMA__build(tokenizer)
        builder.COMMA__addOperand(childNode, node)
        node = childNode
        while True:
            childNode = node[len(node)-1]
            if childNode.type == YIELD and not childNode.parenthesized:
                raise SyntaxError("Yield expression must be parenthesized")
            builder.COMMA__addOperand(node, AssignExpression(tokenizer, compilerContext))
            
            if not tokenizer.match(COMMA):
                break
                
        builder.COMMA__finish(node)

    return node


def AssignExpression(tokenizer, compilerContext):
    builder = compilerContext.builder

    # Have to treat yield like an operand because it could be the leftmost
    # operand of the expression.
    if tokenizer.match(YIELD, True):
        return returnOrYield(tokenizer, compilerContext)

    node = builder.ASSIGN__build(tokenizer)
    lhs = ConditionalExpression(tokenizer, compilerContext)

    if not tokenizer.match(ASSIGN):
        builder.ASSIGN__finish(node)
        return lhs

    if lhs.type == OBJECT_INIT or lhs.type == ARRAY_INIT:
        checkDestructuring(tokenizer, compilerContext, lhs)
    elif lhs.type == IDENTIFIER or lhs.type == DOT or lhs.type == INDEX or lhs.type == CALL:
        pass
    else:
        raise SyntaxError("Bad left-hand side of assignment", tokenizer)
        
    builder.ASSIGN__setAssignOp(node, tokenizer.token.assignOp)
    builder.ASSIGN__addOperand(node, lhs)
    builder.ASSIGN__addOperand(node, AssignExpression(tokenizer, compilerContext))
    builder.ASSIGN__finish(node)

    return node


def ConditionalExpression(tokenizer, compilerContext):
    builder = compilerContext.builder
    node = OrExpression(tokenizer, compilerContext)

    if tokenizer.match(HOOK):
        childNode = node
        node = builder.HOOK__build(tokenizer)
        builder.HOOK__setCondition(node, childNode)

        # Always accept the 'in' operator in the middle clause of a ternary,
        # where it's unambiguous, even if we might be parsing the init of a
        # for statement.
        oldLoopInit = compilerContext.inForLoopInit
        compilerContext.inForLoopInit = False
        builder.HOOK__setThenPart(node, AssignExpression(tokenizer, compilerContext))
        compilerContext.inForLoopInit = oldLoopInit
        
        if not tokenizer.match(COLON):
            raise SyntaxError("Missing : after ?", tokenizer)
            
        builder.HOOK__setElsePart(node, AssignExpression(tokenizer, compilerContext))
        builder.HOOK__finish(node)

    return node
    

def OrExpression(tokenizer, compilerContext):
    builder = compilerContext.builder
    node = AndExpression(tokenizer, compilerContext)
    
    while tokenizer.match(OR):
        childNode = builder.OR__build(tokenizer)
        builder.OR__addOperand(childNode, node)
        builder.OR__addOperand(childNode, AndExpression(tokenizer, compilerContext))
        builder.OR__finish(childNode)
        node = childNode

    return node


def AndExpression(tokenizer, compilerContext):
    builder = compilerContext.builder
    node = BitwiseOrExpression(tokenizer, compilerContext)

    while tokenizer.match(AND):
        childNode = builder.AND__build(tokenizer)
        builder.AND__addOperand(childNode, node)
        builder.AND__addOperand(childNode, BitwiseOrExpression(tokenizer, compilerContext))
        builder.AND__finish(childNode)
        node = childNode

    return node


def BitwiseOrExpression(tokenizer, compilerContext):
    builder = compilerContext.builder
    node = BitwiseXorExpression(tokenizer, compilerContext)
    
    while tokenizer.match(BITWISE_OR):
        childNode = builder.BITWISE_OR__build(tokenizer)
        builder.BITWISE_OR__addOperand(childNode, node)
        builder.BITWISE_OR__addOperand(childNode, BitwiseXorExpression(tokenizer, compilerContext))
        builder.BITWISE_OR__finish(childNode)
        node = childNode

    return node


def BitwiseXorExpression(tokenizer, compilerContext):
    builder = compilerContext.builder
    node = BitwiseAndExpression(tokenizer, compilerContext)
    
    while tokenizer.match(BITWISE_XOR):
        childNode = builder.BITWISE_XOR__build(tokenizer)
        builder.BITWISE_XOR__addOperand(childNode, node)
        builder.BITWISE_XOR__addOperand(childNode, BitwiseAndExpression(tokenizer, compilerContext))
        builder.BITWISE_XOR__finish(childNode)
        node = childNode

    return node


def BitwiseAndExpression(tokenizer, compilerContext):
    builder = compilerContext.builder
    node = EqualityExpression(tokenizer, compilerContext)

    while tokenizer.match(BITWISE_AND):
        childNode = builder.BITWISE_AND__build(tokenizer)
        builder.BITWISE_AND__addOperand(childNode, node)
        builder.BITWISE_AND__addOperand(childNode, EqualityExpression(tokenizer, compilerContext))
        builder.BITWISE_AND__finish(childNode)
        node = childNode

    return node


def EqualityExpression(tokenizer, compilerContext):
    builder = compilerContext.builder
    node = RelationalExpression(tokenizer, compilerContext)
    
    while tokenizer.match(EQ) or tokenizer.match(NE) or tokenizer.match(STRICT_EQ) or tokenizer.match(STRICT_NE):
        childNode = builder.EQUALITY__build(tokenizer)
        builder.EQUALITY__addOperand(childNode, node)
        builder.EQUALITY__addOperand(childNode, RelationalExpression(tokenizer, compilerContext))
        builder.EQUALITY__finish(childNode)
        node = childNode

    return node


def RelationalExpression(tokenizer, compilerContext):
    builder = compilerContext.builder
    oldLoopInit = compilerContext.inForLoopInit

    # Uses of the in operator in shiftExprs are always unambiguous,
    # so unset the flag that prohibits recognizing it.
    compilerContext.inForLoopInit = False
    node = ShiftExpression(tokenizer, compilerContext)

    while tokenizer.match(LT) or tokenizer.match(LE) or tokenizer.match(GE) or tokenizer.match(GT) or (oldLoopInit == False and tokenizer.match(IN)) or tokenizer.match(INSTANCEOF):
        childNode = builder.RELATIONAL__build(tokenizer)
        builder.RELATIONAL__addOperand(childNode, node)
        builder.RELATIONAL__addOperand(childNode, ShiftExpression(tokenizer, compilerContext))
        builder.RELATIONAL__finish(childNode)
        node = childNode
    
    compilerContext.inForLoopInit = oldLoopInit

    return node


def ShiftExpression(tokenizer, compilerContext):
    builder = compilerContext.builder
    node = AddExpression(tokenizer, compilerContext)
    
    while tokenizer.match(LSH) or tokenizer.match(RSH) or tokenizer.match(URSH):
        childNode = builder.SHIFT__build(tokenizer)
        builder.SHIFT__addOperand(childNode, node)
        builder.SHIFT__addOperand(childNode, AddExpression(tokenizer, compilerContext))
        builder.SHIFT__finish(childNode)
        node = childNode

    return node


def AddExpression(tokenizer, compilerContext):
    builder = compilerContext.builder
    node = MultiplyExpression(tokenizer, compilerContext)
    
    while tokenizer.match(PLUS) or tokenizer.match(MINUS):
        childNode = builder.ADD__build(tokenizer)
        builder.ADD__addOperand(childNode, node)
        builder.ADD__addOperand(childNode, MultiplyExpression(tokenizer, compilerContext))
        builder.ADD__finish(childNode)
        node = childNode

    return node


def MultiplyExpression(tokenizer, compilerContext):
    builder = compilerContext.builder
    node = UnaryExpression(tokenizer, compilerContext)
    
    while tokenizer.match(MUL) or tokenizer.match(DIV) or tokenizer.match(MOD):
        childNode = builder.MULTIPLY__build(tokenizer)
        builder.MULTIPLY__addOperand(childNode, node)
        builder.MULTIPLY__addOperand(childNode, UnaryExpression(tokenizer, compilerContext))
        builder.MULTIPLY__finish(childNode)
        node = childNode

    return node


def UnaryExpression(tokenizer, compilerContext):
    builder = compilerContext.builder
    tokenType = tokenizer.get(True)

    if tokenType in [DELETE, VOID, TYPEOF, NOT, BITWISE_NOT, PLUS, MINUS]:
        node = builder.UNARY__build(tokenizer)
        builder.UNARY__addOperand(node, UnaryExpression(tokenizer, compilerContext))
    
    elif tokenType == INCREMENT or tokenType == DECREMENT:
        # Prefix increment/decrement.
        node = builder.UNARY__build(tokenizer)
        builder.UNARY__addOperand(node, MemberExpression(tokenizer, compilerContext, True))

    else:
        tokenizer.unget()
        node = MemberExpression(tokenizer, compilerContext, True)

        # Don't look across a newline boundary for a postfix {in,de}crement.
        if tokenizer.tokens[(tokenizer.tokenIndex + tokenizer.lookahead - 1) & 3].lineno == tokenizer.lineno:
            if tokenizer.match(INCREMENT) or tokenizer.match(DECREMENT):
                childNode = builder.UNARY__build(tokenizer)
                builder.UNARY__setPostfix(childNode)
                builder.UNARY__finish(node)
                builder.UNARY__addOperand(childNode, node)
                node = childNode

    builder.UNARY__finish(node)
    return node


def MemberExpression(tokenizer, compilerContext, allowCallSyntax):
    builder = compilerContext.builder

    if tokenizer.match(NEW):
        node = builder.MEMBER__build(tokenizer)
        builder.MEMBER__addOperand(node, MemberExpression(tokenizer, compilerContext, False))
        
        if tokenizer.match(LEFT_PAREN):
            builder.MEMBER__rebuildNewWithArgs(node)
            builder.MEMBER__addOperand(node, ArgumentList(tokenizer, compilerContext))
        
        builder.MEMBER__finish(node)
    
    else:
        node = PrimaryExpression(tokenizer, compilerContext)

    while True:
        tokenType = tokenizer.get()
        if tokenType == END:
            break
        
        if tokenType == DOT:
            childNode = builder.MEMBER__build(tokenizer)
            builder.MEMBER__addOperand(childNode, node)
            tokenizer.mustMatch(IDENTIFIER)
            builder.MEMBER__addOperand(childNode, builder.MEMBER__build(tokenizer))

        elif tokenType == LEFT_BRACKET:
            childNode = builder.MEMBER__build(tokenizer, INDEX)
            builder.MEMBER__addOperand(childNode, node)
            builder.MEMBER__addOperand(childNode, Expression(tokenizer, compilerContext))
            tokenizer.mustMatch(RIGHT_BRACKET)

        elif tokenType == LEFT_PAREN and allowCallSyntax:
            childNode = builder.MEMBER__build(tokenizer, CALL)
            builder.MEMBER__addOperand(childNode, node)
            builder.MEMBER__addOperand(childNode, ArgumentList(tokenizer, compilerContext))

        else:
            tokenizer.unget()
            return node

        builder.MEMBER__finish(childNode)
        node = childNode

    return node


def ArgumentList(tokenizer, compilerContext):
    builder = compilerContext.builder
    node = builder.LIST__build(tokenizer)
    
    if tokenizer.match(RIGHT_PAREN, True):
        return node
    
    while True:    
        childNode = AssignExpression(tokenizer, compilerContext)
        if childNode.type == YIELD and not childNode.parenthesized and tokenizer.peek() == COMMA:
            raise SyntaxError("Yield expression must be parenthesized", tokenizer)
            
        if tokenizer.match(FOR):
            childNode = GeneratorExpression(tokenizer, compilerContext, childNode)
            if len(node) > 1 or tokenizer.peek(True) == COMMA:
                raise SyntaxError("Generator expression must be parenthesized", tokenizer)
        
        builder.LIST__addOperand(node, childNode)
        if not tokenizer.match(COMMA):
            break

    tokenizer.mustMatch(RIGHT_PAREN)
    builder.LIST__finish(node)

    return node


def PrimaryExpression(tokenizer, compilerContext):
    builder = compilerContext.builder
    tokenType = tokenizer.get(True)

    if tokenType == FUNCTION:
        node = FunctionDefinition(tokenizer, compilerContext, False, EXPRESSED_FORM)

    elif tokenType == LEFT_BRACKET:
        node = builder.ARRAY_INIT__build(tokenizer)
        while True:
            tokenType = tokenizer.peek()
            if tokenType == RIGHT_BRACKET:
                break
        
            if tokenType == COMMA:
                tokenizer.get()
                builder.ARRAY_INIT__addElement(node, null)
                continue

            builder.ARRAY_INIT__addElement(node, AssignExpression(tokenizer, compilerContext))

            if tokenType != COMMA and not tokenizer.match(COMMA)
                break

        # If we matched exactly one element and got a FOR, we have an
        # array comprehension.
        if len(node) == 1 and tokenizer.match(FOR):
            childNode = builder.ARRAY_COMP__build(tokenizer)
            builder.ARRAY_COMP__setExpression(childNode, node[0])
            builder.ARRAY_COMP__setTail(childNode, comprehensionTail(tokenizer, compilerContext))
            node = childNode
        
        tokenizer.mustMatch(RIGHT_BRACKET)
        builder.PRIMARY__finish(node)

    elif tokenType == LEFT_CURLY:
        node = builder.OBJECT_INIT__build(tokenizer)

        # Simulate a label-goto from JS via a closure
        def object_init():
            if not tokenizer.match(RIGHT_CURLY):
                while True:
                    tokenType = tokenizer.get()
                    
                    if (tokenizer.token.value == "get" or tokenizer.token.value == "set") and tokenizer.peek() == IDENTIFIER:
                        if compilerContext.ecma3OnlyMode:
                            raise SyntaxError("Illegal property accessor", tokenizer)
                            
                        fd = FunctionDefinition(tokenizer, compilerContext, True, EXPRESSED_FORM)
                        builder.OBJECT_INIT__addProperty(node, fd)
                        
                    else:
                        if tokenType == IDENTIFIER or tokenType == NUMBER or tokenType == STRING:
                            id = builder.PRIMARY__build(tokenizer, IDENTIFIER)
                            builder.PRIMARY__finish(id)
                            
                        elif tokenType == RIGHT_CURLY:
                            if compilerContext.ecma3OnlyMode:
                                raise SyntaxError("Illegal trailing ,", tokenizer)
                            
                            # re-call self
                            object_init()
                            
                        else:
                            if tokenizer.token.value in keywords:
                                id = builder.PRIMARY__build(tokenizer, IDENTIFIER)
                                builder.PRIMARY__finish(id)
                            else:
                                raise SyntaxError("Invalid property name", tokenizer)
                        
                        if tokenizer.match(COLON):
                            childNode = builder.PROPERTY_INIT__build(tokenizer)
                            builder.PROPERTY_INIT__addOperand(childNode, id)
                            builder.PROPERTY_INIT__addOperand(childNode, AssignExpression(tokenizer, compilerContext))
                            builder.PROPERTY_INIT__finish(childNode)
                            builder.OBJECT_INIT__addProperty(node, childNode)
                            
                        else:
                            # Support, e.g., |var {compilerContext, y} = o| as destructuring shorthand
                            # for |var {compilerContext: compilerContext, y: y} = o|, per proposed JS2/ES4 for JS1.8.
                            if tokenizer.peek() != COMMA and tokenizer.peek() != RIGHT_CURLY:
                                raise SyntaxError("Missing : after property", tokenizer)
                            builder.OBJECT_INIT__addProperty(node, id)
                        
                    if not tokenizer.match(COMMA):
                        break

                tokenizer.mustMatch(RIGHT_CURLY)

            builder.OBJECT_INIT__finish(node)
        
        # Initial call
        object_init()        

    elif tokenType == LEFT_PAREN:
        # ParenExpression does its own matching on parentheses, so we need to unget.
        tokenizer.unget()
        node = ParenExpression(tokenizer, compilerContext)
        node.parenthesized = True

    elif tokenType == LET:
        node = LetBlock(tokenizer, compilerContext, False)

    elif tokenType in [NULL, THIS, TRUE, FALSE, IDENTIFIER, NUMBER, STRING, REGEXP]:
        node = builder.PRIMARY__build(tokenizer)
        builder.PRIMARY__finish(node)

    else:
        raise SyntaxError("Missing operand", tokenizer)

    return node


def parse(builder, source, filename, line):
    tokenizer = new Tokenizer(source, filename, line)
    compilerContext = new CompilerContext(False, builder)
    node = Script(tokenizer, compilerContext)
    
    if not tokenizer.done:
        raise SyntaxError("Syntax error", tokenizer)

    return node
