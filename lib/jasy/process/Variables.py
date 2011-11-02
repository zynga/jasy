#
# JavaScript Tools - Scanner for variables
# Copyright 2010-2011 Sebastian Werner
#

import logging
from jasy.process.Compressor import compress


__all__ = ["scan"]

def scan(node):
    return __scanScope(node)
    
class Stats():
    __slots__ = ["name", "params", "declared", "accessed", "modified", "shared", "unused", "packages"]
    
    def __iter__(self):
        for field in self.__slots__:
            yield field

    def __getitem__(self, key):
        if key == "name":
            return self.name
        elif key == "params":
            return self.params
        elif key == "declared":
            return self.declared
        elif key == "accessed":
            return self.accessed
        elif key == "modified":
            return self.modified
        elif key == "shared":
            return self.shared
        elif key == "unused":
            return self.unused
        elif key == "packages":
            return self.packages

        raise KeyError("Unknown key: %s" % key)

    def __init__(self):
        self.name = None
        self.params = set()
        self.declared = set()
        self.accessed = {}
        self.modified = set()
        self.shared = {}
        self.unused = set()
        self.packages = {}
        
    def increment(self, name, by=1):
        """ Small helper so simplify adding variables to "accessed" dict """
        if not name in self.accessed:
            self.accessed[name] = by
        else:
            self.accessed[name] += by



#
# Implementation
#

def __scanNode(node, stats):
    """ Scans nodes recursively and collects all variables which are declared and accessed. """
    
    if node.type == "function":
        if node.functionForm == "declared_form":
            stats.declared.add(node.name)
            stats.modified.add(node.name)
    
    elif node.type == "declaration":
        varName = getattr(node, "name", None)
        if varName != None:
            stats.declared.add(varName)
            
            if hasattr(node, "initializer"):
                stats.modified.add(varName)
            
            # If the variable is used as a iterator, we need to add it to the use counter as well
            if getattr(node.parent, "rel", None) == "iterator":
                stats.increment(varName)
            
        else:
            # JS 1.7 Destructing Expression
            varNames = node.names
            for identifier in node.names:
                stats.declared.add(identifier.value)
                stats.modified.add(identifier.value)
                
            # If the variable is used as a iterator, we need to add it to the use counter as well
            if getattr(node.parent, "rel", None) == "iterator":
                for identifier in node.names:
                    stats.increment(identifier.value)
            
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
                stats.increment(node.value)
            
                if node.parent.type in ("increment", "decrement"):
                    stats.modified.add(node.value)
                
                elif node.parent.type == "assign" and node.parent[0] == node:
                    stats.modified.add(node.value)

                # Support for package-like object access
                if node.parent.type == "dot":
                    package = combinePackage(node)
                    if package in stats.packages:
                        stats.packages[package] += 1
                    else:
                        stats.packages[package] = 1
                
    # Treat exception variables in catch blocks like declared
    elif node.type == "block" and node.parent.type == "catch":
        stats.declared.add(node.parent.exception.value)                
    
    if node.type == "script":
        innerStats = __scanScope(node)
        for name in innerStats.shared:
            stats.increment(name, innerStats.shared[name])
            
            if name in innerStats.modified:
                stats.modified.add(name)
        
        for package in innerStats.packages:
            if package in stats.packages:
                stats.packages[package] += innerStats.packages[package]
            else:
                stats.packages[package] = innerStats.packages[package]
                
    else:
        for child in node:
            # None children are allowed sometimes e.g. during array_init like [1,2,,,7,8]
            if child != None:
                __scanNode(child, stats)


def combinePackage(node):
    """ Combines a package variable (e.g. foo.bar.baz) into one string """

    result = [node.value]
    parent = node.parent
    while parent.type == "dot":
        result.append(parent[1].value)
        parent = parent.parent

    return ".".join(result)
    
    
def __scanScope(node):
    """ Scans a scope and collects statistics on variable declaration and usage """
    
    # Initialize statistics object for this scope
    stats = Stats()
    node.stats = stats
    
    # Add params to declaration list
    __addParams(node, stats)

    # Collect all stats from all children (excluding sub-scopes)
    for child in node:
        __scanNode(child, stats)
        
    # Remove all objects which are based on locally declared variables
    for name in list(stats.packages):
        top = name[0:name.index(".")]
        if top in stats.declared or top in stats.params:
            del stats.packages[name]
    
    # Look for accessed varibles which have not been defined
    # Might be a part of a closure or just a mistake
    for name in stats.accessed:
        if name not in stats.declared and name not in stats.params and name != "arguments":
            stats.shared[name] = stats.accessed[name]
            
    # Look for variables which have been defined, but not accessed.
    if stats.name and not stats.name in stats.accessed:
        stats.unused.add(stats.name)
    for name in stats.params:
        if not name in stats.accessed:
            stats.unused.add(name)
    for name in stats.declared:
        if not name in stats.accessed:
            stats.unused.add(name)
    
    # print("Quit Scope [Line:%s]" % node.line)
    # stats.output()
    
    return stats
    
    
    
def __addParams(node, stats):
    """ Adds all param names from outer function to the definition list """

    rel = getattr(node, "rel", None)
    if rel == "body" and node.parent.type == "function":
        # In expressed_form the function name belongs to the function body, not to the parent scope
        if node.parent.functionForm == "expressed_form":
            stats.name = getattr(node.parent, "name", None)
        
        paramList = getattr(node.parent, "params", None)
        if paramList:
            for paramIdentifier in paramList:
                stats.params.add(paramIdentifier.value)
    