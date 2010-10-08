#
# JavaScript Tools - Dead Code Removal
# Copyright 2010 Sebastian Werner
#

def optimize(node):
    """ Reprocesses JavaScript to remove dead paths """
    optimized = False
    
    # Process from inside to outside
    for child in node:
        if optimize(child):
            optimized = True
        
    # Optimize if cases
    if node.type == "if":
        check = __checkCondition(node.condition)
        if check is not None:
            optimized = True
            
            if check is True:
                node.parent.replace(node, node.thenPart)
            elif check is False:
                if hasattr(node, "elsePart"):
                    node.parent.replace(node, node.elsePart)
                else:
                    node.parent.remove(node)
    
    # Optimize hook statement
    if node.type == "hook":
        check = __checkCondition(node[0])
        if check is not None:
            optimized = True
        
            if check is True:
                node.parent.replace(node, node[1])
            elif check is False:
                node.parent.replace(node, node[2])
            
    # Optimize block statements
    if node.type == "block" and len(node) == 1:
        optimized = True
        node.parent.replace(node, node[0])
    
    return optimized
    