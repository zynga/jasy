#
# JavaScript Tools - Compressor Module
# Copyright 2010 Sebastian Werner
#

import string
from js.Node import Node


def baseEncode(num, alphabet=string.letters):
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
    
    
def getChildren(node):
    children = []
    children.extend(node)
    
    for key in dir(node):
        if not (key == "parent" or key == "target" or key.startswith("_")):
            value = getattr(node, key)
            if isinstance(value, Node):
                children.append(value)
        
    return children
    