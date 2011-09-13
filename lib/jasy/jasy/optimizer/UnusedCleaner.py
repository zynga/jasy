#
# Jasy - JavaScript Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

from jasy.parser.Node import Node
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
        if child != None:
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
    if node.type != "function":
        for child in node:
            # None children are allowed sometimes e.g. during array_init like [1,2,,,7,8]
            if child != None:
                if __clean(child, unused):
                    retval = True
                    

    if node.type == "script" and hasattr(node, "parent"):
        params = getattr(node.parent, "params", None)
        if params:
            # start from back, as we can only remove params as long
            # as there is not a required one after us.
            for identifier in reversed(params):
                if identifier.value in unused:
                    logging.debug("Cleanup '%s' in line %s", identifier.value, identifier.line)
                    params.remove(identifier)
                    retval = True
                else:
                    break
                    
                    
    elif node.type == "function":
        if hasattr(node, "name") and node.name in unused:
            if node.functionForm == "declared_form":
                if node.parent.type != "script" or hasattr(node.parent, "parent"):
                    logging.debug("Remove unused function %s at line %s" % (node.name, node.line))
                    node.parent.remove(node)
                
            else:
                logging.debug("Clearing unused function name %s at line %s" % (node.name, node.line))
                del node.name
    
    
    elif node.type == "var":
        for decl in reversed(node):
            if getattr(decl, "name", None) in unused:
                if hasattr(decl, "initializer"):
                    init = decl.initializer
                    if init.type in ("null", "this", "true", "false", "identifier", "number", "string", "regexp", "function"):
                        logging.debug("Remove unused variable %s at line %s" % (decl.name, decl.line))
                        node.remove(decl)
                        retval = True
                        
                    else:
                        logging.debug("Could not automatically remove unused variable %s at line %s without possible side-effects" % (decl.name, decl.line))
                    
                else:
                    node.remove(decl)
                    retval = True
                    
        if len(node) == 0:
            logging.debug("Remove empty 'var' block at line %s" % node.line)
            node.parent.remove(node)

    return retval

    