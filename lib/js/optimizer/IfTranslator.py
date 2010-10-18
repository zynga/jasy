#
# JavaScript Tools - Optimizes if-statements for reduced compression size
# Copyright 2010 Sebastian Werner
#

from js.parser.Node import Node
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
            ret = createReturn(createHook(node.condition, thenPart.value, elsePart.value))
            node.parent.replace(node, ret)









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
            
    
    