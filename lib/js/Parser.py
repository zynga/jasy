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
    var node = func(tokenizer, compilerContext)
    compilerContext.stmtStack.pop()
    end and tokenizer.mustMatch(end)
    
    return node


def Statements(tokenizer, compilerContext):
    """Parses a list of Statements."""

    builder = compilerContext.builder
    node = builder.BLOCK$build(tokenizer, compilerContext.blockId++)

    builder.BLOCK$hoistLets(node)
    compilerContext.stmtStack.push(node)

    while !tokenizer.done and tokenizer.peek(True) != RIGHT_CURLY:
        builder.BLOCK$addStatement(node, Statement(tokenizer, compilerContext))

    compilerContext.stmtStack.pop()
    builder.BLOCK$finish(node)

    if node.needsHoisting:
        builder.setHoists(node.id, node.varDecls)
        # Propagate up to the function.
        compilerContext.needsHoisting = True

    return node


def Block(tokenizer, compilerContext):
    tokenizer.mustMatch(LEFT_CURLY)
    var node = Statements(tokenizer, compilerContext)
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
        if compilerContext.stmtStack.length > 1:
            kind = STATEMENT_FORM
        else:
            kind = DECLARED_FORM
        
        return FunctionDefinition(tokenizer, compilerContext, True, kind)
        
        
    elif tokenType == LEFT_CURLY:
        node = Statements(tokenizer, compilerContext)
        tokenizer.mustMatch(RIGHT_CURLY)
        
        return node
        
        
    elif tokenType == IF:
        node = builder.IF$build(tokenizer)
        builder.IF$setCondition(node, ParenExpression(tokenizer, compilerContext))
        compilerContext.stmtStack.push(node)
        builder.IF$setThenPart(node, Statement(tokenizer, compilerContext))

        if tokenizer.match(ELSE):
            builder.IF$setElsePart(node, Statement(tokenizer, compilerContext))

        compilerContext.stmtStack.pop()
        builder.IF$finish(node)
        
        return node
        
        
    elif tokenType == SWITCH:
        # This allows CASEs after a DEFAULT, which is in the standard.
        node = builder.SWITCH$build(tokenizer)
        builder.SWITCH$setDiscriminant(node, ParenExpression(tokenizer, compilerContext))
        compilerContext.stmtStack.push(node)

        tokenizer.mustMatch(LEFT_CURLY)
        tokenType = tokenizer.get()
        
        while tokenType != RIGHT_CURLY:
            if tokenType == DEFAULT:
                if node.defaultIndex >= 0:
                    raise SyntaxError("More than one switch default", tokenizer)
                    
                childNode = builder.DEFAULT$build(tokenizer)
                builder.SWITCH$setDefaultIndex(node, node.cases.length)
                tokenizer.mustMatch(COLON)
                builder.DEFAULT$initializeStatements(childNode, tokenizer)
                
                while ((tokenType=tokenizer.peek(True)) != CASE and tokenType != DEFAULT and tokenType != RIGHT_CURLY)
                    builder.DEFAULT$addStatement(childNode, Statement(tokenizer, compilerContext))
                    
                builder.DEFAULT$finish(childNode)
                break

            elif tokenType == CASE:
                childNode = builder.CASE$build(tokenizer)
                builder.CASE$setLabel(childNode, Expression(tokenizer, compilerContext, COLON))
                tokenizer.mustMatch(COLON)
                builder.CASE$initializeStatements(childNode, tokenizer)
                
                while ((tokenType=tokenizer.peek(True)) != CASE and tokenType != DEFAULT and tokenType != RIGHT_CURLY)
                    builder.CASE$addStatement(childNode, Statement(tokenizer, compilerContext))
                
                builder.CASE$finish(childNode)
                break

            else:
                raise SyntaxError("Invalid switch case", tokenizer)

            builder.SWITCH$addCase(node, childNode)
            tokenType = tokenizer.get()

        compilerContext.stmtStack.pop()
        builder.SWITCH$finish(node)

        return node
        

    elif tokenType == FOR:
        node = builder.FOR$build(tokenizer)
        
        if tokenizer.match(IDENTIFIER) and tokenizer.token.value == "each":
            builder.FOR$rebuildForEach(node)
            
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
                    forBlock = builder.BLOCK$build(tokenizer, compilerContext.blockId++)
                    compilerContext.stmtStack.push(forBlock)
                    childNode = Variables(tokenizer, compilerContext, forBlock)
                
            else:
                childNode = Expression(tokenizer, compilerContext)
            
            compilerContext.inForLoopInit = False

        if childNode and tokenizer.match(IN):
            builder.FOR$rebuildForIn(node)
            builder.FOR$setObject(node, Expression(tokenizer, compilerContext), forBlock)
            
            if childNode.type == VAR or childNode.type == LET:
                if len(childNode) != 1:
                    raise SyntaxError("Invalid for..in left-hand side", tokenizer)

                builder.FOR$setIterator(node, childNode[0], childNode, forBlock)
                
            else:
                builder.FOR$setIterator(node, childNode, null, forBlock)

        else:
            builder.FOR$setSetup(node, childNode)
            tokenizer.mustMatch(SEMICOLON)
            
            if node.isEach:
                raise SyntaxError("Invalid for each..in loop")
                
            builder.FOR$setCondition(node, (tokenizer.peek() == SEMICOLON) ? null : Expression(tokenizer, compilerContext))
            tokenizer.mustMatch(SEMICOLON)
            builder.FOR$setUpdate(node, (tokenizer.peek() == RIGHT_PAREN) ? null : Expression(tokenizer, compilerContext))
        
        tokenizer.mustMatch(RIGHT_PAREN)
        builder.FOR$setBody(node, nest(tokenizer, compilerContext, node, Statement))
        
        if forBlock:
            builder.BLOCK$finish(forBlock)
            compilerContext.stmtStack.pop()
    
        builder.FOR$finish(node)
        return node
        
        
    elif tokenType == WHILE:
        node = builder.WHILE$build(tokenizer)
        
        builder.WHILE$setCondition(node, ParenExpression(tokenizer, compilerContext))
        builder.WHILE$setBody(node, nest(tokenizer, compilerContext, node, Statement))
        builder.WHILE$finish(node)
        
        return node                                    
        
        
    elif tokenType == DO:
        node = builder.DO$build(tokenizer)
        
        builder.DO$setBody(node, nest(tokenizer, compilerContext, node, Statement, WHILE))
        builder.DO$setCondition(node, ParenExpression(tokenizer, compilerContext))
        builder.DO$finish(node)
        
        if not compilerContext.ecmaStrictMode:
            # <script language="JavaScript"> (without version hints) may need
            # automatic semicolon insertion without a newline after do-while.
            # See http://bugzilla.mozilla.org/show_bug.cgi?id=238945.
            tokenizer.match(SEMICOLON)
            return node

        # NO RETURN
      
      
    elif tokenType == BREAK or tokenType == CONTINUE:
        if tokenType == BREAK:
            node = builder.BREAK$build(tokenizer) 
        else:
            node = builder.CONTINUE$build(tokenizer)

        if tokenizer.peekOnSameLine() == IDENTIFIER:
            tokenizer.get()
            
            if tokenType == BREAK:
                builder.BREAK$setLabel(node, tokenizer.token.value)
            else:
                builder.CONTINUE$setLabel(node, tokenizer.token.value)

        ss = compilerContext.stmtStack
        i = ss.length
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
            while i < ss.length - 1 and ss[i+1].type == LABEL:
                i++
                
            if i < ss.length - 1 and ss[i+1].isLoop:
                i++
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
            builder.BREAK$setTarget(node, ss[i])
            builder.BREAK$finish(node)

        else:
            builder.CONTINUE$setTarget(node, ss[i])
            builder.CONTINUE$finish(node)
        
        # NO RETURN        


    elif tokenType == TRY:
        node = builder.TRY$build(tokenizer)
        builder.TRY$setTryBlock(node, Block(tokenizer, compilerContext))
        
        while tokenizer.match(CATCH):
            childNode = builder.CATCH$build(tokenizer)
            tokenizer.mustMatch(LEFT_PAREN)
            nextTokenType = tokenizer.get()
            
            if nextTokenType == LEFT_BRACKET or nextTokenType == LEFT_CURLY:
                # Destructured catch identifiers.
                tokenizer.unget()
                builder.CATCH$setVarName(childNode, DestructuringExpression(tokenizer, compilerContext, True))
            
            elif nextTokenType == IDENTIFIER:
                builder.CATCH$setVarName(childNode, tokenizer.token.value)
            
            else:
                raise SyntaxError("Missing identifier in catch", tokenizer)

            if tokenizer.match(IF):
                if compilerContext.ecma3OnlyMode:
                    raise SyntaxError("Illegal catch guard", tokenizer)
                    
                if node.catchClauses.length and not node.catchClauses.top().guard:
                    raise SyntaxError("Guarded catch after unguarded", tokenizer)
                    
                builder.CATCH$setGuard(childNode, Expression(tokenizer, compilerContext))
                
            else:
                builder.CATCH$setGuard(childNode, null)
            
            tokenizer.mustMatch(RIGHT_PAREN)
            
            builder.CATCH$setBlock(childNode, Block(tokenizer, compilerContext))
            builder.CATCH$finish(childNode)
            
            builder.TRY$addCatch(node, childNode)
        
        builder.TRY$finishCatches(node)
        
        if tokenizer.match(FINALLY):
            builder.TRY$setFinallyBlock(node, Block(tokenizer, compilerContext))
            
        if not node.catchClauses.length and not node.finallyBlock:
            raise SyntaxError("Invalid try statement", tokenizer)
            
        builder.TRY$finish(node)
        return node
        

    elif tokenType == CATCH or tokenType == FINALLY:
        raise SyntaxError(tokens[tokenType] + " without preceding try")


    elif tokenType == THROW:
        node = builder.THROW$build(tokenizer)
        
        builder.THROW$setException(node, Expression(tokenizer, compilerContext))
        builder.THROW$finish(node)
        
        # NO RETURN


    elif tokenType == RETURN:
        node = returnOrYield(tokenizer, compilerContext)
        
        # NO RETURN


    elif tokenType == WITH:
        node = builder.WITH$build(tokenizer)

        builder.WITH$setObject(node, ParenExpression(tokenizer, compilerContext))
        builder.WITH$setBody(node, nest(tokenizer, compilerContext, node, Statement))
        builder.WITH$finish(node)

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
        node = builder.DEBUGGER$build(tokenizer)
        
        # NO RETURN
        

    elif tokenType == NEWLINE or tokenType == SEMICOLON:
        node = builder.SEMICOLON$build(tokenizer)
        
        builder.SEMICOLON$setExpression(node, null)
        builder.SEMICOLON$finish(tokenizer)
        
        return node


    else:
        if tokenType == IDENTIFIER:
            tokenType = tokenizer.peek()

            # Labeled statement.
            if tokenType == COLON:
                label = tokenizer.token.value
                ss = compilerContext.stmtStack
               
                for (i = ss.length-1; i >= 0; --i) {
                    if (ss[i].label == label)
                        raise SyntaxError("Duplicate label")
                }
                
                tokenizer.get()
                node = builder.LABEL$build(tokenizer)
                
                builder.LABEL$setLabel(node, label)
                builder.LABEL$setStatement(node, nest(tokenizer, compilerContext, node, Statement))
                builder.LABEL$finish(node)
                
                return node

        # Expression statement.
        # We unget the current token to parse the expression as a whole.
        node = builder.SEMICOLON$build(tokenizer)
        tokenizer.unget()
        builder.SEMICOLON$setExpression(node, Expression(tokenizer, compilerContext))
        node.end = node.expression.end
        builder.SEMICOLON$finish(node)
        
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
            
        node = builder.RETURN$build(tokenizer)
        
    else:
        if !compilerContext.inFunction:
            raise SyntaxError("Yield not in function", tokenizer)
            
        compilerContext.isGenerator = True
        node = builder.YIELD$build(tokenizer)

    nextTokenType = tokenizer.peek(True)
    if nextTokenType != END and nextTokenType != NEWLINE and nextTokenType != SEMICOLON and nextTokenType != RIGHT_CURLY and (tokenType != YIELD or (nextTokenType != tokenType and nextTokenType != RIGHT_BRACKET and nextTokenType != RIGHT_PAREN and nextTokenType != COLON and nextTokenType != COMMA))):
        if tokenType == RETURN:
            builder.RETURN$setValue(node, Expression(tokenizer, compilerContext))
            compilerContext.hasReturnWithValue = True
        else:
            builder.YIELD$setValue(node, AssignExpression(tokenizer, compilerContext))
        
    elif tokenType == RETURN:
        compilerContext.hasEmptyReturn = True

    # Disallow return v; in generator.
    if compilerContext.hasReturnWithValue and compilerContext.isGenerator:
        raise SyntaxError("Generator returns a value", tokenizer)

    if tokenType == RETURN:
        builder.RETURN$finish(node)
    else:
        builder.YIELD$finish(node)

    return node



