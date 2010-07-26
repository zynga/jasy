#
# JavaScript Tools - Optimizer for variants (pre-compiler directives)
# Copyright 2010 Sebastian Werner
#

import json
from js.Tokenizer import Tokenizer
from js.Parser import parseExpression

#
# Public API
#

# First step: replaces all occourences with incoming values
def replace(node, data):
    if node.type == "dot":
        assembled = __assembleDot(node)
        if assembled and assembled in data:
            # print "Replace %s => %s" % (assembled, data[assembled])
            repl = parseExpression(Tokenizer(data[assembled], None))
            node.parent.replace(node, repl)            
    
    for child in node:
        replace(child, data)
        

# Second step: Reprocesses JavaScript to remove dead paths
def optimize(node):
    # Process from inside to outside
    for child in node:
        optimize(child)
        
    # Optimize if cases
    if node.type == "if":
        check = __checkCondition(node.condition)
        if check is True:
            node.parent.replace(node, node.thenPart)
        elif check is False:
            if hasattr(node, "elsePart"):
                node.parent.replace(node, node.elsePart)
            else:
                node.parent.remove(node)
    
    # Optimize hook statement
    if node.type == "hook":
        check = __checkCondition(node[0])
        if check is True:
            node.parent.replace(node, node[1])
        elif check is False:
            node.parent.replace(node, node[2])
            
    # Optimize block statements
    if node.type == "block" and len(node) == 1:
        node.parent.replace(node, node[0])
    
    
    
    
    
    
#
# Implementation
#

def __checkCondition(node):
    if node.type == "false":
        return False
    elif node.type == "true":
        return True
    elif node.type == "eq":
        return __compareNodes(node[0], node[1])
    elif node.type == "ne":
        return __invertResult(__compareNodes(node[0], node[1]))
    elif node.type == "not":
        return __invertResult(__checkCondition(node[0]))

    return None
    
    
def __invertResult(result):
    if type(result) == bool:
        return not result
    return result
    
    
def __compareNodes(a, b):
    if a.type == b.type:
        if a.type in ("string","number"):
            return a.value == b.value
        elif a.type == "true":
            return True
        elif b.type == "false":
            return False    
    elif a.type in ("true","false") and b.type in ("true","false"):
        return False
        
    return None


def __assembleDot(node, result=None):
    if result == None:
        result = []
        
    for child in node:
        if child.type == "identifier":
            result.append(child.value)
        elif child.type == "dot":
            __assembleDot(child, result)
        else:
            print "Unsupported type: %s" % child.type
            
    return ".".join(result)

    