#
# Jasy - JavaScript Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import logging

def cleanup(node):
    logging.debug(">>> Removing dead code branches...")
    return __cleanup(node)


def __cleanup(node):
    """ Reprocesses JavaScript to remove dead paths """
    optimized = False
    
    # Process from inside to outside
    for child in reversed(node):
        # None children are allowed sometimes e.g. during array_init like [1,2,,,7,8]
        if child != None:
            if __cleanup(child):
                optimized = True
        
    # Optimize if cases
    if node.type == "if":
        check = __checkCondition(node.condition)
        if check is not None:
            optimized = True
            
            if check is True:
                node.parent.replace(node, node.thenPart)
                
            elif check is False:
                if hasattr(node, "elsePart"):
                    node.parent.replace(node, node.elsePart)
                else:
                    node.parent.remove(node)
    
    # Optimize hook statement
    if node.type == "hook":
        check = __checkCondition(node[0])
        if check is not None:
            optimized = True
        
            if check is True:
                node.parent.replace(node, node[1])
            elif check is False:
                node.parent.replace(node, node[2])
                
    # Optimize switch statement
    if node.type == "switch" and node.discriminant.type in ("string", "number"):
        discriminant = node.discriminant.value
        fallback = None
        matcher = None
        allowed = ["default", "case"]
        
        for child in node:
            # Require that every case block ends with a break (no fall-throughs)
            if child.type == "case":
                block = child[len(child)-1]
                if len(block) == 0 or block[len(block)-1].type != "break":
                    logging.warn("Could not optimize switch statement (at line %s) because of fallthrough break statement." % node.line)
                    return False

            if child.type == "default":
                fallback = child.statements

            elif child.type == "case" and child.label.value == discriminant:
                matcher = child.statements
                
                # Remove break statement
                matcher.pop()
            
        if matcher or fallback:
            if not matcher:
                matcher = fallback
                
            node.parent.replace(node, matcher)
            optimized = True
    
    return optimized



#
# Implementation
#

def __checkCondition(node):
    if node.type == "false":
        return False
    elif node.type == "true":
        return True
        
    elif node.type == "eq" or node.type == "strict_eq":
        return __compareNodes(node[0], node[1])
    elif node.type == "ne" or node.type == "strict_ne":
        return __invertResult(__compareNodes(node[0], node[1]))
        
    elif node.type == "not":
        return __invertResult(__checkCondition(node[0]))
        
    elif node.type == "and":
        first = __checkCondition(node[0])
        second = __checkCondition(node[1])
        if first != None:
            if not first:
                return False
            elif second != None:
                return second != False
        

    elif node.type == "or":
        first = __checkCondition(node[0])
        second = __checkCondition(node[1])
        if first != None and second != None:
            return first or second

    return None


def __invertResult(result):
    if type(result) == bool:
        return not result
        
    return result


def __compareNodes(a, b):
    if a.type == b.type:
        if a.type in ("string","number"):
            return a.value == b.value
        elif a.type == "true":
            return True
        elif b.type == "false":
            return False    
            
    elif a.type in ("true","false") and b.type in ("true","false"):
        return False

    return None
    