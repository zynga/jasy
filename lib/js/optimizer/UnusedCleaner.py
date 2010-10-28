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

    if node.type == "script" and hasattr(node, "parent"):
        params = getattr(node.parent, "params", None)
        if params:
            # start from back, as we can only remove params as long
            # as there is not a required one after us.
            for identifier in reversed(params):
                if identifier.value in unused:
                    # logging.debug("Cleanup '%s' in line %s" % (identifier.value, identifier.line))
                    retval = True
                    params.remove(identifier)
                else:
                    break
            

    elif node.type == "var":
        node = splitVar(node)
        
    elif node.type == "declaration" and node.name in unused:
        # logging.debug("Cleanup '%s' in line %s" % (node.name, node.line))
        
        if hasattr(node, "initializer"):
            # Replace whole "var" statement with initializer wrapped in semicolon statement
            # This works because of splitVar splitted statements ealier
            semicolon = Node(node.tokenizer, "semicolon")
            semicolon.append(node[0], "expression")
            node.parent.parent.replace(node.parent, semicolon)
            node = semicolon
            retval = True
        else:
            node.parent.remove(node)
            return True
            
    # Process children
    for child in node:
        if child.type != "function":
            if __clean(child, unused):
                retval = True
            
    return retval
    
    
def splitVar(node):
    """ 
    Splits one var statement with multiple declarations into a var statement for every declaration.
    This is mainly for making cleanups easier afterwards and will be optimized later on by
    the CombineDeclarations optimizer.
    """
    
    # Split:
    #
    # var->def1,def2,def3; into
    # var->def1;var->def2;var->def3;
    
    if len(node) > 1:
        parent = node.parent
        block = Node(node.tokenizer, "block")
        
        helper = None
        for child in list(node):
            helper = Node(node.tokenizer, "var")
            helper.append(child)
            block.append(helper)
            
        parent.replace(node, block)
        
        return block
        
    return node
        
    
    