def FunctionDefinition(tokenizer, compilerContext, requireName, functionForm) {
    var builder = compilerContext.builder
    var f = builder.FUNCTION$build(tokenizer)
    if tokenizer.match(IDENTIFIER):
        builder.FUNCTION$setName(f, tokenizer.token.value)
    elif requireName:
        raise SyntaxError("Missing def identifier", tokenizer)

    tokenizer.mustMatch(LEFT_PAREN)
    if (!tokenizer.match(RIGHT_PAREN)) {
        do {
            switch (tokenizer.get()) {
              case LEFT_BRACKET:
              case LEFT_CURLY:
                # Destructured formal parameters.
                tokenizer.unget()
                builder.FUNCTION$addParam(f, DestructuringExpression(tokenizer, compilerContext))
                break
              case IDENTIFIER:
                builder.FUNCTION$addParam(f, tokenizer.token.value)
                break
              default:
                raise SyntaxError("Missing formal parameter", tokenizer)
                break
            }
        } while (tokenizer.match(COMMA))
        tokenizer.mustMatch(RIGHT_PAREN)
    }

    # Do we have an expression closure or a normal body?
    var tokenType = tokenizer.get()
    if (tokenType != LEFT_CURLY)
        tokenizer.unget()

    var x2 = new CompilerContext(True, builder)
    var rp = tokenizer.save()
    if (compilerContext.inFunction) {
        # 
        # Inner functions don'tokenizer reset block numbering. They also need to
        # remember which block they were parsed in for hoisting (see comment
        # below).
        # 
        x2.blockId = compilerContext.blockId
    }

    if (tokenType != LEFT_CURLY) {
        builder.FUNCTION$setBody(f, AssignExpression(tokenizer, compilerContext))
        if (compilerContext.isGenerator)
            raise SyntaxError("Generator returns a value", tokenizer)
    } else {
        builder.FUNCTION$hoistVars(x2.blockId)
        builder.FUNCTION$setBody(f, Script(tokenizer, x2))
    }

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
    if (x2.needsHoisting) {
        # Order is important here! funDecls must come _after_ varDecls!
        builder.setHoists(f.body.id, x2.varDecls.concat(x2.funDecls))

        if (compilerContext.inFunction) {
            # Propagate up to the parent def if we're an inner function.
            compilerContext.needsHoisting = True
        } else {
            # Only re-parse toplevel functions.
            var x3 = x2
            x2 = new CompilerContext(True, builder)
            tokenizer.rewind(rp)
            # Set a flag in case the builder wants to have different behavior
            # on the second pass.
            builder.secondPass = True
            builder.FUNCTION$hoistVars(f.body.id, True)
            builder.FUNCTION$setBody(f, Script(tokenizer, x2))
            builder.secondPass = False
        }
    }

    if (tokenType == LEFT_CURLY)
        tokenizer.mustMatch(RIGHT_CURLY)

    f.end = tokenizer.token.end
    f.functionForm = functionForm
    if (functionForm == DECLARED_FORM)
        compilerContext.funDecls.push(f)
    builder.FUNCTION$finish(f, compilerContext)
    return f
}


