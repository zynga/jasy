#
# JavaScript Tools - Compressor Module
# Copyright 2010 Sebastian Werner
#

from js.Tokenizer import keywords
from js.Util import *
from copy import copy

__all__ = ["optimize"]

empty = ("null", "this", "true", "false", "number", "string", "regexp")
debug = True

def optimize(node, translate=None):
    if not translate:
        translate = {}
    
    if node.type == "script":
        translate = copy(translate)
        __optimizeScope(node, translate)
        
    for child in getChildren(node):
        optimize(child, translate)
        
      
def __optimizeScope(node, translate):
    if debug: print "Optimize scope at line: %s" % node.line
    
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
        
    __optimizeNode(node, translate, True)


def __optimizeNode(node, translate, first=False):
    nodeType = node.type

    if nodeType == "function" and hasattr(node, "name") and node.name in translate:
        if debug: print " - Function Name: %s => %s" % (node.name, translate[node.name])
        node.name = translate[node.name]

    elif nodeType == "identifier" and node.value in translate:
        # in a variable declaration
        if hasattr(node, "name"):
            if debug: print " - Variable Declaration: %s => %s" % (node.value, translate[node.value])
            node.name = node.value = translate[node.value]

        # every scope relevant identifier (e.g. first identifier for dot-operator, etc.)
        elif getattr(node, "scope", False) == True:
            if debug: print " - Scope Variable: %s => %s" % (node.value, translate[node.value])
            node.value = translate[node.value]    

    # Don't recurse into types which never have children
    # Don't recurse into closures. These are processed by __optimizeScope later
    if not nodeType in empty and (first or not nodeType == "script"):
        for child in getChildren(node):
            __optimizeNode(child, translate, False)
