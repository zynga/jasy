#
# JavaScript Tools - Parser
# License: MPL 1.1/GPL 2.0/LGPL 2.1
# Authors: 
#   - Brendan Eich <brendan@mozilla.org> (Original JavaScript) (2004-2010)
#   - Sebastian Werner <info@sebastian-werner.net> (Python Port) (2010)
#

from js.Node import Node
from js.Tokenizer import Token
from js.Tokenizer import Tokenizer
from js.VanillaBuilder import VanillaBuilder

#__all__ = [ "parse", "parseExpression" ]
__all__ = [ "parse" ]




def parse(source, filename=None, line=0, builder=None):
    if builder == None:
        builder = VanillaBuilder()
    
    tokenizer = Tokenizer(source, filename, line)
    staticContext = StaticContext(False, builder)
    node = Script(tokenizer, staticContext)
    
    if not tokenizer.done():
        raise SyntaxError("Syntax error", tokenizer)

    return node



class SyntaxError(Exception):
    def __init__(self, message, tokenizer):
        Exception.__init__(self, "Syntax error: %s\n%s:%s" % (message, tokenizer.filename, tokenizer.line))


# Used as a status container during tree-building for every def body and the global body
class StaticContext(object):
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
        self.needsHoisting = False
         
        # Status
        self.bracketLevel = 0
        self.curlyLevel = 0
        self.parenLevel = 0
        self.hookLevel = 0
        
        # Configure strict ecmascript 3 mode
        self.ecma3OnlyMode = False
        
        # Status flag during parsing
        self.inForLoopInit = False


def Script(tokenizer, staticContext):
    """Parses the toplevel and def bodies."""
    node = Statements(tokenizer, staticContext)
    
    # change type from "block" to "script" for script root
    node.type = "script"

    # copy over data from compiler context
    node.funDecls = staticContext.funDecls
    node.varDecls = staticContext.varDecls

    return node
    

def nest(tokenizer, staticContext, node, func, end=None):
    """Statement stack and nested statement handler."""
    staticContext.statementStack.append(node)
    node = func(tokenizer, staticContext)
    staticContext.statementStack.pop()
    end and tokenizer.mustMatch(end)
    
    return node


def Statements(tokenizer, staticContext):
    """Parses a list of Statements."""

    builder = staticContext.builder
    node = builder.BLOCK_build(tokenizer, staticContext.blockId)
    staticContext.blockId += 1

    builder.BLOCK_hoistLets(node)
    staticContext.statementStack.append(node)

    while not tokenizer.done() and tokenizer.peek(True) != "right_curly":
        builder.BLOCK_addStatement(node, Statement(tokenizer, staticContext))

    staticContext.statementStack.pop()
    builder.BLOCK_finish(node)

    if getattr(node, "needsHoisting", False):
        raise Exception("Needs hoisting went true!!!")
        builder.setHoists(node.id, node.varDecls)
        # Propagate up to the function.
        staticContext.needsHoisting = True

    return node


def Block(tokenizer, staticContext):
    tokenizer.mustMatch("left_curly")
    node = Statements(tokenizer, staticContext)
    tokenizer.mustMatch("right_curly")
    
    return node


