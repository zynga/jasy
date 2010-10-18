#
# JavaScript Tools - Optimizes if-statements for reduced compression size
# Copyright 2010 Sebastian Werner
#

def optimize(node):
    # Process from inside to outside
    for child in node:
        optimize(node)

    if node.type == "if":
        print("Found if")
        pass
    
    
    