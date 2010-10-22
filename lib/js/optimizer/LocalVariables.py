#
# JavaScript Tools - Optimizer for local variable names
# Copyright 2010 Sebastian Werner
#

from js.tokenizer.Tokenizer import keywords
from copy import copy
import string, logging

__all__ = ["optimize"]

empty = ("null", "this", "true", "false", "number", "string", "regexp")


#
# Public API
#

def optimize(node):
    __scanScope(node)

      


#
# Implementation
#

def baseEncode(num, alphabet=string.ascii_letters):
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
    

def __encode(pos):
    repl = None
    while repl == None or repl in keywords:
        repl = baseEncode(pos)
        pos += 1
        
    return pos, repl
        
       
       
       
def __scanNode(node, delcares, uses):
    if node.type == "function":
        functionName = getattr(node, "name", None)
        if functionName:
            delcares[functionName] = True
    
    elif node.type == "declaration":
        varName = getattr(node, "name", None)
        if varName != None:
            delcares[varName] = True
    
    if node.type == "script":
        __scanScope(node)
            
    else:
        for child in node:
            __scanNode(child, delcares, uses)
    
    

def __scanScope(node):
    delcares = {}
    uses = {}
    
    rel = getattr(node, "rel", None)
    if rel == "body" and node.parent.type == "function":
        paramList = getattr(node.parent, "params", None)
        if paramList:
            for paramIdentifier in paramList:
                delcares[paramIdentifier.value] = True
    
    for child in node:
        __scanNode(child, delcares, uses)
    
    node.vars = sorted(delcares)
    print(node.vars)    
        

