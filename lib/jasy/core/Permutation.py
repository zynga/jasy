#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging, binascii, zlib
from jasy.tokenizer.Tokenizer import Tokenizer
from jasy.parser.Parser import parseExpression

class Permutation:
    def __init__(self, combination):
        self.__combination = combination
        self.__key = self.__buildKey(combination)
        
        # Convert to same value as in JavaScript
        # Python 3 returns the unsigned value for better compliance with the standard.
        # http://bugs.python.org/issue1202
        # checksum = binascii.crc32(self.__key.encode("ascii"))
        checksum = zlib.adler32(self.__key.encode("ascii"))
        checksum = checksum - ((checksum & 0x80000000) <<1)
        
        if checksum < 0:
            checksum = "a%s" % hex(abs(checksum))[2:]
        else:
            checksum = "b%s" % hex(checksum)[2:]
            
        self.__checksum = checksum
        
        
    def __buildKey(self, combination):
        """ Computes the permutations' key based on the given combination """
        
        result = []
        for key in sorted(combination):
            value = combination[key]
            
            # Basic translation like in JavaScript frontend
            # We don't have a special threadment for strings, numbers, etc.
            if value == True:
                value = "true"
            elif value == False:
                value = "false"
            elif value == None:
                value = "null"
            
            result.append("%s:%s" % (key, value))

        return ";".join(result)
        
            
    def has(self, key):
        """ Whether the permutation holds a value for the given key """
        
        return key in self.__combination
        
        
    def get(self, key):
        """ Returns the value of the given key in the permutation """
        
        if key in self.__combination:
            return self.__combination[key]
            
        return None
        
        
    def getCode(self, key):
        """ Returns the code equivalent of the stored value for the given key """
        
        code = self.get(key)
        if code == None:
            return code
        
        if code is True:
            code = "true"
        elif code is False:
            code = "false"
        elif code.startswith("{") and code.endswith("}"):
            pass
        elif code.startswith("[") and code.endswith("]"):
            pass
        else:
            code = "\"%s\"" % code
            
        return code
        
        
    def getKey(self):
        """ Returns the computed key from this permutation """
        
        return self.__key
        
        
    def getChecksum(self):
        """ Returns the computed checksum based on the key of this permutation """
        
        return self.__checksum
        
        
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
                replacement = self.getCode(assembled)
                
                # constants
                if replacement:
                    repl = parseExpression(replacement)
                    node.parent.replace(node, repl)            
                    modified = True

                # qooxdoo specific: qx.core.Variant.isSet(key, expected)
                elif assembled == "qx.core.Variant.isSet" and node.parent.type == "call":
                    callNode = node.parent
                    params = callNode[1]
                    replacement = self.getCode(params[0].value)
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
                    replacement = self.getCode(params[0].value)
                    if replacement:
                        replacementNode = parseExpression(replacement)
                        callNode.parent.replace(callNode, replacementNode)
                        modified = True 

                # qooxdoo specific: qx.core.Variant.select(key, map)
                elif assembled == "qx.core.Variant.select" and node.parent.type == "call":
                    callNode = node.parent
                    params = callNode[1]
                    replacement = self.getCode(params[0].value)
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
                    replacement = self.getCode(params[0].value)

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