def Variables(tokenizer, compilerContext, letBlock) {
    """Parses a comma-separated list of var declarations (and maybe initializations)."""
    var builder = compilerContext.builder
    var node, ss, i, s
    var build, addDecl, finish
    switch (tokenizer.token.type) {
      case VAR:
        build = builder.VAR$build
        addDecl = builder.VAR$addDecl
        finish = builder.VAR$finish
        s = compilerContext
        break
      case CONST:
        build = builder.CONST$build
        addDecl = builder.CONST$addDecl
        finish = builder.CONST$finish
        s = compilerContext
        break
      case LET:
      case LEFT_PAREN:
        build = builder.LET$build
        addDecl = builder.LET$addDecl
        finish = builder.LET$finish
        if (!letBlock) {
            ss = compilerContext.stmtStack
            i = ss.length
            while (ss[--i].type !== BLOCK) ; # a BLOCK *must* be found.
            # 
            # Lets at the def toplevel are just vars, at least in
            # SpiderMonkey.
            # 
            if (i == 0) {
                build = builder.VAR$build
                addDecl = builder.VAR$addDecl
                finish = builder.VAR$finish
                s = compilerContext
            } else {
                s = ss[i]
            }
        } else {
            s = letBlock
        }
        break
    }
    node = build.call(builder, tokenizer)
    initializers = []
    do {
        var tokenType = tokenizer.get()
        # 
        # FIXME Should have a special DECLARATION node instead of overloading
        # IDENTIFIER to mean both identifier declarations and destructured
        # declarations.
        # 
        var childNode = builder.DECL$build(tokenizer)
        if (tokenType == LEFT_BRACKET or tokenType == LEFT_CURLY) {
            # Pass in s if we need to add each pattern matched into
            # its varDecls, else pass in compilerContext.
            var data = null
            # Need to unget to parse the full destructured expression.
            tokenizer.unget()
            builder.DECL$setName(childNode, DestructuringExpression(tokenizer, compilerContext, True, s))
            if (compilerContext.inForLoopInit and tokenizer.peek() == IN) {
                addDecl.call(builder, node, childNode, s)
                continue
            }

            tokenizer.mustMatch(ASSIGN)
            if (tokenizer.token.assignOp)
                raise SyntaxError("Invalid variable initialization")

            # Parse the init as a normal assignment.
            var n3 = builder.ASSIGN$build(tokenizer)
            builder.ASSIGN$addOperand(n3, childNode.name)
            builder.ASSIGN$addOperand(n3, AssignExpression(tokenizer, compilerContext))
            builder.ASSIGN$finish(n3)

            # But only add the rhs as the initializer.
            builder.DECL$setInitializer(childNode, n3[1])
            builder.DECL$finish(childNode)
            addDecl.call(builder, node, childNode, s)
            continue
        }

        if (tokenType != IDENTIFIER)
            raise SyntaxError("Missing variable name")

        builder.DECL$setName(childNode, tokenizer.token.value)
        builder.DECL$setReadOnly(childNode, node.type == CONST)
        addDecl.call(builder, node, childNode, s)

        if (tokenizer.match(ASSIGN)) {
            if (tokenizer.token.assignOp)
                raise SyntaxError("Invalid variable initialization")

            # Parse the init as a normal assignment.
            var id = mkIdentifier(childNode.tokenizer, childNode.name, True)
            var n3 = builder.ASSIGN$build(tokenizer)
            builder.ASSIGN$addOperand(n3, id)
            builder.ASSIGN$addOperand(n3, AssignExpression(tokenizer, compilerContext))
            builder.ASSIGN$finish(n3)
            initializers.push(n3)

            # But only add the rhs as the initializer.
            builder.DECL$setInitializer(childNode, n3[1])
        }

        builder.DECL$finish(childNode)
        s.varDecls.push(childNode)
    } while (tokenizer.match(COMMA))
    finish.call(builder, node)
    return node
}

