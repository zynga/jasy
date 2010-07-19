#
# JavaScript Tools - Compressor Module
# Copyright 2010 Sebastian Werner
#

import string
from js.Node import Node

__all__ = ["optimize"]

def optimize(node, translate=None):
    if not translate:
        translate = {}
    
    if node.type == "function" or node.type == "script":
        optimizeBlock(node, translate)
        
    for child in getChildren(node):
        optimize(child, translate)
        
      
      
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
    
    
def getChildren(node):
    children = []
    children.extend(node)
    
    for key in dir(node):
        if not (key == "parent" or key.startswith("_")):
            value = getattr(node, key)
            if isinstance(value, Node):
                children.append(value)
        
    return children
            
    
def processStructure(node, types, callback):
    if node.type in types:
        callback(node)
        
    for child in getChildren(node):
        processStructure(child, types, callback)
    
    
def optimizeBlock(node, translate):
    pos = len(translate)
    if node.type == "function":
        for i, param in enumerate(node.params):
            node.params[i] = translate[param] = baseEncode(pos)
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
            
        elif node.type == "identifier" and node.value in translate:
            # in a variable declaration
            if hasattr(node, "name"):
                node.name = node.value = translate[node.value]
            
            # every first identifier in a row of dots, or any identifier outsight of dot operator
            elif testChild(node):
                node.value = translate[node.value]
    
    processStructure(body, ["identifier", "function", "script"], optimizeLocals)
    return translate
    

    
    