def Statement(tokenizer, staticContext):
    """Parses a Statement."""

    tokenType = tokenizer.get(True)
    builder = staticContext.builder

    # Cases for statements ending in a right curly return early, avoiding the
    # common semicolon insertion magic after this switch.
    
    if tokenType == "function":
        # "declared_form" extends funDecls of staticContext, "statement_form" doesn'tokenizer.
        if len(staticContext.statementStack) > 1:
            kind = "statement_form"
        else:
            kind = "declared_form"
        
        return FunctionDefinition(tokenizer, staticContext, True, kind)
        
        
    elif tokenType == "left_curly":
        node = Statements(tokenizer, staticContext)
        tokenizer.mustMatch("right_curly")
        
        return node
        
        
    elif tokenType == "if":
        node = builder.IF_build(tokenizer)
        builder.IF_setCondition(node, ParenExpression(tokenizer, staticContext))
        staticContext.statementStack.append(node)
        builder.IF_setThenPart(node, Statement(tokenizer, staticContext))

        if tokenizer.match("else"):
            builder.IF_setElsePart(node, Statement(tokenizer, staticContext))

        staticContext.statementStack.pop()
        builder.IF_finish(node)
        
        return node
        
        
    elif tokenType == "switch":
        # This allows CASEs after a "default", which is in the standard.
        node = builder.SWITCH_build(tokenizer)
        builder.SWITCH_setDiscriminant(node, ParenExpression(tokenizer, staticContext))
        staticContext.statementStack.append(node)

        tokenizer.mustMatch("left_curly")
        tokenType = tokenizer.get()
        
        while tokenType != "right_curly":
            if tokenType == "default":
                if node.defaultIndex >= 0:
                    raise SyntaxError("More than one switch default", tokenizer)
                    
                childNode = builder.DEFAULT_build(tokenizer)
                builder.SWITCH_setDefaultIndex(node, len(node)-1)
                tokenizer.mustMatch("colon")
                builder.DEFAULT_initializeStatements(childNode, tokenizer)
                
                while True:
                    tokenType=tokenizer.peek(True)
                    if tokenType == "case" or tokenType == "default" or tokenType == "right_curly":
                        break
                    builder.DEFAULT_addStatement(childNode, Statement(tokenizer, staticContext))
                
                builder.DEFAULT_finish(childNode)

            elif tokenType == "case":
                childNode = builder.CASE_build(tokenizer)
                builder.CASE_setLabel(childNode, Expression(tokenizer, staticContext))
                tokenizer.mustMatch("colon")
                builder.CASE_initializeStatements(childNode, tokenizer)

                while True:
                    tokenType=tokenizer.peek(True)
                    if tokenType == "case" or tokenType == "default" or tokenType == "right_curly":
                        break
                    builder.CASE_addStatement(childNode, Statement(tokenizer, staticContext))
                
                builder.CASE_finish(childNode)

            else:
                raise SyntaxError("Invalid switch case", tokenizer)

            builder.SWITCH_addCase(node, childNode)
            tokenType = tokenizer.get()

        staticContext.statementStack.pop()
        builder.SWITCH_finish(node)

        return node
        

    elif tokenType == "for":
        node = builder.FOR_build(tokenizer)
        forBlock = None
        
        if tokenizer.match("identifier") and tokenizer.token.value == "each":
            builder.FOR_rebuildForEach(node)
            
        tokenizer.mustMatch("left_paren")
        tokenType = tokenizer.peek()
        
        if tokenType != "semicolon":
            staticContext.inForLoopInit = True
            
            if tokenType == "var" or tokenType == "const":
                tokenizer.get()
                childNode = Variables(tokenizer, staticContext)
            
            elif tokenType == "let":
                tokenizer.get()
                
                if tokenizer.peek() == "left_paren":
                    childNode = LetBlock(tokenizer, staticContext, False)
                    
                else:
                    # Let in for head, we need to add an implicit block
                    # around the rest of the for.
                    forBlock = builder.BLOCK_build(tokenizer, staticContext.blockId)
                    staticContext.blockId += 1
                    staticContext.statementStack.append(forBlock)
                    childNode = Variables(tokenizer, staticContext, forBlock)
                
            else:
                childNode = Expression(tokenizer, staticContext)
            
            staticContext.inForLoopInit = False

        if childNode and tokenizer.match("in"):
            builder.FOR_rebuildForIn(node)
            builder.FOR_setObject(node, Expression(tokenizer, staticContext), forBlock)
            
            if childNode.type == "var" or childNode.type == "let":
                if len(childNode) != 1:
                    raise SyntaxError("Invalid for..in left-hand side", tokenizer)

                builder.FOR_setIterator(node, childNode[0], childNode, forBlock)
                
            else:
                builder.FOR_setIterator(node, childNode, None, forBlock)

        else:
            builder.FOR_setSetup(node, childNode)
            tokenizer.mustMatch("semicolon")
            
            if node.isEach:
                raise SyntaxError("Invalid for each..in loop")
                
            if tokenizer.peek() == "semicolon":
                builder.FOR_setCondition(node, None)
            else:
                builder.FOR_setCondition(node, Expression(tokenizer, staticContext))
            
            tokenizer.mustMatch("semicolon")
            
            if tokenizer.peek() == "right_paren":
                builder.FOR_setUpdate(node, None)
            else:    
                builder.FOR_setUpdate(node, Expression(tokenizer, staticContext))
        
        tokenizer.mustMatch("right_paren")
        builder.FOR_setBody(node, nest(tokenizer, staticContext, node, Statement))
        
        if forBlock:
            builder.BLOCK_finish(forBlock)
            staticContext.statementStack.pop()
    
        builder.FOR_finish(node)
        return node
        
        
    elif tokenType == "while":
        node = builder.WHILE_build(tokenizer)
        
        builder.WHILE_setCondition(node, ParenExpression(tokenizer, staticContext))
        builder.WHILE_setBody(node, nest(tokenizer, staticContext, node, Statement))
        builder.WHILE_finish(node)
        
        return node                                    
        
        
    elif tokenType == "do":
        node = builder.DO_build(tokenizer)
        
        builder.DO_setBody(node, nest(tokenizer, staticContext, node, Statement, "while"))
        builder.DO_setCondition(node, ParenExpression(tokenizer, staticContext))
        builder.DO_finish(node)
        
        if not staticContext.ecma3OnlyMode:
            # <script language="JavaScript"> (without version hints) may need
            # automatic semicolon insertion without a newline after do-while.
            # See http://bugzilla.mozilla.org/show_bug.cgi?id=238945.
            tokenizer.match("semicolon")
            return node

        # NO RETURN
      
      
    elif tokenType == "break" or tokenType == "continue":
        if tokenType == "break":
            node = builder.BREAK_build(tokenizer) 
        else:
            node = builder.CONTINUE_build(tokenizer)

        if tokenizer.peekOnSameLine() == "identifier":
            tokenizer.get()
            
            if tokenType == "break":
                builder.BREAK_setLabel(node, tokenizer.token.value)
            else:
                builder.CONTINUE_setLabel(node, tokenizer.token.value)

        statementStack = staticContext.statementStack
        i = len(statementStack)
        label = node.label if hasattr(node, "label") else None

        if label:
            while True:
                i -= 1
                if i < 0:
                    raise SyntaxError("Label not found", tokenizer)
                if getattr(statementStack[i], "label", None) == label:
                    break

            # 
            # Both break and continue to label need to be handled specially
            # within a labeled loop, so that they target that loop. If not in
            # a loop, then break targets its labeled statement. Labels can be
            # nested so we skip all labels immediately enclosing the nearest
            # non-label statement.
            # 
            while i < len(statementStack) - 1 and statementStack[i+1].type == "label":
                i += 1
                
            if i < len(statementStack) - 1 and getattr(statementStack[i+1], "isLoop", False):
                i += 1
            elif tokenType == "continue":
                raise SyntaxError("Invalid continue", tokenizer)
                
        else:
            while True:
                i -= 1
                if i < 0:
                    if tokenType == "break":
                        raise SyntaxError("Invalid break")
                    else:
                        raise SyntaxError("Invalid continue")

                if getattr(statementStack[i], "isLoop", False) or (tokenType == "break" and statementStack[i].type == "switch"):
                    break
        
        if tokenType == "break":
            builder.BREAK_setTarget(node, statementStack[i])
            builder.BREAK_finish(node)

        else:
            builder.CONTINUE_setTarget(node, statementStack[i])
            builder.CONTINUE_finish(node)
        
        # NO RETURN        


    elif tokenType == "try":
        node = builder.TRY_build(tokenizer)
        builder.TRY_setTryBlock(node, Block(tokenizer, staticContext))
        
        while tokenizer.match("catch"):
            childNode = builder.CATCH_build(tokenizer)
            tokenizer.mustMatch("left_paren")
            nextTokenType = tokenizer.get()
            
            if nextTokenType == "left_bracket" or nextTokenType == "left_curly":
                # Destructured catch identifiers.
                tokenizer.unget()
                builder.CATCH_setVarName(childNode, DestructuringExpression(tokenizer, staticContext, True))
            
            elif nextTokenType == "identifier":
                builder.CATCH_setVarName(childNode, tokenizer.token.value)
            
            else:
                raise SyntaxError("Missing identifier in catch", tokenizer)

            if tokenizer.match("if"):
                if staticContext.ecma3OnlyMode:
                    raise SyntaxError("Illegal catch guard", tokenizer)
                    
                if node.getChildrenLength() > 0 and not node.getUnrelatedChildren()[0].guard:
                    raise SyntaxError("Guarded catch after unguarded", tokenizer)
                    
                builder.CATCH_setGuard(childNode, Expression(tokenizer, staticContext))
                
            else:
                builder.CATCH_setGuard(childNode, None)
            
            tokenizer.mustMatch("right_paren")
            
            builder.CATCH_setBlock(childNode, Block(tokenizer, staticContext))
            builder.CATCH_finish(childNode)
            
            builder.TRY_addCatch(node, childNode)
        
        builder.TRY_finishCatches(node)
        
        if tokenizer.match("finally"):
            builder.TRY_setFinallyBlock(node, Block(tokenizer, staticContext))
            
        if node.getChildrenLength() == 0 and not hasattr(node, "finallyBlock"):
            raise SyntaxError("Invalid try statement", tokenizer)
            
        builder.TRY_finish(node)
        return node
        

    elif tokenType == "catch" or tokenType == "finally":
        raise SyntaxError(tokens[tokenType] + " without preceding try")


    elif tokenType == "throw":
        node = builder.THROW_build(tokenizer)
        
        builder.THROW_setException(node, Expression(tokenizer, staticContext))
        builder.THROW_finish(node)
        
        # NO RETURN


    elif tokenType == "return":
        node = returnOrYield(tokenizer, staticContext)
        
        # NO RETURN


    elif tokenType == "with":
        node = builder.WITH_build(tokenizer)

        builder.WITH_setObject(node, ParenExpression(tokenizer, staticContext))
        builder.WITH_setBody(node, nest(tokenizer, staticContext, node, Statement))
        builder.WITH_finish(node)

        return node


    elif tokenType == "var" or tokenType == "const":
        node = Variables(tokenizer, staticContext)
        
        # NO RETURN
        

    elif tokenType == "let":
        if tokenizer.peek() == "left_paren":
            node = LetBlock(tokenizer, staticContext, True)
        else:
            node = Variables(tokenizer, staticContext)
        
        # NO RETURN
        

    elif tokenType == "debugger":
        node = builder.DEBUGGER_build(tokenizer)
        
        # NO RETURN
        

    elif tokenType == "newline" or tokenType == "semicolon":
        node = builder.SEMICOLON_build(tokenizer)
        
        builder.SEMICOLON_setExpression(node, None)
        builder.SEMICOLON_finish(tokenizer)
        
        return node


    else:
        if tokenType == "identifier":
            tokenType = tokenizer.peek()

            # Labeled statement.
            if tokenType == "colon":
                label = tokenizer.token.value
                statementStack = staticContext.statementStack
               
                i = len(statementStack)-1
                while i >= 0:
                    if getattr(statementStack[i], "label", None) == label:
                        raise SyntaxError("Duplicate label")
                    
                    i -= 1
               
                tokenizer.get()
                node = builder.LABEL_build(tokenizer)
                
                builder.LABEL_setLabel(node, label)
                builder.LABEL_setStatement(node, nest(tokenizer, staticContext, node, Statement))
                builder.LABEL_finish(node)
                
                return node

        # Expression statement.
        # We unget the current token to parse the expression as a whole.
        node = builder.SEMICOLON_build(tokenizer)
        tokenizer.unget()
        builder.SEMICOLON_setExpression(node, Expression(tokenizer, staticContext))
        node.end = node.expression.end
        builder.SEMICOLON_finish(node)
        
        # NO RETURN
        

    MagicalSemicolon(tokenizer)
    return node



