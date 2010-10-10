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
                repl = parseExpression(replacement)
                node.parent.replace(node, repl)            
                modified = True
                
            elif assembled == "qx.core.Variant.isSet" and node.parent.type == "call":
                call = node.parent
                params = call[1]
                replacement = permutation.get(params[0].value)
                if replacement:
                    repl = parseExpression("true" if replacement == params[1].value else "false")
                    call.parent.replace(call, repl)
                    modified = True
    
    
    for child in node:
        if patch(child, permutation):
            modified = True
            
    return modified
        

    
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
            return None
            
    return ".".join(result)

    