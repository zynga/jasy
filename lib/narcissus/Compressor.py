def compress(node):
    return globals()[node.type](node)


def script(node):
    result = ""
    for child in node:
        result += compress(child)
        if result[-1] != ";":
            result += ";"
    return result


def block(node):
    result = "{"
    for child in node:
        result += compress(child)
        result += ";"
    result = result[:-1]
    result += "}"

    return result


def var(node):
    result = "var "
    for child in node:
        result += compress(child)
        result += ","    
    result = result[:-1]

    return result


def identifier(node):
    result = node.value

    if hasattr(node, "initializer"):
        result += "=%s" % compress(node.initializer)

    return result


def number(node):
    return "%s" % node.value


def string(node):
    return "%s%s%s" % ('"', node.value, '"')
    

def semicolon(node):
    result = ""
    if node.expression:
        result += compress(node.expression)
    return result + ";"
    
    
def call(node):
    result = compress(node[0]) + "("
    for index, child in enumerate(node):
        if index > 0:
            result += compress(child)
    result += ")"
    return result
    
    
def list(node):
    result = ""
    for child in node:
        result += compress(child)
        result += ","
    result = result[:-1]
    return result
    
    
def operator(node, operator):
    result = ""
    for child in node:
        result += compress(child)
        result += operator
    result = result[:-len(operator)]
    return result
    
    
def plus(node):
    return operator(node, "+")
    
def dot(node):
    return operator(node, ".")    
    
def object_init(node):
    result = "{"
    for child in node:
        result += compress(child)
        result += ","
    result = result[:-1] + "}"
    return result
    
def property_init(node):
    return operator(node, ":")    
    
def function(node):
    return "-function-"