# 
# LetBlock :: (tokenizer, compiler context, boolean) -> node
# 
# Does not handle let inside of for loop init.
# 
def LetBlock(tokenizer, compilerContext, isStatement) {
    var node, childNode, binds
    var builder = compilerContext.builder

    # tokenizer.token.type must be LET
    node = builder.LET_BLOCK$build(tokenizer)
    tokenizer.mustMatch(LEFT_PAREN)
    builder.LET_BLOCK$setVariables(node, Variables(tokenizer, compilerContext, node))
    tokenizer.mustMatch(RIGHT_PAREN)

    if (isStatement and tokenizer.peek() != LEFT_CURLY) {
        # 
        # If this is really an expression in let statement guise, then we
        # need to wrap the LET_BLOCK node in a SEMICOLON node so that we pop
        # the return value of the expression.
        # 
        childNode = builder.SEMICOLON$build(tokenizer)
        builder.SEMICOLON$setExpression(childNode, node)
        builder.SEMICOLON$finish(childNode)
        isStatement = False
    }

    if (isStatement) {
        childNode = Block(tokenizer, compilerContext)
        builder.LET_BLOCK$setBlock(node, childNode)
    } else {
        childNode = AssignExpression(tokenizer, compilerContext)
        builder.LET_BLOCK$setExpression(node, childNode)
    }

    builder.LET_BLOCK$finish(node)

    return node
}

