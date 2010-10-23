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
    globalUses = __scanScope(node)
    __rework(node)


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
        
       
       
       
def __scanNode(node, delcares, uses):
    if node.type == "function":
        functionName = getattr(node, "name", None)
        if functionName:
            delcares.add(functionName)
    
    elif node.type == "declaration":
        varName = getattr(node, "name", None)
        if varName != None:
            delcares.add(varName)
            
    elif node.type == "identifier":
        if node.parent.type == "list" and getattr(node.parent, "rel", None) == "params":
            pass
            
        elif node.parent.type != "dot" or node.parent.index(node) == 0:
            uses.add(node.value)
    
    if node.type == "script":
        for name in __scanScope(node):
            uses.add(name)
        
    else:
        for child in node:
            __scanNode(child, delcares, uses)
    
    

def __scanScope(node):
    declares = set()
    uses = set()
    
    rel = getattr(node, "rel", None)
    if rel == "body" and node.parent.type == "function":
        paramList = getattr(node.parent, "params", None)
        if paramList:
            for paramIdentifier in paramList:
                declares.add(paramIdentifier.value)
    
    for child in node:
        __scanNode(child, declares, uses)
    
    parents = set()
    for name in uses:
        if name not in declares:
            parents.add(name)

    # print("Quit Scope [Line:%s]" % node.line)
    # print("- Declares:", declares)
    # print("- Uses:", uses)
    # print("- Parents:", parents)
    
    node.__declares = declares
    node.__uses = uses
    node.__parents = parents
    
    return parents
    
    
        
def __rework(node, translate=None):
    if node.type == "script" and hasattr(node, "parent"):
        usedRepl = set()
        
        if not translate:
            translate = {}
        else:
            # copy only the interesting ones from the __parents set
            newTranslate = {}
            
            for name in node.__parents:
                if name in translate:
                    newTranslate[name] = translate[name]
                    usedRepl.add(translate[name])
            translate = newTranslate
            
        pos = 0
        for name in node.__declares:
            while True:
                repl = baseEncode(pos)
                pos += 1
                if not repl in usedRepl and not repl in keywords:
                    break
                
            
            print("Translate: %s => %s" % (name, repl))
            translate[name] = repl


    for child in node:
        __rework(child, translate)
        
        
        
    if translate:
        # Update params
        if node.type == "script":
            # Update params from outer function block
            if hasattr(node, "parent"):
                function = node.parent
                if function.type == "function" and hasattr(function, "params"):
                    for identifier in function.params:
                        if identifier.value in translate:
                            identifier.value = translate[identifier.value]
            
        # Update function name
        elif node.type == "function":
            if hasattr(node, "name") and node.name in translate:
                node.name = translate[node.name]
    
        # Update identifiers
        elif node.type == "identifier":
            # Ignore param blocks from inner functions
            if node.parent.type == "list" and getattr(node.parent, "rel", None) == "params":
                pass
            
            # Update all identifiers which are 
            # a) not part of a dot operator
            # b) first in a dot operator
            elif node.parent.type != "dot" or node.parent.index(node) == 0:
                if node.value in translate:
                    node.value = translate[node.value]
                
        # Update declarations (as part of a var statement)
        elif node.type == "declaration":
            varName = getattr(node, "name", None)
            if varName != None and varName in translate:
                node.name = varName = translate[varName]

