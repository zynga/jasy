#
# JavaScript Tools - Optimizes if-statements for reduced compression size
# Copyright 2010 Sebastian Werner
#

from js.parser.Node import Node
from js.Compressor import compress
import logging

def optimize(node):
    # Process from inside to outside
    for child in node:
        optimize(child)
        
    # Unwrap blocks
    if node.type == "block":
        if len(node) == 0:
            print("Replace empty block")
            node.parent.replace(node, Node(node.tokenizer, "semicolon"))
        elif len(node) == 1:
            print("Unwrap block")
            node.parent.replace(node, node[0])
            
    # Process all if-statements
    if node.type == "if":
        thenPart = getattr(node, "thenPart", None)
        elsePart = getattr(node, "elsePart", None)
        
        if thenPart.type == "return" and elsePart.type == "return":
            # Combine return statement
            replacement = createReturn(createHook(node.condition, thenPart.value, elsePart.value))
            node.parent.replace(node, replacement)
        
        elif thenPart.type == "semicolon" and elsePart.type == "semicolon":
            # Combine two expressions
            thenExpression = getattr(thenPart, "expression", None)
            elseExpression = getattr(elsePart, "expression", None)
            if thenExpression and elseExpression:
                replacement = combineAssignments(node.condition, thenExpression, elseExpression) or combineExpressions(node.condition, thenExpression, elseExpression)
                if replacement:
                    node.parent.replace(node, replacement)



        




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
    