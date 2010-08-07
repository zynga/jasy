#
# JavaScript Tools - Vanilla AST Builder
# License: MPL 1.1/GPL 2.0/LGPL 2.1
# Authors: 
#   - Brendan Eich <brendan@mozilla.org> (Original JavaScript) (2004-2010)
#   - Sebastian Werner <info@sebastian-werner.net> (Python Port) (2010)
#

from Node import Node

class SubBuilder:
    pass

class VanillaBuilder:
    """The vanilla AST builder."""
    
    def IF_build(self, tokenizer):
        return Node(tokenizer, "if")

    def IF_setCondition(self, node, expression):
        node.condition = expression

    def IF_setThenPart(self, node, statement):
        node.thenPart = statement

    def IF_setElsePart(self, node, statement):
        node.elsePart = statement

    def IF_finish(self, node):
        pass

    def SWITCH_build(self, tokenizer):
        node = Node(tokenizer, "switch")
        node.cases = []
        node.defaultIndex = -1
        return node

    def SWITCH_setDiscriminant(self, node, expression):
        node.discriminant = expression

    def SWITCH_setDefaultIndex(self, node, index):
        node.defaultIndex = index

    def SWITCH_addCase(self, node, childNode):
        node.cases.append(childNode)

    def SWITCH_finish(self, node):
        pass

    def CASE_build(self, tokenizer):
        return Node(tokenizer, "case")

    def CASE_setLabel(self, node, expression):
        node.caseLabel = expression

    def CASE_initializeStatements(self, node, tokenizer):
        node.statements = Node(tokenizer, "block")

    def CASE_addStatement(self, node, statement):
        node.statements.append(statement)

    def CASE_finish(self, node):
        pass

    def DEFAULT_build(self, tokenizer, p):
        return Node(tokenizer, "default")

    def DEFAULT_initializeStatements(self, node, tokenizer):
        node.statements = Node(tokenizer, "block")

    def DEFAULT_addStatement(self, node, statement):
        node.statements.append(statement)

    def DEFAULT_finish(self, node):
        pass

    def FOR_build(self, tokenizer):
        node = Node(tokenizer, "for")
        node.isLoop = true
        node.isEach = false
        return node

    def FOR_rebuildForEach(self, node):
        node.isEach = true

    # "nb". This function is called after rebuildForEach, if that'statement called at all.
    def FOR_rebuildForIn(self, node):
        node.type = "for_in"

    def FOR_setCondition(self, node, expression):
        node.condition = expression

    def FOR_setSetup(self, node, expression):
        node.setup = expression if expression else None

    def FOR_setUpdate(self, node, expression):
        node.update = expression

    def FOR_setObject(self, node, expression):
        node.object = expression

    def FOR_setIterator(self, node, expression, expression2):
        node.iterator = expression
        node.varDecl = expression2

    def FOR_setBody(self, node, statement):
        node.body = statement

    def FOR_finish(self, node):
        pass

    def WHILE_build(self, tokenizer):
        node = Node(tokenizer, "while")
        node.isLoop = true
        return node

    def WHILE_setCondition(self, node, expression):
        node.condition = expression

    def WHILE_setBody(self, node, statement):
        node.body = statement

    def WHILE_finish(self, node):
        pass

    def DO_build(self, tokenizer):
        node = Node(tokenizer, "do")
        node.isLoop = true
        return node

    def DO_setCondition(self, node, expression):
        node.condition = expression

    def DO_setBody(self, node, statement):
        node.body = statement

    def DO_finish(self, node):
        pass

    def BREAK_build(self, tokenizer):
        return Node(tokenizer, "break")

    def BREAK_setLabel(self, node, identifier):
        node.label = identifier

    def BREAK_setTarget(self, node, childNode):
        node.target = childNode

    def BREAK_finish(self, node):
        pass

    def CONTINUE_build(self, tokenizer):
        return Node(tokenizer, "continue")

    def CONTINUE_setLabel(self, node, identifier):
        node.label = identifier

    def CONTINUE_setTarget(self, node, childNode):
        node.target = childNode

    def CONTINUE_finish(self, node):
        pass

    def TRY_build(self, tokenizer):
        node = Node(tokenizer, "try")
        node.catchClauses = []
        return node

    def TRY_setTryBlock(self, node, statement):
        node.tryBlock = statement

    def TRY_addCatch(self, node, childNode):
        node.catchClauses.append(childNode)

    def TRY_finishCatches(self, node):
        pass

    def TRY_setFinallyBlock(self, node, statement):
        node.finallyBlock = statement

    def TRY_finish(self, node):
        pass

    def CATCH_build(self, tokenizer):
        node = Node(tokenizer, "catch")
        node.guard = None
        return node

    def CATCH_setVarName(self, node, identifier):
        node.varName = identifier

    def CATCH_setGuard(self, node, expression):
        node.guard = expression

    def CATCH_setBlock(self, node, statement):
        node.block = statement

    def CATCH_finish(self, node):
        pass

    def THROW_build(self, tokenizer):
        return Node(tokenizer, "throw")

    def THROW_setException(self, node, expression):
        node.exception = expression

    def THROW_finish(self, node):
        pass

    def RETURN_build(self, tokenizer):
        return Node(tokenizer, "return")

    def RETURN_setValue(self, node, expression):
        node.value = expression

    def RETURN_finish(self, node):
        pass

    def YIELD_build(self, tokenizer):
        return Node(tokenizer, "yield")

    def YIELD_setValue(self, node, expression):
        node.value = expression

    def YIELD_finish(self, node):
        pass

    def GENERATOR_build(self, tokenizer):
        return Node(tokenizer, "generator")

    def GENERATOR_setExpression(self, node, expression):
        node.expression = expression

    def GENERATOR_setTail(self, node, childNode):
        node.tail = childNode

    def GENERATOR_finish(self, node):
        pass

    def WITH_build(self, tokenizer):
        return Node(tokenizer, "with")

    def WITH_setObject(self, node, expression):
        node.object = expression

    def WITH_setBody(self, node, statement):
        node.body = statement

    def WITH_finish(self, node):
        pass

    def DEBUGGER_build(self, tokenizer):
        return Node(tokenizer, "debugger")

    def SEMICOLON_build(self, tokenizer):
        return Node(tokenizer, "semicolon")

    def SEMICOLON_setExpression(self, node, expression):
        node.expression = expression

    def SEMICOLON_finish(self, node):
        pass

    def LABEL_build(self, tokenizer):
        return Node(tokenizer, "label")

    def LABEL_setLabel(self, node, expression):
        node.label = expression

    def LABEL_setStatement(self, node, statement):
        node.statement = statement

    def LABEL_finish(self, node):
        pass

    def FUNCTION_build(self, tokenizer):
        node = Node(tokenizer)
        if node.type != "function":
            if node.value == "get":
                node.type = "getter"
            else:
                node.type = "setter"

        node.params = []
        return node

    def FUNCTION_setName(self, node, identifier):
        node.name = identifier

    def FUNCTION_addParam(self, node, identifier):
        node.params.append(identifier)

    def FUNCTION_setBody(self, node, statement):
        node.body = statement

    def FUNCTION_hoistVars(self, x):
        pass

    def FUNCTION_finish(self, node, x):
        pass

    def VAR_build(self, tokenizer):
        return Node(tokenizer, "var")

    def VAR_addDecl(self, node, childNode, x):
        node.append(childNode)

    def VAR_finish(self, node):
        pass

    def CONST_build(self, tokenizer):
        return Node(tokenizer, "var")

    def CONST_addDecl(self, node, childNode, x):
        node.append(childNode)

    def CONST_finish(self, node):
        pass

    def LET_build(self, tokenizer):
        return Node(tokenizer, "let")

    def LET_addDecl(self, node, childNode, x):
        node.append(childNode)

    def LET_finish(self, node):
        pass

    def DECL_build(self, tokenizer):
        return Node(tokenizer, "identifier")

    def DECL_setName(self, node, identifier):
        node.name = identifier

    def DECL_setInitializer(self, node, expression):
        node.initializer = expression

    def DECL_setReadOnly(self, node, readOnly):
        node.readOnly = readOnly

    def DECL_finish(self, node):
        pass

    def LETBLOCK_build(self, tokenizer):
        node = Node(tokenizer, "let_block")
        node.varDecls = []
        return node

    def LETBLOCK_setVariables(self, node, childNode):
        node.variables = childNode

    def LETBLOCK_setExpression(self, node, expression):
        node.expression = expression

    def LETBLOCK_setBlock(self, node, statement):
        node.block = statement

    def LETBLOCK_finish(self, node):
        pass

    def BLOCK_build(self, tokenizer, id):
        node = Node(tokenizer, "block")
        node.varDecls = []
        node.id = id
        return node

    def BLOCK_hoistLets(self, node):
        pass

    def BLOCK_addStatement(self, node, childNode):
        node.append(childNode)

    def BLOCK_finish(self, node):
        pass

    def EXPRESSION_build(self, tokenizer, tokenType):
        return Node(tokenizer, tokenType)

    def EXPRESSION_addOperand(self, node, childNode):
        node.append(childNode)

    def EXPRESSION_finish(self, node):
        pass

    def ASSIGN_build(self, tokenizer):
        return Node(tokenizer, "assign")

    def ASSIGN_addOperand(self, node, childNode):
        node.append(childNode)

    def ASSIGN_setAssignOp(self, node, operator):
        node.assignOp = operator

    def ASSIGN_finish(self, node):
        pass

    def HOOK_build(self, tokenizer):
        return Node(tokenizer, "hook")

    def HOOK_setCondition(self, node, expression):
        node[0] = expression

    def HOOK_setThenPart(self, node, childNode):
        node[1] = childNode

    def HOOK_setElsePart(self, node, childNode):
        node[2] = childNode

    def HOOK_finish(self, node):
        pass

    def OR_build(self, tokenizer):
        return Node(tokenizer, "or")

    def OR_addOperand(self, node, childNode):
        node.append(childNode)

    def OR_finish(self, node):
        pass

    def AND_build(self, tokenizer):
        return Node(tokenizer, "and")

    def AND_addOperand(self, node, childNode):
        node.append(childNode)

    def AND_finish(self, node):
        pass

    def BITWISEOR_build(self, tokenizer):
        return Node(tokenizer, "bitwise_or")

    def BITWISEOR_addOperand(self, node, childNode):
        node.append(childNode)

    def BITWISEOR_finish(self, node):
        pass

    def BITWISEXOR_build(self, tokenizer):
        return Node(tokenizer, "bitwise_xor")

    def BITWISEXOR_addOperand(self, node, childNode):
        node.append(childNode)

    def BITWISEXOR_finish(self, node):
        pass

    def BITWISEAND_build(self, tokenizer):
        return Node(tokenizer, "bitwise_and")

    def BITWISEAND_addOperand(self, node, childNode):
        node.append(childNode)

    def BITWISEAND_finish(self, node):
        pass

    def EQUALITY_build(self, tokenizer):
        # "nb" tokenizer.token.type must be "eq", "ne", "strict_eq", or "strict_ne".
        return Node(tokenizer)

    def EQUALITY_addOperand(self, node, childNode):
        node.append(childNode)

    def EQUALITY_finish(self, node):
        pass

    def RELATIONAL_build(self, tokenizer):
        # "nb" tokenizer.token.type must be "lt", "le", "ge", or "gt".
        return Node(tokenizer)

    def RELATIONAL_addOperand(self, node, childNode):
        node.append(childNode)

    def RELATIONAL_finish(self, node):
        pass

    def SHIFT_build(self, tokenizer):
        # "nb" tokenizer.token.type must be "lsh", "rsh", or "ursh".
        return Node(tokenizer)

    def SHIFT_addOperand(self, node, childNode):
        node.append(childNode)

    def SHIFT_finish(self, node):
        pass

    def ADD_build(self, tokenizer):
        # "nb" tokenizer.token.type must be "plus" or "minus".
        return Node(tokenizer)

    def ADD_addOperand(self, node, childNode):
        node.append(childNode)

    def ADD_finish(self, node):
        pass

    def MULTIPLY_build(self, tokenizer):
        # "nb" tokenizer.token.type must be "mul", "div", or "mod".
        return Node(tokenizer)

    def MULTIPLY_addOperand(self, node, childNode):
        node.append(childNode)

    def MULTIPLY_finish(self, node):
        pass

    def UNARY_build(self, tokenizer):
        # "nb" tokenizer.token.type must be "delete", "void", "typeof", "not", "bitwise_not",
        # "unary_plus", "unary_minus", "increment", or "decrement".
        if tokenizer.token.type == "plus":
            tokenizer.token.type = "unary_plus"
        elif tokenizer.token.type == "minus":
            tokenizer.token.type = "unary_minus"
            
        return Node(tokenizer)

    def UNARY_addOperand(self, node, childNode):
        node.append(childNode)

    def UNARY_setPostfix(self, node):
        node.postfix = true

    def UNARY_finish(self, node):
        pass

    def MEMBER_build(self, tokenizer, tokenType):
        # "nb" tokenizer.token.type must be "new", "dot", or "index".
        return Node(tokenizer, tokenType)

    def MEMBER_rebuildNewWithArgs(self, node):
        node.type = "new_with_args"

    def MEMBER_addOperand(self, node, childNode):
        node.append(childNode)

    def MEMBER_finish(self, node):
        pass

    def PRIMARY_build(self, tokenizer, tokenType):
        # "nb" tokenizer.token.type must be "null", "this", "truie", "false", "identifier",
        # "number", "string", or "regexp".
        return Node(tokenizer, tokenType)

    def PRIMARY_finish(self, node):
        pass

    def ARRAYINIT_build(self, tokenizer):
        return Node(tokenizer, "array_init")

    def ARRAYINIT_addElement(self, node, childNode):
        node.append(childNode)

    def ARRAYINIT_finish(self, node):
        pass

    def ARRAYCOMP_build(self, tokenizer):
        return Node(tokenizer, "array_comp")
    
    def ARRAYCOMP_setExpression(self, node, expression):
        node.expression = expression
    
    def ARRAYCOMP_setTail(self, node, childNode):
        node.tail = childNode
    
    def ARRAYCOMP_finish(self, node):
        pass

    def COMPTAIL_build(self, tokenizer):
        return Node(tokenizer, "comp_tail")

    def COMPTAIL_setGuard(self, node, expression):
        node.guard = expression

    def COMPTAIL_addFor(self, node, childNode):
        node.append(childNode)

    def COMPTAIL_finish(self, node):
        pass

    def OBJECTINIT_build(self, tokenizer):
        return Node(tokenizer, "object_init")

    def OBJECTINIT_addProperty(self, node, childNode):
        node.append(childNode)

    def OBJECTINIT_finish(self, node):
        pass

    def PROPERTYINIT_build(self, tokenizer):
        return Node(tokenizer, "property_init")

    def PROPERTYINIT_addOperand(self, node, childNode):
        node.append(childNode)

    def PROPERTYINIT_finish(self, node):
        pass

    def COMMA_build(self, tokenizer):
        return Node(tokenizer, "comma")

    def COMMA_addOperand(self, node, childNode):
        node.append(childNode)

    def COMMA_finish(self, node):
        pass

    def LIST_build(self, tokenizer):
        return Node(tokenizer, "list")

    def LIST_addOperand(self, node, childNode):
        node.append(childNode)

    def LIST_finish(self, node):
        pass

    def setHoists(self, id, vds):
        pass
        