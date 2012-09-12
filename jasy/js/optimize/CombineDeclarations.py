#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import jasy.js.parse.Node as Node
import jasy.core.Console as Console

__all__ = ["optimize", "Error"]



#
# Public API
#

class Error(Exception):
    def __init__(self, line):
        self.__line = line
        
        
def optimize(node):
    Console.debug("Combining declarations...")
    Console.indent()
    result = __optimize(node)
    Console.outdent()
    return result
    

def __optimize(node):
    
    # stabilize list during processing modifyable stuff
    copy = node
    if node.type in ("script", "block"):
        copy = list(node)
    
    for child in copy:
        # None children are allowed sometimes e.g. during array_init like [1,2,,,7,8]
        if child != None:
            __optimize(child)
        
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
                Console.debug("Removing for-loop setup section at line %s" % setup.line)
                child.remove(setup)
                child = setup    

        # Combine declarations of VAR statements
        if child.type == "var" and prevChild.type == "var":
            # debug("Combining var statement at line %s" % child.line)
            
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
    
    if len(node.scope.declared) == 0:
        return
    
    firstVar = __findFirstVarStatement(node)
    
    # Special case, when a node has variables, but no valid "var" block to hold them
    # This happens in cases where there is a for-loop which contains a "var", but
    # there are no other variable declarations anywhere. In this case we are not able
    # to optimize the code further and just exit at this point
    
    # Only size-saving when there are multiple for-in loops, but no other var statement or first
    # "free" var declaration is after for-loops.
    if not firstVar:
        firstVar = Node.Node(None, "var")
        node.insert(0, firstVar)
    
    __patchVarStatements(node, firstVar)
    __cleanFirst(firstVar)
    
    # Remove unused "var"
    if len(firstVar) == 0:
        firstVar.parent.remove(firstVar)

    else:
        # When there is a classical for loop immediately after our 
        # first var statement, then we try to move the var declaration
        # into there as a setup expression
    
        firstVarParent = firstVar.parent
        firstVarPos = firstVarParent.index(firstVar)
        if len(firstVarParent) > firstVarPos+1:
            possibleForStatement = firstVarParent[firstVarPos+1]
            if possibleForStatement.type == "for" and not hasattr(possibleForStatement, "setup"):
                possibleForStatement.append(firstVar, "setup")

        
def __findFirstVarStatement(node):
    """Returns the first var statement of the given node. Ignores inner functions."""
    
    if node.type == "var":
        # Ignore variable blocks which are used as an iterator in for-in loops
        # In this case we return False, so that a new collector "var" is being created
        if getattr(node, "rel", None) == "iterator":
            return False
        else:
            return node
        
    for child in node:
        if child.type == "function":
            continue
        
        result = __findFirstVarStatement(child)
        if result:
            return result
        elif result is False:
            return False
    
    return None
        

def __cleanFirst(first):
    """ 
    Should remove double declared variables which have no initializer e.g.
    var s=3,s,s,t,s; => var s=3,t;
    """
    
    # Add all with initializer first
    known = set()
    for child in first:
        if hasattr(child, "initializer"):
            varName = getattr(child, "name", None)
            if varName != None:
                known.add(varName)
            else:
                # JS 1.7 Destructing Expression
                for varIdentifier in child.names:
                    known.add(varIdentifier.value)
    
    # Then add all remaining ones which are not added before
    # This implementation omits duplicates even if the assignments
    # are listed later in the original node.
    for child in list(first):
        # JS 1.7 Destructing Expression always have a initializer
        if not hasattr(child, "initializer"):
            if child.name in known:
                first.remove(child)
            else:
                known.add(child.name)


def __createSimpleAssignment(identifier, valueNode):
    assignNode = Node.Node(None, "assign")
    identNode = Node.Node(None, "identifier")
    identNode.value = identifier
    assignNode.append(identNode)
    assignNode.append(valueNode)

    return assignNode
    
    
def __createMultiAssignment(names, valueNode):
    assignNode = Node.Node(None, "assign")
    assignNode.append(names)
    assignNode.append(valueNode)

    return assignNode    


def __createDeclaration(name):
    declNode = Node.Node(None, "declaration")
    declNode.name = name
    declNode.readOnly = False
    return declNode


def __createIdentifier(value):
    identifier = Node.Node(None, "identifier")
    identifier.value = value
    return identifier    


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
    assignment = Node.Node(node.tokenizer, "semicolon")
    assignmentList = Node.Node(node.tokenizer, "comma")
    assignment.append(assignmentList, "expression")

    # Casting to list() creates a copy during the process (keeps loop stable)
    for child in list(node):
        if hasattr(child, "name"):
            # Cleanup initializer and move to assignment
            if hasattr(child, "initializer"):
                assign = __createSimpleAssignment(child.name, child.initializer)
                assignmentList.append(assign)
                
            firstVarStatement.append(child)
        
        else:
            # JS 1.7 Destructing Expression
            for identifier in child.names:
                firstVarStatement.append(__createDeclaration(identifier.value))

            if hasattr(child, "initializer"):
                assign = __createMultiAssignment(child.names, child.initializer)
                assignmentList.append(assign)
                
            node.remove(child)
                        
    # Patch parent node to contain assignment instead of declaration
    if len(assignmentList) > 0:
        node.parent.replace(node, assignment)
    
    # Special process for "for-in" loops
    # It is OK to be second because of assignments are not allowed at
    # all in for-in loops and so the first if basically does nothing
    # for these kind of statements.
    elif getattr(node, "rel", None) == "iterator":
        if hasattr(child, "name"):
            node.parent.replace(node, __createIdentifier(child.name))
        else:
            # JS 1.7 Destructing Expressions
            node.parent.replace(node, child.names)
    
    # Edge case. Not yet found if this happen realistically
    else:
        if hasattr(node, "rel"):
            Console.warn("Remove related node (%s) from parent: %s" % (node.rel, node))
            
        node.parent.remove(node)
        
    # Minor post-cleanup. Remove useless comma statement when only one expression is the result
    if len(assignmentList) == 1:
        assignment.replace(assignmentList, assignmentList[0])
