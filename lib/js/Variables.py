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

def __scanNode(node, declares, uses):
    if node.type == "function":
        functionName = getattr(node, "name", None)
        if functionName:
            declares.add(functionName)
    
    elif node.type == "declaration":
        varName = getattr(node, "name", None)
        if varName != None:
            declares.add(varName)
        else:
            # JS 1.7 Destructing Expression
            varNames = node.names
            for identifier in node.names:
                declares.add(identifier.value)
            
    elif node.type == "identifier":
        # Ignore parameter names (of inner functions, these are handled by __scanScope)
        if node.parent.type == "list" and getattr(node.parent, "rel", None) == "params":
            pass
        
        # Ignore property initialization names
        elif node.parent.type == "property_init" and node.parent[0] == node:
            pass
            
        # Ignore non first identifiers in dot-chains
        elif node.parent.type != "dot" or node.parent.index(node) == 0:
            if node.value in uses:
                uses[node.value] += 1
            else:
                uses[node.value] = 1
                
    # Treat exception variables in catch blocks like declarations
    elif node.type == "block" and node.parent.type == "catch":
        declares.add(node.parent.exception.value)                
    
    if node.type == "script":
        childUndefines = __scanScope(node)
        for name in childUndefines:
            if name in uses:
                uses[name] += childUndefines[name]
            else:
                uses[name] = childUndefines[name]
                
    else:
        for child in node:
            # None children are allowed sometimes e.g. during array_init like [1,2,,,7,8]
            if child != None:
                __scanNode(child, declares, uses)



def __scanScope(node):
    defines = set()
    uses = {}
    
    # Add params to declaration list
    __addParams(node, defines)

    # Process children
    for child in node:
        __scanNode(child, defines, uses)
    
    # Look for used varibles which have not been defined
    # Might be a part of a closure or just a mistake
    inherits = {}
    for name in uses:
        if name not in defines and name != "arguments":
            inherits[name] = uses[name]

    print("Quit Scope [Line:%s]" % node.line)
    print("- Defines:", defines)
    print("- Uses:", uses)
    print("- Inherits:", inherits)
    
    node.__defines = defines
    node.__uses = uses
    node.__inherits = inherits
    
    return inherits
    
    
    
def __addParams(node, defines):
    """ Adds all param names from outer function to the definition list """

    rel = getattr(node, "rel", None)
    if rel == "body" and node.parent.type == "function":
        paramList = getattr(node.parent, "params", None)
        if paramList:
            for paramIdentifier in paramList:
                defines.add(paramIdentifier.value)    