def MagicalSemicolon(tokenizer):
    if tokenizer.line == tokenizer.token.line:
        tokenType = tokenizer.peekOnSameLine()
    
        if tokenType != "end" and tokenType != "newline" and tokenType != "semicolon" and tokenType != "right_curly":
            raise SyntaxError("Missing ; before statement", tokenizer)
    
    tokenizer.match("semicolon")

    

def returnOrYield(tokenizer, staticContext):
    builder = staticContext.builder
    tokenType = tokenizer.token.type

    if tokenType == "return":
        if not staticContext.inFunction:
            raise SyntaxError("Return not in function", tokenizer)
            
        node = builder.RETURN_build(tokenizer)
        
    else:
        if not staticContext.inFunction:
            raise SyntaxError("Yield not in function", tokenizer)
            
        staticContext.isGenerator = True
        node = builder.YIELD_build(tokenizer)

    nextTokenType = tokenizer.peek(True)
    if nextTokenType != "end" and nextTokenType != "newline" and nextTokenType != "semicolon" and nextTokenType != "right_curly" and (tokenType != "yield" or (nextTokenType != tokenType and nextTokenType != "right_bracket" and nextTokenType != "right_paren" and nextTokenType != "colon" and nextTokenType != "comma")):
        if tokenType == "return":
            builder.RETURN_setValue(node, Expression(tokenizer, staticContext))
            staticContext.hasReturnWithValue = True
        else:
            builder.YIELD_setValue(node, AssignExpression(tokenizer, staticContext))
        
    elif tokenType == "return":
        staticContext.hasEmptyReturn = True

    # Disallow return v; in generator.
    if staticContext.hasReturnWithValue and staticContext.isGenerator:
        raise SyntaxError("Generator returns a value", tokenizer)

    if tokenType == "return":
        builder.RETURN_finish(node)
    else:
        builder.YIELD_finish(node)

    return node



