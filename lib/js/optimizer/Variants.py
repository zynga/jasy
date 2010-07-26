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
            print "Replace %s => %s" % (assembled, data[assembled])
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
        if check is False:
            if hasattr(node, "elsePart"):
                node.parent.replace(node, node.elsePart)
            else:
                node.parent.remove(node)
            
        elif check is True:
            node.parent.replace(node, node.thenPart)
            
    

            
    
    # Optimize block statements
    if node.type == "block" and len(node) == 1:
        node.parent.replace(node, node[0])
    
    
    
def __checkCondition(node):
    if node.type == "false":
        return False
    
    elif node.type == "true":
        return True

    # Equal operator
    elif node.type == "eq" and node[0].type == node[1].type:
        if node[0].type in ("string","number"):
            return node[0].value == node[1].value
        elif node[0].type == "true":
            return True
        elif node[0].type == "false":
            return False    

    # Not equal operator
    elif node.type == "ne" and node[0].type == node[1].type:
        if node[0].type in ("string","number"):
            return node[0].value != node[1].value
        elif node[0].type == "true":
            return False
        elif node[0].type == "false":
            return True    

    # Inverted 
    elif node.type == "not":
        innerResult = __checkCondition(node[0])
        if type(innerResult) == bool:
            return not innerResult

        
    return None
    
    
    
    
#
# Implementation
#

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

    