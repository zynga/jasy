#
# JavaScript Tools - Optimizes if-statements for reduced compression size
# Copyright 2010 Sebastian Werner
#

from js.parser.Node import Node
from js.Compressor import compress
from js.parser.Lang import expressionOrder, expressions
import logging

__all__ = ["optimize"]

def optimize(node):
    # Process from inside to outside
    for child in node:
        # None children are allowed sometimes e.g. during array_init like [1,2,,,7,8]
        if child != None:
            optimize(child)
    
    
    # Remove unneeded parens
    if getattr(node, "parenthesized", False):
        cleanParens(node)
    
    
    # Pre-compute numeric expressions where it makes sense
    if node.type in ("plus","minus","mul","div","mod") and node[1].type == "number" and node[1].type == "number":
        firstNumber = node[0]
        secondNumber = node[1]
        operator = node.type
        
        if operator == "plus":
            firstNumber.value += secondNumber.value
            node.parent.replace(node, firstNumber)
        elif operator == "minus":
            firstNumber.value -= secondNumber.value
            node.parent.replace(node, firstNumber)
        else:
            if operator == "mul":
                result = firstNumber.value * secondNumber.value
            elif operator == "div":
                result = firstNumber.value / secondNumber.value
            elif operator == "mod":
                result = firstNumber.value % secondNumber.value
            
            if len(str(result)) < len(compress(node)):
                firstNumber.value = result
                node.parent.replace(node, firstNumber)


    # Pre-combine strings (even supports mixed string + number concats)
    elif node.type == "plus" and node[0].type in ("number", "string") and node[1].type in ("number", "string"):
        node[0].value = "%s%s" % (node[0].value, node[1].value)
        node[0].type = "string"
        node.parent.replace(node, node[0])


    # Unwrap blocks
    if node.type == "block":
        if node.parent.type in ("try", "catch", "finally"):
            pass
        elif len(node) == 0:
            repl =Node(node.tokenizer, "semicolon")
            node.parent.replace(node, repl)
            node = repl
        elif len(node) == 1:
            if node.parent.type == "if" and node.rel == "thenBlock" and hasattr(node.parent, "elsePart") and containsIf(node):
                # if with else where the thenBlock contains another if
                pass
            elif node.parent.type == "if" and node.rel == "thenBlock" and containsIfElse(node):
                # if without else where the thenBlock contains a if-else
                pass
            elif node.parent.type in ("case", "default"):
                # virtual blocks inside case/default statements
                pass
            else:
                node.parent.replace(node, node[0])
                node = node[0]
        else:
            node = combineToCommaExpression(node)
        
        
    # Remove "empty" semicolons who are inside a block/script parent
    if node.type == "semicolon":
        if not hasattr(node, "expression"):
            if node.parent.type in ("block", "script"):
                node.parent.remove(node)
            elif node.parent.type == "if":
                rel = getattr(node, "rel", None)
                if rel == "elsePart":
                    node.parent.remove(node)
            
            
    # Process all if-statements
    if node.type == "if":
        condition = node.condition
        thenPart = node.thenPart
        elsePart = getattr(node, "elsePart", None)
        
        # Optimize for empty thenPart if elsePart is available
        if thenPart.type == "semicolon" and not hasattr(thenPart, "expression") and elsePart:
            if condition.type == "not":
                node.replace(condition, condition[0])
                condition = condition[0]
            else:
                repl = Node(None, "not")
                node.replace(condition, repl)
                repl.append(condition)
                condition = repl
            
            node.replace(thenPart, elsePart)
            thenPart = elsePart
            elsePart = None
        
        # Optimize using hook operator
        if elsePart and thenPart.type == "return" and elsePart.type == "return":
            # Combine return statement
            replacement = createReturn(createHook(condition, thenPart.value, elsePart.value))
            node.parent.replace(node, replacement)
            return

        # Check whether if-part ends with a return statement. Then
        # We do not need a else statement here and just can wrap the whole content
        # of the else block inside the parent
        if elsePart and endsWithReturnOrThrow(thenPart):
            reworkElse(node, elsePart)
            elsePart = None

        # Optimize using "AND" or "OR" operators
        # Combine multiple semicolon statements into one semicolon statement using an "comma" expression
        thenPart = combineToCommaExpression(thenPart)
        elsePart = combineToCommaExpression(elsePart)
        
        # Optimize remaining if or if-else constructs
        if elsePart:
            mergeParts(node, thenPart, elsePart, condition)
        elif thenPart.type == "semicolon":
            compactIf(node, thenPart, condition)


