#
# JavaScript Tools - Scanner for variables
# Copyright 2010 Sebastian Werner
#

import logging

__all__ = ["scan"]

def scan(node):
    return __scanScope(node)



#
# Implementation
#

def __scanNode(node, declared, used):
    """ Scans nodes recursively and collects all variables which are declared and used. """
    
    def increment(name, by=1):
        """ Small helper so simplify adding variables to "used" dict """
        if not name in used:
            used[name] = by
        else:
            used[name] += by
    
    if node.type == "function":
        functionName = getattr(node, "name", None)
        if functionName:
            declared.add(functionName)
    
    elif node.type == "declaration":
        varName = getattr(node, "name", None)
        if varName != None:
            declared.add(varName)
            
            # If the variable is used as a iterator, we need to add it to the use counter as well
            if getattr(node.parent, "rel", None) == "iterator":
                increment(varName)
            
        else:
            # JS 1.7 Destructing Expression
            varNames = node.names
            for identifier in node.names:
                declared.add(identifier.value)
                
            # If the variable is used as a iterator, we need to add it to the use counter as well
            if getattr(node.parent, "rel", None) == "iterator":
                for identifier in node.names:
                    increment(identifier.value)
            
    elif node.type == "identifier":
        # Ignore parameter names (of inner functions, these are handled by __scanScope)
        if node.parent.type == "list" and getattr(node.parent, "rel", None) == "params":
            pass
        
        # Ignore property initialization names
        elif node.parent.type == "property_init" and node.parent[0] == node:
            pass
            
        # Ignore non first identifiers in dot-chains
        elif node.parent.type != "dot" or node.parent.index(node) == 0:
            increment(node.value)
                
    # Treat exception variables in catch blocks like declared
    elif node.type == "block" and node.parent.type == "catch":
        declared.add(node.parent.exception.value)                
    
    if node.type == "script":
        shared = __scanScope(node)
        for name in shared:
            increment(name, shared[name])
                
    else:
        for child in node:
            # None children are allowed sometimes e.g. during array_init like [1,2,,,7,8]
            if child != None:
                __scanNode(child, declared, used)



def __scanScope(node):
    """ Scans a scope and collects statistics on variable declaration and usage """
    
    # Add params to declaration list
    params = __getParams(node)

    # Scan children
    declared = set()
    used = {}
    for child in node:
        __scanNode(child, declared, used)
    
    # Look for used varibles which have not been defined
    # Might be a part of a closure or just a mistake
    shared = {}
    for name in used:
        if name not in declared and name not in params and name != "arguments":
            shared[name] = used[name]
            
    # Look for variables which have been defined, but not used.
    unused = set()
    for name in params:
        if not name in used:
            unused.add(name)
    for name in declared:
        if not name in used:
            unused.add(name)





    print("Quit Scope [Line:%s]" % node.line)
    print("- Params:", params)
    print("- Declared:", declared)
    print("- Used:", used)
    print("- Shared:", shared)
    print("- Unused:", unused)
    
    node.params = params
    node.declared = declared
    node.used = used
    node.shared = shared
    node.unused = unused
    
    return shared
    
    
    
def __getParams(node):
    """ Adds all param names from outer function to the definition list """

    params = set()
    rel = getattr(node, "rel", None)
    if rel == "body" and node.parent.type == "function":
        paramList = getattr(node.parent, "params", None)
        if paramList:
            for paramIdentifier in paramList:
                params.add(paramIdentifier.value)    
                
    return params
    