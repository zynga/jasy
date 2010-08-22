#
# JavaScript Tools - Optimizer for combining variable declarations
# Copyright 2010 Sebastian Werner
#

#
# Public API
#

def optimize(node):
    if not node.type in ("script", "block"):
        return
        
    for child in node:
        print child.type
        
    
    