def FunctionDefinition(tokenizer, staticContext, requireName, functionForm):
    builder = staticContext.builder
    functionNode = builder.FUNCTION_build(tokenizer)
    
    if tokenizer.match("identifier"):
        builder.FUNCTION_setName(functionNode, tokenizer.token.value)
    elif requireName:
        raise SyntaxError("Missing def identifier", tokenizer)

    tokenizer.mustMatch("left_paren")
    
    if not tokenizer.match("right_paren"):
        while True:
            tokenType = tokenizer.get()
            if tokenType == "left_bracket" or tokenType == "left_curly":
                # Destructured formal parameters.
                tokenizer.unget()
                builder.FUNCTION_addParam(functionNode, DestructuringExpression(tokenizer, staticContext))
                
            elif tokenType == "identifier":
                builder.FUNCTION_addParam(functionNode, tokenizer.token.value)
                
            else:
                raise SyntaxError("Missing formal parameter", tokenizer)
        
            if not tokenizer.match("comma"):
                break
        
        tokenizer.mustMatch("right_paren")

    # Do we have an expression closure or a normal body?
    tokenType = tokenizer.get()
    if tokenType != "left_curly":
        tokenizer.unget()

    childContext = StaticContext(True, builder)
    rp = tokenizer.save()
    
    if staticContext.inFunction:
        # 
        # Inner functions don'tokenizer reset block numbering. They also need to
        # remember which block they were parsed in for hoisting (see comment
        # below).
        # 
        childContext.blockId = staticContext.blockId

    if tokenType != "left_curly":
        builder.FUNCTION_setBody(functionNode, AssignExpression(tokenizer, staticContext))
        if staticContext.isGenerator:
            raise SyntaxError("Generator returns a value", tokenizer)
            
    else:
        builder.FUNCTION_hoistVars(childContext.blockId)
        builder.FUNCTION_setBody(functionNode, Script(tokenizer, childContext))

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
    #   staticContext = 0
    #   g()
    #   staticContext; # staticContext's forward pointer should be invalidated!
    #   def g() {
    #     staticContext = 'g'
    #   }
    #   var staticContext
    # }
    # 
    # So, a def needs to remember in which block it is parsed under
    # (since the def body is _not_ hoisted, only the declaration) and
    # upon hoisting, needs to recalculate all its upvars up front.
    # 
    if childContext.needsHoisting:
        # Order is important here! funDecls must come _after_ varDecls!
        builder.setHoists(functionNode.body.id, childContext.varDecls.concat(childContext.funDecls))

        if staticContext.inFunction:
            # Propagate up to the parent def if we're an inner function.
            staticContext.needsHoisting = True
        
        else:
            # Only re-parse toplevel functions.
            x3 = childContext
            childContext = StaticContext(True, builder)
            tokenizer.rewind(rp)
            
            # Set a flag in case the builder wants to have different behavior
            # on the second pass.
            builder.secondPass = True
            builder.FUNCTION_hoistVars(functionNode.body.id, True)
            builder.FUNCTION_setBody(functionNode, Script(tokenizer, childContext))
            builder.secondPass = False

    if tokenType == "left_curly":
        tokenizer.mustMatch("right_curly")

    functionNode.end = tokenizer.token.end
    functionNode.functionForm = functionForm
    
    if functionForm == "declared_form":
        staticContext.funDecls.append(functionNode)
        
    builder.FUNCTION_finish(functionNode, staticContext)
    
    return functionNode



def Variables(tokenizer, staticContext, letBlock=None):
    """Parses a comma-separated list of var declarations (and maybe initializations)."""
    
    builder = staticContext.builder
    if tokenizer.token.type == "var":
        build = builder.VAR_build
        addDecl = builder.VAR_addDecl
        finish = builder.VAR_finish
        childContext = staticContext
            
    elif tokenizer.token.type == "const":
        build = builder.CONST_build
        addDecl = builder.CONST_addDecl
        finish = builder.CONST_finish
        childContext = staticContext
        
    elif tokenizer.token.type == "let" or tokenizer.token.type == "left_paren":
        build = builder.LET_build
        addDecl = builder.LET_addDecl
        finish = builder.LET_finish
        
        if not letBlock:
            statementStack = staticContext.statementStack
            i = len(statementStack) - 1
            
            # a "block" *must* be found.
            while statementStack[i].type != "block":
                i -= 1

            # Lets at the def toplevel are just vars, at least in SpiderMonkey.
            if i == 0:
                build = builder.VAR_build
                addDecl = builder.VAR_addDecl
                finish = builder.VAR_finish
                childContext = staticContext

            else:
                childContext = statementStack[i]
            
        else:
            childContext = letBlock

    node = build(tokenizer)

    while True:
        tokenType = tokenizer.get()

        # "fixme" Should have a special "declaration" node instead of overloading
        # "identifier" to mean both identifier declarations and destructured
        # declarations.
        childNode = builder.DECL_build(tokenizer)
        
        if tokenType == "left_bracket" or tokenType == "left_curly":
            # Pass in childContext if we need to add each pattern matched into
            # its varDecls, else pass in staticContext.
            data = None

            # Need to unget to parse the full destructured expression.
            tokenizer.unget()
            builder.DECL_setName(childNode, DestructuringExpression(tokenizer, staticContext, True, childContext))

            if staticContext.inForLoopInit and tokenizer.peek() == "in":
                addDecl(node, childNode, childContext)
                continue

            tokenizer.mustMatch("assign")
            if (tokenizer.token.assignOp):
                raise SyntaxError("Invalid variable initialization", tokenizer)

            # Parse the init as a normal assignment.
            assignmentNode = builder.ASSIGN_build(tokenizer)
            builder.ASSIGN_addOperand(assignmentNode, childNode.name)
            builder.ASSIGN_addOperand(assignmentNode, AssignExpression(tokenizer, staticContext))
            builder.ASSIGN_finish(assignmentNode)

            # But only add the rhs as the initializer.
            # TODO: But why create the whole assignment then?
            builder.DECL_setInitializer(childNode, assignmentNode[1])
            builder.DECL_finish(childNode)
            addDecl(node, childNode, childContext)
            continue

        if tokenType != "identifier":
            raise SyntaxError("Missing variable name", tokenizer)

        builder.DECL_setName(childNode, tokenizer.token.value)
        builder.DECL_setReadOnly(childNode, node.type == "const")
        addDecl(node, childNode, childContext)

        if tokenizer.match("assign"):
            if tokenizer.token.assignOp:
                raise SyntaxError("Invalid variable initialization", tokenizer)

            # Parse the init as a normal assignment.
            id = Node(childNode.tokenizer, "identifier")
            assignmentNode = builder.ASSIGN_build(tokenizer)
            builder.ASSIGN_addOperand(assignmentNode, id)
            builder.ASSIGN_addOperand(assignmentNode, AssignExpression(tokenizer, staticContext))
            builder.ASSIGN_finish(assignmentNode)
            
            # But only add the rhs as the initializer.
            # TODO: But why create the whole assignment then?
            builder.DECL_setInitializer(childNode, assignmentNode[1])

        builder.DECL_finish(childNode)
        childContext.varDecls.append(childNode)
        
        if not tokenizer.match("comma"):
            break
        
    finish(node)
    return node