def reworkElse(node, elsePart):
    """ 
    If an if ends with a return/throw we are able to inline the content 
    of the else to the same parent as the if resides into. This method
    deals with all the nasty details of this operation.
    """
    
    target = node.parent
    targetIndex = target.index(node)+1

    # A workaround for compact if-else blocks
    # We are a elsePart of the if where we want to move our
    # content to. This cannot work. So we need to wrap ourself
    # into a block and move the else statements to this newly
    # established block
    if not target.type in ("block","script"):
        newBlock = Node(None, "block")
        newBlock.wrapped = True
        
        # Replace node with newly created block and put ourself into it
        node.parent.replace(node, newBlock)
        newBlock.append(node)
        
        # Update the target and the index
        target = newBlock
        targetIndex = 1
        
    if not target.type in ("block","script"):
        print("No possible target found/created")
        return elsePart
        
    if elsePart.type == "block":
        for child in reversed(elsePart):
            target.insert(targetIndex, child)

        # Remove else block from if statement
        node.remove(elsePart)
            
    else:
        target.insert(targetIndex, elsePart)
        
    return  



def endsWithReturnOrThrow(node):
    if node.type in ("return", "throw"):
        return True
        
    elif node.type == "block":
        length = len(node)
        return length > 0 and node[length-1].type in ("return", "throw")
        
    return False
    
    
    
def mergeParts(node, thenPart, elsePart, condition):
    if thenPart.type == "semicolon" and elsePart.type == "semicolon":
        # Combine two assignments or expressions
        thenExpression = getattr(thenPart, "expression", None)
        elseExpression = getattr(elsePart, "expression", None)
        if thenExpression and elseExpression:
            replacement = combineAssignments(condition, thenExpression, elseExpression) or combineExpressions(condition, thenExpression, elseExpression)
            if replacement:
                node.parent.replace(node, replacement)    


def cleanParens(node):
    parent = node.parent

    if node.type == "function" and parent.type == "call":
        # Ignore for direct execution functions. This is required
        # for parsing e.g. (function(){})(); which does not work
        # without parens around the function instance other than
        # priorities might suggest. It only works this way when being
        # part of assignment/declaration.
        if parent.parent.type in ("declaration", "assign"):
            node.parenthesized = False
            
    elif node.type == "assign" and parent.type == "hook":
        node.parenthesized = node.rel == "condition"
                
    elif getattr(node, "rel", None) == "condition":
        # inside a condition e.g. while(condition) or for(;condition;) we do not need
        # parens aroudn an expression
        node.parenthesized = False
    
    elif node.type in expressions and parent.type == "return":
        # Returns never need parens around the expression
        node.parenthesized = False
        
    elif node.type == "new" and parent.type == "dot":
        # Constructs like (new foo.bar.Object).doSomething()
        # "new" is defined with higher priority than "dot" but in
        # this case it does not work without parens. Interestingly
        # the same works without issues when having "new_with_args" 
        # instead like: new foo.bar.Object("param").doSomething()
        pass
        
    elif node.type in expressions and parent.type in expressions:
        prio = expressionOrder[node.type]
        parentPrio = expressionOrder[node.parent.type]
        
        # Only higher priorities are optimized. Others are just to complex e.g.
        # "hello" + (3+4) + "world" is not allowed to be translated to 
        # "hello" + 3+4 + "world"
        if prio > parentPrio:
            node.parenthesized = False
        elif prio == parentPrio:
            if node.type == "hook":
                node.parenthesized = False
            