def checkDestructuring(tokenizer, compilerContext, node, simpleNamesOnly, data) {
    if (node.type == ARRAY_COMP)
        raise SyntaxError("Invalid array comprehension left-hand side")
    if (node.type != ARRAY_INIT and node.type != OBJECT_INIT)
        return

    var builder = compilerContext.builder

    for (var i = 0, j = node.length; i < j; i++) {
        var nn = node[i], lhs, rhs
        if (!nn)
            continue
        if (nn.type == PROPERTY_INIT)
            lhs = nn[0], rhs = nn[1]
        else
            lhs = null, rhs = null
        if (rhs and (rhs.type == ARRAY_INIT or rhs.type == OBJECT_INIT))
            checkDestructuring(tokenizer, compilerContext, rhs, simpleNamesOnly, data)
        if (lhs and simpleNamesOnly) {
            # In declarations, lhs must be simple names
            if (lhs.type != IDENTIFIER) {
                raise SyntaxError("Missing name in pattern")
            } elif (data) {
                var childNode = builder.DECL$build(tokenizer)
                builder.DECL$setName(childNode, lhs.value)
                # Don'tokenizer need to set initializer because it's just for
                # hoisting anyways.
                builder.DECL$finish(childNode)
                # Each pattern needs to be added to varDecls.
                data.varDecls.push(childNode)
            }
        }
    }
}

def DestructuringExpression(tokenizer, compilerContext, simpleNamesOnly, data) {
    var node = PrimaryExpression(tokenizer, compilerContext)
    checkDestructuring(tokenizer, compilerContext, node, simpleNamesOnly, data)
    return node
}

def GeneratorExpression(tokenizer, compilerContext, e) {
    var node

    node = builder.GENERATOR$build(tokenizer)
    builder.GENERATOR$setExpression(node, e)
    builder.GENERATOR$setTail(node, comprehensionTail(tokenizer, compilerContext))
    builder.GENERATOR$finish(node)

    return node
}

def comprehensionTail(tokenizer, compilerContext) {
    var body, node
    var builder = compilerContext.builder
    # tokenizer.token.type must be FOR
    body = builder.COMP_TAIL$build(tokenizer)

    do {
        node = builder.FOR$build(tokenizer)
        # Comprehension tails are always for..in loops.
        builder.FOR$rebuildForIn(node)
        if (tokenizer.match(IDENTIFIER)) {
            # But sometimes they're for each..in.
            if (tokenizer.token.value == "each")
                builder.FOR$rebuildForEach(node)
            else
                tokenizer.unget()
        }
        tokenizer.mustMatch(LEFT_PAREN)
        switch(tokenizer.get()) {
          case LEFT_BRACKET:
          case LEFT_CURLY:
            tokenizer.unget()
            # Destructured left side of for in comprehension tails.
            builder.FOR$setIterator(node, DestructuringExpression(tokenizer, compilerContext), null)
            break

          case IDENTIFIER:
            var n3 = builder.DECL$build(tokenizer)
            builder.DECL$setName(n3, n3.value)
            builder.DECL$finish(n3)
            var childNode = builder.VAR$build(tokenizer)
            builder.VAR$addDecl(childNode, n3)
            builder.VAR$finish(childNode)
            builder.FOR$setIterator(node, n3, childNode)
            # 
            # Don'tokenizer add to varDecls since the semantics of comprehensions is
            # such that the variables are in their own def when
            # desugared.
            # 
            break

          default:
            raise SyntaxError("Missing identifier")
        }
        tokenizer.mustMatch(IN)
        builder.FOR$setObject(node, Expression(tokenizer, compilerContext))
        tokenizer.mustMatch(RIGHT_PAREN)
        builder.COMP_TAIL$addFor(body, node)
    } while (tokenizer.match(FOR))

    # Optional guard.
    if (tokenizer.match(IF))
        builder.COMP_TAIL$setGuard(body, ParenExpression(tokenizer, compilerContext))

    builder.COMP_TAIL$finish(body)
    return body
}

def ParenExpression(tokenizer, compilerContext) {
    tokenizer.mustMatch(LEFT_PAREN)

    # 
    # Always accept the 'in' operator in a parenthesized expression,
    # where it's unambiguous, even if we might be parsing the init of a
    # for statement.
    # 
    var oldLoopInit = compilerContext.inForLoopInit
    compilerContext.inForLoopInit = False
    var node = Expression(tokenizer, compilerContext)
    compilerContext.inForLoopInit = oldLoopInit

    var err = "expression must be parenthesized"
    if (tokenizer.match(FOR)) {
        if (node.type == YIELD and !node.parenthesized)
            raise SyntaxError("Yield " + err, tokenizer)
        if (node.type == COMMA and !node.parenthesized)
            raise SyntaxError("Generator " + err, tokenizer)
        node = GeneratorExpression(tokenizer, compilerContext, node)
    }

    tokenizer.mustMatch(RIGHT_PAREN)

    return node
}


def Expression(tokenizer, compilerContext) {
    """Top-down expression parser matched against SpiderMonkey."""
    var node, childNode
    var builder = compilerContext.builder

    node = AssignExpression(tokenizer, compilerContext)
    if (tokenizer.match(COMMA)) {
        childNode = builder.COMMA$build(tokenizer)
        builder.COMMA$addOperand(childNode, node)
        node = childNode
        do {
            childNode = node[node.length-1]
            if (childNode.type == YIELD and !childNode.parenthesized)
                raise SyntaxError("Yield expression must be parenthesized")
            builder.COMMA$addOperand(node, AssignExpression(tokenizer, compilerContext))
        } while (tokenizer.match(COMMA))
        builder.COMMA$finish(node)
    }

    return node
}

