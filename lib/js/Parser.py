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


# Used as a status container during tree-building for every function body and the global body
class CompilerContext(object):
    # inFunction is used to check if a return stm appears in a valid context.
    def __init__(self, inFunction, builder):
        # Whether this is inside a function, mostly true, only for top-level scope it's false
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
    """Parses the toplevel and function bodies."""
    node = Statements(tokenizer, compilerContext)
    
    # change type from "block" to "script" for script root
    node.type = "script"

    # copy over data from compiler context
    node.funDecls = compilerContext.funDecls
    node.varDecls = compilerContext.varDecls

    return node
    










    // Statement stack and nested statement handler.
    function nest(tokenizer, compilerContext, node, func, end) {
        compilerContext.stmtStack.push(node)
        var node = func(tokenizer, compilerContext)
        compilerContext.stmtStack.pop()
        end && tokenizer.mustMatch(end)
        return node
    }

    /*
     * Statements :: (tokenizer, compiler context) -> node
     *
     * Parses a list of Statements.
     */
    function Statements(tokenizer, compilerContext) {
        var builder = compilerContext.builder
        var node = builder.BLOCK$build(tokenizer, compilerContext.blockId++)
        builder.BLOCK$hoistLets(node)
        compilerContext.stmtStack.push(node)
        while (!tokenizer.done && tokenizer.peek(true) != RIGHT_CURLY)
            builder.BLOCK$addStatement(node, Statement(tokenizer, compilerContext))
        compilerContext.stmtStack.pop()
        builder.BLOCK$finish(node)
        if (node.needsHoisting) {
            builder.setHoists(node.id, node.varDecls)
            // Propagate up to the function.
            compilerContext.needsHoisting = true
        }
        return node
    }

    function Block(tokenizer, compilerContext) {
        tokenizer.mustMatch(LEFT_CURLY)
        var node = Statements(tokenizer, compilerContext)
        tokenizer.mustMatch(RIGHT_CURLY)
        return node
    }

    const DECLARED_FORM = 0, EXPRESSED_FORM = 1, STATEMENT_FORM = 2

    /*
     * Statement :: (tokenizer, compiler context) -> node
     *
     * Parses a Statement.
     */
    function Statement(tokenizer, compilerContext) {
        var i, label, node, n2, ss, tt = tokenizer.get(true)
        var builder = compilerContext.builder

        // Cases for statements ending in a right curly return early, avoiding the
        // common semicolon insertion magic after this switch.
        switch (tt) {
          case FUNCTION:
            // DECLARED_FORM extends funDecls of compilerContext, STATEMENT_FORM doesn'tokenizer.
            return FunctionDefinition(tokenizer, compilerContext, true,
                                      (compilerContext.stmtStack.length > 1)
                                      ? STATEMENT_FORM
                                      : DECLARED_FORM)

          case LEFT_CURLY:
            node = Statements(tokenizer, compilerContext)
            tokenizer.mustMatch(RIGHT_CURLY)
            return node

          case IF:
            node = builder.IF$build(tokenizer)
            builder.IF$setCondition(node, ParenExpression(tokenizer, compilerContext))
            compilerContext.stmtStack.push(node)
            builder.IF$setThenPart(node, Statement(tokenizer, compilerContext))
            if (tokenizer.match(ELSE))
                builder.IF$setElsePart(node, Statement(tokenizer, compilerContext))
            compilerContext.stmtStack.pop()
            builder.IF$finish(node)
            return node

          case SWITCH:
            // This allows CASEs after a DEFAULT, which is in the standard.
            node = builder.SWITCH$build(tokenizer)
            builder.SWITCH$setDiscriminant(node, ParenExpression(tokenizer, compilerContext))
            compilerContext.stmtStack.push(node)
            tokenizer.mustMatch(LEFT_CURLY)
            while ((tt = tokenizer.get()) != RIGHT_CURLY) {
                switch (tt) {
                  case DEFAULT:
                    if (node.defaultIndex >= 0)
                        throw tokenizer.newSyntaxError("More than one switch default")
                    n2 = builder.DEFAULT$build(tokenizer)
                    builder.SWITCH$setDefaultIndex(node, node.cases.length)
                    tokenizer.mustMatch(COLON)
                    builder.DEFAULT$initializeStatements(n2, tokenizer)
                    while ((tt=tokenizer.peek(true)) != CASE && tt != DEFAULT &&
                           tt != RIGHT_CURLY)
                        builder.DEFAULT$addStatement(n2, Statement(tokenizer, compilerContext))
                    builder.DEFAULT$finish(n2)
                    break

                  case CASE:
                    n2 = builder.CASE$build(tokenizer)
                    builder.CASE$setLabel(n2, Expression(tokenizer, compilerContext, COLON))
                    tokenizer.mustMatch(COLON)
                    builder.CASE$initializeStatements(n2, tokenizer)
                    while ((tt=tokenizer.peek(true)) != CASE && tt != DEFAULT &&
                           tt != RIGHT_CURLY)
                        builder.CASE$addStatement(n2, Statement(tokenizer, compilerContext))
                    builder.CASE$finish(n2)
                    break

                  default:
                    throw tokenizer.newSyntaxError("Invalid switch case")
                }
                builder.SWITCH$addCase(node, n2)
            }
            compilerContext.stmtStack.pop()
            builder.SWITCH$finish(node)
            return node

          case FOR:
            node = builder.FOR$build(tokenizer)
            if (tokenizer.match(IDENTIFIER) && tokenizer.token.value == "each")
                builder.FOR$rebuildForEach(node)
            tokenizer.mustMatch(LEFT_PAREN)
            if ((tt = tokenizer.peek()) != SEMICOLON) {
                compilerContext.inForLoopInit = true
                if (tt == VAR || tt == CONST) {
                    tokenizer.get()
                    n2 = Variables(tokenizer, compilerContext)
                } else if (tt == LET) {
                    tokenizer.get()
                    if (tokenizer.peek() == LEFT_PAREN) {
                        n2 = LetBlock(tokenizer, compilerContext, false)
                    } else {
                        /*
                         * Let in for head, we need to add an implicit block
                         * around the rest of the for.
                         */
                        var forBlock = builder.BLOCK$build(tokenizer, compilerContext.blockId++)
                        compilerContext.stmtStack.push(forBlock)
                        n2 = Variables(tokenizer, compilerContext, forBlock)
                    }
                } else {
                    n2 = Expression(tokenizer, compilerContext)
                }
                compilerContext.inForLoopInit = false
            }
            if (n2 && tokenizer.match(IN)) {
                builder.FOR$rebuildForIn(node)
                builder.FOR$setObject(node, Expression(tokenizer, compilerContext), forBlock)
                if (n2.type == VAR || n2.type == LET) {
                    if (n2.length != 1) {
                        throw new SyntaxError("Invalid for..in left-hand side",
                                              tokenizer.filename, n2.lineno)
                    }
                    builder.FOR$setIterator(node, n2[0], n2, forBlock)
                } else {
                    builder.FOR$setIterator(node, n2, null, forBlock)
                }
            } else {
                builder.FOR$setSetup(node, n2)
                tokenizer.mustMatch(SEMICOLON)
                if (node.isEach)
                    throw tokenizer.newSyntaxError("Invalid for each..in loop")
                builder.FOR$setCondition(node, (tokenizer.peek() == SEMICOLON)
                                  ? null
                                  : Expression(tokenizer, compilerContext))
                tokenizer.mustMatch(SEMICOLON)
                builder.FOR$setUpdate(node, (tokenizer.peek() == RIGHT_PAREN)
                                   ? null
                                   : Expression(tokenizer, compilerContext))
            }
            tokenizer.mustMatch(RIGHT_PAREN)
            builder.FOR$setBody(node, nest(tokenizer, compilerContext, node, Statement))
            if (forBlock) {
                builder.BLOCK$finish(forBlock)
                compilerContext.stmtStack.pop()
            }
            builder.FOR$finish(node)
            return node

          case WHILE:
            node = builder.WHILE$build(tokenizer)
            builder.WHILE$setCondition(node, ParenExpression(tokenizer, compilerContext))
            builder.WHILE$setBody(node, nest(tokenizer, compilerContext, node, Statement))
            builder.WHILE$finish(node)
            return node

          case DO:
            node = builder.DO$build(tokenizer)
            builder.DO$setBody(node, nest(tokenizer, compilerContext, node, Statement, WHILE))
            builder.DO$setCondition(node, ParenExpression(tokenizer, compilerContext))
            builder.DO$finish(node)
            if (!compilerContext.ecmaStrictMode) {
                // <script language="JavaScript"> (without version hints) may need
                // automatic semicolon insertion without a newline after do-while.
                // See http://bugzilla.mozilla.org/show_bug.cgi?id=238945.
                tokenizer.match(SEMICOLON)
                return node
            }
            break

          case BREAK:
          case CONTINUE:
            node = tt == BREAK ? builder.BREAK$build(tokenizer) : builder.CONTINUE$build(tokenizer)

            if (tokenizer.peekOnSameLine() == IDENTIFIER) {
                tokenizer.get()
                if (tt == BREAK)
                    builder.BREAK$setLabel(node, tokenizer.token.value)
                else
                    builder.CONTINUE$setLabel(node, tokenizer.token.value)
            }

            ss = compilerContext.stmtStack
            i = ss.length
            label = node.label

            if (label) {
                do {
                    if (--i < 0)
                        throw tokenizer.newSyntaxError("Label not found")
                } while (ss[i].label != label)

                /*
                 * Both break and continue to label need to be handled specially
                 * within a labeled loop, so that they target that loop. If not in
                 * a loop, then break targets its labeled statement. Labels can be
                 * nested so we skip all labels immediately enclosing the nearest
                 * non-label statement.
                 */
                while (i < ss.length - 1 && ss[i+1].type == LABEL)
                    i++
                if (i < ss.length - 1 && ss[i+1].isLoop)
                    i++
                else if (tt == CONTINUE)
                    throw tokenizer.newSyntaxError("Invalid continue")
            } else {
                do {
                    if (--i < 0) {
                        throw tokenizer.newSyntaxError("Invalid " + ((tt == BREAK)
                                                             ? "break"
                                                             : "continue"))
                    }
                } while (!ss[i].isLoop && !(tt == BREAK && ss[i].type == SWITCH))
            }
            if (tt == BREAK) {
                builder.BREAK$setTarget(node, ss[i])
                builder.BREAK$finish(node)
            } else {
                builder.CONTINUE$setTarget(node, ss[i])
                builder.CONTINUE$finish(node)
            }
            break

          case TRY:
            node = builder.TRY$build(tokenizer)
            builder.TRY$setTryBlock(node, Block(tokenizer, compilerContext))
            while (tokenizer.match(CATCH)) {
                n2 = builder.CATCH$build(tokenizer)
                tokenizer.mustMatch(LEFT_PAREN)
                switch (tokenizer.get()) {
                  case LEFT_BRACKET:
                  case LEFT_CURLY:
                    // Destructured catch identifiers.
                    tokenizer.unget()
                    builder.CATCH$setVarName(n2, DestructuringExpression(tokenizer, compilerContext, true))
                  case IDENTIFIER:
                    builder.CATCH$setVarName(n2, tokenizer.token.value)
                    break
                  default:
                    throw tokenizer.newSyntaxError("Missing identifier in catch")
                    break
                }
                if (tokenizer.match(IF)) {
                    if (compilerContext.ecma3OnlyMode)
                        throw tokenizer.newSyntaxError("Illegal catch guard")
                    if (node.catchClauses.length && !node.catchClauses.top().guard)
                        throw tokenizer.newSyntaxError("Guarded catch after unguarded")
                    builder.CATCH$setGuard(n2, Expression(tokenizer, compilerContext))
                } else {
                    builder.CATCH$setGuard(n2, null)
                }
                tokenizer.mustMatch(RIGHT_PAREN)
                builder.CATCH$setBlock(n2, Block(tokenizer, compilerContext))
                builder.CATCH$finish(n2)
                builder.TRY$addCatch(node, n2)
            }
            builder.TRY$finishCatches(node)
            if (tokenizer.match(FINALLY))
                builder.TRY$setFinallyBlock(node, Block(tokenizer, compilerContext))
            if (!node.catchClauses.length && !node.finallyBlock)
                throw tokenizer.newSyntaxError("Invalid try statement")
            builder.TRY$finish(node)
            return node

          case CATCH:
          case FINALLY:
            throw tokenizer.newSyntaxError(tokens[tt] + " without preceding try")

          case THROW:
            node = builder.THROW$build(tokenizer)
            builder.THROW$setException(node, Expression(tokenizer, compilerContext))
            builder.THROW$finish(node)
            break

          case RETURN:
            node = returnOrYield(tokenizer, compilerContext)
            break

          case WITH:
            node = builder.WITH$build(tokenizer)
            builder.WITH$setObject(node, ParenExpression(tokenizer, compilerContext))
            builder.WITH$setBody(node, nest(tokenizer, compilerContext, node, Statement))
            builder.WITH$finish(node)
            return node

          case VAR:
          case CONST:
            node = Variables(tokenizer, compilerContext)
            break

          case LET:
            if (tokenizer.peek() == LEFT_PAREN)
                node = LetBlock(tokenizer, compilerContext, true)
            else
                node = Variables(tokenizer, compilerContext)
            break

          case DEBUGGER:
            node = builder.DEBUGGER$build(tokenizer)
            break

          case NEWLINE:
          case SEMICOLON:
            node = builder.SEMICOLON$build(tokenizer)
            builder.SEMICOLON$setExpression(node, null)
            builder.SEMICOLON$finish(tokenizer)
            return node

          default:
            if (tt == IDENTIFIER) {
                tt = tokenizer.peek()
                // Labeled statement.
                if (tt == COLON) {
                    label = tokenizer.token.value
                    ss = compilerContext.stmtStack
                    for (i = ss.length-1; i >= 0; --i) {
                        if (ss[i].label == label)
                            throw tokenizer.newSyntaxError("Duplicate label")
                    }
                    tokenizer.get()
                    node = builder.LABEL$build(tokenizer)
                    builder.LABEL$setLabel(node, label)
                    builder.LABEL$setStatement(node, nest(tokenizer, compilerContext, node, Statement))
                    builder.LABEL$finish(node)
                    return node
                }
            }

            // Expression statement.
            // We unget the current token to parse the expression as a whole.
            node = builder.SEMICOLON$build(tokenizer)
            tokenizer.unget()
            builder.SEMICOLON$setExpression(node, Expression(tokenizer, compilerContext))
            node.end = node.expression.end
            builder.SEMICOLON$finish(node)
            break
        }

        MagicalSemicolon(tokenizer)
        return node
    }

    function MagicalSemicolon(tokenizer) {
        var tt
        if (tokenizer.lineno == tokenizer.token.lineno) {
            tt = tokenizer.peekOnSameLine()
            if (tt != END && tt != NEWLINE && tt != SEMICOLON && tt != RIGHT_CURLY)
                throw tokenizer.newSyntaxError("Missing ; before statement")
        }
        tokenizer.match(SEMICOLON)
    }

    function returnOrYield(tokenizer, compilerContext) {
        var node, builder = compilerContext.builder, tt = tokenizer.token.type, tt2

        if (tt == RETURN) {
            if (!compilerContext.inFunction)
                throw tokenizer.newSyntaxError("Return not in function")
            node = builder.RETURN$build(tokenizer)
        } else /* (tt == YIELD) */ {
            if (!compilerContext.inFunction)
                throw tokenizer.newSyntaxError("Yield not in function")
            compilerContext.isGenerator = true
            node = builder.YIELD$build(tokenizer)
        }

        tt2 = tokenizer.peek(true)
        if (tt2 != END && tt2 != NEWLINE && tt2 != SEMICOLON && tt2 != RIGHT_CURLY
            && (tt != YIELD ||
                (tt2 != tt && tt2 != RIGHT_BRACKET && tt2 != RIGHT_PAREN &&
                 tt2 != COLON && tt2 != COMMA))) {
            if (tt == RETURN) {
                builder.RETURN$setValue(node, Expression(tokenizer, compilerContext))
                compilerContext.hasReturnWithValue = true
            } else {
                builder.YIELD$setValue(node, AssignExpression(tokenizer, compilerContext))
            }
        } else if (tt == RETURN) {
            compilerContext.hasEmptyReturn = true
        }

        // Disallow return v; in generator.
        if (compilerContext.hasReturnWithValue && compilerContext.isGenerator)
            throw tokenizer.newSyntaxError("Generator returns a value")

        if (tt == RETURN)
            builder.RETURN$finish(node)
        else
            builder.YIELD$finish(node)

        return node
    }

    /*
     * FunctionDefinition :: (tokenizer, compiler context, boolean,
     *                        DECLARED_FORM or EXPRESSED_FORM or STATEMENT_FORM)
     *                    -> node
     */
    function FunctionDefinition(tokenizer, compilerContext, requireName, functionForm) {
        var builder = compilerContext.builder
        var f = builder.FUNCTION$build(tokenizer)
        if (tokenizer.match(IDENTIFIER))
            builder.FUNCTION$setName(f, tokenizer.token.value)
        else if (requireName)
            throw tokenizer.newSyntaxError("Missing function identifier")

        tokenizer.mustMatch(LEFT_PAREN)
        if (!tokenizer.match(RIGHT_PAREN)) {
            do {
                switch (tokenizer.get()) {
                  case LEFT_BRACKET:
                  case LEFT_CURLY:
                    // Destructured formal parameters.
                    tokenizer.unget()
                    builder.FUNCTION$addParam(f, DestructuringExpression(tokenizer, compilerContext))
                    break
                  case IDENTIFIER:
                    builder.FUNCTION$addParam(f, tokenizer.token.value)
                    break
                  default:
                    throw tokenizer.newSyntaxError("Missing formal parameter")
                    break
                }
            } while (tokenizer.match(COMMA))
            tokenizer.mustMatch(RIGHT_PAREN)
        }

        // Do we have an expression closure or a normal body?
        var tt = tokenizer.get()
        if (tt != LEFT_CURLY)
            tokenizer.unget()

        var x2 = new CompilerContext(true, builder)
        var rp = tokenizer.save()
        if (compilerContext.inFunction) {
            /*
             * Inner functions don'tokenizer reset block numbering. They also need to
             * remember which block they were parsed in for hoisting (see comment
             * below).
             */
            x2.blockId = compilerContext.blockId
        }

        if (tt != LEFT_CURLY) {
            builder.FUNCTION$setBody(f, AssignExpression(tokenizer, compilerContext))
            if (compilerContext.isGenerator)
                throw tokenizer.newSyntaxError("Generator returns a value")
        } else {
            builder.FUNCTION$hoistVars(x2.blockId)
            builder.FUNCTION$setBody(f, Script(tokenizer, x2))
        }

        /*
         * To linearize hoisting with nested blocks needing hoists, if a toplevel
         * function has any hoists we reparse the entire thing. Each toplevel
         * function is parsed at most twice.
         *
         * Pass 1: If there needs to be hoisting at any child block or inner
         * function, the entire function gets reparsed.
         *
         * Pass 2: It's possible that hoisting has changed the upvars of
         * functions. That is, consider:
         *
         * function f() {
         *   compilerContext = 0
         *   g()
         *   compilerContext; // compilerContext's forward pointer should be invalidated!
         *   function g() {
         *     compilerContext = 'g'
         *   }
         *   var compilerContext
         * }
         *
         * So, a function needs to remember in which block it is parsed under
         * (since the function body is _not_ hoisted, only the declaration) and
         * upon hoisting, needs to recalculate all its upvars up front.
         */
        if (x2.needsHoisting) {
            // Order is important here! funDecls must come _after_ varDecls!
            builder.setHoists(f.body.id, x2.varDecls.concat(x2.funDecls))

            if (compilerContext.inFunction) {
                // Propagate up to the parent function if we're an inner function.
                compilerContext.needsHoisting = true
            } else {
                // Only re-parse toplevel functions.
                var x3 = x2
                x2 = new CompilerContext(true, builder)
                tokenizer.rewind(rp)
                // Set a flag in case the builder wants to have different behavior
                // on the second pass.
                builder.secondPass = true
                builder.FUNCTION$hoistVars(f.body.id, true)
                builder.FUNCTION$setBody(f, Script(tokenizer, x2))
                builder.secondPass = false
            }
        }

        if (tt == LEFT_CURLY)
            tokenizer.mustMatch(RIGHT_CURLY)

        f.end = tokenizer.token.end
        f.functionForm = functionForm
        if (functionForm == DECLARED_FORM)
            compilerContext.funDecls.push(f)
        builder.FUNCTION$finish(f, compilerContext)
        return f
    }

    /*
     * Variables :: (tokenizer, compiler context) -> node
     *
     * Parses a comma-separated list of var declarations (and maybe
     * initializations).
     */
    function Variables(tokenizer, compilerContext, letBlock) {
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
                while (ss[--i].type !== BLOCK) ; // a BLOCK *must* be found.
                /*
                 * Lets at the function toplevel are just vars, at least in
                 * SpiderMonkey.
                 */
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
            var tt = tokenizer.get()
            /*
             * FIXME Should have a special DECLARATION node instead of overloading
             * IDENTIFIER to mean both identifier declarations and destructured
             * declarations.
             */
            var n2 = builder.DECL$build(tokenizer)
            if (tt == LEFT_BRACKET || tt == LEFT_CURLY) {
                // Pass in s if we need to add each pattern matched into
                // its varDecls, else pass in compilerContext.
                var data = null
                // Need to unget to parse the full destructured expression.
                tokenizer.unget()
                builder.DECL$setName(n2, DestructuringExpression(tokenizer, compilerContext, true, s))
                if (compilerContext.inForLoopInit && tokenizer.peek() == IN) {
                    addDecl.call(builder, node, n2, s)
                    continue
                }

                tokenizer.mustMatch(ASSIGN)
                if (tokenizer.token.assignOp)
                    throw tokenizer.newSyntaxError("Invalid variable initialization")

                // Parse the init as a normal assignment.
                var n3 = builder.ASSIGN$build(tokenizer)
                builder.ASSIGN$addOperand(n3, n2.name)
                builder.ASSIGN$addOperand(n3, AssignExpression(tokenizer, compilerContext))
                builder.ASSIGN$finish(n3)

                // But only add the rhs as the initializer.
                builder.DECL$setInitializer(n2, n3[1])
                builder.DECL$finish(n2)
                addDecl.call(builder, node, n2, s)
                continue
            }

            if (tt != IDENTIFIER)
                throw tokenizer.newSyntaxError("Missing variable name")

            builder.DECL$setName(n2, tokenizer.token.value)
            builder.DECL$setReadOnly(n2, node.type == CONST)
            addDecl.call(builder, node, n2, s)

            if (tokenizer.match(ASSIGN)) {
                if (tokenizer.token.assignOp)
                    throw tokenizer.newSyntaxError("Invalid variable initialization")

                // Parse the init as a normal assignment.
                var id = mkIdentifier(n2.tokenizer, n2.name, true)
                var n3 = builder.ASSIGN$build(tokenizer)
                builder.ASSIGN$addOperand(n3, id)
                builder.ASSIGN$addOperand(n3, AssignExpression(tokenizer, compilerContext))
                builder.ASSIGN$finish(n3)
                initializers.push(n3)

                // But only add the rhs as the initializer.
                builder.DECL$setInitializer(n2, n3[1])
            }

            builder.DECL$finish(n2)
            s.varDecls.push(n2)
        } while (tokenizer.match(COMMA))
        finish.call(builder, node)
        return node
    }

    /*
     * LetBlock :: (tokenizer, compiler context, boolean) -> node
     *
     * Does not handle let inside of for loop init.
     */
    function LetBlock(tokenizer, compilerContext, isStatement) {
        var node, n2, binds
        var builder = compilerContext.builder

        // tokenizer.token.type must be LET
        node = builder.LET_BLOCK$build(tokenizer)
        tokenizer.mustMatch(LEFT_PAREN)
        builder.LET_BLOCK$setVariables(node, Variables(tokenizer, compilerContext, node))
        tokenizer.mustMatch(RIGHT_PAREN)

        if (isStatement && tokenizer.peek() != LEFT_CURLY) {
            /*
             * If this is really an expression in let statement guise, then we
             * need to wrap the LET_BLOCK node in a SEMICOLON node so that we pop
             * the return value of the expression.
             */
            n2 = builder.SEMICOLON$build(tokenizer)
            builder.SEMICOLON$setExpression(n2, node)
            builder.SEMICOLON$finish(n2)
            isStatement = false
        }

        if (isStatement) {
            n2 = Block(tokenizer, compilerContext)
            builder.LET_BLOCK$setBlock(node, n2)
        } else {
            n2 = AssignExpression(tokenizer, compilerContext)
            builder.LET_BLOCK$setExpression(node, n2)
        }

        builder.LET_BLOCK$finish(node)

        return node
    }

    function checkDestructuring(tokenizer, compilerContext, node, simpleNamesOnly, data) {
        if (node.type == ARRAY_COMP)
            throw tokenizer.newSyntaxError("Invalid array comprehension left-hand side")
        if (node.type != ARRAY_INIT && node.type != OBJECT_INIT)
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
            if (rhs && (rhs.type == ARRAY_INIT || rhs.type == OBJECT_INIT))
                checkDestructuring(tokenizer, compilerContext, rhs, simpleNamesOnly, data)
            if (lhs && simpleNamesOnly) {
                // In declarations, lhs must be simple names
                if (lhs.type != IDENTIFIER) {
                    throw tokenizer.newSyntaxError("Missing name in pattern")
                } else if (data) {
                    var n2 = builder.DECL$build(tokenizer)
                    builder.DECL$setName(n2, lhs.value)
                    // Don'tokenizer need to set initializer because it's just for
                    // hoisting anyways.
                    builder.DECL$finish(n2)
                    // Each pattern needs to be added to varDecls.
                    data.varDecls.push(n2)
                }
            }
        }
    }

    function DestructuringExpression(tokenizer, compilerContext, simpleNamesOnly, data) {
        var node = PrimaryExpression(tokenizer, compilerContext)
        checkDestructuring(tokenizer, compilerContext, node, simpleNamesOnly, data)
        return node
    }

    function GeneratorExpression(tokenizer, compilerContext, e) {
        var node

        node = builder.GENERATOR$build(tokenizer)
        builder.GENERATOR$setExpression(node, e)
        builder.GENERATOR$setTail(node, comprehensionTail(tokenizer, compilerContext))
        builder.GENERATOR$finish(node)

        return node
    }

    function comprehensionTail(tokenizer, compilerContext) {
        var body, node
        var builder = compilerContext.builder
        // tokenizer.token.type must be FOR
        body = builder.COMP_TAIL$build(tokenizer)

        do {
            node = builder.FOR$build(tokenizer)
            // Comprehension tails are always for..in loops.
            builder.FOR$rebuildForIn(node)
            if (tokenizer.match(IDENTIFIER)) {
                // But sometimes they're for each..in.
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
                // Destructured left side of for in comprehension tails.
                builder.FOR$setIterator(node, DestructuringExpression(tokenizer, compilerContext), null)
                break

              case IDENTIFIER:
                var n3 = builder.DECL$build(tokenizer)
                builder.DECL$setName(n3, n3.value)
                builder.DECL$finish(n3)
                var n2 = builder.VAR$build(tokenizer)
                builder.VAR$addDecl(n2, n3)
                builder.VAR$finish(n2)
                builder.FOR$setIterator(node, n3, n2)
                /*
                 * Don'tokenizer add to varDecls since the semantics of comprehensions is
                 * such that the variables are in their own function when
                 * desugared.
                 */
                break

              default:
                throw tokenizer.newSyntaxError("Missing identifier")
            }
            tokenizer.mustMatch(IN)
            builder.FOR$setObject(node, Expression(tokenizer, compilerContext))
            tokenizer.mustMatch(RIGHT_PAREN)
            builder.COMP_TAIL$addFor(body, node)
        } while (tokenizer.match(FOR))

        // Optional guard.
        if (tokenizer.match(IF))
            builder.COMP_TAIL$setGuard(body, ParenExpression(tokenizer, compilerContext))

        builder.COMP_TAIL$finish(body)
        return body
    }

    function ParenExpression(tokenizer, compilerContext) {
        tokenizer.mustMatch(LEFT_PAREN)

        /*
         * Always accept the 'in' operator in a parenthesized expression,
         * where it's unambiguous, even if we might be parsing the init of a
         * for statement.
         */
        var oldLoopInit = compilerContext.inForLoopInit
        compilerContext.inForLoopInit = false
        var node = Expression(tokenizer, compilerContext)
        compilerContext.inForLoopInit = oldLoopInit

        var err = "expression must be parenthesized"
        if (tokenizer.match(FOR)) {
            if (node.type == YIELD && !node.parenthesized)
                throw tokenizer.newSyntaxError("Yield " + err)
            if (node.type == COMMA && !node.parenthesized)
                throw tokenizer.newSyntaxError("Generator " + err)
            node = GeneratorExpression(tokenizer, compilerContext, node)
        }

        tokenizer.mustMatch(RIGHT_PAREN)

        return node
    }

    /*
     * Expression: (tokenizer, compiler context) -> node
     *
     * Top-down expression parser matched against SpiderMonkey.
     */
    function Expression(tokenizer, compilerContext) {
        var node, n2
        var builder = compilerContext.builder

        node = AssignExpression(tokenizer, compilerContext)
        if (tokenizer.match(COMMA)) {
            n2 = builder.COMMA$build(tokenizer)
            builder.COMMA$addOperand(n2, node)
            node = n2
            do {
                n2 = node[node.length-1]
                if (n2.type == YIELD && !n2.parenthesized)
                    throw tokenizer.newSyntaxError("Yield expression must be parenthesized")
                builder.COMMA$addOperand(node, AssignExpression(tokenizer, compilerContext))
            } while (tokenizer.match(COMMA))
            builder.COMMA$finish(node)
        }

        return node
    }

    function AssignExpression(tokenizer, compilerContext) {
        var node, lhs
        var builder = compilerContext.builder

        // Have to treat yield like an operand because it could be the leftmost
        // operand of the expression.
        if (tokenizer.match(YIELD, true))
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
            // FALL THROUGH
          case IDENTIFIER: case DOT: case INDEX: case CALL:
            break
          default:
            throw tokenizer.newSyntaxError("Bad left-hand side of assignment")
            break
        }

        builder.ASSIGN$setAssignOp(node, tokenizer.token.assignOp)
        builder.ASSIGN$addOperand(node, lhs)
        builder.ASSIGN$addOperand(node, AssignExpression(tokenizer, compilerContext))
        builder.ASSIGN$finish(node)

        return node
    }

    function ConditionalExpression(tokenizer, compilerContext) {
        var node, n2
        var builder = compilerContext.builder

        node = OrExpression(tokenizer, compilerContext)
        if (tokenizer.match(HOOK)) {
            n2 = node
            node = builder.HOOK$build(tokenizer)
            builder.HOOK$setCondition(node, n2)
            /*
             * Always accept the 'in' operator in the middle clause of a ternary,
             * where it's unambiguous, even if we might be parsing the init of a
             * for statement.
             */
            var oldLoopInit = compilerContext.inForLoopInit
            compilerContext.inForLoopInit = false
            builder.HOOK$setThenPart(node, AssignExpression(tokenizer, compilerContext))
            compilerContext.inForLoopInit = oldLoopInit
            if (!tokenizer.match(COLON))
                throw tokenizer.newSyntaxError("Missing : after ?")
            builder.HOOK$setElsePart(node, AssignExpression(tokenizer, compilerContext))
            builder.HOOK$finish(node)
        }

        return node
    }

    function OrExpression(tokenizer, compilerContext) {
        var node, n2
        var builder = compilerContext.builder

        node = AndExpression(tokenizer, compilerContext)
        while (tokenizer.match(OR)) {
            n2 = builder.OR$build(tokenizer)
            builder.OR$addOperand(n2, node)
            builder.OR$addOperand(n2, AndExpression(tokenizer, compilerContext))
            builder.OR$finish(n2)
            node = n2
        }

        return node
    }

    function AndExpression(tokenizer, compilerContext) {
        var node, n2
        var builder = compilerContext.builder

        node = BitwiseOrExpression(tokenizer, compilerContext)
        while (tokenizer.match(AND)) {
            n2 = builder.AND$build(tokenizer)
            builder.AND$addOperand(n2, node)
            builder.AND$addOperand(n2, BitwiseOrExpression(tokenizer, compilerContext))
            builder.AND$finish(n2)
            node = n2
        }

        return node
    }

    function BitwiseOrExpression(tokenizer, compilerContext) {
        var node, n2
        var builder = compilerContext.builder

        node = BitwiseXorExpression(tokenizer, compilerContext)
        while (tokenizer.match(BITWISE_OR)) {
            n2 = builder.BITWISE_OR$build(tokenizer)
            builder.BITWISE_OR$addOperand(n2, node)
            builder.BITWISE_OR$addOperand(n2, BitwiseXorExpression(tokenizer, compilerContext))
            builder.BITWISE_OR$finish(n2)
            node = n2
        }

        return node
    }

    function BitwiseXorExpression(tokenizer, compilerContext) {
        var node, n2
        var builder = compilerContext.builder

        node = BitwiseAndExpression(tokenizer, compilerContext)
        while (tokenizer.match(BITWISE_XOR)) {
            n2 = builder.BITWISE_XOR$build(tokenizer)
            builder.BITWISE_XOR$addOperand(n2, node)
            builder.BITWISE_XOR$addOperand(n2, BitwiseAndExpression(tokenizer, compilerContext))
            builder.BITWISE_XOR$finish(n2)
            node = n2
        }

        return node
    }

    function BitwiseAndExpression(tokenizer, compilerContext) {
        var node, n2
        var builder = compilerContext.builder

        node = EqualityExpression(tokenizer, compilerContext)
        while (tokenizer.match(BITWISE_AND)) {
            n2 = builder.BITWISE_AND$build(tokenizer)
            builder.BITWISE_AND$addOperand(n2, node)
            builder.BITWISE_AND$addOperand(n2, EqualityExpression(tokenizer, compilerContext))
            builder.BITWISE_AND$finish(n2)
            node = n2
        }

        return node
    }

    function EqualityExpression(tokenizer, compilerContext) {
        var node, n2
        var builder = compilerContext.builder

        node = RelationalExpression(tokenizer, compilerContext)
        while (tokenizer.match(EQ) || tokenizer.match(NE) ||
               tokenizer.match(STRICT_EQ) || tokenizer.match(STRICT_NE)) {
            n2 = builder.EQUALITY$build(tokenizer)
            builder.EQUALITY$addOperand(n2, node)
            builder.EQUALITY$addOperand(n2, RelationalExpression(tokenizer, compilerContext))
            builder.EQUALITY$finish(n2)
            node = n2
        }

        return node
    }

    function RelationalExpression(tokenizer, compilerContext) {
        var node, n2
        var builder = compilerContext.builder
        var oldLoopInit = compilerContext.inForLoopInit

        /*
         * Uses of the in operator in shiftExprs are always unambiguous,
         * so unset the flag that prohibits recognizing it.
         */
        compilerContext.inForLoopInit = false
        node = ShiftExpression(tokenizer, compilerContext)
        while ((tokenizer.match(LT) || tokenizer.match(LE) || tokenizer.match(GE) || tokenizer.match(GT) ||
               (oldLoopInit == false && tokenizer.match(IN)) ||
               tokenizer.match(INSTANCEOF))) {
            n2 = builder.RELATIONAL$build(tokenizer)
            builder.RELATIONAL$addOperand(n2, node)
            builder.RELATIONAL$addOperand(n2, ShiftExpression(tokenizer, compilerContext))
            builder.RELATIONAL$finish(n2)
            node = n2
        }
        compilerContext.inForLoopInit = oldLoopInit

        return node
    }

    function ShiftExpression(tokenizer, compilerContext) {
        var node, n2
        var builder = compilerContext.builder

        node = AddExpression(tokenizer, compilerContext)
        while (tokenizer.match(LSH) || tokenizer.match(RSH) || tokenizer.match(URSH)) {
            n2 = builder.SHIFT$build(tokenizer)
            builder.SHIFT$addOperand(n2, node)
            builder.SHIFT$addOperand(n2, AddExpression(tokenizer, compilerContext))
            builder.SHIFT$finish(n2)
            node = n2
        }

        return node
    }

    function AddExpression(tokenizer, compilerContext) {
        var node, n2
        var builder = compilerContext.builder

        node = MultiplyExpression(tokenizer, compilerContext)
        while (tokenizer.match(PLUS) || tokenizer.match(MINUS)) {
            n2 = builder.ADD$build(tokenizer)
            builder.ADD$addOperand(n2, node)
            builder.ADD$addOperand(n2, MultiplyExpression(tokenizer, compilerContext))
            builder.ADD$finish(n2)
            node = n2
        }

        return node
    }

    function MultiplyExpression(tokenizer, compilerContext) {
        var node, n2
        var builder = compilerContext.builder

        node = UnaryExpression(tokenizer, compilerContext)
        while (tokenizer.match(MUL) || tokenizer.match(DIV) || tokenizer.match(MOD)) {
            n2 = builder.MULTIPLY$build(tokenizer)
            builder.MULTIPLY$addOperand(n2, node)
            builder.MULTIPLY$addOperand(n2, UnaryExpression(tokenizer, compilerContext))
            builder.MULTIPLY$finish(n2)
            node = n2
        }

        return node
    }

    function UnaryExpression(tokenizer, compilerContext) {
        var node, n2, tt
        var builder = compilerContext.builder

        switch (tt = tokenizer.get(true)) {
          case DELETE: case VOID: case TYPEOF:
          case NOT: case BITWISE_NOT: case PLUS: case MINUS:
            node = builder.UNARY$build(tokenizer)
            builder.UNARY$addOperand(node, UnaryExpression(tokenizer, compilerContext))
            break

          case INCREMENT:
          case DECREMENT:
            // Prefix increment/decrement.
            node = builder.UNARY$build(tokenizer)
            builder.UNARY$addOperand(node, MemberExpression(tokenizer, compilerContext, true))
            break

          default:
            tokenizer.unget()
            node = MemberExpression(tokenizer, compilerContext, true)

            // Don'tokenizer look across a newline boundary for a postfix {in,de}crement.
            if (tokenizer.tokens[(tokenizer.tokenIndex + tokenizer.lookahead - 1) & 3].lineno ==
                tokenizer.lineno) {
                if (tokenizer.match(INCREMENT) || tokenizer.match(DECREMENT)) {
                    n2 = builder.UNARY$build(tokenizer)
                    builder.UNARY$setPostfix(n2)
                    builder.UNARY$finish(node)
                    builder.UNARY$addOperand(n2, node)
                    node = n2
                }
            }
            break
        }

        builder.UNARY$finish(node)
        return node
    }

    function MemberExpression(tokenizer, compilerContext, allowCallSyntax) {
        var node, n2, tt
        var builder = compilerContext.builder

        if (tokenizer.match(NEW)) {
            node = builder.MEMBER$build(tokenizer)
            builder.MEMBER$addOperand(node, MemberExpression(tokenizer, compilerContext, false))
            if (tokenizer.match(LEFT_PAREN)) {
                builder.MEMBER$rebuildNewWithArgs(node)
                builder.MEMBER$addOperand(node, ArgumentList(tokenizer, compilerContext))
            }
            builder.MEMBER$finish(node)
        } else {
            node = PrimaryExpression(tokenizer, compilerContext)
        }

        while ((tt = tokenizer.get()) != END) {
            switch (tt) {
              case DOT:
                n2 = builder.MEMBER$build(tokenizer)
                builder.MEMBER$addOperand(n2, node)
                tokenizer.mustMatch(IDENTIFIER)
                builder.MEMBER$addOperand(n2, builder.MEMBER$build(tokenizer))
                break

              case LEFT_BRACKET:
                n2 = builder.MEMBER$build(tokenizer, INDEX)
                builder.MEMBER$addOperand(n2, node)
                builder.MEMBER$addOperand(n2, Expression(tokenizer, compilerContext))
                tokenizer.mustMatch(RIGHT_BRACKET)
                break

              case LEFT_PAREN:
                if (allowCallSyntax) {
                    n2 = builder.MEMBER$build(tokenizer, CALL)
                    builder.MEMBER$addOperand(n2, node)
                    builder.MEMBER$addOperand(n2, ArgumentList(tokenizer, compilerContext))
                    break
                }

                // FALL THROUGH
              default:
                tokenizer.unget()
                return node
            }

            builder.MEMBER$finish(n2)
            node = n2
        }

        return node
    }

    function ArgumentList(tokenizer, compilerContext) {
        var node, n2
        var builder = compilerContext.builder
        var err = "expression must be parenthesized"

        node = builder.LIST$build(tokenizer)
        if (tokenizer.match(RIGHT_PAREN, true))
            return node
        do {
            n2 = AssignExpression(tokenizer, compilerContext)
            if (n2.type == YIELD && !n2.parenthesized && tokenizer.peek() == COMMA)
                throw tokenizer.newSyntaxError("Yield " + err)
            if (tokenizer.match(FOR)) {
                n2 = GeneratorExpression(tokenizer, compilerContext, n2)
                if (node.length > 1 || tokenizer.peek(true) == COMMA)
                    throw tokenizer.newSyntaxError("Generator " + err)
            }
            builder.LIST$addOperand(node, n2)
        } while (tokenizer.match(COMMA))
        tokenizer.mustMatch(RIGHT_PAREN)
        builder.LIST$finish(node)

        return node
    }

    function PrimaryExpression(tokenizer, compilerContext) {
        var node, n2, n3, tt = tokenizer.get(true)
        var builder = compilerContext.builder

        switch (tt) {
          case FUNCTION:
            node = FunctionDefinition(tokenizer, compilerContext, false, EXPRESSED_FORM)
            break

          case LEFT_BRACKET:
            node = builder.ARRAY_INIT$build(tokenizer)
            while ((tt = tokenizer.peek()) != RIGHT_BRACKET) {
                if (tt == COMMA) {
                    tokenizer.get()
                    builder.ARRAY_INIT$addElement(node, null)
                    continue
                }
                builder.ARRAY_INIT$addElement(node, AssignExpression(tokenizer, compilerContext))
                if (tt != COMMA && !tokenizer.match(COMMA))
                    break
            }

            // If we matched exactly one element and got a FOR, we have an
            // array comprehension.
            if (node.length == 1 && tokenizer.match(FOR)) {
                n2 = builder.ARRAY_COMP$build(tokenizer)
                builder.ARRAY_COMP$setExpression(n2, node[0])
                builder.ARRAY_COMP$setTail(n2, comprehensionTail(tokenizer, compilerContext))
                node = n2
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
                    tt = tokenizer.get()
                    if ((tokenizer.token.value == "get" || tokenizer.token.value == "set") &&
                        tokenizer.peek() == IDENTIFIER) {
                        if (compilerContext.ecma3OnlyMode)
                            throw tokenizer.newSyntaxError("Illegal property accessor")
                        var fd = FunctionDefinition(tokenizer, compilerContext, true, EXPRESSED_FORM)
                        builder.OBJECT_INIT$addProperty(node, fd)
                    } else {
                        switch (tt) {
                          case IDENTIFIER: case NUMBER: case STRING:
                            id = builder.PRIMARY$build(tokenizer, IDENTIFIER)
                            builder.PRIMARY$finish(id)
                            break
                          case RIGHT_CURLY:
                            if (compilerContext.ecma3OnlyMode)
                                throw tokenizer.newSyntaxError("Illegal trailing ,")
                            break object_init
                          default:
                            if (tokenizer.token.value in keywords) {
                                id = builder.PRIMARY$build(tokenizer, IDENTIFIER)
                                builder.PRIMARY$finish(id)
                                break
                            }
                            throw tokenizer.newSyntaxError("Invalid property name")
                        }
                        if (tokenizer.match(COLON)) {
                            n2 = builder.PROPERTY_INIT$build(tokenizer)
                            builder.PROPERTY_INIT$addOperand(n2, id)
                            builder.PROPERTY_INIT$addOperand(n2, AssignExpression(tokenizer, compilerContext))
                            builder.PROPERTY_INIT$finish(n2)
                            builder.OBJECT_INIT$addProperty(node, n2)
                        } else {
                            // Support, e.g., |var {compilerContext, y} = o| as destructuring shorthand
                            // for |var {compilerContext: compilerContext, y: y} = o|, per proposed JS2/ES4 for JS1.8.
                            if (tokenizer.peek() != COMMA && tokenizer.peek() != RIGHT_CURLY)
                                throw tokenizer.newSyntaxError("Missing : after property")
                            builder.OBJECT_INIT$addProperty(node, id)
                        }
                    }
                } while (tokenizer.match(COMMA))
                tokenizer.mustMatch(RIGHT_CURLY)
            }
            builder.OBJECT_INIT$finish(node)
            break

          case LEFT_PAREN:
            // ParenExpression does its own matching on parentheses, so we need to
            // unget.
            tokenizer.unget()
            node = ParenExpression(tokenizer, compilerContext)
            node.parenthesized = true
            break

          case LET:
            node = LetBlock(tokenizer, compilerContext, false)
            break

          case NULL: case THIS: case TRUE: case FALSE:
          case IDENTIFIER: case NUMBER: case STRING: case REGEXP:
            node = builder.PRIMARY$build(tokenizer)
            builder.PRIMARY$finish(node)
            break

          default:
            throw tokenizer.newSyntaxError("Missing operand")
            break
        }

        return node
    }

    /*
     * parse :: (builder, file ptr, path, line number) -> node
     */
    function parse(builder, s, f, l) {
        var tokenizer = new Tokenizer(s, f, l)
        var compilerContext = new CompilerContext(false, builder)
        var node = Script(tokenizer, compilerContext)
        if (!tokenizer.done)
            throw tokenizer.newSyntaxError("Syntax error")

        return node
    }
