#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import jasy.js.parse.ScopeData


__all__ = ["scan"]


#
# Public API
#

def scan(tree):
    """
    Scans the given tree and attaches variable data instances (core/ScopeData.py) to every scope (aka function).
    This data is being stored independently from the real tree so that if you modifiy the tree the
    data is not automatically updated. This means that every time you modify the tree heavily,
    it might make sense to re-execute this method to bring it in sync to the current tree structure.
    """
    
    return __scanScope(tree)



#
# Implementation
#

def __scanNode(node, data):
    """
    Scans nodes recursively and collects all variables which are declared and accessed.
    """
    
    if node.type == "function":
        if node.functionForm == "declared_form":
            data.declared.add(node.name)
            data.modified.add(node.name)
    
    elif node.type == "declaration":
        varName = getattr(node, "name", None)
        if varName != None:
            data.declared.add(varName)
            
            if hasattr(node, "initializer"):
                data.modified.add(varName)
            
            # If the variable is used as a iterator, we need to add it to the use counter as well
            if getattr(node.parent, "rel", None) == "iterator":
                data.increment(varName)
            
        else:
            # JS 1.7 Destructing Expression
            varNames = node.names
            for identifier in node.names:
                data.declared.add(identifier.value)
                data.modified.add(identifier.value)
                
            # If the variable is used as a iterator, we need to add it to the use counter as well
            if getattr(node.parent, "rel", None) == "iterator":
                for identifier in node.names:
                    data.increment(identifier.value)
            
    elif node.type == "identifier":
        # Ignore parameter names (of inner functions, these are handled by __scanScope)
        if node.parent.type == "list" and getattr(node.parent, "rel", None) == "params":
            pass
        
        # Ignore property initialization names
        elif node.parent.type == "property_init" and node.parent[0] == node:
            pass
            
        # Ignore non first identifiers in dot-chains
        elif node.parent.type != "dot" or node.parent.index(node) == 0:
            if node.value != "arguments":
                data.increment(node.value)
            
                if node.parent.type in ("increment", "decrement"):
                    data.modified.add(node.value)
                
                elif node.parent.type == "assign" and node.parent[0] == node:
                    data.modified.add(node.value)

                # Support for package-like object access
                if node.parent.type == "dot":
                    package = __combinePackage(node)
                    if package in data.packages:
                        data.packages[package] += 1
                    else:
                        data.packages[package] = 1
                
    # Treat exception variables in catch blocks like declared
    elif node.type == "block" and node.parent.type == "catch":
        data.declared.add(node.parent.exception.value)                
    
    if node.type == "script":
        innerVariables = __scanScope(node)
        for name in innerVariables.shared:
            data.increment(name, innerVariables.shared[name])
            
            if name in innerVariables.modified:
                data.modified.add(name)
        
        for package in innerVariables.packages:
            if package in data.packages:
                data.packages[package] += innerVariables.packages[package]
            else:
                data.packages[package] = innerVariables.packages[package]
                
    else:
        for child in node:
            # None children are allowed sometimes e.g. during array_init like [1,2,,,7,8]
            if child != None:
                __scanNode(child, data)



def __combinePackage(node):
    """
    Combines a package variable (e.g. foo.bar.baz) into one string
    """

    result = [node.value]
    parent = node.parent
    while parent.type == "dot":
        result.append(parent[1].value)
        parent = parent.parent

    return ".".join(result)
    
    
    
def __scanScope(node):
    """ 
    Scans a scope and collects statistics on variable declaration and usage 
    """
    
    # Initialize statistics object for this scope
    data = jasy.js.parse.ScopeData.ScopeData()
    node.scope = data
    
    # Add params to declaration list
    __addParams(node, data)

    # Collect all data from all children (excluding sub-scopes)
    for child in node:
        __scanNode(child, data)
        
    # Remove all objects which are based on locally declared variables
    for name in list(data.packages):
        top = name[0:name.index(".")]
        if top in data.declared or top in data.params:
            del data.packages[name]
    
    # Look for accessed varibles which have not been defined
    # Might be a part of a closure or just a mistake
    for name in data.accessed:
        if name not in data.declared and name not in data.params and name != "arguments":
            data.shared[name] = data.accessed[name]
            
    # Look for variables which have been defined, but not accessed.
    if data.name and not data.name in data.accessed:
        data.unused.add(data.name)
    for name in data.params:
        if not name in data.accessed:
            data.unused.add(name)
    for name in data.declared:
        if not name in data.accessed:
            data.unused.add(name)
    
    return data
    
    
    
def __addParams(node, data):
    """
    Adds all param names from outer function to the definition list
    """

    rel = getattr(node, "rel", None)
    if rel == "body" and node.parent.type == "function":
        # In expressed_form the function name belongs to the function body, not to the parent scope
        if node.parent.functionForm == "expressed_form":
            data.name = getattr(node.parent, "name", None)
        
        paramList = getattr(node.parent, "params", None)
        if paramList:
            for paramIdentifier in paramList:
                data.params.add(paramIdentifier.value)