def LetBlock(tokenizer, staticContext, isStatement):
    """Does not handle let inside of for loop init."""
    builder = staticContext.builder

    # tokenizer.token.type must be "let"
    node = builder.LETBLOCK_build(tokenizer)
    tokenizer.mustMatch("left_paren")
    builder.LETBLOCK_setVariables(node, Variables(tokenizer, staticContext, node))
    tokenizer.mustMatch("right_paren")

    if isStatement and tokenizer.peek() != "left_curly":
        # If this is really an expression in let statement guise, then we
        # need to wrap the "let_block" node in a "semicolon" node so that we pop
        # the return value of the expression.
        childNode = builder.SEMICOLON_build(tokenizer)
        builder.SEMICOLON_setExpression(childNode, node)
        builder.SEMICOLON_finish(childNode)
        isStatement = False

    if isStatement:
        childNode = Block(tokenizer, staticContext)
        builder.LETBLOCK_setBlock(node, childNode)
        
    else:
        childNode = AssignExpression(tokenizer, staticContext)
        builder.LETBLOCK_setExpression(node, childNode)

    builder.LETBLOCK_finish(node)
    return node


def checkDestructuring(tokenizer, staticContext, node, simpleNamesOnly, data):
    if node.type == "array_comp":
        raise SyntaxError("Invalid array comprehension left-hand side")
        
    if node.type != "array_init" and node.type != "object_init":
        return

    builder = staticContext.builder

    for child in node:
        if child == None:
            continue
        
        if child.type == "property_init":
            lhs = child[0]
            rhs = child[1]
        else:
            lhs = None
            rhs = None
        
        if rhs and (rhs.type == "array_init" or rhs.type == "object_init"):
            checkDestructuring(tokenizer, staticContext, rhs, simpleNamesOnly, data)
            
        if lhs and simpleNamesOnly:
            # In declarations, lhs must be simple names
            if lhs.type != "identifier":
                raise SyntaxError("Missing name in pattern")
                
            elif data:
                childNode = builder.DECL_build(tokenizer)
                builder.DECL_setName(childNode, lhs.value)

                # Don't need to set initializer because it's just for
                # hoisting anyways.
                builder.DECL_finish(childNode)

                # Each pattern needs to be added to varDecls.
                data.varDecls.append(childNode)


# JavaScript 1.7
def DestructuringExpression(tokenizer, staticContext, simpleNamesOnly, data):
    node = PrimaryExpression(tokenizer, staticContext)
    checkDestructuring(tokenizer, staticContext, node, simpleNamesOnly, data)

    return node


def GeneratorExpression(tokenizer, staticContext, expression):
    node = builder.GENERATOR_build(tokenizer)

    builder.GENERATOR_setExpression(node, expression)
    builder.GENERATOR_setTail(node, comprehensionTail(tokenizer, staticContext))
    builder.GENERATOR_finish(node)

    return node


def comprehensionTail(tokenizer, staticContext):
    builder = staticContext.builder
    
    # tokenizer.token.type must be "for"
    body = builder.COMPTAIL_build(tokenizer)

    while True:
        node = builder.FOR_build(tokenizer)
        
        # Comprehension tails are always for..in loops.
        builder.FOR_rebuildForIn(node)
        if tokenizer.match("identifier"):
            # But sometimes they're for each..in.
            if tokenizer.token.value == "each":
                builder.FOR_rebuildForEach(node)
            else:
                tokenizer.unget()

        tokenizer.mustMatch("left_paren")
        
        tokenType = tokenizer.get()
        if tokenType == "left_bracket" or tokenType == "left_curly":
            tokenizer.unget()
            # Destructured left side of for in comprehension tails.
            builder.FOR_setIterator(node, DestructuringExpression(tokenizer, staticContext), None)
            break

        elif tokenType == "identifier":
            declaration = builder.DECL_build(tokenizer)
            
            builder.DECL_setName(declaration, declaration.value)
            builder.DECL_finish(declaration)
            
            childNode = builder.VAR_build(tokenizer)
            
            builder.VAR_addDecl(childNode, declaration)
            builder.VAR_finish(childNode)
            builder.FOR_setIterator(node, declaration, childNode)
            
            # Don't add to varDecls since the semantics of comprehensions is
            # such that the variables are in their own def when
            # desugared.
            break

        else:
            raise SyntaxError("Missing identifier")
        
        tokenizer.mustMatch("in")
        builder.FOR_setObject(node, Expression(tokenizer, staticContext))
        tokenizer.mustMatch("right_paren")
        builder.COMPTAIL_addFor(body, node)
        
        if not tokenizer.match("for"):
            break

    # Optional guard.
    if tokenizer.match("if"):
        builder.COMPTAIL_setGuard(body, ParenExpression(tokenizer, staticContext))

    builder.COMPTAIL_finish(body)

    return body


