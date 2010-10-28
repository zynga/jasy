#
# JavaScript Tools - Cleaner for unused variables
# Copyright 2010 Sebastian Werner
#

from js.parser.Node import Node
import logging

def optimize(node):
    return __optimize(node)
        
        
def __optimize(node):
    optimized = False
    
    for child in list(node):
        if __optimize(child):
            optimized = True

    if node.type == "script" and node.stats.unused:
        if __clean(node, node.stats.unused):
            optimized = True

    return optimized
            
            
            
def __clean(node, unused):
    retval = False

    if node.type == "var":
        node = splitVar(node)
        
    elif node.type == "declaration" and node.name in unused:
        logging.debug("Cleanup '%s' in line %s" % (node.name, node.line))
        
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
        if child.type != "script":
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
        
    
    