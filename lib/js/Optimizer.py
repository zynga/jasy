#
# JavaScript Tools - Compressor Module
# Copyright 2010 Sebastian Werner
#

from js.Tokenizer import keywords
from js.Util import *

__all__ = ["optimize"]

empty = ("null", "this", "true", "false", "identifier", "number", "string", "regexp")


def optimize(node, translate=None):
    if not translate:
        translate = {}
    
    if node.type == "script":
        __optimizeScope(node, translate)
        
    for child in getChildren(node):
        optimize(child, translate)
        
      
def __optimizeScope(node, translate):
    pos = len(translate)
    if node.type == "function":
        for i, param in enumerate(node.params):
            node.params[i] = translate[param] = baseEncode(pos)
            pos += 1
        body = node.body
    else:
        body = node

    for item in body.functions + body.variables:
        if not item.name in translate:
            translate[item.name] = baseEncode(pos)
            pos += 1
        
    __optimizeNode(body, translate)


def __optimizeNode(node, translate):
    nodeType = node.type

    if nodeType == "function" and hasattr(node, "name") and node.name in translate:
        node.name = translate[node.name]

    elif nodeType == "identifier" and node.value in translate:
        # in a variable declaration
        if hasattr(node, "name"):
            node.name = node.value = translate[node.value]

        # every scope relevant identifier (e.g. first identifier for dot-operator, etc.)
        elif getattr(node, "scope", False):
            node.value = translate[node.value]    

    if nodeType not in empty:
        for child in getChildren(node):
            __optimizeNode(child, translate)