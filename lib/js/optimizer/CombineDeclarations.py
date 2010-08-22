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

    # Backwards processing and insertion into previous sibling
    length = len(node)
    pos = length-1
    while pos > 0:
        child = node[pos]
        prevChild = node[pos-1]
        
        if child.type == "var" and prevChild.type == "var":
            for variable in child:
                prevChild.append(variable)
            node.remove(child)
        
        pos -= 1
    
    