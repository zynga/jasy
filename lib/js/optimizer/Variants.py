#
# JavaScript Tools - Optimizer for variants (pre-compiler directives)
# Copyright 2010 Sebastian Werner
#

import json, logging
from js.Tokenizer import Tokenizer
from js.Parser import parseExpression

#
# Public API
#

# First step: replaces all occourences with incoming values
def replace(node, permutation):
    modified = False
    
    if node.type == "dot":
        assembled = __assembleDot(node)
        if assembled:
            replacement = permutation.get(assembled)
            if replacement:
                print("Replace %s => %s" % (assembled, replacement))
                repl = parseExpression(Tokenizer(replacement, None))
                node.parent.replace(node, repl)            
                modified = True
    
    for child in node:
        if replace(child, permutation):
            modified = True
            
    return modified
        

# Second step: Reprocesses JavaScript to remove dead paths
def optimize(node):
    optimized = False
    
    # Process from inside to outside
    for child in node:
        if optimize(child):
            optimized = True
        
    # Optimize if cases
    if node.type == "if":
        check = __checkCondition(node.condition)
        if check is not None:
            optimized = True
            
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
        if check is not None:
            optimized = True
        
            if check is True:
                node.parent.replace(node, node[1])
            elif check is False:
                node.parent.replace(node, node[2])
            
    # Optimize block statements
    if node.type == "block" and len(node) == 1:
        optimized = True
        node.parent.replace(node, node[0])
    
    return optimized
    
    
    
    
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
            return None
            
    return ".".join(result)

    