def AssignExpression(tokenizer, compilerContext) {
    var node, lhs
    var builder = compilerContext.builder

    # Have to treat yield like an operand because it could be the leftmost
    # operand of the expression.
    if (tokenizer.match(YIELD, True))
        return returnOrYield(tokenizer, compilerContext)

    node = builder.ASSIGN$build(tokenizer)
    lhs = ConditionalExpression(tokenizer, compilerContext)

    if (!tokenizer.match(ASSIGN)) {
        builder.ASSIGN$finish(node)
        return lhs
    }

    switch (lhs.type) {
      case OBJECT_INIT:
      case ARRAY_INIT:
        checkDestructuring(tokenizer, compilerContext, lhs)
        # FALL THROUGH
      case IDENTIFIER: case DOT: case INDEX: case CALL:
        break
      default:
        raise SyntaxError("Bad left-hand side of assignment", tokenizer)
        break
    }

    builder.ASSIGN$setAssignOp(node, tokenizer.token.assignOp)
    builder.ASSIGN$addOperand(node, lhs)
    builder.ASSIGN$addOperand(node, AssignExpression(tokenizer, compilerContext))
    builder.ASSIGN$finish(node)

    return node
}

def ConditionalExpression(tokenizer, compilerContext) {
    var node, childNode
    var builder = compilerContext.builder

    node = OrExpression(tokenizer, compilerContext)
    if (tokenizer.match(HOOK)) {
        childNode = node
        node = builder.HOOK$build(tokenizer)
        builder.HOOK$setCondition(node, childNode)
        # 
        # Always accept the 'in' operator in the middle clause of a ternary,
        # where it's unambiguous, even if we might be parsing the init of a
        # for statement.
        # 
        var oldLoopInit = compilerContext.inForLoopInit
        compilerContext.inForLoopInit = False
        builder.HOOK$setThenPart(node, AssignExpression(tokenizer, compilerContext))
        compilerContext.inForLoopInit = oldLoopInit
        if (!tokenizer.match(COLON))
            raise SyntaxError("Missing : after ?", tokenizer)
        builder.HOOK$setElsePart(node, AssignExpression(tokenizer, compilerContext))
        builder.HOOK$finish(node)
    }

    return node
}

def OrExpression(tokenizer, compilerContext) {
    var node, childNode
    var builder = compilerContext.builder

    node = AndExpression(tokenizer, compilerContext)
    while (tokenizer.match(OR)) {
        childNode = builder.OR$build(tokenizer)
        builder.OR$addOperand(childNode, node)
        builder.OR$addOperand(childNode, AndExpression(tokenizer, compilerContext))
        builder.OR$finish(childNode)
        node = childNode
    }

    return node
}

def AndExpression(tokenizer, compilerContext) {
    var node, childNode
    var builder = compilerContext.builder

    node = BitwiseOrExpression(tokenizer, compilerContext)
    while (tokenizer.match(AND)) {
        childNode = builder.AND$build(tokenizer)
        builder.AND$addOperand(childNode, node)
        builder.AND$addOperand(childNode, BitwiseOrExpression(tokenizer, compilerContext))
        builder.AND$finish(childNode)
        node = childNode
    }

    return node
}

def BitwiseOrExpression(tokenizer, compilerContext) {
    var node, childNode
    var builder = compilerContext.builder

    node = BitwiseXorExpression(tokenizer, compilerContext)
    while (tokenizer.match(BITWISE_OR)) {
        childNode = builder.BITWISE_OR$build(tokenizer)
        builder.BITWISE_OR$addOperand(childNode, node)
        builder.BITWISE_OR$addOperand(childNode, BitwiseXorExpression(tokenizer, compilerContext))
        builder.BITWISE_OR$finish(childNode)
        node = childNode
    }

    return node
}

def BitwiseXorExpression(tokenizer, compilerContext) {
    var node, childNode
    var builder = compilerContext.builder

    node = BitwiseAndExpression(tokenizer, compilerContext)
    while (tokenizer.match(BITWISE_XOR)) {
        childNode = builder.BITWISE_XOR$build(tokenizer)
        builder.BITWISE_XOR$addOperand(childNode, node)
        builder.BITWISE_XOR$addOperand(childNode, BitwiseAndExpression(tokenizer, compilerContext))
        builder.BITWISE_XOR$finish(childNode)
        node = childNode
    }

    return node
}

def BitwiseAndExpression(tokenizer, compilerContext) {
    var node, childNode
    var builder = compilerContext.builder

    node = EqualityExpression(tokenizer, compilerContext)
    while (tokenizer.match(BITWISE_AND)) {
        childNode = builder.BITWISE_AND$build(tokenizer)
        builder.BITWISE_AND$addOperand(childNode, node)
        builder.BITWISE_AND$addOperand(childNode, EqualityExpression(tokenizer, compilerContext))
        builder.BITWISE_AND$finish(childNode)
        node = childNode
    }

    return node
}

def EqualityExpression(tokenizer, compilerContext) {
    var node, childNode
    var builder = compilerContext.builder

    node = RelationalExpression(tokenizer, compilerContext)
    while (tokenizer.match(EQ) or tokenizer.match(NE) or
           tokenizer.match(STRICT_EQ) or tokenizer.match(STRICT_NE)) {
        childNode = builder.EQUALITY$build(tokenizer)
        builder.EQUALITY$addOperand(childNode, node)
        builder.EQUALITY$addOperand(childNode, RelationalExpression(tokenizer, compilerContext))
        builder.EQUALITY$finish(childNode)
        node = childNode
    }

    return node
}

def RelationalExpression(tokenizer, compilerContext) {
    var node, childNode
    var builder = compilerContext.builder
    var oldLoopInit = compilerContext.inForLoopInit

    # 
    # Uses of the in operator in shiftExprs are always unambiguous,
    # so unset the flag that prohibits recognizing it.
    # 
    compilerContext.inForLoopInit = False
    node = ShiftExpression(tokenizer, compilerContext)
    while ((tokenizer.match(LT) or tokenizer.match(LE) or tokenizer.match(GE) or tokenizer.match(GT) or
           (oldLoopInit == False and tokenizer.match(IN)) or
           tokenizer.match(INSTANCEOF))) {
        childNode = builder.RELATIONAL$build(tokenizer)
        builder.RELATIONAL$addOperand(childNode, node)
        builder.RELATIONAL$addOperand(childNode, ShiftExpression(tokenizer, compilerContext))
        builder.RELATIONAL$finish(childNode)
        node = childNode
    }
    compilerContext.inForLoopInit = oldLoopInit

    return node
}

