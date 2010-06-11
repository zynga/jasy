from narcissus.Lang import *

def Compressor(node):
    result = ""
    
    print node.type
    
    if node.type_ == NUMBER or node.type_ == STRING or node.type_ == IDENTIFIER:
        result += node.value

    elif node.type_ == VAR:
        result += "var "

    elif node.type_ == BLOCK:
        result += "{"

    
    
    # Process children of SCRIPT/BLOCK
    if node.type_ == SCRIPT or node.type_ == BLOCK:
        for child in node:
            result += Compressor(child)
            result += ";"
            
        # post-remove last semicolon
        if node.type_ != SCRIPT:
            result = result[:-1]          
          
            
    # Process children of "VAR"
    if node.type_ == VAR:
        for child in node:
            result += Compressor(child)
            result += ","
            
        # post-remove last comma
        result = result[:-1]


    if node.type_ == BLOCK:
        result += "}"
        


            
    return result