#
# Jasy - JavaScript Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import zlib, string, logging, re

__all__ = ["optimize", "PrivateException"]



#
# Public API
#

def optimize(node, contextId=""):
    coll = __search(node)

    repl = {}
    for name in coll:
        repl[name] = "__%s" % __encode("%s.%s" % (contextId, name))
        logging.debug("Replace private field %s with %s (context: %s)", name[2:], repl[name], contextId)
    
    logging.debug("Found %s private fields" % len(repl))
    return __replace(node, repl)
    

class PrivateException(Exception):
    def __init__(self, name, line):
        self.__name = name
        self.__line = line
    
    def __str__(self):
        return "Unallowed private field access to %s at line %s!" % (self.__name, self.__line)




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
            if __matcher.match(name):
                coll.add(name)
        
    elif node.type == "property_init":
        name = node[0].value
        if __matcher.match(name):
            coll.add(name)

    for child in node:
        # None children are allowed sometimes e.g. during array_init like [1,2,,,7,8]
        if child != None:
            __search(child, coll)
            
    return coll



def __replace(node, repl):
    modified = False
    
    if node.type == "identifier" and getattr(node, "parent", None):
        # Only rename items which are part of a dot operator
        if node.parent.type in ("dot", "property_init") and __matcher.match(node.value):
            if node.value in repl:
                node.value = repl[node.value]
                modified = True
            else:
                raise PrivateException(node.value, node.line)
        
    for child in node:
        # None children are allowed sometimes e.g. during array_init like [1,2,,,7,8]
        if child != None:
            if __replace(child, repl):
                modified = True
            
    return modified
    
    
    
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
    