#
# Jasy - JavaScript Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

from jasy.parser.Node import Node
import logging
import jasy.process.Variables as Variables

__all__ = ["optimize", "Error"]


#
# Public API
#


class Error(Exception):
    def __init__(self, name, line):
        self.__name = name
        self.__line = line
    
    def __str__(self):
        return "Unallowed private field access to %s at line %s!" % (self.__name, self.__line)


def optimize(node):
    if not hasattr(node, "stats"):
        Variables.scan(node)

    # Re optimize until nothing to remove is found
    x = 0
    optimized = False
    
    while True:
        x = x + 1
        logging.debug("Removing unused variables [%s]..." % x)
        if __optimize(node):
            Variables.scan(node)
            optimized = True
        else:
            break
        
    return optimized



#
# Implementation
#

def __optimize(node):
    """ The scanner part which looks for scopes with unused variables/params """
    
    optimized = False
    
    for child in list(node):
        if child != None and __optimize(child):
            optimized = True

    if node.type == "script" and node.stats.unused and hasattr(node, "parent"):
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
        # Remove unused parameters
        params = getattr(node.parent, "params", None)
        if params:
            # Start from back, as we can only remove params as long
            # as there is not a required one after the current one
            for identifier in reversed(params):
                if identifier.value in unused:
                    logging.debug("Removing unused parameter '%s' in line %s", identifier.value, identifier.line)
                    params.remove(identifier)
                    retval = True
                else:
                    break

        # Remove function names which are unused
        if node.parent.functionForm == "expressed_form":
            funcName = getattr(node.parent, "name", None)
            if funcName != None and funcName in unused:
                logging.debug("Removing unused function name at line %s" % node.line)
                del node.parent.name
                retval = True
                    
                    
    elif node.type == "function":
        # Remove full unused functions (when not in top-level scope)
        if node.functionForm == "declared_form" and getattr(node, "parent", None) and node.parent.type != "call":
            funcName = getattr(node, "name", None)
            if funcName != None and funcName in unused:
                logging.debug("Removing unused function declaration %s at line %s" % (funcName, node.line))
                node.parent.remove(node)
                retval = True
            
    
    elif node.type == "var":
        for decl in reversed(node):
            if getattr(decl, "name", None) in unused:
                if hasattr(decl, "initializer"):
                    init = decl.initializer
                    if init.type in ("null", "this", "true", "false", "identifier", "number", "string", "regexp"):
                        logging.debug("Removing unused primitive variable %s at line %s" % (decl.name, decl.line))
                        node.remove(decl)
                        retval = True
                        
                    elif init.type == "function" and (not hasattr(init, "name") or init.name in unused):
                        logging.debug("Removing unused function variable %s at line %s" % (decl.name, decl.line))
                        node.remove(decl)
                        retval = True
                    
                    # If we have only one child, we replace the whole var statement with just the init block
                    elif len(node) == 1:
                        semicolon = Node(init.tokenizer, "semicolon")
                        semicolon.append(init, "expression")
                        node.parent.replace(node, semicolon)
                        retval = True

                    # If we are the last declaration, move it out of node and append after var block
                    elif node[-1] == decl:
                        node.remove(decl)
                        nodePos = node.parent.index(node)
                        semicolon = Node(init.tokenizer, "semicolon")
                        semicolon.append(init, "expression")
                        
                        node.parent.insert(nodePos + 1, semicolon)
                        retval = True
                        
                    else:
                        logging.debug("Could not automatically remove unused variable %s at line %s without possible side-effects" % (decl.name, decl.line))
                    
                else:
                    node.remove(decl)
                    retval = True
                    
        if len(node) == 0:
            logging.debug("Removing empty 'var' block at line %s" % node.line)
            node.parent.remove(node)

    return retval

    