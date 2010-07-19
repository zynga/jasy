#
# JavaScript Tools - Compressor Module
# Copyright 2010 Sebastian Werner
#

import string

def optimize(node):
    if node.type == "function" or node.type == "script":
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
    
    
def processStructure(node, types, callback):
    if node.type in types:
        callback(node)
        
    if hasattr(node, "initializer"):
        processStructure(node.initializer, types, callback)

    if hasattr(node, "expression"):
        processStructure(node.expression, types, callback)

    if hasattr(node, "value") and hasattr(node.value, "type"):
        processStructure(node.value, types, callback)
        
    for child in node:
        processStructure(child, types, callback)
    
    
    
#
# Optimizer :: Function
#         

def optimizeFunction(node, pos=0):
    translate = {}
    if node.type == "function":
        for param in node.params:
            node.params[pos] = translate[param] = baseEncode(pos)
            pos += 1
        body = node.body
    else:
        body = node

    for item in body.functions + body.variables:
        if not item.name in translate:
            translate[item.name] = baseEncode(pos)
            pos += 1
        
    def testChild(node):
        if not hasattr(node, "parent"):
            return True
            
        parent = node.parent
        
        if parent.type != "dot":
            return True
        
        if parent[1] is node:
            return False
            
        if parent[0] is node:
            return testChild(parent)
        
        
    def optimizeLocals(node):
        if node.type == "function" and hasattr(node, "name"):
            node.name = translate[node.name]
            
        if node.type == "identifier" and node.value in translate:
            # in a variable declaration
            if hasattr(node, "name"):
                node.name = node.value = translate[node.value]
            
            # every first identifier in a row of dots, or any identifier outsight of dot operator
            elif testChild(node):
                node.value = translate[node.value]
                
    
    processStructure(body, ["identifier", "function", "script"], optimizeLocals)
    return pos
    

    
    