#
# JavaScript Tools - Optimizer for variants (pre-compiler directives)
# Copyright 2010 Sebastian Werner
#

import json


#
# Public API
#

def optimize(node, data):
    if node.type == "dot":
        assembled = __assembleDot(node)
        if assembled and assembled in data:
            print "Found %s => %s" % (assembled, data[assembled])
            __replace(node, data[assembled])
    
    for child in node:
        optimize(child, data)
    
    
    
#
# Implementation
#

def __assembleDot(node, result=None):
    
    if node.type != "dot":
        raise "Wrong node type for __assembleDot!"

    if result == None:
        result = []
        
    for child in node:
        if child.type == "identifier":
            result.append(child.value)
        elif child.type == "dot":
            __assembleDot(child, result)
        else:
            print "Unsupported type: %s" % child.type
            
    return ".".join(result)
    
    
def __replace(node, replacement):
    #pos = node.parent.index(node)
    #print "Replace at index: %s" % pos
    pass
    
    
    