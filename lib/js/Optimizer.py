#
# JavaScript Tools - Compressor Module
# Copyright 2010 Sebastian Werner
#

import string

def optimize(node):
    if node.type == "function":
        optimizeFunction(node)
        
    for child in node:
        optimize(child)
        
      
      
#
# Utils
#  
        
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
    
    
    
#
# Optimizer :: Function
#         

def optimizeFunction(node):
    translate = {}
    pos = 0
    for param in node.params:
        translate[param] = baseEncode(pos)
        pos += 1
        
    body = node.body
    for item in body.functions + body.variables:
        if not item.name in translate:
            translate[item.name] = baseEncode(pos)
            pos += 1
        
    print translate
    
    