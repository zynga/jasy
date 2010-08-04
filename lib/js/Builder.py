#
# JavaScript Tools - Parser Module
# License: MPL 1.1/GPL 2.0/LGPL 2.1
# Authors: 
#   - Brendan Eich <brendan@mozilla.org> (Original JavaScript) (2004-2010)
#   - Sebastian Werner <info@sebastian-werner.net> (Python Port) (2010)
#

from Node import Node

class VanillaBuilder:
    def IF__build(t):
        return Node(t, IF)

    def IF__setCondition(n, e):
        n.condition = e

    def IF__setThenPart(n, s):
        n.thenPart = s

    def IF__setElsePart(n, s):
        n.elsePart = s

    def IF__finish(n):
        pass

    def SWITCH__build(t):
        n = Node(t, SWITCH)
        n.cases = []
        n.defaultIndex = -1
        return n

    def SWITCH__setDiscriminant(n, e):
        n.discriminant = e

    def SWITCH__setDefaultIndex(n, i):
        n.defaultIndex = i

    def SWITCH__addCase(n, n2):
        n.cases.push(n2)

    def SWITCH__finish(n):
        pass

    def CASE__build(t):
        return Node(t, CASE)

    def CASE__setLabel(n, e):
        n.caseLabel = e

    def CASE__initializeStatements(n, t):
        n.statements = Node(t, BLOCK)

    def CASE__addStatement(n, s):
        n.statements.push(s)

    def CASE__finish(n):
        pass

    def DEFAULT__build(t, p):
        return Node(t, DEFAULT)

    def DEFAULT__initializeStatements(n, t):
        n.statements = Node(t, BLOCK)

    def DEFAULT__addStatement(n, s):
        n.statements.push(s)

    def DEFAULT__finish(n):
        pass

    def FOR__build(t):
        n = Node(t, FOR)
        n.isLoop = true
        n.isEach = false
        return n

    def FOR__rebuildForEach(n):
        n.isEach = true

    # NB. This function is called after rebuildForEach, if that's called at all.
    def FOR__rebuildForIn(n):
        n.type = FOR_IN

    def FOR__setCondition(n, e):
        n.condition = e

    def FOR__setSetup(n, e):
        n.setup = e if e else None

    def FOR__setUpdate(n, e):
        n.update = e

    def FOR__setObject(n, e):
        n.object = e

    def FOR__setIterator(n, e, e2):
        n.iterator = e
        n.varDecl = e2

    def FOR__setBody(n, s):
        n.body = s

    def FOR__finish(n):
        pass

    def WHILE__build(t):
        n = Node(t, WHILE)
        n.isLoop = true
        return n

    def WHILE__setCondition(n, e):
        n.condition = e

    def WHILE__setBody(n, s):
        n.body = s

    def WHILE__finish(n):
        pass

    def DO__build(t):
        n = Node(t, DO)
        n.isLoop = true
        return n

    def DO__setCondition(n, e):
        n.condition = e

    def DO__setBody(n, s):
        n.body = s

    def DO__finish(n):
        pass

    def BREAK__build(t):
        return Node(t, BREAK)

    def BREAK__setLabel(n, v):
        n.label = v

    def BREAK__setTarget(n, n2):
        n.target = n2

    def BREAK__finish(n):
        pass

    def CONTINUE__build(t):
        return Node(t, CONTINUE)

    def CONTINUE__setLabel(n, v):
        n.label = v

    def CONTINUE__setTarget(n, n2):
        n.target = n2

    def CONTINUE__finish(n):
        pass

    def TRY__build(t):
        n = Node(t, TRY)
        n.catchClauses = []
        return n

    def TRY__setTryBlock(n, s):
        n.tryBlock = s

    def TRY__addCatch(n, n2):
        n.catchClauses.push(n2)

    def TRY__finishCatches(n):
        pass

    def TRY__setFinallyBlock(n, s):
        n.finallyBlock = s

    def TRY__finish(n):
        pass

    def CATCH__build(t):
        n = Node(t, CATCH)
        n.guard = None
        return n

    def CATCH__setVarName(n, v):
        n.varName = v

    def CATCH__setGuard(n, e):
        n.guard = e

    def CATCH__setBlock(n, s):
        n.block = s

    def CATCH__finish(n):
        pass

    def THROW__build(t):
        return Node(t, THROW)

    def THROW__setException(n, e):
        n.exception = e

    def THROW__finish(n):
        pass

    def RETURN__build(t):
        return Node(t, RETURN)

    def RETURN__setValue(n, e):
        n.value = e

    def RETURN__finish(n):
        pass

    def YIELD__build(t):
        return Node(t, YIELD)

    def YIELD__setValue(n, e):
        n.value = e

    def YIELD__finish(n):
        pass

    def GENERATOR__build(t):
        return Node(t, GENERATOR)

    def GENERATOR__setExpression(n, e):
        n.expression = e

    def GENERATOR__setTail(n, n2):
        n.tail = n2

    def GENERATOR__finish(n):
        pass

    def WITH__build(t):
        return Node(t, WITH)

    def WITH__setObject(n, e):
        n.object = e

    def WITH__setBody(n, s):
        n.body = s

    def WITH__finish(n):
        pass

    def DEBUGGER__build(t):
        return Node(t, DEBUGGER)

    def SEMICOLON__build(t):
        return Node(t, SEMICOLON)

    def SEMICOLON__setExpression(n, e):
        n.expression = e

    def SEMICOLON__finish(n):
        pass

    def LABEL__build(t):
        return Node(t, LABEL)

    def LABEL__setLabel(n, e):
        n.label = e

    def LABEL__setStatement(n, s):
        n.statement = s

    def LABEL__finish(n):
        pass

    def FUNCTION__build(t):
        n = Node(t)
        if n.type != FUNCTION:
            if n.value == "get":
                n.type = GETTER
            else:
                n.type = SETTER

        n.params = []
        return n

    def FUNCTION__setName(n, v):
        n.name = v

    def FUNCTION__addParam(n, v):
        n.params.push(v)

    def FUNCTION__setBody(n, s):
        n.body = s

    def FUNCTION__hoistVars(x):
        pass

    def FUNCTION__finish(n, x):
        pass

    def VAR__build(t):
        return Node(t, VAR)

    def VAR__addDecl(n, n2, x):
        n.push(n2)

    def VAR__finish(n):
        pass

    def CONST__build(t):
        return Node(t, VAR)

    def CONST__addDecl(n, n2, x):
        n.push(n2)

    def CONST__finish(n):
        pass

    def LET__build(t):
        return Node(t, LET)

    def LET__addDecl(n, n2, x):
        n.push(n2)

    def LET__finish(n):
        pass

    def DECL__build(t):
        return Node(t, IDENTIFIER)

    def DECL__setName(n, v):
        n.name = v

    def DECL__setInitializer(n, e):
        n.initializer = e

    def DECL__setReadOnly(n, b):
        n.readOnly = b

    def DECL__finish(n):
        pass

    def LET_BLOCK__build(t):
        n = Node(t, LET_BLOCK)
        n.varDecls = []
        return n

    def LET_BLOCK__setVariables(n, n2):
        n.variables = n2

    def LET_BLOCK__setExpression(n, e):
        n.expression = e

    def LET_BLOCK__setBlock(n, s):
        n.block = s

    def LET_BLOCK__finish(n):
        pass

    def BLOCK__build(t, id):
        n = Node(t, BLOCK)
        n.varDecls = []
        n.id = id
        return n

    def BLOCK__hoistLets(n):
        pass

    def BLOCK__addStatement(n, n2):
        n.push(n2)

    def BLOCK__finish(n):
        pass

    def EXPRESSION__build(t, tt):
        return Node(t, tt)

    def EXPRESSION__addOperand(n, n2):
        n.push(n2)

    def EXPRESSION__finish(n):
        pass

    def ASSIGN__build(t):
        return Node(t, ASSIGN)

    def ASSIGN__addOperand(n, n2):
        n.push(n2)

    def ASSIGN__setAssignOp(n, o):
        n.assignOp = o

    def ASSIGN__finish(n):
        pass

    def HOOK__build(t):
        return Node(t, HOOK)

    def HOOK__setCondition(n, e):
        n[0] = e

    def HOOK__setThenPart(n, n2):
        n[1] = n2

    def HOOK__setElsePart(n, n2):
        n[2] = n2

    def HOOK__finish(n):
        pass

    def OR__build(t):
        return Node(t, OR)

    def OR__addOperand(n, n2):
        n.push(n2)

    def OR__finish(n):
        pass

    def AND__build(t):
        return Node(t, AND)

    def AND__addOperand(n, n2):
        n.push(n2)

    def AND__finish(n):
        pass

    def BITWISE_OR__build(t):
        return Node(t, BITWISE_OR)

    def BITWISE_OR__addOperand(n, n2):
        n.push(n2)

    def BITWISE_OR__finish(n):
        pass

    def BITWISE_XOR__build(t):
        return Node(t, BITWISE_XOR)

    def BITWISE_XOR__addOperand(n, n2):
        n.push(n2)

    def BITWISE_XOR__finish(n):
        pass

    def BITWISE_AND__build(t):
        return Node(t, BITWISE_AND)

    def BITWISE_AND__addOperand(n, n2):
        n.push(n2)

    def BITWISE_AND__finish(n):
        pass

    def EQUALITY__build(t):
        # NB t.token.type must be EQ, NE, STRICT_EQ, or STRICT_NE.
        return Node(t)

    def EQUALITY__addOperand(n, n2):
        n.push(n2)

    def EQUALITY__finish(n):
        pass

    def RELATIONAL__build(t):
        # NB t.token.type must be LT, LE, GE, or GT.
        return Node(t)

    def RELATIONAL__addOperand(n, n2):
        n.push(n2)

    def RELATIONAL__finish(n):
        pass

    def SHIFT__build(t):
        # NB t.token.type must be LSH, RSH, or URSH.
        return Node(t)

    def SHIFT__addOperand(n, n2):
        n.push(n2)

    def SHIFT__finish(n):
        pass

    def ADD__build(t):
        # NB t.token.type must be PLUS or MINUS.
        return Node(t)

    def ADD__addOperand(n, n2):
        n.push(n2)

    def ADD__finish(n):
        pass

    def MULTIPLY__build(t):
        # NB t.token.type must be MUL, DIV, or MOD.
        return Node(t)

    def MULTIPLY__addOperand(n, n2):
        n.push(n2)

    def MULTIPLY__finish(n):
        pass

    def UNARY__build(t):
        # NB t.token.type must be DELETE, VOID, TYPEOF, NOT, BITWISE_NOT,
        # UNARY_PLUS, UNARY_MINUS, INCREMENT, or DECREMENT.
        if t.token.type == PLUS:
            t.token.type = UNARY_PLUS
        elif t.token.type == MINUS:
            t.token.type = UNARY_MINUS
            
        return Node(t)

    def UNARY__addOperand(n, n2):
        n.push(n2)

    def UNARY__setPostfix(n):
        n.postfix = true

    def UNARY__finish(n):
        pass

    def MEMBER__build(t, tt):
        # NB t.token.type must be NEW, DOT, or INDEX.
        return Node(t, tt)

    def MEMBER__rebuildNewWithArgs(n):
        n.type = NEW_WITH_ARGS

    def MEMBER__addOperand(n, n2):
        n.push(n2)

    def MEMBER__finish(n):
        pass

    def PRIMARY__build(t, tt):
        # NB t.token.type must be NULL, THIS, TRUIE, FALSE, IDENTIFIER,
        # NUMBER, STRING, or REGEXP.
        return Node(t, tt)

    def PRIMARY__finish(n):
        pass

    def ARRAY_INIT__build(t):
        return Node(t, ARRAY_INIT)

    def ARRAY_INIT__addElement(n, n2):
        n.push(n2)

    def ARRAY_INIT__finish(n):
        pass

    def ARRAY_COMP__build(t):
        return Node(t, ARRAY_COMP)
    
    def ARRAY_COMP__setExpression(n, e):
        n.expression = e
    
    def ARRAY_COMP__setTail(n, n2):
        n.tail = n2
    
    def ARRAY_COMP__finish(n):
        pass

    def COMP_TAIL__build(t):
        return Node(t, COMP_TAIL)

    def COMP_TAIL__setGuard(n, e):
        n.guard = e

    def COMP_TAIL__addFor(n, n2):
        n.push(n2)

    def COMP_TAIL__finish(n):
        pass

    def OBJECT_INIT__build(t):
        return Node(t, OBJECT_INIT)

    def OBJECT_INIT__addProperty(n, n2):
        n.push(n2)

    def OBJECT_INIT__finish(n):
        pass

    def PROPERTY_INIT__build(t):
        return Node(t, PROPERTY_INIT)

    def PROPERTY_INIT__addOperand(n, n2):
        n.push(n2)

    def PROPERTY_INIT__finish(n):
        pass

    def COMMA__build(t):
        return Node(t, COMMA)

    def COMMA__addOperand(n, n2):
        n.push(n2)

    def COMMA__finish(n):
        pass

    def LIST__build(t):
        return Node(t, LIST)

    def LIST__addOperand(n, n2):
        n.push(n2)

    def LIST__finish(n):
        pass

    def setHoists(id, vds):
        pass
        