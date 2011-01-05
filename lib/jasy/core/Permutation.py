#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import json, logging, binascii
from jasy.tokenizer.Tokenizer import Tokenizer
from jasy.parser.Parser import parseExpression


    

class Permutation:
    def __init__(self, combination):
        self.__combination = combination
        self.__key = self.__buildKey(combination)
        
    def __buildKey(self, combination):
        result = []
        for key in sorted(combination):
            result.append("%s:%s" % (key, combination[key]))

        return ";".join(result)
            
    def has(self, variant):
        return variant in self.__combination
        
    def get(self, variant):
        if variant in self.__combination:
            return self.__combination[variant]
            
        return None
        
    def getKey(self):
        return self.__key
        
        
    def getChecksum(self):
        return binascii.crc32(self.__key.encode("ascii"))
        
        
    # Map Python built-ins
    __repr__ = getKey
    __str__ = getKey
    
    
    #
    # Patch API
    #

    def patch(self, node):
        """ Replaces all occourences with incoming values """
        modified = False

        # Assemble dot operators
        if node.type == "dot" and node.parent.type != "dot":
            assembled = self.__assembleDot(node)
            if assembled:
                replacement = self.get(assembled)
                
                # constants
                if replacement:
                    repl = parseExpression(replacement)
                    node.parent.replace(node, repl)            
                    modified = True

                # qooxdoo specific: qx.core.Variant.isSet(key, expected)
                elif assembled == "qx.core.Variant.isSet" and node.parent.type == "call":
                    callNode = node.parent
                    params = callNode[1]
                    replacement = self.get(params[0].value)
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
                    replacement = self.get(params[0].value)
                    if replacement:
                        replacementNode = parseExpression(replacement)
                        callNode.parent.replace(callNode, replacementNode)
                        modified = True 

                # qooxdoo specific: qx.core.Variant.select(key, map)
                elif assembled == "qx.core.Variant.select" and node.parent.type == "call":
                    callNode = node.parent
                    params = callNode[1]
                    replacement = self.get(params[0].value)
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
                    replacement = self.get(params[0].value)

                    # Only boolean replacements allowed
                    if replacement in ("true","false"):
                        replacementNode = parseExpression(replacement)
                        node.parent.replace(node, replacementNode)

        # Process children
        for child in reversed(node):
            if child != None:
                if self.patch(child):
                    modified = True

        return modified


    def __assembleDot(self, node, result=None):
        if result == None:
            result = []

        for child in node:
            if child.type == "identifier":
                result.append(child.value)
            elif child.type == "dot":
                self.__assembleDot(child, result)
            else:
                return None

        return ".".join(result)    