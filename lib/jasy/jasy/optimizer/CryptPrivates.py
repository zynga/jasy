#
# Jasy - JavaScript Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import zlib, string, logging

__all__ = ["optimize"]



#
# Public API
#

def optimize(node, contextId=""):
    __recurser(node, contextId)
    
    

#
# Internal API
#

__cache = {}

def __recurser(node, contextId, modified=False):
    if node.type == "identifier":
        value = node.value
        # Protect e.g. __proto__ from optimization
        if type(value) == str and value.startswith("__") and not value.endswith("__"):
            full = "%s.%s" % (contextId, value)
            if full in __cache:
                repl = __cache[full]
            else:
                repl = "__%s" % __encode(full)
                __cache[full] = repl

                logging.debug("Replace private field %s with %s (context: %s)", value, repl, contextId)
                
            # Updating identifier
            node.value = repl
        
    for child in node:
        # None children are allowed sometimes e.g. during array_init like [1,2,,,7,8]
        if child != None:
            __recurser(child, contextId)
    
    
    
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
    