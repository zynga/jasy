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

def optimizeFunction(node):
    translate = {}
    if node.type == "function":
        for pos, param in enumerate(node.params):
            node.params[pos] = translate[param] = baseEncode(pos)
        pos += 1
        body = node.body
    else:
        pos = 0
        body = node

    for item in body.functions + body.variables:
        if not item.name in translate:
            translate[item.name] = baseEncode(pos)
            pos += 1
        
    def testChild(node):
        if not "parent" in node:
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
            print "FUNC: %s => %s" % (node.name, translate[node.name])
            node.name = translate[node.name]
            
        if node.type == "identifier" and node.value in translate:
            # in a variable declaration
            if hasattr(node, "name"):
                print "DECL: %s => %s" % (node.value, translate[node.value])
                node.name = node.value = translate[node.value]
            
            # every first identifier in a row of dots, or any identifier outsight of dot operator
            elif testChild(node):
                print "ACCESS: %s => %s" % (node.value, translate[node.value])
                node.value = translate[node.value]
                
    
    print "Optimizing..."
    processStructure(body, ["identifier", "function", "script"], optimizeLocals)
    
    print translate
    #print node
    
    
    

    
    