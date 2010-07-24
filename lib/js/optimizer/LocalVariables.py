#
# JavaScript Tools - Compressor Module
# Copyright 2010 Sebastian Werner
#

from js.Tokenizer import keywords
from js.Util import *
from copy import copy

__all__ = ["optimize"]

empty = ("null", "this", "true", "false", "number", "string", "regexp")
debug = False


#
# Public API
#

def optimize(node, translate=None, pos=0):
    if node.type == "script":
        # before going into a function scope, make a copy of the parent scope
        # to not modify the parent scope and badly influence the variable length
        # of other child scopes
        translate = {} if not translate else copy(translate)
        pos = __optimizeScope(node, translate, pos)
        
    for child in getChildren(node):
        optimize(child, translate, pos)
      


#
# Implementation
#

def __encode(pos):
    repl = None
    while repl == None or repl in keywords:
        repl = baseEncode(pos)
        pos += 1
        
    return pos, repl
        
      
def __optimizeScope(node, translate, pos):
    if debug: print "Optimize scope at line: %s" % node.line
    
    parent = getattr(node, "parent", None)
    if parent and parent.type == "function":
        for i, param in enumerate(parent.params):
            pos, translate[param] = __encode(pos)
            parent.params[i] = translate[param]

    for name in node.declares:
        if not name in translate:
            pos, translate[name] = __encode(pos)
        
    __optimizeNode(node, translate, True)
    return pos


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
        elif getattr(node, "scope", False):
            if debug: print " - Scope Variable: %s => %s" % (node.value, translate[node.value])
            node.value = translate[node.value]    

    # Don't recurse into types which never have children
    # Don't recurse into closures. These are processed by __optimizeScope later
    if not nodeType in empty and (first or not nodeType == "script"):
        for child in getChildren(node):
            __optimizeNode(child, translate, False)
