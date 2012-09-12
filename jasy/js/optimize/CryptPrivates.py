#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import zlib, string, re
import jasy.core.Console as Console

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



def optimize(node, contextId=""):
    
    Console.debug("Crypting private fields...")
    Console.indent()
    
    coll = __search(node)

    repl = {}
    for name in coll:
        repl[name] = "__%s" % __encode("%s.%s" % (contextId, name[2:]))
        Console.debug("Replacing private field %s with %s (context: %s)", name, repl[name], contextId)
    
    Console.debug("Found %s private fields" % len(repl))
    modified, reduction = __replace(node, repl)
    
    Console.debug("Reduced size by %s bytes" % reduction)
    Console.outdent()
    
    return modified
    


#
# Internal API
#

__matcher = re.compile("__[a-zA-Z0-9]+")


def __search(node, coll=None):
    
    if coll is None:
        coll = set()
    
    if node.type == "assign" and node[0].type == "dot":
        # Only last dot child is relevant
        if node[0][1].type == "identifier":
            name = node[0][1].value
            if type(name) is str and __matcher.match(name):
                coll.add(name)
        
    elif node.type == "property_init":
        name = node[0].value
        if type(name) is str and __matcher.match(name):
            coll.add(name)

    for child in node:
        # None children are allowed sometimes e.g. during array_init like [1,2,,,7,8]
        if child != None:
            __search(child, coll)
            
    return coll



def __replace(node, repl):
    modified = False
    reduction = 0
    
    if node.type == "identifier" and getattr(node, "parent", None):
        # Only rename items which are part of a dot operator
        if node.parent.type in ("dot", "property_init") and type(node.value) is str and __matcher.match(node.value):
            if node.value in repl:
                reduction = reduction + len(node.value) - len(repl[node.value])
                node.value = repl[node.value]
                modified = True
            elif node.value.endswith("__"):
                # Ignore __defineGetter__, __defineSetter__, __proto__
                pass
            else:
                raise Error(node.value, node.line)
        
    for child in node:
        # None children are allowed sometimes e.g. during array_init like [1,2,,,7,8]
        if child != None:
            subModified, subReduction = __replace(child, repl)
            modified = modified or subModified
            reduction = reduction + subReduction
            
    return modified, reduction
    
    
    
def __encode(value, alphabet=string.ascii_letters+string.digits):
    
    num = zlib.adler32(value.encode("utf-8"))
    
    if num == 0:
        return alphabet[0]
    
    arr = []
    base = len(alphabet)
    
    while num:
        rem = num % base
        num = num // base
        arr.append(alphabet[rem])
    
    arr.reverse()
    
    return "".join(arr)
    