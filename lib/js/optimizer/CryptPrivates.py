#
# JavaScript Tools - Optimizer/Crypter for private member names
# Copyright 2010 Sebastian Werner
#

import zlib, string

__all__ = ["optimize"]



#
# Public API
#

def optimize(node):
    __recurser(node)
    
    

#
# Internal API
#

__cache = {}

def __recurser(node, modified=False):
    if node.type == "identifier":
        value = node.value
        if type(value) == str and value.startswith("__") and not value.endswith("__"):
            if value in __cache:
                repl = __cache[value]
            else:
                repl = "__%s" % __encode(value)
                __cache[value] = repl
                
            # Updating identifier
            node.value = repl
        
    for child in node:
        __recurser(child)
    
    
    
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
    