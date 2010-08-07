#
# JavaScript Tools - Parser Module
# License: MPL 1.1/GPL 2.0/LGPL 2.1
# Authors: 
#   - Brendan Eich <brendan@mozilla.org> (Original JavaScript) (2004-2010)
#   - Sebastian Werner <info@sebastian-werner.net> (Python Port) (2010)
#

from Node import Node

class VanillaBuilder:
    """The vanilla AST builder."""
    
    def IF__build(self, t):
        return Node(t, IF)

    def IF__setCondition(self, n, e):
        n.condition = e

    def IF__setThenPart(self, n, s):
        n.thenPart = s

    def IF__setElsePart(self, n, s):
        n.elsePart = s

    def IF__finish(self, n):
        pass

    def SWITCH__build(self, t):
        n = Node(t, SWITCH)
        n.cases = []
        n.defaultIndex = -1
        return n

    def SWITCH__setDiscriminant(self, n, e):
        n.discriminant = e

    def SWITCH__setDefaultIndex(self, n, i):
        n.defaultIndex = i

    def SWITCH__addCase(self, n, n2):
        n.cases.push(n2)

    def SWITCH__finish(self, n):
        pass

    def CASE__build(self, t):
        return Node(t, CASE)

    def CASE__setLabel(self, n, e):
        n.caseLabel = e

    def CASE__initializeStatements(self, n, t):
        n.statements = Node(t, BLOCK)

    def CASE__addStatement(self, n, s):
        n.statements.push(s)

    def CASE__finish(self, n):
        pass

    def DEFAULT__build(self, t, p):
        return Node(t, DEFAULT)

    def DEFAULT__initializeStatements(self, n, t):
        n.statements = Node(t, BLOCK)

    def DEFAULT__addStatement(self, n, s):
        n.statements.push(s)

    def DEFAULT__finish(self, n):
        pass

    def FOR__build(self, t):
        n = Node(t, FOR)
        n.isLoop = true
        n.isEach = false
        return n

    def FOR__rebuildForEach(self, n):
        n.isEach = true

    # NB. This function is called after rebuildForEach, if that's called at all.
    def FOR__rebuildForIn(self, n):
        n.type = FOR_IN

    def FOR__setCondition(self, n, e):
        n.condition = e

    def FOR__setSetup(self, n, e):
        n.setup = e if e else None

    def FOR__setUpdate(self, n, e):
        n.update = e

    def FOR__setObject(self, n, e):
        n.object = e

    def FOR__setIterator(self, n, e, e2):
        n.iterator = e
        n.varDecl = e2

    def FOR__setBody(self, n, s):
        n.body = s

    def FOR__finish(self, n):
        pass

    def WHILE__build(self, t):
        n = Node(t, WHILE)
        n.isLoop = true
        return n

    def WHILE__setCondition(self, n, e):
        n.condition = e

    def WHILE__setBody(self, n, s):
        n.body = s

    def WHILE__finish(self, n):
        pass

    def DO__build(self, t):
        n = Node(t, DO)
        n.isLoop = true
        return n

    def DO__setCondition(self, n, e):
        n.condition = e

    def DO__setBody(self, n, s):
        n.body = s

    def DO__finish(self, n):
        pass

    def BREAK__build(self, t):
        return Node(t, BREAK)

    def BREAK__setLabel(self, n, v):
        n.label = v

    def BREAK__setTarget(self, n, n2):
        n.target = n2

    def BREAK__finish(self, n):
        pass

    def CONTINUE__build(self, t):
        return Node(t, CONTINUE)

    def CONTINUE__setLabel(self, n, v):
        n.label = v

    def CONTINUE__setTarget(self, n, n2):
        n.target = n2

    def CONTINUE__finish(self, n):
        pass

    def TRY__build(self, t):
        n = Node(t, TRY)
        n.catchClauses = []
        return n

    def TRY__setTryBlock(self, n, s):
        n.tryBlock = s

    def TRY__addCatch(self, n, n2):
        n.catchClauses.push(n2)

    def TRY__finishCatches(self, n):
        pass

    def TRY__setFinallyBlock(self, n, s):
        n.finallyBlock = s

    def TRY__finish(self, n):
        pass

    def CATCH__build(self, t):
        n = Node(t, CATCH)
        n.guard = None
        return n

    def CATCH__setVarName(self, n, v):
        n.varName = v

    def CATCH__setGuard(self, n, e):
        n.guard = e

    def CATCH__setBlock(self, n, s):
        n.block = s

    def CATCH__finish(self, n):
        pass

    def THROW__build(self, t):
        return Node(t, THROW)

    def THROW__setException(self, n, e):
        n.exception = e

    def THROW__finish(self, n):
        pass

    def RETURN__build(self, t):
        return Node(t, RETURN)

    def RETURN__setValue(self, n, e):
        n.value = e

    def RETURN__finish(self, n):
        pass

    def YIELD__build(self, t):
        return Node(t, YIELD)

    def YIELD__setValue(self, n, e):
        n.value = e

    def YIELD__finish(self, n):
        pass

    def GENERATOR__build(self, t):
        return Node(t, GENERATOR)

    def GENERATOR__setExpression(self, n, e):
        n.expression = e

    def GENERATOR__setTail(self, n, n2):
        n.tail = n2

    def GENERATOR__finish(self, n):
        pass

    def WITH__build(self, t):
        return Node(t, WITH)

    def WITH__setObject(self, n, e):
        n.object = e

    def WITH__setBody(self, n, s):
        n.body = s

    def WITH__finish(self, n):
        pass

    def DEBUGGER__build(self, t):
        return Node(t, DEBUGGER)

    def SEMICOLON__build(self, t):
        return Node(t, SEMICOLON)

    def SEMICOLON__setExpression(self, n, e):
        n.expression = e

    def SEMICOLON__finish(self, n):
        pass

    def LABEL__build(self, t):
        return Node(t, LABEL)

    def LABEL__setLabel(self, n, e):
        n.label = e

    def LABEL__setStatement(self, n, s):
        n.statement = s

    def LABEL__finish(self, n):
        pass

    def FUNCTION__build(self, t):
        n = Node(t)
        if n.type != FUNCTION:
            if n.value == "get":
                n.type = GETTER
            else:
                n.type = SETTER

        n.params = []
        return n

    def FUNCTION__setName(self, n, v):
        n.name = v

    def FUNCTION__addParam(self, n, v):
        n.params.push(v)

    def FUNCTION__setBody(self, n, s):
        n.body = s

    def FUNCTION__hoistVars(self, x):
        pass

    def FUNCTION__finish(self, n, x):
        pass

    def VAR__build(self, t):
        return Node(t, VAR)

    def VAR__addDecl(self, n, n2, x):
        n.push(n2)

    def VAR__finish(self, n):
        pass

    def CONST__build(self, t):
        return Node(t, VAR)

    def CONST__addDecl(self, n, n2, x):
        n.push(n2)

    def CONST__finish(self, n):
        pass

    def LET__build(self, t):
        return Node(t, LET)

    def LET__addDecl(self, n, n2, x):
        n.push(n2)

    def LET__finish(self, n):
        pass

    def DECL__build(self, t):
        return Node(t, IDENTIFIER)

    def DECL__setName(self, n, v):
        n.name = v

    def DECL__setInitializer(self, n, e):
        n.initializer = e

    def DECL__setReadOnly(self, n, b):
        n.readOnly = b

    def DECL__finish(self, n):
        pass

    def LET_BLOCK__build(self, t):
        n = Node(t, LET_BLOCK)
        n.varDecls = []
        return n

    def LET_BLOCK__setVariables(self, n, n2):
        n.variables = n2

    def LET_BLOCK__setExpression(self, n, e):
        n.expression = e

    def LET_BLOCK__setBlock(self, n, s):
        n.block = s

    def LET_BLOCK__finish(self, n):
        pass

    def BLOCK__build(self, t, id):
        n = Node(t, BLOCK)
        n.varDecls = []
        n.id = id
        return n

    def BLOCK__hoistLets(self, n):
        pass

    def BLOCK__addStatement(self, n, n2):
        n.push(n2)

    def BLOCK__finish(self, n):
        pass

    def EXPRESSION__build(self, t, tt):
        return Node(t, tt)

    def EXPRESSION__addOperand(self, n, n2):
        n.push(n2)

    def EXPRESSION__finish(self, n):
        pass

    def ASSIGN__build(self, t):
        return Node(t, ASSIGN)

    def ASSIGN__addOperand(self, n, n2):
        n.push(n2)

    def ASSIGN__setAssignOp(self, n, o):
        n.assignOp = o

    def ASSIGN__finish(self, n):
        pass

    def HOOK__build(self, t):
        return Node(t, HOOK)

    def HOOK__setCondition(self, n, e):
        n[0] = e

    def HOOK__setThenPart(self, n, n2):
        n[1] = n2

    def HOOK__setElsePart(self, n, n2):
        n[2] = n2

    def HOOK__finish(self, n):
        pass

    def OR__build(self, t):
        return Node(t, OR)

    def OR__addOperand(self, n, n2):
        n.push(n2)

    def OR__finish(self, n):
        pass

    def AND__build(self, t):
        return Node(t, AND)

    def AND__addOperand(self, n, n2):
        n.push(n2)

    def AND__finish(self, n):
        pass

    def BITWISE_OR__build(self, t):
        return Node(t, BITWISE_OR)

    def BITWISE_OR__addOperand(self, n, n2):
        n.push(n2)

    def BITWISE_OR__finish(self, n):
        pass

    def BITWISE_XOR__build(self, t):
        return Node(t, BITWISE_XOR)

    def BITWISE_XOR__addOperand(self, n, n2):
        n.push(n2)

    def BITWISE_XOR__finish(self, n):
        pass

    def BITWISE_AND__build(self, t):
        return Node(t, BITWISE_AND)

    def BITWISE_AND__addOperand(self, n, n2):
        n.push(n2)

    def BITWISE_AND__finish(self, n):
        pass

    def EQUALITY__build(self, t):
        # NB t.token.type must be EQ, NE, STRICT_EQ, or STRICT_NE.
        return Node(t)

    def EQUALITY__addOperand(self, n, n2):
        n.push(n2)

    def EQUALITY__finish(self, n):
        pass

    def RELATIONAL__build(self, t):
        # NB t.token.type must be LT, LE, GE, or GT.
        return Node(t)

    def RELATIONAL__addOperand(self, n, n2):
        n.push(n2)

    def RELATIONAL__finish(self, n):
        pass

    def SHIFT__build(self, t):
        # NB t.token.type must be LSH, RSH, or URSH.
        return Node(t)

    def SHIFT__addOperand(self, n, n2):
        n.push(n2)

    def SHIFT__finish(self, n):
        pass

    def ADD__build(self, t):
        # NB t.token.type must be PLUS or MINUS.
        return Node(t)

    def ADD__addOperand(self, n, n2):
        n.push(n2)

    def ADD__finish(self, n):
        pass

    def MULTIPLY__build(self, t):
        # NB t.token.type must be MUL, DIV, or MOD.
        return Node(t)

    def MULTIPLY__addOperand(self, n, n2):
        n.push(n2)

    def MULTIPLY__finish(self, n):
        pass

    def UNARY__build(self, t):
        # NB t.token.type must be DELETE, VOID, TYPEOF, NOT, BITWISE_NOT,
        # UNARY_PLUS, UNARY_MINUS, INCREMENT, or DECREMENT.
        if t.token.type == PLUS:
            t.token.type = UNARY_PLUS
        elif t.token.type == MINUS:
            t.token.type = UNARY_MINUS
            
        return Node(t)

    def UNARY__addOperand(self, n, n2):
        n.push(n2)

    def UNARY__setPostfix(self, n):
        n.postfix = true

    def UNARY__finish(self, n):
        pass

    def MEMBER__build(self, t, tt):
        # NB t.token.type must be NEW, DOT, or INDEX.
        return Node(t, tt)

    def MEMBER__rebuildNewWithArgs(self, n):
        n.type = NEW_WITH_ARGS

    def MEMBER__addOperand(self, n, n2):
        n.push(n2)

    def MEMBER__finish(self, n):
        pass

    def PRIMARY__build(self, t, tt):
        # NB t.token.type must be NULL, THIS, TRUIE, FALSE, IDENTIFIER,
        # NUMBER, STRING, or REGEXP.
        return Node(t, tt)

    def PRIMARY__finish(self, n):
        pass

    def ARRAY_INIT__build(self, t):
        return Node(t, ARRAY_INIT)

    def ARRAY_INIT__addElement(self, n, n2):
        n.push(n2)

    def ARRAY_INIT__finish(self, n):
        pass

    def ARRAY_COMP__build(self, t):
        return Node(t, ARRAY_COMP)
    
    def ARRAY_COMP__setExpression(self, n, e):
        n.expression = e
    
    def ARRAY_COMP__setTail(self, n, n2):
        n.tail = n2
    
    def ARRAY_COMP__finish(self, n):
        pass

    def COMP_TAIL__build(self, t):
        return Node(t, COMP_TAIL)

    def COMP_TAIL__setGuard(self, n, e):
        n.guard = e

    def COMP_TAIL__addFor(self, n, n2):
        n.push(n2)

    def COMP_TAIL__finish(self, n):
        pass

    def OBJECT_INIT__build(self, t):
        return Node(t, OBJECT_INIT)

    def OBJECT_INIT__addProperty(self, n, n2):
        n.push(n2)

    def OBJECT_INIT__finish(self, n):
        pass

    def PROPERTY_INIT__build(self, t):
        return Node(t, PROPERTY_INIT)

    def PROPERTY_INIT__addOperand(self, n, n2):
        n.push(n2)

    def PROPERTY_INIT__finish(self, n):
        pass

    def COMMA__build(self, t):
        return Node(t, COMMA)

    def COMMA__addOperand(self, n, n2):
        n.push(n2)

    def COMMA__finish(self, n):
        pass

    def LIST__build(self, t):
        return Node(t, LIST)

    def LIST__addOperand(self, n, n2):
        n.push(n2)

    def LIST__finish(self, n):
        pass

    def setHoists(self, id, vds):
        pass
        