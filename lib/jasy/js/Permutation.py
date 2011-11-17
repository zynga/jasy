#
# Jasy - Web Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import logging, binascii, zlib, json
from jasy.js.tokenize.Tokenizer import Tokenizer
from jasy.js.parse.Parser import parseExpression

__all__ = ["Permutation", "getKeys"]


# core.Env.isSet(key, expected?)
# core.Env.getValue(key)
# core.Env.select(key, map)
__dotcalls = ("core.Env.isSet", "core.Env.getValue", "core.Env.select")

# hasjs specific: has(key)
__globalcalls = ("has")

def testNode(node):
    # Assemble dot operators
    if node.type == "dot" and node.parent.type == "call" and assembleDot(node) in __dotcalls:
        return "dotcall"

    # Global function calls
    elif node.type == "call" and node[0].type == "identifier" and node[0].value in __globalcalls:
        return "globalcall"


def assembleDot(node, result=None):
    if result == None:
        result = []

    for child in node:
        if child.type == "identifier":
            result.append(child.value)
        elif child.type == "dot":
            assembleDot(child, result)
        else:
            return None

    return ".".join(result)


def getKeys(node, keys=None):
    if keys is None:
        keys = set()

    result = testNode(node)
    if result:
        if result == "dotcall":
            keys.add(node.parent[1][0].value)
        elif result == "globalcall":
            keys.add(node[1][0].value)
    
    # Process children
    for child in reversed(node):
        if child != None:
            getKeys(child, keys)
    
    return keys


PermutationCache = {}

def getPermutation(combination):
    """ Small wrapper to omit double creation of identical permutations in filter() method """
    
    key = str(combination)
    if key in PermutationCache:
        return PermutationCache[key]
        
    PermutationCache[key] = Permutation(combination)
    return PermutationCache[key]
    



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
        
        
    def getJSValue(self, key):
        """ Returns the code equivalent of the stored value for the given key """
        
        code = self.get(key)
        
        if code is None:
            pass
        elif code is True:
            code = "true"
        elif code is False:
            code = "false"
        elif type(code) is str and code.startswith("{") and code.endswith("}"):
            pass
        elif type(code) is str and code.startswith("[") and code.endswith("]"):
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
    # Filter API
    #
    
    def filter(self, available):
        filtered = {}
        for key in self.__combination:
            if key in available:
                filtered[key] = self.__combination[key]
        
        return getPermutation(filtered)
    
    
    #
    # Patch API
    #
    
    def patch(self, node):
        """ Replaces all occourences with incoming values """

        modified = False
        result = testNode(node)
        
        if result == "dotcall":
            assembled = assembleDot(node)
            
            # Permutation.getValue(key)
            if assembled == "core.Env.getValue" and node.parent.type == "call":
                callNode = node.parent
                params = callNode[1]
                replacement = self.getJSValue(params[0].value)
                if replacement:
                    replacementNode = parseExpression(replacement)
                    callNode.parent.replace(callNode, replacementNode)
                    modified = True            
            
            # Permutation.isSet(key, expected)
            # also supports boolean like: Permutation.isSet(key)
            elif assembled == "core.Env.isSet" and node.parent.type == "call":
                callNode = node.parent
                params = callNode[1]
                name = params[0].value
                replacement = self.getJSValue(name)
                
                if replacement != None:
                    # Auto-fill second parameter with boolean "true"
                    expected = params[1] if len(params) > 1 else parseExpression("true")

                    if expected.type in ("string", "number", "true", "false"):
                        parsedReplacement = parseExpression(replacement)
                        expectedValue = getattr(expected, "value", None)
                        
                        if expectedValue is not None:
                            if getattr(parsedReplacement, "value", None) is not None:
                                replacementResult = parsedReplacement.value in str(expected.value).split("|")
                            else:
                                replacementResult = parsedReplacement.type in str(expected.value).split("|")
                        else:
                            replacementResult = parsedReplacement.type == expected.type

                        # Do actual replacement
                        replacementNode = parseExpression("true" if replacementResult else "false")
                        callNode.parent.replace(callNode, replacementNode)
                        modified = True
            
            # Permutation.select(key, map)
            elif assembled == "core.Env.select" and node.parent.type == "call":
                callNode = node.parent
                params = callNode[1]
                replacement = self.getJSValue(params[0].value)
                if replacement:
                    parsedReplacement = parseExpression(replacement)
                    if parsedReplacement.type != "string":
                        raise Exception("core.Env.select requires that the given replacement is of type string.")

                    # Directly try to find matching identifier in second param (map)
                    objectInit = params[1]
                    if objectInit.type == "object_init":
                        fallbackNode = None
                        for propertyInit in objectInit:
                            if propertyInit[0].value == "default":
                                fallbackNode = propertyInit[1]

                            elif parsedReplacement.value in str(propertyInit[0].value).split("|"):
                                callNode.parent.replace(callNode, propertyInit[1])
                                modified = True
                                break

                        if not modified and fallbackNode is not None:
                            callNode.parent.replace(callNode, fallbackNode)
                            modified = True
                            
            
        elif result == "globalcall":
            params = node[1]

            # has.js requires that there is exactly one param with a string value
            if len(params) == 1 and params[0].type == "string":
                replacement = self.getJSValue(params[0].value)

                # Only boolean replacements allowed
                if replacement in ("true", "false"):
                    replacementNode = parseExpression(replacement)
                    node.parent.replace(node, replacementNode)


        # Process children
        for child in reversed(node):
            if child != None:
                if self.patch(child):
                    modified = True

        return modified  