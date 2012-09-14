#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

"""
This module is used to detect dead code branches and remove them. 
This is escecially useful after injecting values from the outside
which might lead to simple truish equations which can be easily
resolved. 

This module is directly used by Class after Permutations have been
applied (code branches) but can be used more widely, too.

This acts somewhat like the optimizers you find under "optimizer",
but is dependency relevant (Permutations might remove whole blocks 
of alternative code branches). It makes no sense to optimize this
just before compilation. It must be done pretty early during the
processing of classes.

The module currently support the following statements:

* if
* hook (?:)
* switch

and can detect good code based on:

* true
* false
* equal: ==
* strict equal: ===
* not equal: !=
* strict not equal: !==
* not: !
* and: &&
* or: ||

It supports the types "string" and "number" during comparisions. It
uses a simple equality operator in Python which behaves like strict
equal in JavaScript. This also means that number 42 is not equal to
string "42" during the dead code analysis.

It can figure out combined expressions as well like:

* 4 == 4 && !false

"""

__all__ = ["cleanup"]

import jasy.core.Console as Console

def cleanup(node):
    """
    Reprocesses JavaScript to remove dead paths 
    """
    
    Console.debug("Removing dead code branches...")

    Console.indent()
    result = __cleanup(node)
    Console.outdent()

    return result


def __cleanup(node):
    """
    Reprocesses JavaScript to remove dead paths 
    """
    
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
            Console.debug("Optimizing if/else at line %s", node.line)
            
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
            Console.debug("Optimizing hook at line %s", node.line)
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
                    Console.warn("Could not optimize switch statement (at line %s) because of fallthrough break statement.", node.line)
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
            Console.debug("Optimizing switch at line %s", node.line)
            optimized = True
    
    return optimized



#
# Implementation
#

def __checkCondition(node):
    """
    Checks a comparison for equality. Returns None when
    both, truely and falsy could not be deteted.
    """
    
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
        if first != None and not first:
            return False

        second = __checkCondition(node[1])
        if second != None and not second:
            return False
            
        if first and second:
            return True

    elif node.type == "or":
        first = __checkCondition(node[0])
        second = __checkCondition(node[1])
        if first != None and second != None:
            return first or second

    return None


def __invertResult(result):
    """
    Used to support the NOT operator.
    """
    
    if type(result) == bool:
        return not result
        
    return result


def __compareNodes(a, b):
    """
    This method compares two nodes from the tree regarding equality.
    It supports boolean, string and number type compares
    """
    
    if a.type == b.type:
        if a.type in ("string", "number"):
            return a.value == b.value
        elif a.type == "true":
            return True
        elif b.type == "false":
            return False    
            
    elif a.type in ("true", "false") and b.type in ("true", "false"):
        return False

    return None
    