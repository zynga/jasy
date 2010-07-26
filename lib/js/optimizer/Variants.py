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
        condition = node.condition
        if condition.type == "false":
            if hasattr(node, "elsePart"):
                node.parent.replace(node, node.elsePart)
            else:
                node.parent.remove(node)
            
        elif condition.type == "true":
            node.parent.replace(node, node.thenPart)
            print node.parent
    
    
    # Optimize block statements
    if node.type == "block" and len(node) == 1:
        node.parent.replace(node, node[0])
    
    
    
    
    
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

    