def ShiftExpression(tokenizer, compilerContext) {
    var node, childNode
    var builder = compilerContext.builder

    node = AddExpression(tokenizer, compilerContext)
    while (tokenizer.match(LSH) or tokenizer.match(RSH) or tokenizer.match(URSH)) {
        childNode = builder.SHIFT$build(tokenizer)
        builder.SHIFT$addOperand(childNode, node)
        builder.SHIFT$addOperand(childNode, AddExpression(tokenizer, compilerContext))
        builder.SHIFT$finish(childNode)
        node = childNode
    }

    return node
}

def AddExpression(tokenizer, compilerContext) {
    var node, childNode
    var builder = compilerContext.builder

    node = MultiplyExpression(tokenizer, compilerContext)
    while (tokenizer.match(PLUS) or tokenizer.match(MINUS)) {
        childNode = builder.ADD$build(tokenizer)
        builder.ADD$addOperand(childNode, node)
        builder.ADD$addOperand(childNode, MultiplyExpression(tokenizer, compilerContext))
        builder.ADD$finish(childNode)
        node = childNode
    }

    return node
}

def MultiplyExpression(tokenizer, compilerContext) {
    var node, childNode
    var builder = compilerContext.builder

    node = UnaryExpression(tokenizer, compilerContext)
    while (tokenizer.match(MUL) or tokenizer.match(DIV) or tokenizer.match(MOD)) {
        childNode = builder.MULTIPLY$build(tokenizer)
        builder.MULTIPLY$addOperand(childNode, node)
        builder.MULTIPLY$addOperand(childNode, UnaryExpression(tokenizer, compilerContext))
        builder.MULTIPLY$finish(childNode)
        node = childNode
    }

    return node
}

def UnaryExpression(tokenizer, compilerContext) {
    var node, childNode, tokenType
    var builder = compilerContext.builder

    switch (tokenType = tokenizer.get(True)) {
      case DELETE: case VOID: case TYPEOF:
      case NOT: case BITWISE_NOT: case PLUS: case MINUS:
        node = builder.UNARY$build(tokenizer)
        builder.UNARY$addOperand(node, UnaryExpression(tokenizer, compilerContext))
        break

      case INCREMENT:
      case DECREMENT:
        # Prefix increment/decrement.
        node = builder.UNARY$build(tokenizer)
        builder.UNARY$addOperand(node, MemberExpression(tokenizer, compilerContext, True))
        break

      default:
        tokenizer.unget()
        node = MemberExpression(tokenizer, compilerContext, True)

        # Don'tokenizer look across a newline boundary for a postfix {in,de}crement.
        if (tokenizer.tokens[(tokenizer.tokenIndex + tokenizer.lookahead - 1) & 3].lineno ==
            tokenizer.lineno) {
            if (tokenizer.match(INCREMENT) or tokenizer.match(DECREMENT)) {
                childNode = builder.UNARY$build(tokenizer)
                builder.UNARY$setPostfix(childNode)
                builder.UNARY$finish(node)
                builder.UNARY$addOperand(childNode, node)
                node = childNode
            }
        }
        break
    }

    builder.UNARY$finish(node)
    return node
}

def MemberExpression(tokenizer, compilerContext, allowCallSyntax) {
    var node, childNode, tokenType
    var builder = compilerContext.builder

    if (tokenizer.match(NEW)) {
        node = builder.MEMBER$build(tokenizer)
        builder.MEMBER$addOperand(node, MemberExpression(tokenizer, compilerContext, False))
        if (tokenizer.match(LEFT_PAREN)) {
            builder.MEMBER$rebuildNewWithArgs(node)
            builder.MEMBER$addOperand(node, ArgumentList(tokenizer, compilerContext))
        }
        builder.MEMBER$finish(node)
    } else {
        node = PrimaryExpression(tokenizer, compilerContext)
    }

    while ((tokenType = tokenizer.get()) != END) {
        switch (tokenType) {
          case DOT:
            childNode = builder.MEMBER$build(tokenizer)
            builder.MEMBER$addOperand(childNode, node)
            tokenizer.mustMatch(IDENTIFIER)
            builder.MEMBER$addOperand(childNode, builder.MEMBER$build(tokenizer))
            break

          case LEFT_BRACKET:
            childNode = builder.MEMBER$build(tokenizer, INDEX)
            builder.MEMBER$addOperand(childNode, node)
            builder.MEMBER$addOperand(childNode, Expression(tokenizer, compilerContext))
            tokenizer.mustMatch(RIGHT_BRACKET)
            break

          case LEFT_PAREN:
            if (allowCallSyntax) {
                childNode = builder.MEMBER$build(tokenizer, CALL)
                builder.MEMBER$addOperand(childNode, node)
                builder.MEMBER$addOperand(childNode, ArgumentList(tokenizer, compilerContext))
                break
            }

            # FALL THROUGH
          default:
            tokenizer.unget()
            return node
        }

        builder.MEMBER$finish(childNode)
        node = childNode
    }

    return node
}