def ParenExpression(tokenizer, staticContext):
    tokenizer.mustMatch("left_paren")

    # Always accept the 'in' operator in a parenthesized expression,
    # where it's unambiguous, even if we might be parsing the init of a
    # for statement.
    oldLoopInit = staticContext.inForLoopInit
    staticContext.inForLoopInit = False
    node = Expression(tokenizer, staticContext)
    staticContext.inForLoopInit = oldLoopInit

    err = "expression must be parenthesized"
    if tokenizer.match("for"):
        if node.type == "yield" and not node.parenthesized:
            raise SyntaxError("Yield " + err, tokenizer)
            
        if node.type == "comma" and not node.parenthesized:
            raise SyntaxError("Generator " + err, tokenizer)
            
        node = GeneratorExpression(tokenizer, staticContext, node)

    tokenizer.mustMatch("right_paren")

    return node


def Expression(tokenizer, staticContext):
    """Top-down expression parser matched against SpiderMonkey."""
    builder = staticContext.builder
    node = AssignExpression(tokenizer, staticContext)

    if tokenizer.match("comma"):
        childNode = builder.COMMA_build(tokenizer)
        builder.COMMA_addOperand(childNode, node)
        node = childNode
        while True:
            childNode = node[len(node)-1]
            if childNode.type == "yield" and not childNode.parenthesized:
                raise SyntaxError("Yield expression must be parenthesized")
            builder.COMMA_addOperand(node, AssignExpression(tokenizer, staticContext))
            
            if not tokenizer.match("comma"):
                break
                
        builder.COMMA_finish(node)

    return node


def AssignExpression(tokenizer, staticContext):
    builder = staticContext.builder

    # Have to treat yield like an operand because it could be the leftmost
    # operand of the expression.
    if tokenizer.match("yield", True):
        return returnOrYield(tokenizer, staticContext)

    node = builder.ASSIGN_build(tokenizer)
    lhs = ConditionalExpression(tokenizer, staticContext)

    if not tokenizer.match("assign"):
        builder.ASSIGN_finish(node)
        return lhs

    if lhs.type == "object_init" or lhs.type == "array_init":
        checkDestructuring(tokenizer, staticContext, lhs)
    elif lhs.type == "identifier" or lhs.type == "dot" or lhs.type == "index" or lhs.type == "call":
        pass
    else:
        raise SyntaxError("Bad left-hand side of assignment", tokenizer)
        
    builder.ASSIGN_setAssignOp(node, tokenizer.token.assignOp)
    builder.ASSIGN_addOperand(node, lhs)
    builder.ASSIGN_addOperand(node, AssignExpression(tokenizer, staticContext))
    builder.ASSIGN_finish(node)

    return node


def ConditionalExpression(tokenizer, staticContext):
    builder = staticContext.builder
    node = OrExpression(tokenizer, staticContext)

    if tokenizer.match("hook"):
        childNode = node
        node = builder.HOOK_build(tokenizer)
        builder.HOOK_setCondition(node, childNode)

        # Always accept the 'in' operator in the middle clause of a ternary,
        # where it's unambiguous, even if we might be parsing the init of a
        # for statement.
        oldLoopInit = staticContext.inForLoopInit
        staticContext.inForLoopInit = False
        builder.HOOK_setThenPart(node, AssignExpression(tokenizer, staticContext))
        staticContext.inForLoopInit = oldLoopInit
        
        if not tokenizer.match("colon"):
            raise SyntaxError("Missing : after ?", tokenizer)
            
        builder.HOOK_setElsePart(node, AssignExpression(tokenizer, staticContext))
        builder.HOOK_finish(node)

    return node
    

def OrExpression(tokenizer, staticContext):
    builder = staticContext.builder
    node = AndExpression(tokenizer, staticContext)
    
    while tokenizer.match("or"):
        childNode = builder.OR_build(tokenizer)
        builder.OR_addOperand(childNode, node)
        builder.OR_addOperand(childNode, AndExpression(tokenizer, staticContext))
        builder.OR_finish(childNode)
        node = childNode

    return node


def AndExpression(tokenizer, staticContext):
    builder = staticContext.builder
    node = BitwiseOrExpression(tokenizer, staticContext)

    while tokenizer.match("and"):
        childNode = builder.AND_build(tokenizer)
        builder.AND_addOperand(childNode, node)
        builder.AND_addOperand(childNode, BitwiseOrExpression(tokenizer, staticContext))
        builder.AND_finish(childNode)
        node = childNode

    return node


def BitwiseOrExpression(tokenizer, staticContext):
    builder = staticContext.builder
    node = BitwiseXorExpression(tokenizer, staticContext)
    
    while tokenizer.match("bitwise_or"):
        childNode = builder.BITWISEOR_build(tokenizer)
        builder.BITWISEOR_addOperand(childNode, node)
        builder.BITWISEOR_addOperand(childNode, BitwiseXorExpression(tokenizer, staticContext))
        builder.BITWISEOR_finish(childNode)
        node = childNode

    return node


def BitwiseXorExpression(tokenizer, staticContext):
    builder = staticContext.builder
    node = BitwiseAndExpression(tokenizer, staticContext)
    
    while tokenizer.match("bitwise_xor"):
        childNode = builder.BITWISEXOR_build(tokenizer)
        builder.BITWISEXOR_addOperand(childNode, node)
        builder.BITWISEXOR_addOperand(childNode, BitwiseAndExpression(tokenizer, staticContext))
        builder.BITWISEXOR_finish(childNode)
        node = childNode

    return node


