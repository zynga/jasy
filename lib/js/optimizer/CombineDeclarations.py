#
# JavaScript Tools - Optimizer for combining variable declarations
# Copyright 2010 Sebastian Werner
#

from js.parser.Node import Node
import logging

__all__ = ["optimize"]



#
# Public API
#

def optimize(node):
    # stabilize list during processing modifyable stuff
    copy = node
    if node.type in ("script", "block"):
        copy = list(node)
    
    for child in copy:
        optimize(child)
        
    if node.type in ("script", "block"):
        __combineSiblings(node)
        
    if node.type == "script":
        __combineVarStatements(node)




#
# Merge direct variable siblings
#

def __combineSiblings(node):
    """Backwards processing and insertion into previous sibling if both are declarations""" 
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
    first = __findFirstVarStatement(node)
    
    # Special case, when a node has variables, but no valid "var" block to hold them
    if not first and node.variables:
        first = Node(None, "var")
        node.append(first)
    
    if first:
        __patchVarStatements(node, first)
        __cleanFirst(first)
        
        if len(first) == 0:
            first.parent.remove(first)
        

        
def __findFirstVarStatement(node):
    """Returns the first var statement of the given node. Ignores inner functions."""
    
    # Ignore variable blocks which are used as an iterator in for-in loops
    if node.type == "var" and getattr(node, "rel", None) != "iterator":
        return node
        
    for child in node:
        if child.type == "function":
            continue
        
        result = __findFirstVarStatement(child)
        if result:
            return result
    
    return None
        

def __cleanFirst(first):
    known = set()
    for child in list(first):
        if not child.name in known:
            known.add(child.name)
        elif not hasattr(child, "initializer"):
            first.remove(child)


def __createSimpleAssignment(identifier, valueNode):
    assignNode = Node(None, "assign")
    identNode = Node(None, "identifier")
    identNode.scope = True
    identNode.value = identifier
    assignNode.append(identNode)
    assignNode.append(valueNode)

    return assignNode


def __patchVarStatements(node, firstVarStatement):
    """Patches all variable statements in the given node (works recursively) and replace them with assignments."""
    if node is firstVarStatement:
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
    assignment = Node(node.tokenizer, "semicolon")
    assignmentList = Node(node.tokenizer, "comma")
    assignment.append(assignmentList, "expression")

    # Casting to list() creates a copy during the process (keeps loop stable)
    for child in list(node):
        # Cleanup initializer and move to assignment
        if hasattr(child, "initializer"):
            assign = __createSimpleAssignment(child.name, child.initializer)
            assignmentList.append(assign)
            
        # Now move declaration without initializer around
        firstVarStatement.append(child)
            
    # Patch parent node to contain assignment instead of declaration
    if len(assignmentList) > 0:
        node.parent.replace(node, assignment)
    
    elif getattr(node, "rel", None) == "iterator":
        # is OK to be second because of assignments are not allowed at
        # all in for-in loops and so the first if basically does nothing
        # for these kind of statements.
        identifier = Node(None, "identifier")
        identifier.scope = True

        # copy name of declaration into value of new identifier node
        identifier.value = child.name
        node.parent.replace(node, identifier)
    
    else:
        if hasattr(node, "rel"):
            logging.warn("Remove related node (%s) from parent: %s" % (node.rel, node))
            
        node.parent.remove(node)
        
    # Minor post-cleanup. Remove useless comma statement when only one expression is the result
    if len(assignmentList) == 1:
        assignment.replace(assignmentList, assignmentList[0])
