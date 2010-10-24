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
    undefines = __scanScope(node)
    __patch(node)


#
# Implementation
#

def __baseEncode(num, alphabet=string.ascii_letters):
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
            if node.value in uses:
                uses[node.value] += 1
            else:
                uses[node.value] = 1
    
    if node.type == "script":
        childUndefines = __scanScope(node)
        for name in childUndefines:
            if name in uses:
                uses[name] += childUndefines[name]
            else:
                uses[name] = childUndefines[name]
                
    # Treat catch blocks like new scopes
    elif node.type == "block" and getattr(node, "rel", None) == "block" and node.parent.type == "catch":
        childUndefines = __scanScope(node)
        for name in childUndefines:
            if name in uses:
                uses[name] += childUndefines[name]
            else:
                uses[name] = childUndefines[name]        
        
    else:
        for child in node:
            __scanNode(child, delcares, uses)



def __scanScope(node):
    defines = set()
    uses = {}
    
    # Add params to declaration list
    __addParams(node, defines)
    __addExceptions(node, defines)

    # Process children
    for child in node:
        __scanNode(child, defines, uses)
    
    # Look for used varibles which have not been defined
    # Might be a part of a closure or just a mistake
    undefines = {}
    for name in uses:
        if name not in defines:
            undefines[name] = uses[name]

    # print("Quit Scope [Line:%s]" % node.line)
    # print("- Defines:", defines)
    # print("- Uses:", uses)
    # print("- Undefines:", undefines)
    
    node.__defines = defines
    node.__uses = uses
    node.__undefines = undefines
    
    return undefines
    
    
def __addParams(node, defines):
    """ Adds all param names from outer function to the definition list """
    
    rel = getattr(node, "rel", None)
    if rel == "body" and node.parent.type == "function":
        paramList = getattr(node.parent, "params", None)
        if paramList:
            for paramIdentifier in paramList:
                defines.add(paramIdentifier.value)
                
                
def __addExceptions(node, defines):
    """ Adds name of exception variable from outer catch """
    
    if node.type == "block" and node.parent.type == "catch":
        exception = node.parent.exception
        defines.add(exception.value)


def __patch(node, enable=False, translate=None):
    if node.type == "script" and hasattr(node, "parent"):
        enable = True
    
    
    #
    # GENERATE TRANSLATION TABLE
    #
    if enable and hasattr(node, "__defines"):
        usedRepl = set()
        
        if not translate:
            translate = {}
        else:
            # copy only the interesting ones from the __undefines set
            newTranslate = {}
            
            for name in node.__undefines:
                if name in translate:
                    newTranslate[name] = translate[name]
                    usedRepl.add(translate[name])
            translate = newTranslate
            
        # Merge in usage data into declaration map to have
        # the possibilities to sort translation priority to
        # the usage number. Pretty cool.
        
        defined = {}
        for name in node.__defines:
            if name in node.__uses:
                defined[name] = node.__uses[name]
            else:
                defined[name] = 0
                
        definedSorted = list(reversed(sorted(defined, key=lambda x: defined[x])))

        # Extend translation map by new replacements for locally 
        # defined variables. Automatically ignores keywords. Only
        # blocks usage of replacements where the original variable from
        # outer scope is used. This way variable names may be re-used more
        # often than in the original code.
        pos = 0
        for name in definedSorted:
            while True:
                repl = __baseEncode(pos)
                pos += 1
                if not repl in usedRepl and not repl in keywords:
                    break
                
            # print("Translate: %s => %s" % (name, repl))
            translate[name] = repl


    #
    # APPLY TRANSLATION
    #
    if translate:
        # Update param names in outer function block
        if node.type == "script":
            if hasattr(node, "parent"):
                function = node.parent
                if function.type == "function" and hasattr(function, "params"):
                    for identifier in function.params:
                        if identifier.value in translate:
                            identifier.value = translate[identifier.value]
            
        # Update catch variable name in outer catch block
        elif node.type == "block" and node.parent.type == "catch":
            exceptionVariable = node.parent.exception
            if exceptionVariable.value in translate:
                exceptionVariable.value = translate[exceptionVariable.value]

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


    #
    # PROCESS CHILDREN
    #
    for child in node:
        __patch(child, enable, translate)