def BitwiseAndExpression(tokenizer, staticContext):
    builder = staticContext.builder
    node = EqualityExpression(tokenizer, staticContext)

    while tokenizer.match("bitwise_and"):
        childNode = builder.BITWISEAND_build(tokenizer)
        builder.BITWISEAND_addOperand(childNode, node)
        builder.BITWISEAND_addOperand(childNode, EqualityExpression(tokenizer, staticContext))
        builder.BITWISEAND_finish(childNode)
        node = childNode

    return node


def EqualityExpression(tokenizer, staticContext):
    builder = staticContext.builder
    node = RelationalExpression(tokenizer, staticContext)
    
    while tokenizer.match("eq") or tokenizer.match("ne") or tokenizer.match("strict_eq") or tokenizer.match("strict_ne"):
        childNode = builder.EQUALITY_build(tokenizer)
        builder.EQUALITY_addOperand(childNode, node)
        builder.EQUALITY_addOperand(childNode, RelationalExpression(tokenizer, staticContext))
        builder.EQUALITY_finish(childNode)
        node = childNode

    return node


def RelationalExpression(tokenizer, staticContext):
    builder = staticContext.builder
    oldLoopInit = staticContext.inForLoopInit

    # Uses of the in operator in shiftExprs are always unambiguous,
    # so unset the flag that prohibits recognizing it.
    staticContext.inForLoopInit = False
    node = ShiftExpression(tokenizer, staticContext)

    while tokenizer.match("lt") or tokenizer.match("le") or tokenizer.match("ge") or tokenizer.match("gt") or (oldLoopInit == False and tokenizer.match("in")) or tokenizer.match("instanceof"):
        childNode = builder.RELATIONAL_build(tokenizer)
        builder.RELATIONAL_addOperand(childNode, node)
        builder.RELATIONAL_addOperand(childNode, ShiftExpression(tokenizer, staticContext))
        builder.RELATIONAL_finish(childNode)
        node = childNode
    
    staticContext.inForLoopInit = oldLoopInit

    return node


def ShiftExpression(tokenizer, staticContext):
    builder = staticContext.builder
    node = AddExpression(tokenizer, staticContext)
    
    while tokenizer.match("lsh") or tokenizer.match("rsh") or tokenizer.match("ursh"):
        childNode = builder.SHIFT_build(tokenizer)
        builder.SHIFT_addOperand(childNode, node)
        builder.SHIFT_addOperand(childNode, AddExpression(tokenizer, staticContext))
        builder.SHIFT_finish(childNode)
        node = childNode

    return node


def AddExpression(tokenizer, staticContext):
    builder = staticContext.builder
    node = MultiplyExpression(tokenizer, staticContext)
    
    while tokenizer.match("plus") or tokenizer.match("minus"):
        childNode = builder.ADD_build(tokenizer)
        builder.ADD_addOperand(childNode, node)
        builder.ADD_addOperand(childNode, MultiplyExpression(tokenizer, staticContext))
        builder.ADD_finish(childNode)
        node = childNode

    return node


def MultiplyExpression(tokenizer, staticContext):
    builder = staticContext.builder
    node = UnaryExpression(tokenizer, staticContext)
    
    while tokenizer.match("mul") or tokenizer.match("div") or tokenizer.match("mod"):
        childNode = builder.MULTIPLY_build(tokenizer)
        builder.MULTIPLY_addOperand(childNode, node)
        builder.MULTIPLY_addOperand(childNode, UnaryExpression(tokenizer, staticContext))
        builder.MULTIPLY_finish(childNode)
        node = childNode

    return node


def UnaryExpression(tokenizer, staticContext):
    builder = staticContext.builder
    tokenType = tokenizer.get(True)

    if tokenType in ["delete", "void", "typeof", "not", "bitwise_not", "plus", "minus"]:
        node = builder.UNARY_build(tokenizer)
        builder.UNARY_addOperand(node, UnaryExpression(tokenizer, staticContext))
    
    elif tokenType == "increment" or tokenType == "decrement":
        # Prefix increment/decrement.
        node = builder.UNARY_build(tokenizer)
        builder.UNARY_addOperand(node, MemberExpression(tokenizer, staticContext, True))

    else:
        tokenizer.unget()
        node = MemberExpression(tokenizer, staticContext, True)

        # Don't look across a newline boundary for a postfix {in,de}crement.
        if tokenizer.tokens[(tokenizer.tokenIndex + tokenizer.lookahead - 1) & 3].line == tokenizer.line:
            if tokenizer.match("increment") or tokenizer.match("decrement"):
                childNode = builder.UNARY_build(tokenizer)
                builder.UNARY_setPostfix(childNode)
                builder.UNARY_finish(node)
                builder.UNARY_addOperand(childNode, node)
                node = childNode

    builder.UNARY_finish(node)
    return node


def MemberExpression(tokenizer, staticContext, allowCallSyntax):
    builder = staticContext.builder

    if tokenizer.match("new"):
        node = builder.MEMBER_build(tokenizer)
        builder.MEMBER_addOperand(node, MemberExpression(tokenizer, staticContext, False))
        
        if tokenizer.match("left_paren"):
            builder.MEMBER_rebuildNewWithArgs(node)
            builder.MEMBER_addOperand(node, ArgumentList(tokenizer, staticContext))
        
        builder.MEMBER_finish(node)
    
    else:
        node = PrimaryExpression(tokenizer, staticContext)

    while True:
        tokenType = tokenizer.get()
        if tokenType == "end":
            break
        
        if tokenType == "dot":
            childNode = builder.MEMBER_build(tokenizer)
            builder.MEMBER_addOperand(childNode, node)
            tokenizer.mustMatch("identifier")
            builder.MEMBER_addOperand(childNode, builder.MEMBER_build(tokenizer))

        elif tokenType == "left_bracket":
            childNode = builder.MEMBER_build(tokenizer, "index")
            builder.MEMBER_addOperand(childNode, node)
            builder.MEMBER_addOperand(childNode, Expression(tokenizer, staticContext))
            tokenizer.mustMatch("right_bracket")

        elif tokenType == "left_paren" and allowCallSyntax:
            childNode = builder.MEMBER_build(tokenizer, "call")
            builder.MEMBER_addOperand(childNode, node)
            builder.MEMBER_addOperand(childNode, ArgumentList(tokenizer, staticContext))

        else:
            tokenizer.unget()
            return node

        builder.MEMBER_finish(childNode)
        node = childNode

    return node


