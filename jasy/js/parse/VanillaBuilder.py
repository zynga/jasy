#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

#
# License: MPL 1.1/GPL 2.0/LGPL 2.1
# Authors: 
#   - Brendan Eich <brendan@mozilla.org> (Original JavaScript) (2004-2010)
#   - Sebastian Werner <info@sebastian-werner.net> (Python Port) (2010)
#

import jasy.js.parse.Node

class VanillaBuilder:
    """The vanilla AST builder."""
    
    def COMMENTS_add(self, currNode, prevNode, comments):
        if not comments:
            return
            
        currComments = []
        prevComments = []
        for comment in comments:
            # post comments - for previous node
            if comment.context == "inline":
                prevComments.append(comment)
                
            # all other comment styles are attached to the current one
            else:
                currComments.append(comment)
        
        # Merge with previously added ones
        if hasattr(currNode, "comments"):
            currNode.comments.extend(currComments)
        else:
            currNode.comments = currComments
        
        if prevNode:
            if hasattr(prevNode, "comments"):
                prevNode.comments.extend(prevComments)
            else:
                prevNode.comments = prevComments
        else:
            # Don't loose the comment in tree (if not previous node is there, attach it to this node)
            currNode.comments.extend(prevComments)
    
    def IF_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "if")

    def IF_setCondition(self, node, expression):
        node.append(expression, "condition")

    def IF_setThenPart(self, node, statement):
        node.append(statement, "thenPart")

    def IF_setElsePart(self, node, statement):
        node.append(statement, "elsePart")

    def IF_finish(self, node):
        pass

    def SWITCH_build(self, tokenizer):
        node = jasy.js.parse.Node.Node(tokenizer, "switch")
        node.defaultIndex = -1
        return node

    def SWITCH_setDiscriminant(self, node, expression):
        node.append(expression, "discriminant")

    def SWITCH_setDefaultIndex(self, node, index):
        node.defaultIndex = index

    def SWITCH_addCase(self, node, childNode):
        node.append(childNode)

    def SWITCH_finish(self, node):
        pass

    def CASE_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "case")

    def CASE_setLabel(self, node, expression):
        node.append(expression, "label")

    def CASE_initializeStatements(self, node, tokenizer):
        node.append(jasy.js.parse.Node.Node(tokenizer, "block"), "statements")

    def CASE_addStatement(self, node, statement):
        node.statements.append(statement)

    def CASE_finish(self, node):
        pass

    def DEFAULT_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "default")

    def DEFAULT_initializeStatements(self, node, tokenizer):
        node.append(jasy.js.parse.Node.Node(tokenizer, "block"), "statements")

    def DEFAULT_addStatement(self, node, statement):
        node.statements.append(statement)

    def DEFAULT_finish(self, node):
        pass

    def FOR_build(self, tokenizer):
        node = jasy.js.parse.Node.Node(tokenizer, "for")
        node.isLoop = True
        node.isEach = False
        return node

    def FOR_rebuildForEach(self, node):
        node.isEach = True

    # NB: This function is called after rebuildForEach, if that'statement called at all.
    def FOR_rebuildForIn(self, node):
        node.type = "for_in"

    def FOR_setCondition(self, node, expression):
        node.append(expression, "condition")

    def FOR_setSetup(self, node, expression):
        node.append(expression, "setup")

    def FOR_setUpdate(self, node, expression):
        node.append(expression, "update")

    def FOR_setObject(self, node, expression, forBlock=None):
        # wpbasti: not sure what forBlock stands for but it is used in the parser
        # JS tolerates the optinal unused parameter, but not so Python.
        node.append(expression, "object")

    def FOR_setIterator(self, node, expression, forBlock=None):
        # wpbasti: not sure what forBlock stands for but it is used in the parser
        # JS tolerates the optinal unused parameter, but not so Python.
        node.append(expression, "iterator")

    def FOR_setBody(self, node, statement):
        node.append(statement, "body")

    def FOR_finish(self, node):
        pass

    def WHILE_build(self, tokenizer):
        node = jasy.js.parse.Node.Node(tokenizer, "while")
        node.isLoop = True
        return node

    def WHILE_setCondition(self, node, expression):
        node.append(expression, "condition")

    def WHILE_setBody(self, node, statement):
        node.append(statement, "body")

    def WHILE_finish(self, node):
        pass

    def DO_build(self, tokenizer):
        node = jasy.js.parse.Node.Node(tokenizer, "do")
        node.isLoop = True
        return node

    def DO_setCondition(self, node, expression):
        node.append(expression, "condition")

    def DO_setBody(self, node, statement):
        node.append(statement, "body")

    def DO_finish(self, node):
        pass

    def BREAK_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "break")

    def BREAK_setLabel(self, node, label):
        node.label = label

    def BREAK_setTarget(self, node, target):
        # Hint, no append() - relation, but not a child
        node.target = target

    def BREAK_finish(self, node):
        pass

    def CONTINUE_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "continue")

    def CONTINUE_setLabel(self, node, label):
        node.label = label

    def CONTINUE_setTarget(self, node, target):
        # Hint, no append() - relation, but not a child
        node.target = target

    def CONTINUE_finish(self, node):
        pass

    def TRY_build(self, tokenizer):
        node = jasy.js.parse.Node.Node(tokenizer, "try")
        return node

    def TRY_setTryBlock(self, node, statement):
        node.append(statement, "tryBlock")

    def TRY_addCatch(self, node, childNode):
        node.append(childNode)

    def TRY_finishCatches(self, node):
        pass

    def TRY_setFinallyBlock(self, node, statement):
        node.append(statement, "finallyBlock")

    def TRY_finish(self, node):
        pass

    def CATCH_build(self, tokenizer):
        node = jasy.js.parse.Node.Node(tokenizer, "catch")
        return node
        
    def CATCH_wrapException(self, tokenizer):
        node = jasy.js.parse.Node.Node(tokenizer, "exception")
        node.value = tokenizer.token.value
        return node

    def CATCH_setException(self, node, exception):
        node.append(exception, "exception")

    def CATCH_setGuard(self, node, expression):
        node.append(expression, "guard")

    def CATCH_setBlock(self, node, statement):
        node.append(statement, "block")

    def CATCH_finish(self, node):
        pass

    def THROW_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "throw")

    def THROW_setException(self, node, expression):
        node.append(expression, "exception")

    def THROW_finish(self, node):
        pass

    def RETURN_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "return")

    def RETURN_setValue(self, node, expression):
        node.append(expression, "value")

    def RETURN_finish(self, node):
        pass

    def YIELD_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "yield")

    def YIELD_setValue(self, node, expression):
        node.append(expression, "value")

    def YIELD_finish(self, node):
        pass

    def GENERATOR_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "generator")

    def GENERATOR_setExpression(self, node, expression):
        node.append(expression, "expression")

    def GENERATOR_setTail(self, node, childNode):
        node.append(childNode, "tail")

    def GENERATOR_finish(self, node):
        pass

    def WITH_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "with")

    def WITH_setObject(self, node, expression):
        node.append(expression, "object")

    def WITH_setBody(self, node, statement):
        node.append(statement, "body")

    def WITH_finish(self, node):
        pass

    def DEBUGGER_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "debugger")

    def SEMICOLON_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "semicolon")

    def SEMICOLON_setExpression(self, node, expression):
        node.append(expression, "expression")

    def SEMICOLON_finish(self, node):
        pass

    def LABEL_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "label")

    def LABEL_setLabel(self, node, label):
        node.label = label

    def LABEL_setStatement(self, node, statement):
        node.append(statement, "statement")

    def LABEL_finish(self, node):
        pass

    def FUNCTION_build(self, tokenizer):
        node = jasy.js.parse.Node.Node(tokenizer)
        if node.type != "function":
            if tokenizer.token.value == "get":
                node.type = "getter"
            else:
                node.type = "setter"
                
        return node

    def FUNCTION_setName(self, node, identifier):
        node.name = identifier

    def FUNCTION_initParams(self, node, tokenizer):
        node.append(jasy.js.parse.Node.Node(tokenizer, "list"), "params")
        
    def FUNCTION_wrapParam(self, tokenizer):
        param = jasy.js.parse.Node.Node(tokenizer)
        param.value = tokenizer.token.value
        return param
        
    def FUNCTION_addParam(self, node, tokenizer, expression):
        node.params.append(expression)
        
    def FUNCTION_setExpressionClosure(self, node, expressionClosure):
        node.expressionClosure = expressionClosure

    def FUNCTION_setBody(self, node, statement):
        # copy over function parameters to function body
        params = getattr(node, "params", None)
        #if params:
        #    statement.params = [param.value for param in params]
            
        node.append(statement, "body")

    def FUNCTION_hoistVars(self, x):
        pass

    def FUNCTION_finish(self, node, x):
        pass

    def VAR_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "var")

    def VAR_addDecl(self, node, childNode, childContext=None):
        node.append(childNode)

    def VAR_finish(self, node):
        pass

    def CONST_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "const")

    def CONST_addDecl(self, node, childNode, childContext=None):
        node.append(childNode)

    def CONST_finish(self, node):
        pass

    def LET_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "let")

    def LET_addDecl(self, node, childNode, childContext=None):
        node.append(childNode)

    def LET_finish(self, node):
        pass

    def DECL_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "declaration")

    def DECL_setNames(self, node, expression):
        node.append(expression, "names")

    def DECL_setName(self, node, identifier):
        node.name = identifier

    def DECL_setInitializer(self, node, expression):
        node.append(expression, "initializer")

    def DECL_setReadOnly(self, node, readOnly):
        node.readOnly = readOnly

    def DECL_finish(self, node):
        pass

    def LETBLOCK_build(self, tokenizer):
        node = jasy.js.parse.Node.Node(tokenizer, "let_block")
        return node

    def LETBLOCK_setVariables(self, node, childNode):
        node.append(childNode, "variables")

    def LETBLOCK_setExpression(self, node, expression):
        node.append(expression, "expression")

    def LETBLOCK_setBlock(self, node, statement):
        node.append(statement, "block")

    def LETBLOCK_finish(self, node):
        pass

    def BLOCK_build(self, tokenizer, id):
        node = jasy.js.parse.Node.Node(tokenizer, "block")
        # node.id = id
        return node

    def BLOCK_hoistLets(self, node):
        pass

    def BLOCK_addStatement(self, node, childNode):
        node.append(childNode)

    def BLOCK_finish(self, node):
        pass

    def EXPRESSION_build(self, tokenizer, tokenType):
        return jasy.js.parse.Node.Node(tokenizer, tokenType)

    def EXPRESSION_addOperand(self, node, childNode):
        node.append(childNode)

    def EXPRESSION_finish(self, node):
        pass

    def ASSIGN_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "assign")

    def ASSIGN_addOperand(self, node, childNode):
        node.append(childNode)

    def ASSIGN_setAssignOp(self, node, operator):
        node.assignOp = operator

    def ASSIGN_finish(self, node):
        pass

    def HOOK_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "hook")

    def HOOK_setCondition(self, node, expression):
        node.append(expression, "condition")

    def HOOK_setThenPart(self, node, childNode):
        node.append(childNode, "thenPart")

    def HOOK_setElsePart(self, node, childNode):
        node.append(childNode, "elsePart")

    def HOOK_finish(self, node):
        pass

    def OR_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "or")

    def OR_addOperand(self, node, childNode):
        node.append(childNode)

    def OR_finish(self, node):
        pass

    def AND_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "and")

    def AND_addOperand(self, node, childNode):
        node.append(childNode)

    def AND_finish(self, node):
        pass

    def BITWISEOR_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "bitwise_or")

    def BITWISEOR_addOperand(self, node, childNode):
        node.append(childNode)

    def BITWISEOR_finish(self, node):
        pass

    def BITWISEXOR_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "bitwise_xor")

    def BITWISEXOR_addOperand(self, node, childNode):
        node.append(childNode)

    def BITWISEXOR_finish(self, node):
        pass

    def BITWISEAND_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "bitwise_and")

    def BITWISEAND_addOperand(self, node, childNode):
        node.append(childNode)

    def BITWISEAND_finish(self, node):
        pass

    def EQUALITY_build(self, tokenizer):
        # NB: tokenizer.token.type must be "eq", "ne", "strict_eq", or "strict_ne".
        return jasy.js.parse.Node.Node(tokenizer)

    def EQUALITY_addOperand(self, node, childNode):
        node.append(childNode)

    def EQUALITY_finish(self, node):
        pass

    def RELATIONAL_build(self, tokenizer):
        # NB: tokenizer.token.type must be "lt", "le", "ge", or "gt".
        return jasy.js.parse.Node.Node(tokenizer)

    def RELATIONAL_addOperand(self, node, childNode):
        node.append(childNode)

    def RELATIONAL_finish(self, node):
        pass

    def SHIFT_build(self, tokenizer):
        # NB: tokenizer.token.type must be "lsh", "rsh", or "ursh".
        return jasy.js.parse.Node.Node(tokenizer)

    def SHIFT_addOperand(self, node, childNode):
        node.append(childNode)

    def SHIFT_finish(self, node):
        pass

    def ADD_build(self, tokenizer):
        # NB: tokenizer.token.type must be "plus" or "minus".
        return jasy.js.parse.Node.Node(tokenizer)

    def ADD_addOperand(self, node, childNode):
        node.append(childNode)

    def ADD_finish(self, node):
        pass

    def MULTIPLY_build(self, tokenizer):
        # NB: tokenizer.token.type must be "mul", "div", or "mod".
        return jasy.js.parse.Node.Node(tokenizer)

    def MULTIPLY_addOperand(self, node, childNode):
        node.append(childNode)

    def MULTIPLY_finish(self, node):
        pass

    def UNARY_build(self, tokenizer):
        # NB: tokenizer.token.type must be "delete", "void", "typeof", "not", "bitwise_not",
        # "unary_plus", "unary_minus", "increment", or "decrement".
        if tokenizer.token.type == "plus":
            tokenizer.token.type = "unary_plus"
        elif tokenizer.token.type == "minus":
            tokenizer.token.type = "unary_minus"
            
        return jasy.js.parse.Node.Node(tokenizer)

    def UNARY_addOperand(self, node, childNode):
        node.append(childNode)

    def UNARY_setPostfix(self, node):
        node.postfix = True

    def UNARY_finish(self, node):
        pass

    def MEMBER_build(self, tokenizer, tokenType=None):
        node = jasy.js.parse.Node.Node(tokenizer, tokenType)
        if node.type == "identifier":
            node.value = tokenizer.token.value
        return node

    def MEMBER_rebuildNewWithArgs(self, node):
        node.type = "new_with_args"

    def MEMBER_addOperand(self, node, childNode):
        node.append(childNode)

    def MEMBER_finish(self, node):
        pass

    def PRIMARY_build(self, tokenizer, tokenType):
        # NB: tokenizer.token.type must be "null", "this", "true", "false", "identifier", "number", "string", or "regexp".
        node = jasy.js.parse.Node.Node(tokenizer, tokenType)
        if tokenType in ("identifier", "string", "regexp", "number"):
            node.value = tokenizer.token.value
            
        return node

    def PRIMARY_finish(self, node):
        pass

    def ARRAYINIT_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "array_init")

    def ARRAYINIT_addElement(self, node, childNode):
        node.append(childNode)

    def ARRAYINIT_finish(self, node):
        pass

    def ARRAYCOMP_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "array_comp")
    
    def ARRAYCOMP_setExpression(self, node, expression):
        node.append(expression, "expression")
    
    def ARRAYCOMP_setTail(self, node, childNode):
        node.append(childNode, "tail")
    
    def ARRAYCOMP_finish(self, node):
        pass

    def COMPTAIL_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "comp_tail")

    def COMPTAIL_setGuard(self, node, expression):
        node.append(expression, "guard")

    def COMPTAIL_addFor(self, node, childNode):
        node.append(childNode, "for")

    def COMPTAIL_finish(self, node):
        pass

    def OBJECTINIT_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "object_init")

    def OBJECTINIT_addProperty(self, node, childNode):
        node.append(childNode)

    def OBJECTINIT_finish(self, node):
        pass

    def PROPERTYINIT_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "property_init")

    def PROPERTYINIT_addOperand(self, node, childNode):
        node.append(childNode)

    def PROPERTYINIT_finish(self, node):
        pass

    def COMMA_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "comma")

    def COMMA_addOperand(self, node, childNode):
        node.append(childNode)

    def COMMA_finish(self, node):
        pass

    def LIST_build(self, tokenizer):
        return jasy.js.parse.Node.Node(tokenizer, "list")

    def LIST_addOperand(self, node, childNode):
        node.append(childNode)

    def LIST_finish(self, node):
        pass

    def setHoists(self, id, vds):
        pass
        