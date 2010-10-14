#
# JavaScript Tools - Optimizer/Crypter for private member names
# Copyright 2010 Sebastian Werner
#

import binascii, string

__all__ = ["optimize"]



#
# Public API
#

def optimize(node, fileId):
    privates = {}
    __recurser(node, fileId, privates)
    return len(privates) > 0
    
    

#
# Internal API
#

def __recurser(node, fileId, privates, modified=False):
    if node.type == "identifier":
        value = node.value
        if type(value) == str and value.startswith("__"):
            modified = True
            
            if value in privates:
                repl = privates[value]
            else:
                repl = "$%s$%s" % (fileId, __baseEncode(len(privates)))
                privates[value] = repl
                
            # Updating identifier
            node.value = repl
        
    for child in node:
        __recurser(child, fileId, privates)
    
    
    
def __baseEncode(num, alphabet=string.ascii_letters+string.digits):
    if (num == 0):
        return alphabet[0]
    arr = []
    base = len(alphabet)
    while num:
        rem = num % base
        num = num // base
        arr.append(alphabet[rem])
    arr.reverse()
    return "".join(arr)
    