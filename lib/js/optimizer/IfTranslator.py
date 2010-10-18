#
# JavaScript Tools - Optimizes if-statements for reduced compression size
# Copyright 2010 Sebastian Werner
#

from js.parser.Node import Node
from js.Compressor import compress
import logging

__all__ = ["optimize"]

def optimize(node, level=0):
    # Process from inside to outside
    for child in node:
        optimize(child, level+1)
        
    # Unwrap blocks
    if node.type == "block":
        if len(node) == 0:
            print("Replace empty block #%s" % level)
            node.parent.replace(node, Node(node.tokenizer, "semicolon"))
        elif len(node) == 1:
            if node.parent.type == "if" and containsIf(node):
                print("Omit unwrapping of block (cascaded if blocks) at #%s" % level)
            else:
                print("Unwrap block at #%s" % level)
                node.parent.replace(node, node[0])
            
    # Process all if-statements
    if node.type == "if":
        print("IF at #%s" % level)
        
        thenPart = getattr(node, "thenPart", None)
        elsePart = getattr(node, "elsePart", None)

        # Optimize using "AND" or "OR" operators
        # Combine multiple semicolon statements into one semicolon statement using an "comma" expression
        thenPart = combineToCommaExpression(thenPart)
        elsePart = combineToCommaExpression(elsePart)
        
        # Optimize using hook operator
        if thenPart and elsePart:
            if thenPart.type == "return" and elsePart.type == "return":
                # Combine return statement
                replacement = createReturn(createHook(node.condition, thenPart.value, elsePart.value))
                node.parent.replace(node, replacement)
        
            elif thenPart.type == "semicolon" and elsePart.type == "semicolon":
                # Combine two assignments or expressions
                thenExpression = getattr(thenPart, "expression", None)
                elseExpression = getattr(elsePart, "expression", None)
                if thenExpression and elseExpression:
                    replacement = combineAssignments(node.condition, thenExpression, elseExpression) or combineExpressions(node.condition, thenExpression, elseExpression)
                    if replacement:
                        node.parent.replace(node, replacement)



        
def combineToCommaExpression(node):
    if node.type != "block":
        return node
        
    for child in node:
        if child.type != "semicolon":
            return node
            
    comma = Node(node.tokenizer, "comma")    
    comma.parenthesized = True
    
    for child in node:
        # Ignore empty semicolons
        if hasattr(child, "expression"):
            comma.append(child.expression)
            
    semicolon = Node(node.tokenizer, "semicolon")
    semicolon.append(comma, "expression")
    
    node.parent.replace(node, semicolon)
    
    return semicolon
        

def containsIf(node):
    """ helper for block removal optimization """
    if node.type == "if":
        return True

    for child in node:
        if containsIf(child):
            return True

    return False


def combineAssignments(condition, thenExpression, elseExpression):
    if thenExpression.type == "assign" and elseExpression.type == "assign":
        operator = getattr(thenExpression, "assignOp", None)
        if operator == getattr(elseExpression, "assignOp", None):
            if compress(thenExpression[0]) == compress(elseExpression[0]):
                hook = createHook(condition, thenExpression[1], elseExpression[1])
                thenExpression.append(hook)
                return thenExpression.parent


def combineExpressions(condition, thenExpression, elseExpression):
    hook = createHook(condition, thenExpression, elseExpression)
    semicolon = Node(condition.tokenizer, "semicolon")
    semicolon.append(hook, "expression")
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
    