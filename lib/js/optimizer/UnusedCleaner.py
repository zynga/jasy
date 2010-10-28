#
# JavaScript Tools - Cleaner for unused variables
# Copyright 2010 Sebastian Werner
#

from js.parser.Node import Node
import logging


#
# Public API
#

def optimize(node):
    return __optimize(node)



#
# Implementation
#

def __optimize(node):
    """ The scanner part which looks for scopes with unused variables/params """
    
    optimized = False
    
    for child in list(node):
        if __optimize(child):
            optimized = True

    if node.type == "script" and node.stats.unused:
        if __clean(node, node.stats.unused):
            optimized = True

    return optimized
            
            
            
def __clean(node, unused):
    """ 
    The cleanup part which always processes one scope and cleans up params and
    variable definitions which are unused
    """
    
    retval = False
    
    # Process children
    for child in node:
        if child.type != "function":
            if __clean(child, unused):
                retval = True
                    

    if node.type == "script" and hasattr(node, "parent"):
        params = getattr(node.parent, "params", None)
        if params:
            # start from back, as we can only remove params as long
            # as there is not a required one after us.
            for identifier in reversed(params):
                if identifier.value in unused:
                    # logging.debug("Cleanup '%s' in line %s", identifier.value, identifier.line)
                    params.remove(identifier)
                    retval = True
                else:
                    break
                    
            
    elif node.type == "var":
        later = []
        for decl in reversed(node):
            if decl.name in unused:
                if hasattr(decl, "initializer"):
                    init = decl.initializer
                    if init.type in ("null", "this", "true", "false", "identifier", "number", "string", "regexp"):
                        # Primary initializer => just remove the declaration
                        node.remove(decl)
                        retval = True
                        
                    else:
                        later.append(decl)
                    
                else:
                    # No initializer => just remove the declaration
                    node.remove(decl)
                    retval = True
                    
        # Whether we need to rework the list to remove all declarations cleanly
        if later:
            parent = node.parent
            if parent.type in ("block", "script"):
                index = parent.index(node)
                currentVar = node
                for child in list(node):
                    if child in later:
                        # Wrap initializer into semicolon statement
                        index += 1
                        semicolon = Node(child.tokenizer, "semicolon")
                        semicolon.append(child.initializer, "expression")
                        parent.insert(index, semicolon)
                        
                        # Remove original child
                        node.remove(child)
                    
                        # Prepare new var block for following children
                        index += 1
                        currentVar = Node(node.tokenizer, "var")
                        parent.insert(index, currentVar)
                        
                    elif child.parent != currentVar:
                        # Append remaining definitions to current variable block
                        currentVar.append(child)
                        
                # Remove the last created "var" statement if it is unused
                if len(currentVar) == 0:
                    currentVar.parent.remove(currentVar)
                
            else:
                # Edge-case: Variable declaration which assigns a complex value, but
                # where the result is never used. What needs to be happen here is 
                # that one needs to extract the "var" block to the outside of the loop.
                # This needs to create a new "block" if there is not yet one, move the "for"
                # inside it, extract the "var" block to be placed before the "for" 
                # and then need to rework this new block with the same logic as above.
                
                for decl in later:
                    logging.warn("Unused variables %s at line %s could not be removed automatically." % (decl.name, node.line))
                
                
        elif len(node) == 0:
            node.parent.remove(node)




    return retval

    