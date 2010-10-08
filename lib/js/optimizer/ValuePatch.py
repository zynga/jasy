#
# JavaScript Tools - Patches dynamic values as static values into the code
# Copyright 2010 Sebastian Werner
#

import json, logging
from js.tokenizer.Tokenizer import Tokenizer
from js.parser.Parser import parseExpression

#
# Public API
#

def patch(node, permutation):
    """ Replaces all occourences with incoming values """
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
        if patch(child, permutation):
            modified = True
            
    return modified
        

    
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

    