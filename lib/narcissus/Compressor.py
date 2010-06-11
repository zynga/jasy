#from narcissus.Lang import *

def Compressor(node):
    return globals()[node.type](node)


def SCRIPT(node):
    result = ""
    for child in node:
        result += Compressor(child)
        if result[-1] != ";":
            result += ";"
    return result


def BLOCK(node):
    result = "{"
    for child in node:
        result += Compressor(child)
        result += ";"
    result = result[:-1]
    result += "}"

    return result


def VAR(node):
    result = "var "
    for child in node:
        result += Compressor(child)
        result += ","    
    result = result[:-1]

    return result


def IDENTIFIER(node):
    result = node.value

    if hasattr(node, "initializer"):
        result += "=%s" % Compressor(node.initializer)

    return result


def NUMBER(node):
    return node.value


def STRING(node):
    return "%s%s%s" % ('"', node.value, '"')
    

def SEMICOLON(node):
    result = ""
    if node.expression:
        result += Compressor(node.expression)
    return result + ";"
    
    
def CALL(node):
    result = Compressor(node[0]) + "("
    for index, child in enumerate(node):
        if index > 0:
            result += Compressor(child)
    result += ")"
    return result
    
    
def LIST(node):
    result = ""
    for child in node:
        result += Compressor(child)
        result += ","
    result = result[:-1]
    return result