#
# JavaScript Tools - Compressor Module
# Copyright 2010 Sebastian Werner
#

from js.Tokenizer import keywords
from js.Util import *
from copy import copy


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
    parent = getattr(node, "parent", None)
    if parent:
        for i, param in enumerate(parent.params):
            parent.params[i] = translate[param] = baseEncode(pos)
            pos += 1

    for item in node.functions + node.variables:
        if not item.name in translate:
            translate[item.name] = baseEncode(pos)
            pos += 1
        
    __optimizeNode(node, translate)


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