def fixParens(node):
    parent = node.parent
    
    if parent.type in expressions:
        prio = expressionOrder[node.type]
        parentPrio = expressionOrder[node.parent.type]

        # If the child was moved to a new parent we need to figure
        # out whether we need parens to 
        needsParens = prio < parentPrio
        
        # Fix minor priority issue in hook statements. They are a little bit special. 
        # In their condition part, assignments have lower priority than the hook, in 
        # the action parts it's the other way around.
        if parent.type == "hook" and node.type == "assign":
            needsParens = node.rel == "condition"

        node.parenthesized = needsParens


def combineToCommaExpression(node):
    if node == None or node.type != "block":
        return node
        
    for child in node:
        if child.type != "semicolon":
            return node
    
    comma = Node(node.tokenizer, "comma")
    
    for child in list(node):
        # Ignore empty semicolons
        if hasattr(child, "expression"):
            comma.append(child.expression)
            
    semicolon = Node(node.tokenizer, "semicolon")
    semicolon.append(comma, "expression")
    
    parent = node.parent
    parent.replace(node, semicolon)
    
    return semicolon
        


def compactIf(node, thenPart, condition):
    thenExpression = getattr(thenPart, "expression", None)
    if not thenExpression:
        # Empty semicolon statement => translate if into semicolon statement
        node.remove(condition)
        node.remove(node.thenPart)
        node.append(condition, "expression")
        node.type = "semicolon"

    else:
        # Has expression => Translate IF using a AND or OR operator
        if condition.type == "not":
            replacement = Node(thenPart.tokenizer, "or")
            condition = condition[0]
        else:
            replacement = Node(thenPart.tokenizer, "and")

        replacement.append(condition)
        replacement.append(thenExpression)

        thenPart.append(replacement, "expression")

        fixParens(thenExpression)
        fixParens(condition)
        
        node.parent.replace(node, thenPart)


def containsIfElse(node):
    """ helper for block removal optimization """
    if node.type == "if" and hasattr(node, "elsePart"):
        return True

    for child in node:
        # Blocks reset this if-else problem so we ignore them 
        # (and their content) for our scan.
        if child.type == "block":
            pass
        
        elif containsIfElse(child):
            return True

    return False
    
    
def containsIf(node):
    """ helper for block removal optimization """
    if node.type == "if":
        return True

    for child in node:
        # Blocks reset this if-else problem so we ignore them 
        # (and their content) for our scan.
        if child.type == "block":
            pass

        elif containsIf(child):
            return True

    return False    


def combineAssignments(condition, thenExpression, elseExpression):
    if thenExpression.type == "assign" and elseExpression.type == "assign":
        operator = getattr(thenExpression, "assignOp", None)
        if operator == getattr(elseExpression, "assignOp", None):
            if compress(thenExpression[0]) == compress(elseExpression[0]):
                hook = createHook(condition, thenExpression[1], elseExpression[1])
                fixParens(condition)
                fixParens(hook.thenPart)
                fixParens(hook.elsePart)
                thenExpression.append(hook)
                return thenExpression.parent


def combineExpressions(condition, thenExpression, elseExpression):
    hook = createHook(condition, thenExpression, elseExpression)
    semicolon = Node(condition.tokenizer, "semicolon")
    semicolon.append(hook, "expression")
    
    fixParens(condition)
    fixParens(thenExpression)
    fixParens(elseExpression)
    
    return semicolon


def createReturn(value):
    ret = Node(value.tokenizer, "return")
    ret.append(value, "value")
    return ret


def createHook(condition, thenPart, elsePart):
    hook = Node(condition.tokenizer, "hook")
    hook.append(condition, "condition")
    hook.append(thenPart, "thenPart")
    hook.append(elsePart, "elsePart")
    return hook
    