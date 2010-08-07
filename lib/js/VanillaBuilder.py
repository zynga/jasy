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
    
    def IF__build(self, tokenizer):
        return Node(tokenizer, IF)

    def IF__setCondition(self, node, expression):
        node.condition = expression

    def IF__setThenPart(self, node, statement):
        node.thenPart = statement

    def IF__setElsePart(self, node, statement):
        node.elsePart = statement

    def IF__finish(self, node):
        pass

    def SWITCH__build(self, tokenizer):
        node = Node(tokenizer, SWITCH)
        node.cases = []
        node.defaultIndex = -1
        return node

    def SWITCH__setDiscriminant(self, node, expression):
        node.discriminant = expression

    def SWITCH__setDefaultIndex(self, node, index):
        node.defaultIndex = index

    def SWITCH__addCase(self, node, childNode):
        node.cases.push(childNode)

    def SWITCH__finish(self, node):
        pass

    def CASE__build(self, tokenizer):
        return Node(tokenizer, CASE)

    def CASE__setLabel(self, node, expression):
        node.caseLabel = expression

    def CASE__initializeStatements(self, node, tokenizer):
        node.statements = Node(tokenizer, BLOCK)

    def CASE__addStatement(self, node, statement):
        node.statements.push(statement)

    def CASE__finish(self, node):
        pass

    def DEFAULT__build(self, tokenizer, p):
        return Node(tokenizer, DEFAULT)

    def DEFAULT__initializeStatements(self, node, tokenizer):
        node.statements = Node(tokenizer, BLOCK)

    def DEFAULT__addStatement(self, node, statement):
        node.statements.push(statement)

    def DEFAULT__finish(self, node):
        pass

    def FOR__build(self, tokenizer):
        node = Node(tokenizer, FOR)
        node.isLoop = true
        node.isEach = false
        return node

    def FOR__rebuildForEach(self, node):
        node.isEach = true

    # NB. This function is called after rebuildForEach, if that'statement called at all.
    def FOR__rebuildForIn(self, node):
        node.type = FOR_IN

    def FOR__setCondition(self, node, expression):
        node.condition = expression

    def FOR__setSetup(self, node, expression):
        node.setup = expression if expression else None

    def FOR__setUpdate(self, node, expression):
        node.update = expression

    def FOR__setObject(self, node, expression):
        node.object = expression

    def FOR__setIterator(self, node, expression, expression2):
        node.iterator = expression
        node.varDecl = expression2

    def FOR__setBody(self, node, statement):
        node.body = statement

    def FOR__finish(self, node):
        pass

    def WHILE__build(self, tokenizer):
        node = Node(tokenizer, WHILE)
        node.isLoop = true
        return node

    def WHILE__setCondition(self, node, expression):
        node.condition = expression

    def WHILE__setBody(self, node, statement):
        node.body = statement

    def WHILE__finish(self, node):
        pass

    def DO__build(self, tokenizer):
        node = Node(tokenizer, DO)
        node.isLoop = true
        return node

    def DO__setCondition(self, node, expression):
        node.condition = expression

    def DO__setBody(self, node, statement):
        node.body = statement

    def DO__finish(self, node):
        pass

    def BREAK__build(self, tokenizer):
        return Node(tokenizer, BREAK)

    def BREAK__setLabel(self, node, identifier):
        node.label = identifier

    def BREAK__setTarget(self, node, childNode):
        node.target = childNode

    def BREAK__finish(self, node):
        pass

    def CONTINUE__build(self, tokenizer):
        return Node(tokenizer, CONTINUE)

    def CONTINUE__setLabel(self, node, identifier):
        node.label = identifier

    def CONTINUE__setTarget(self, node, childNode):
        node.target = childNode

    def CONTINUE__finish(self, node):
        pass

    def TRY__build(self, tokenizer):
        node = Node(tokenizer, TRY)
        node.catchClauses = []
        return node

    def TRY__setTryBlock(self, node, statement):
        node.tryBlock = statement

    def TRY__addCatch(self, node, childNode):
        node.catchClauses.push(childNode)

    def TRY__finishCatches(self, node):
        pass

    def TRY__setFinallyBlock(self, node, statement):
        node.finallyBlock = statement

    def TRY__finish(self, node):
        pass

    def CATCH__build(self, tokenizer):
        node = Node(tokenizer, CATCH)
        node.guard = None
        return node

    def CATCH__setVarName(self, node, identifier):
        node.varName = identifier

    def CATCH__setGuard(self, node, expression):
        node.guard = expression

    def CATCH__setBlock(self, node, statement):
        node.block = statement

    def CATCH__finish(self, node):
        pass

    def THROW__build(self, tokenizer):
        return Node(tokenizer, THROW)

    def THROW__setException(self, node, expression):
        node.exception = expression

    def THROW__finish(self, node):
        pass

    def RETURN__build(self, tokenizer):
        return Node(tokenizer, RETURN)

    def RETURN__setValue(self, node, expression):
        node.value = expression

    def RETURN__finish(self, node):
        pass

    def YIELD__build(self, tokenizer):
        return Node(tokenizer, YIELD)

    def YIELD__setValue(self, node, expression):
        node.value = expression

    def YIELD__finish(self, node):
        pass

    def GENERATOR__build(self, tokenizer):
        return Node(tokenizer, GENERATOR)

    def GENERATOR__setExpression(self, node, expression):
        node.expression = expression

    def GENERATOR__setTail(self, node, childNode):
        node.tail = childNode

    def GENERATOR__finish(self, node):
        pass

    def WITH__build(self, tokenizer):
        return Node(tokenizer, WITH)

    def WITH__setObject(self, node, expression):
        node.object = expression

    def WITH__setBody(self, node, statement):
        node.body = statement

    def WITH__finish(self, node):
        pass

    def DEBUGGER__build(self, tokenizer):
        return Node(tokenizer, DEBUGGER)

    def SEMICOLON__build(self, tokenizer):
        return Node(tokenizer, SEMICOLON)

    def SEMICOLON__setExpression(self, node, expression):
        node.expression = expression

    def SEMICOLON__finish(self, node):
        pass

    def LABEL__build(self, tokenizer):
        return Node(tokenizer, LABEL)

    def LABEL__setLabel(self, node, expression):
        node.label = expression

    def LABEL__setStatement(self, node, statement):
        node.statement = statement

    def LABEL__finish(self, node):
        pass

    def FUNCTION__build(self, tokenizer):
        node = Node(tokenizer)
        if node.type != FUNCTION:
            if node.value == "get":
                node.type = GETTER
            else:
                node.type = SETTER

        node.params = []
        return node

    def FUNCTION__setName(self, node, identifier):
        node.name = identifier

    def FUNCTION__addParam(self, node, identifier):
        node.params.push(identifier)

    def FUNCTION__setBody(self, node, statement):
        node.body = statement

    def FUNCTION__hoistVars(self, x):
        pass

    def FUNCTION__finish(self, node, x):
        pass

    def VAR__build(self, tokenizer):
        return Node(tokenizer, VAR)

    def VAR__addDecl(self, node, childNode, x):
        node.push(childNode)

    def VAR__finish(self, node):
        pass

    def CONST__build(self, tokenizer):
        return Node(tokenizer, VAR)

    def CONST__addDecl(self, node, childNode, x):
        node.push(childNode)

    def CONST__finish(self, node):
        pass

    def LET__build(self, tokenizer):
        return Node(tokenizer, LET)

    def LET__addDecl(self, node, childNode, x):
        node.push(childNode)

    def LET__finish(self, node):
        pass

    def DECL__build(self, tokenizer):
        return Node(tokenizer, IDENTIFIER)

    def DECL__setName(self, node, identifier):
        node.name = identifier

    def DECL__setInitializer(self, node, expression):
        node.initializer = expression

    def DECL__setReadOnly(self, node, b):
        node.readOnly = b

    def DECL__finish(self, node):
        pass

    def LET_BLOCK__build(self, tokenizer):
        node = Node(tokenizer, LET_BLOCK)
        node.varDecls = []
        return node

    def LET_BLOCK__setVariables(self, node, childNode):
        node.variables = childNode

    def LET_BLOCK__setExpression(self, node, expression):
        node.expression = expression

    def LET_BLOCK__setBlock(self, node, statement):
        node.block = statement

    def LET_BLOCK__finish(self, node):
        pass

    def BLOCK__build(self, tokenizer, id):
        node = Node(tokenizer, BLOCK)
        node.varDecls = []
        node.id = id
        return node

    def BLOCK__hoistLets(self, node):
        pass

    def BLOCK__addStatement(self, node, childNode):
        node.push(childNode)

    def BLOCK__finish(self, node):
        pass

    def EXPRESSION__build(self, tokenizer, tokenType):
        return Node(tokenizer, tokenType)

    def EXPRESSION__addOperand(self, node, childNode):
        node.push(childNode)

    def EXPRESSION__finish(self, node):
        pass

    def ASSIGN__build(self, tokenizer):
        return Node(tokenizer, ASSIGN)

    def ASSIGN__addOperand(self, node, childNode):
        node.push(childNode)

    def ASSIGN__setAssignOp(self, node, o):
        node.assignOp = o

    def ASSIGN__finish(self, node):
        pass

    def HOOK__build(self, tokenizer):
        return Node(tokenizer, HOOK)

    def HOOK__setCondition(self, node, expression):
        node[0] = expression

    def HOOK__setThenPart(self, node, childNode):
        node[1] = childNode

    def HOOK__setElsePart(self, node, childNode):
        node[2] = childNode

    def HOOK__finish(self, node):
        pass

    def OR__build(self, tokenizer):
        return Node(tokenizer, OR)

    def OR__addOperand(self, node, childNode):
        node.push(childNode)

    def OR__finish(self, node):
        pass

    def AND__build(self, tokenizer):
        return Node(tokenizer, AND)

    def AND__addOperand(self, node, childNode):
        node.push(childNode)

    def AND__finish(self, node):
        pass

    def BITWISE_OR__build(self, tokenizer):
        return Node(tokenizer, BITWISE_OR)

    def BITWISE_OR__addOperand(self, node, childNode):
        node.push(childNode)

    def BITWISE_OR__finish(self, node):
        pass

    def BITWISE_XOR__build(self, tokenizer):
        return Node(tokenizer, BITWISE_XOR)

    def BITWISE_XOR__addOperand(self, node, childNode):
        node.push(childNode)

    def BITWISE_XOR__finish(self, node):
        pass

    def BITWISE_AND__build(self, tokenizer):
        return Node(tokenizer, BITWISE_AND)

    def BITWISE_AND__addOperand(self, node, childNode):
        node.push(childNode)

    def BITWISE_AND__finish(self, node):
        pass

    def EQUALITY__build(self, tokenizer):
        # NB tokenizer.token.type must be EQ, NE, STRICT_EQ, or STRICT_NE.
        return Node(tokenizer)

    def EQUALITY__addOperand(self, node, childNode):
        node.push(childNode)

    def EQUALITY__finish(self, node):
        pass

    def RELATIONAL__build(self, tokenizer):
        # NB tokenizer.token.type must be LT, LE, GE, or GT.
        return Node(tokenizer)

    def RELATIONAL__addOperand(self, node, childNode):
        node.push(childNode)

    def RELATIONAL__finish(self, node):
        pass

    def SHIFT__build(self, tokenizer):
        # NB tokenizer.token.type must be LSH, RSH, or URSH.
        return Node(tokenizer)

    def SHIFT__addOperand(self, node, childNode):
        node.push(childNode)

    def SHIFT__finish(self, node):
        pass

    def ADD__build(self, tokenizer):
        # NB tokenizer.token.type must be PLUS or MINUS.
        return Node(tokenizer)

    def ADD__addOperand(self, node, childNode):
        node.push(childNode)

    def ADD__finish(self, node):
        pass

    def MULTIPLY__build(self, tokenizer):
        # NB tokenizer.token.type must be MUL, DIV, or MOD.
        return Node(tokenizer)

    def MULTIPLY__addOperand(self, node, childNode):
        node.push(childNode)

    def MULTIPLY__finish(self, node):
        pass

    def UNARY__build(self, tokenizer):
        # NB tokenizer.token.type must be DELETE, VOID, TYPEOF, NOT, BITWISE_NOT,
        # UNARY_PLUS, UNARY_MINUS, INCREMENT, or DECREMENT.
        if tokenizer.token.type == PLUS:
            tokenizer.token.type = UNARY_PLUS
        elif tokenizer.token.type == MINUS:
            tokenizer.token.type = UNARY_MINUS
            
        return Node(tokenizer)

    def UNARY__addOperand(self, node, childNode):
        node.push(childNode)

    def UNARY__setPostfix(self, node):
        node.postfix = true

    def UNARY__finish(self, node):
        pass

    def MEMBER__build(self, tokenizer, tokenType):
        # NB tokenizer.token.type must be NEW, DOT, or INDEX.
        return Node(tokenizer, tokenType)

    def MEMBER__rebuildNewWithArgs(self, node):
        node.type = NEW_WITH_ARGS

    def MEMBER__addOperand(self, node, childNode):
        node.push(childNode)

    def MEMBER__finish(self, node):
        pass

    def PRIMARY__build(self, tokenizer, tokenType):
        # NB tokenizer.token.type must be NULL, THIS, TRUIE, FALSE, IDENTIFIER,
        # NUMBER, STRING, or REGEXP.
        return Node(tokenizer, tokenType)

    def PRIMARY__finish(self, node):
        pass

    def ARRAY_INIT__build(self, tokenizer):
        return Node(tokenizer, ARRAY_INIT)

    def ARRAY_INIT__addElement(self, node, childNode):
        node.push(childNode)

    def ARRAY_INIT__finish(self, node):
        pass

    def ARRAY_COMP__build(self, tokenizer):
        return Node(tokenizer, ARRAY_COMP)
    
    def ARRAY_COMP__setExpression(self, node, expression):
        node.expression = expression
    
    def ARRAY_COMP__setTail(self, node, childNode):
        node.tail = childNode
    
    def ARRAY_COMP__finish(self, node):
        pass

    def COMP_TAIL__build(self, tokenizer):
        return Node(tokenizer, COMP_TAIL)

    def COMP_TAIL__setGuard(self, node, expression):
        node.guard = expression

    def COMP_TAIL__addFor(self, node, childNode):
        node.push(childNode)

    def COMP_TAIL__finish(self, node):
        pass

    def OBJECT_INIT__build(self, tokenizer):
        return Node(tokenizer, OBJECT_INIT)

    def OBJECT_INIT__addProperty(self, node, childNode):
        node.push(childNode)

    def OBJECT_INIT__finish(self, node):
        pass

    def PROPERTY_INIT__build(self, tokenizer):
        return Node(tokenizer, PROPERTY_INIT)

    def PROPERTY_INIT__addOperand(self, node, childNode):
        node.push(childNode)

    def PROPERTY_INIT__finish(self, node):
        pass

    def COMMA__build(self, tokenizer):
        return Node(tokenizer, COMMA)

    def COMMA__addOperand(self, node, childNode):
        node.push(childNode)

    def COMMA__finish(self, node):
        pass

    def LIST__build(self, tokenizer):
        return Node(tokenizer, LIST)

    def LIST__addOperand(self, node, childNode):
        node.push(childNode)

    def LIST__finish(self, node):
        pass

    def setHoists(self, id, vds):
        pass
        