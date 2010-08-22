#
# JavaScript Tools - Optimizer for combining variable declarations
# Copyright 2010 Sebastian Werner
#

from js.Node import Node


#
# Public API
#

def optimize(node):
    if node.type in ("script", "block"):
        __combineSiblings(node)

    if hasattr(node, "variables"):
        __combineVarStatements(node)

        
    
    
#
# Private API
#

def __combineSiblings(node):
    # Backwards processing and insertion into previous sibling
    length = len(node)
    pos = length-1
    while pos > 0:
        child = node[pos]
        prevChild = node[pos-1]
        
        if child.type == "var" and prevChild.type == "var":
            for variable in child:
                prevChild.append(variable)
            node.remove(child)
        
        pos -= 1
        
        
def __combineVarStatements(node):
    variables = node.variables
    length = len(node)

    firstVarStatement = None
    for pos, child in enumerate(node):
        if child.type == "var":
            firstVarStatement = child
            pos += 1
            break
            
    if not firstVarStatement:
        return
        
    while pos < length:
        if node[pos].type == "var":
            node[pos] = __rebuildAsAssignment(node[pos], firstVarStatement)
        
        pos += 1
        
    
def __rebuildAsAssignment(node, target):
    replacement = Node(node.tokenizer, "semicolon")
    comma = Node(node.tokenizer, "comma")
    replacement.append(comma, "expression")
    
    for child in node:
        if hasattr(child, "initializer"):
            assign = Node(node.tokenizer, "assign")
            comma.append(assign)
            identifier = Node(node.tokenizer, "identifier")
            assign.append(identifier)
            assign.append(child.initializer)

            # Converted from declarations is always the first one => in scope
            identifier.scope = True
            identifier.value = child.name

            # Now move cleaned-up declaration around
            target.append(child)
            
    return replacement
    