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

def optimize(node, data):
    if node.type == "dot":
        assembled = __assembleDot(node)
        if assembled and assembled in data:
            print "Found %s => %s" % (assembled, data[assembled])
            __replace(node, data[assembled])
    
    for child in node:
        optimize(child, data)
    
    
    
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
    
    
def __replace(node, expression):
    repl = parseExpression(Tokenizer(expression, None))
    return node.parent.replace(node, repl)
    