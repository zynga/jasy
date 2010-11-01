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
    
    # Assemble dot operators
    if node.type == "dot" and node.parent.type != "dot":
        assembled = __assembleDot(node)
        if assembled:
            replacement = permutation.get(assembled)
            if replacement:
                repl = parseExpression(replacement)
                node.parent.replace(node, repl)            
                modified = True
                
            # qooxdoo specific: qx.core.Variant.isSet(key, expected)
            elif assembled == "qx.core.Variant.isSet" and node.parent.type == "call":
                callNode = node.parent
                params = callNode[1]
                replacement = permutation.get(params[0].value)
                if replacement:
                    targetIdentifier = parseExpression(replacement).value
                    if targetIdentifier in str(params[1].value).split("|"):
                        replacementNode = parseExpression("true")
                    else:
                        replacementNode = parseExpression("false")
                    
                    callNode.parent.replace(callNode, replacementNode)
                    modified = True
                    
            # qooxdoo specific: qx.core.Settings.get(key)
            elif assembled == "qx.core.Setting.get" and node.parent.type == "call":
                callNode = node.parent
                params = callNode[1]
                replacement = permutation.get(params[0].value)
                if replacement:
                    replacementNode = parseExpression(replacement)
                    callNode.parent.replace(callNode, replacementNode)
                    modified = True 
    
            # qooxdoo specific: qx.core.Variant.select(key, map)
            elif assembled == "qx.core.Variant.select" and node.parent.type == "call":
                callNode = node.parent
                params = callNode[1]
                replacement = permutation.get(params[0].value)
                if replacement:
                    targetIdentifier = parseExpression(replacement).value

                    # Directly try to find matching identifier in second param (map)
                    objectInit = params[1]
                    if objectInit.type == "object_init":
                        fallbackNode = None
                        for propertyInit in objectInit:
                            if propertyInit[0].value == "default":
                                fallbackNode = propertyInit[1]
                                
                            elif targetIdentifier in str(propertyInit[0].value).split("|"):
                                callNode.parent.replace(callNode, propertyInit[1])
                                modified = True
                                break
                                
                        if not modified and fallbackNode is not None:
                            callNode.parent.replace(callNode, fallbackNode)
                            modified = True
    
    # Global function calls
    elif node.type == "call" and node[0].type == "identifier":
        
        # has.js specific: has("function-bind")
        if node[0].value == "has":
            params = node[1]
            
            # has.js requires that there is exactly one param with a string value
            if len(params) == 1 and params[0].type == "string":
                replacement = permutation.get(params[0].value)
                
                # Only boolean replacements allowed
                if replacement in ("true","false"):
                    replacementNode = parseExpression(replacement)
                    node.parent.replace(node, replacementNode)

    # Process children
    for child in reversed(node):
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

    