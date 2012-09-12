#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import jasy.js.parse.Node as Node
import jasy.js.parse.ScopeScanner as ScopeScanner

import jasy.core.Console as Console

__all__ = ["cleanup", "Error"]


#
# Public API
#

class Error(Exception):
    def __init__(self, name, line):
        self.__name = name
        self.__line = line
    
    def __str__(self):
        return "Unallowed private field access to %s at line %s!" % (self.__name, self.__line)



def cleanup(node):
    """
    """
    
    if not hasattr(node, "variables"):
        ScopeScanner.scan(node)

    # Re cleanup until nothing to remove is found
    x = 0
    cleaned = False
    
    Console.debug("Removing unused variables...")
    while True:
        x = x + 1
        #debug("Removing unused variables [Iteration: %s]...", x)
        Console.indent()

        if __cleanup(node):
            ScopeScanner.scan(node)
            cleaned = True
            Console.outdent()
        else:
            Console.outdent()
            break
        
    return cleaned



#
# Implementation
#

def __cleanup(node):
    """ The scanner part which looks for scopes with unused variables/params """
    
    cleaned = False
    
    for child in list(node):
        if child != None and __cleanup(child):
            cleaned = True

    if node.type == "script" and node.scope.unused and hasattr(node, "parent"):
        if __recurser(node, node.scope.unused):
            cleaned = True

    return cleaned
            
            
            
def __recurser(node, unused):
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
                if __recurser(child, unused):
                    retval = True
                    

    if node.type == "script" and hasattr(node, "parent"):
        # Remove unused parameters
        params = getattr(node.parent, "params", None)
        if params:
            # Start from back, as we can only remove params as long
            # as there is not a required one after the current one
            for identifier in reversed(params):
                if identifier.value in unused:
                    Console.debug("Removing unused parameter '%s' in line %s", identifier.value, identifier.line)
                    params.remove(identifier)
                    retval = True
                else:
                    break

        # Remove function names which are unused
        if node.parent.functionForm == "expressed_form":
            funcName = getattr(node.parent, "name", None)
            if funcName != None and funcName in unused:
                Console.debug("Removing unused function name at line %s" % node.line)
                del node.parent.name
                retval = True
                    
                    
    elif node.type == "function":
        # Remove full unused functions (when not in top-level scope)
        if node.functionForm == "declared_form" and getattr(node, "parent", None) and node.parent.type != "call":
            funcName = getattr(node, "name", None)
            if funcName != None and funcName in unused:
                Console.debug("Removing unused function declaration %s at line %s" % (funcName, node.line))
                node.parent.remove(node)
                retval = True
            
    
    elif node.type == "var":
        for decl in reversed(node):
            if getattr(decl, "name", None) in unused:
                if hasattr(decl, "initializer"):
                    init = decl.initializer
                    if init.type in ("null", "this", "true", "false", "identifier", "number", "string", "regexp"):
                        Console.debug("Removing unused primitive variable %s at line %s" % (decl.name, decl.line))
                        node.remove(decl)
                        retval = True
                        
                    elif init.type == "function" and (not hasattr(init, "name") or init.name in unused):
                        Console.debug("Removing unused function variable %s at line %s" % (decl.name, decl.line))
                        node.remove(decl)
                        retval = True
                    
                    # If we have only one child, we replace the whole var statement with just the init block
                    elif len(node) == 1:
                        semicolon = Node.Node(init.tokenizer, "semicolon")
                        semicolon.append(init, "expression")

                        # Protect non-expressions with parens
                        if init.type in ("array_init", "object_init"):
                            init.parenthesized = True
                        elif init.type == "call" and init[0].type == "function":
                            init[0].parenthesized = True
                        
                        node.parent.replace(node, semicolon)
                        retval = True

                    # If we are the last declaration, move it out of node and append after var block
                    elif node[-1] == decl or node[0] == decl:
                        isFirst = node[0] == decl
                        
                        node.remove(decl)
                        nodePos = node.parent.index(node)
                        semicolon = Node.Node(init.tokenizer, "semicolon")
                        semicolon.append(init, "expression")

                        # Protect non-expressions with parens
                        if init.type in ("array_init", "object_init"):
                            init.parenthesized = True
                        elif init.type == "call" and init[0].type == "function":
                            init[0].parenthesized = True

                        if isFirst:
                            node.parent.insert(nodePos, semicolon)
                        else:
                            node.parent.insert(nodePos + 1, semicolon)
                            
                        retval = True
                        
                    else:
                        Console.debug("Could not automatically remove unused variable %s at line %s without possible side-effects" % (decl.name, decl.line))
                    
                else:
                    node.remove(decl)
                    retval = True
                    
        if len(node) == 0:
            Console.debug("Removing empty 'var' block at line %s" % node.line)
            node.parent.remove(node)

    return retval

    