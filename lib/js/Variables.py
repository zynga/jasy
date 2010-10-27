#
# JavaScript Tools - Scanner for variables
# Copyright 2010 Sebastian Werner
#

import logging

__all__ = ["scan"]

def scan(node):
    return __scanScope(node)
    
    
class Stats:
    def __init__(self):
        self.params = set()
        self.declared = set()
        self.accessed = {}
        self.modified = set()
        self.shared = {}
        self.unused = set()
        
        self.accessedObjects = set()
        self.modifiedObjects = set()
        
        
    def output(self):
        print("- Params:", self.params)

        print("- Declared Variables:", self.declared)
        print("- Unused Variables:", self.unused)

        print("- Accessed Name:", self.accessed)
        print("- Modified Name:", self.modified)
        print("- Shared Name:", self.shared)

        print("- Accessed Objects", self.accessedObjects)
        print("- Modified Objects", self.modifiedObjects)
    


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
        functionName = getattr(node, "name", None)
        if functionName:
            stats.declared.add(functionName)
            stats.modified.add(functionName)
    
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
            
                if node.parent.type in ("increment", "decrement", "assign"):
                    stats.modified.add(node.value)

                # Support for namespaced object access
                if node.parent.type == "dot":
                    variable = combineVariable(node)
                
                    nonDot = node.parent
                    while nonDot.type == "dot":
                        nonDot = nonDot.parent
                
                    if nonDot.type in ("increment", "decrement", "assign"):
                        stats.modifiedObjects.add(variable)
                    else:
                        stats.accessedObjects.add(variable)
                
    # Treat exception variables in catch blocks like declared
    elif node.type == "block" and node.parent.type == "catch":
        stats.declared.add(node.parent.exception.value)                
    
    if node.type == "script":
        innerStats = __scanScope(node)
        for name in innerStats.shared:
            stats.increment(name, innerStats.shared[name])
            
            if name in innerStats.modified:
                stats.modified.add(name)
            
            
        stats.accessedObjects.update(innerStats.accessedObjects)
        stats.modifiedObjects.update(innerStats.modifiedObjects)
                
    else:
        for child in node:
            # None children are allowed sometimes e.g. during array_init like [1,2,,,7,8]
            if child != None:
                __scanNode(child, stats)



def combineVariable(node):
    """ Combines an identifier node to a namespaced variable. Only returns a (string) value when value is part of a namespaced variable """

    if node.parent.type == "dot":
        variable = __combineVariableRecurser(node)
        if "." in variable:
            return variable

    return None


def __combineVariableRecurser(node):
    """ Internal helper for namespace builder """
    result = node.value

    parent = node.parent
    if parent.type == "dot":
        if parent[0] is node:
            result += "." + __combineVariableRecurser(parent[1])
        else:
            parentParent = parent.parent
            if parentParent.type == "dot" and parentParent[0] is parent:
                result += "." + __combineVariableRecurser(parentParent[1])

    return result


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
        
    # Cleanup objects
    # Remove all objects which are based on locally declared variables
    for name in list(stats.accessedObjects):
        top = name[0:name.index(".")]
        if top in stats.declared or top in stats.params:
            stats.accessedObjects.remove(name)

    for name in list(stats.modifiedObjects):
        top = name[0:name.index(".")]
        if top in stats.declared or top in stats.params:
            stats.modifiedObjects.remove(name)
            
    # Look for accessed varibles which have not been defined
    # Might be a part of a closure or just a mistake
    for name in stats.accessed:
        if name not in stats.declared and name not in stats.params and name != "arguments":
            stats.shared[name] = stats.accessed[name]
            
    # Look for variables which have been defined, but not accessed.
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
        paramList = getattr(node.parent, "params", None)
        if paramList:
            for paramIdentifier in paramList:
                stats.params.add(paramIdentifier.value)
    