def ArgumentList(tokenizer, compilerContext) {
    var node, childNode
    var builder = compilerContext.builder
    var err = "expression must be parenthesized"

    node = builder.LIST$build(tokenizer)
    if (tokenizer.match(RIGHT_PAREN, True))
        return node
    do {
        childNode = AssignExpression(tokenizer, compilerContext)
        if (childNode.type == YIELD and !childNode.parenthesized and tokenizer.peek() == COMMA)
            raise SyntaxError("Yield " + err, tokenizer)
        if (tokenizer.match(FOR)) {
            childNode = GeneratorExpression(tokenizer, compilerContext, childNode)
            if (node.length > 1 or tokenizer.peek(True) == COMMA)
                raise SyntaxError("Generator " + err, tokenizer)
        }
        builder.LIST$addOperand(node, childNode)
    } while (tokenizer.match(COMMA))
    tokenizer.mustMatch(RIGHT_PAREN)
    builder.LIST$finish(node)

    return node
}

def PrimaryExpression(tokenizer, compilerContext) {
    var node, childNode, n3, tokenType = tokenizer.get(True)
    var builder = compilerContext.builder

    switch (tokenType) {
      case FUNCTION:
        node = FunctionDefinition(tokenizer, compilerContext, False, EXPRESSED_FORM)
        break

      case LEFT_BRACKET:
        node = builder.ARRAY_INIT$build(tokenizer)
        while ((tokenType = tokenizer.peek()) != RIGHT_BRACKET) {
            if (tokenType == COMMA) {
                tokenizer.get()
                builder.ARRAY_INIT$addElement(node, null)
                continue
            }
            builder.ARRAY_INIT$addElement(node, AssignExpression(tokenizer, compilerContext))
            if (tokenType != COMMA and !tokenizer.match(COMMA))
                break
        }

        # If we matched exactly one element and got a FOR, we have an
        # array comprehension.
        if (node.length == 1 and tokenizer.match(FOR)) {
            childNode = builder.ARRAY_COMP$build(tokenizer)
            builder.ARRAY_COMP$setExpression(childNode, node[0])
            builder.ARRAY_COMP$setTail(childNode, comprehensionTail(tokenizer, compilerContext))
            node = childNode
        }
        tokenizer.mustMatch(RIGHT_BRACKET)
        builder.PRIMARY$finish(node)
        break

      case LEFT_CURLY:
        var id
        node = builder.OBJECT_INIT$build(tokenizer)

      object_init:
        if (!tokenizer.match(RIGHT_CURLY)) {
            do {
                tokenType = tokenizer.get()
                if ((tokenizer.token.value == "get" or tokenizer.token.value == "set") and
                    tokenizer.peek() == IDENTIFIER) {
                    if (compilerContext.ecma3OnlyMode)
                        raise SyntaxError("Illegal property accessor")
                    var fd = FunctionDefinition(tokenizer, compilerContext, True, EXPRESSED_FORM)
                    builder.OBJECT_INIT$addProperty(node, fd)
                } else {
                    switch (tokenType) {
                      case IDENTIFIER: case NUMBER: case STRING:
                        id = builder.PRIMARY$build(tokenizer, IDENTIFIER)
                        builder.PRIMARY$finish(id)
                        break
                      case RIGHT_CURLY:
                        if (compilerContext.ecma3OnlyMode)
                            raise SyntaxError("Illegal trailing ,")
                        break object_init
                      default:
                        if (tokenizer.token.value in keywords) {
                            id = builder.PRIMARY$build(tokenizer, IDENTIFIER)
                            builder.PRIMARY$finish(id)
                            break
                        }
                        raise SyntaxError("Invalid property name")
                    }
                    if (tokenizer.match(COLON)) {
                        childNode = builder.PROPERTY_INIT$build(tokenizer)
                        builder.PROPERTY_INIT$addOperand(childNode, id)
                        builder.PROPERTY_INIT$addOperand(childNode, AssignExpression(tokenizer, compilerContext))
                        builder.PROPERTY_INIT$finish(childNode)
                        builder.OBJECT_INIT$addProperty(node, childNode)
                    } else {
                        # Support, e.g., |var {compilerContext, y} = o| as destructuring shorthand
                        # for |var {compilerContext: compilerContext, y: y} = o|, per proposed JS2/ES4 for JS1.8.
                        if (tokenizer.peek() != COMMA and tokenizer.peek() != RIGHT_CURLY)
                            raise SyntaxError("Missing : after property")
                        builder.OBJECT_INIT$addProperty(node, id)
                    }
                }
            } while (tokenizer.match(COMMA))
            tokenizer.mustMatch(RIGHT_CURLY)
        }
        builder.OBJECT_INIT$finish(node)
        break

      case LEFT_PAREN:
        # ParenExpression does its own matching on parentheses, so we need to
        # unget.
        tokenizer.unget()
        node = ParenExpression(tokenizer, compilerContext)
        node.parenthesized = True
        break

      case LET:
        node = LetBlock(tokenizer, compilerContext, False)
        break

      case NULL: case THIS: case TRUE: case FALSE:
      case IDENTIFIER: case NUMBER: case STRING: case REGEXP:
        node = builder.PRIMARY$build(tokenizer)
        builder.PRIMARY$finish(node)
        break

      default:
        raise SyntaxError("Missing operand")
        break


    return node



def parse(builder, source, filename, line) {
    var tokenizer = new Tokenizer(source, filename, line)
    var compilerContext = new CompilerContext(False, builder)
    var node = Script(tokenizer, compilerContext)
    
    if not tokenizer.done:
        raise SyntaxError("Syntax error")

    return node
