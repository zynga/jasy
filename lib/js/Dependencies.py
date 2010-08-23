#
# JavaScript Tools - Dependency Analyser Module
# Copyright 2010 Sebastian Werner
#

from copy import copy

def deps(node):
    names = {}
    declared = {}
    namespaced = {}
    __inspect(node, declared, names, namespaced)
    
    return names, namespaced
    
    
def __inspect(node, declared, names, namespaced):
    variables = getattr(node, "variables", None)
    functions = getattr(node, "functions", None)
    
    # Protect outer from changes
    if variables or functions:
        declared = copy(declared)

        if variables:
            for item in variables:
                declared[item] = True
    
        if functions:
            for item in functions:
                declared[item] = True

    # Detect namespaced identifiers
    if node.type == "identifier" and not node.value in declared and getattr(node, "scope", False) and node.parent.type == "dot":
        name = __combineDot(node)
        if "." in name:
            namespaced[name] = True

    # Filter uses by known items
    uses = getattr(node, "uses", None)
    if uses:
        for item in uses:
            if not item in declared:
                names[item] = True
        
    # Go into recursion
    for child in node:
        __inspect(child, declared, names, namespaced)
        
    
def __combineDot(node):
    result = node.value
    
    # Don't go deeper if name starts with a upper-case
    # This is normally a hint for a class name.
    if result[0].upper() == result[0]:
        return result
    
    parent = node.parent
    if parent.type == "dot":
        if parent[0] is node:
            result += "." + __combineDot(parent[1])
        else:
            parentParent = parent.parent
            if parentParent.type == "dot" and parentParent[0] is parent:
                result += "." + __combineDot(parentParent[1])
            
    return result
    