from narcissus.Lang import *

def Compressor(node):
    result = ""
    
    print node.type
    
    if node.type_ == VAR:
        result += "var "
    
    if node.type == NUMBER or node.type == STRING:
        result += node.value
    
    
    
    for child in node:
        result += Compressor(child)
        result += ","
            
    return result