def ArgumentList(tokenizer, staticContext):
    builder = staticContext.builder
    node = builder.LIST_build(tokenizer)
    
    if tokenizer.match("right_paren", True):
        return node
    
    while True:    
        childNode = AssignExpression(tokenizer, staticContext)
        if childNode.type == "yield" and not childNode.parenthesized and tokenizer.peek() == "comma":
            raise SyntaxError("Yield expression must be parenthesized", tokenizer)
            
        if tokenizer.match("for"):
            childNode = GeneratorExpression(tokenizer, staticContext, childNode)
            if len(node) > 1 or tokenizer.peek(True) == "comma":
                raise SyntaxError("Generator expression must be parenthesized", tokenizer)
        
        builder.LIST_addOperand(node, childNode)
        if not tokenizer.match("comma"):
            break

    tokenizer.mustMatch("right_paren")
    builder.LIST_finish(node)

    return node


def PrimaryExpression(tokenizer, staticContext):
    builder = staticContext.builder
    tokenType = tokenizer.get(True)

    if tokenType == "function":
        node = FunctionDefinition(tokenizer, staticContext, False, "expressed_form")

    elif tokenType == "left_bracket":
        node = builder.ARRAYINIT_build(tokenizer)
        while True:
            tokenType = tokenizer.peek()
            if tokenType == "right_bracket":
                break
        
            if tokenType == "comma":
                tokenizer.get()
                builder.ARRAYINIT_addElement(node, None)
                continue

            builder.ARRAYINIT_addElement(node, AssignExpression(tokenizer, staticContext))

            if tokenType != "comma" and not tokenizer.match("comma"):
                break

        # If we matched exactly one element and got a "for", we have an
        # array comprehension.
        if len(node) == 1 and tokenizer.match("for"):
            childNode = builder.ARRAYCOMP_build(tokenizer)
            builder.ARRAYCOMP_setExpression(childNode, node[0])
            builder.ARRAYCOMP_setTail(childNode, comprehensionTail(tokenizer, staticContext))
            node = childNode
        
        tokenizer.mustMatch("right_bracket")
        builder.PRIMARY_finish(node)

    elif tokenType == "left_curly":
        node = builder.OBJECTINIT_build(tokenizer)

        # Simulate a label-goto from "js" via a closure
        def object_init():
            if not tokenizer.match("right_curly"):
                while True:
                    tokenType = tokenizer.get()
                    
                    if (tokenizer.token.value == "get" or tokenizer.token.value == "set") and tokenizer.peek() == "identifier":
                        if staticContext.ecma3OnlyMode:
                            raise SyntaxError("Illegal property accessor", tokenizer)
                            
                        fd = FunctionDefinition(tokenizer, staticContext, True, "expressed_form")
                        builder.OBJECTINIT_addProperty(node, fd)
                        
                    else:
                        if tokenType == "identifier" or tokenType == "number" or tokenType == "string":
                            id = builder.PRIMARY_build(tokenizer, "identifier")
                            builder.PRIMARY_finish(id)
                            
                        elif tokenType == "right_curly":
                            if staticContext.ecma3OnlyMode:
                                raise SyntaxError("Illegal trailing ,", tokenizer)
                            
                            # re-call self
                            object_init()
                            
                        else:
                            if tokenizer.token.value in keywords:
                                id = builder.PRIMARY_build(tokenizer, "identifier")
                                builder.PRIMARY_finish(id)
                            else:
                                raise SyntaxError("Invalid property name", tokenizer)
                        
                        if tokenizer.match("colon"):
                            childNode = builder.PROPERTYINIT_build(tokenizer)
                            builder.PROPERTYINIT_addOperand(childNode, id)
                            builder.PROPERTYINIT_addOperand(childNode, AssignExpression(tokenizer, staticContext))
                            builder.PROPERTYINIT_finish(childNode)
                            builder.OBJECTINIT_addProperty(node, childNode)
                            
                        else:
                            # Support, e.g., |var {staticContext, y} = o| as destructuring shorthand
                            # for |var {staticContext: staticContext, y: y} = o|, per proposed JS2/ES4 for JS1.8.
                            if tokenizer.peek() != "comma" and tokenizer.peek() != "right_curly":
                                raise SyntaxError("Missing : after property", tokenizer)
                            builder.OBJECTINIT_addProperty(node, id)
                        
                    if not tokenizer.match("comma"):
                        break

                tokenizer.mustMatch("right_curly")

            builder.OBJECTINIT_finish(node)
        
        # Initial call
        object_init()        

    elif tokenType == "left_paren":
        # ParenExpression does its own matching on parentheses, so we need to unget.
        tokenizer.unget()
        node = ParenExpression(tokenizer, staticContext)
        node.parenthesized = True

    elif tokenType == "let":
        node = LetBlock(tokenizer, staticContext, False)

    elif tokenType in ["null", "this", "true", "false", "identifier", "number", "string", "regexp"]:
        node = builder.PRIMARY_build(tokenizer, tokenType)
        builder.PRIMARY_finish(node)

    else:
        raise SyntaxError("Missing operand. Found type: %s" % tokenType, tokenizer)

    return node
