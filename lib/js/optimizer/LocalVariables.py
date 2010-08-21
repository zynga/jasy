#
# JavaScript Tools - Optimizer for local variable names
# Copyright 2010 Sebastian Werner
#

from js.Tokenizer import keywords
from js.Util import baseEncode
from copy import copy

__all__ = ["optimize"]

empty = ("null", "this", "true", "false", "number", "string", "regexp")
debug = True


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
        
    for child in node:
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
    if parent and parent.type == "function" and hasattr(parent, "params"):
        for i, param in enumerate(parent.params):
            pos, translate[param.value] = __encode(pos)
            param.value = translate[param.value]

    for name in node.variables:
        pos, translate[name] = __encode(pos)
        print "Variable: %s => %s" % (name, translate[name])
        
    __optimizeNode(node, translate, True)
    return pos


def __optimizeNode(node, translate, first=False):
    nodeType = node.type

    # function names
    if nodeType == "function" and hasattr(node, "name") and node.name in translate:
        if debug: print " - Function Name: %s => %s" % (node.name, translate[node.name])
        node.name = translate[node.name]

    # declarations
    elif nodeType == "declaration":
        name = getattr(node, "name", None)
        if name in translate:
            if debug: print " - Variable Declaration: %s => %s" % (node.name, translate[node.name])
            node.name = translate[node.name]
        else:
            names = getattr(node, "names", None)
            for child in names:
                if child.value in translate:
                    if debug: print " - Variable Destructed Declaration: %s => %s" % (child.value, translate[child.value])
                    child.value = translate[child.value]

    # every scope relevant identifier (e.g. first identifier for dot-operator, etc.)
    elif nodeType == "identifier" and node.value in translate and getattr(node, "scope", False):
        if debug: print " - Scope Variable: %s => %s" % (node.value, translate[node.value])
        node.value = translate[node.value]    

    # Don't recurse into types which never have children
    # Don't recurse into closures. These are processed by __optimizeScope later
    if not nodeType in empty and (first or not nodeType == "script"):
        for child in node:
            __optimizeNode(child, translate, False)
