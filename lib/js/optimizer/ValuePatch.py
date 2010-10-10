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
                
            # qooxdoo specific: qx.core.Variant.isSet(value, expected)
            elif assembled == "qx.core.Variant.isSet" and node.parent.type == "call":
                callNode = node.parent
                params = callNode[1]
                replacement = permutation.get(params[0].value)
                if replacement:
                    parsedReplacement = parseExpression(replacement)
                    if parsedReplacement.value == params[1].value:
                        replacementNode = parseExpression("true")
                    else:
                        replacementNode = parseExpression("false")
                    
                    callNode.parent.replace(callNode, replacementNode)
                    modified = True
    
            # qooxdoo specific: qx.core.Variant.select(value, map)
            elif assembled == "qx.core.Variant.select" and node.parent.type == "call":
                callNode = node.parent
                params = callNode[1]
                replacement = permutation.get(params[0].value)
                if replacement:
                    parsedReplacement = parseExpression(replacement)
                    targetIdentifier = parsedReplacement.value

                    # Directly try to find matching identifier in second param (map)
                    objectInit = params[1]
                    if objectInit.type == "object_init":
                        for propertyInit in objectInit:
                            if propertyInit[0].value == targetIdentifier:
                                callNode.parent.replace(callNode, propertyInit[1])
                                break
    
    
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

    