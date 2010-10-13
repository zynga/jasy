#
# JavaScript Tools - Optimizer for combining variable declarations
# Copyright 2010 Sebastian Werner
#

from js.parser.Node import Node

__all__ = ["optimize"]



#
# Public API
#

def optimize(node):
    for child in node:
        optimize(child)

    if node.type in ("script", "block"):
        __combineSiblings(node)
        
    if node.type == "script":
        __combineVarStatements(node)
    
    

#
# Merge direct variable siblings
#

def __combineSiblings(node):
    """Backwards processing and insertion into previous sibling if both a var declarations""" 
    length = len(node)
    pos = length-1
    while pos > 0:
        child = node[pos]
        prevChild = node[pos-1]

        # Special FOR loop optimization, emulate faked VAR
        if child.type == "for" and prevChild.type == "var":
            setup = getattr(child, "setup", None)
            if setup and setup.type == "var":
                child.remove(setup)
                child = setup    

        # Combine declarations of VAR statements
        if child.type == "var" and prevChild.type == "var":
            # Fix loop through casting node to list()
            for variable in list(child):
                prevChild.append(variable)
                
            if child in node:
                node.remove(child)
            
        pos -= 1
        
        
      
    
#
# Merge var statements, convert in-place to assignments in other locations (quite complex)
#

def __combineVarStatements(node):
    """Top level method called to optimize a script node"""
    __patchVarStatements(node, __findFirstVarStatement(node))

        
def __findFirstVarStatement(node):
    """Returns the first var statement of the given node. Ignores inner functions."""
    if node.type == "var":
        return node
        
    for child in node:
        if child.type == "function":
            continue
        
        result = __findFirstVarStatement(child)
        if result:
            return result
    
    return None
        

def __patchVarStatements(node, firstVarStatement):
    """Patches all variable statements in the given node (works recursively) and replace them with assignments."""
    if node == firstVarStatement:
        return
        
    elif node.type == "function":
        # Don't process inner functions/scopes
        return
        
    elif node.type == "var":
        __rebuildAsAssignment(node, firstVarStatement)
        
    else:
        # Recursion into children
        # Create a cast to list() to keep loop stable during modification
        for child in list(node):
            __patchVarStatements(child, firstVarStatement)


def __rebuildAsAssignment(node, firstVarStatement):
    """Rebuilds the items of a var statement into a assignment list and moves declarations to the given var statement"""
    replacement = Node(node.tokenizer, "semicolon")
    comma = Node(node.tokenizer, "comma")
    replacement.append(comma, "expression")
    
    # Casting two list() creates a copy during the process (keeps loop stable)
    for child in list(node):
        # Cleanup initializer and move to assignment
        if hasattr(child, "initializer"):
            assign = Node(node.tokenizer, "assign")

            # Converted from declarations is always the first one => in scope
            identifier = Node(node.tokenizer, "identifier")
            identifier.scope = True
            identifier.value = child.name
            
            assign.append(identifier)
            assign.append(child.initializer)

            comma.append(assign)

        # Now move declaration without initializer around
        firstVarStatement.append(child)
            
    # Patch parent node to contain replacement statement instead of declaration
    if len(comma) > 0:
        node.parent.replace(node, replacement)
    else:
        node.parent.remove(node)
    