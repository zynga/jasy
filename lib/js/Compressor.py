import simplejson as json

def compress(node):
    type = node.type
    
    if type in prefix:
        return __prefix(node)
    elif type in postfix:
        return __postfix(node)
    elif type in divider:
        return __divider(node)
    else:
        return globals()[type](node)


divider = {
    "plus"          : '+',    
    "minus"         : '-',    
    "mul"           : '*',    
    "div"           : '/',    
    "mod"           : '%',
    "dot"           : '.',    
    "property_init" : ":",
}

postfix = {
    "increment"     : "++",
    "decrement"     : "--"
}

prefix = {
    "unary_plus"    : "+",
    "unary_minus"   : "-"
}




symbols = {
    "newline"       : '\n',   
    "semicolon"     : ';',    
    "comma"         : ',',    
    "hook"          : '?',    
    "colon"         : ':',    
    "or"            : '||',   
    "and"           : '&&',   
    "bitwise_or"    : '|',    
    "bitwise_xor"   : '^',    
    "bitwise_and"   : '&',    
    "strict_eq"     : '===',  
    "eq"            : '==',   
    "assign"        : '=',    
    "strict_ne"     : '!==',  
    "ne"            : '!=',   
    "lsh"           : '<<',   
    "le"            : '<=',   
    "lt"            : '<',    
    "ursh"          : '>>>',  
    "rsh"           : '>>',   
    "ge"            : '>=',   
    "gt"            : '>',    
    "increment"     : '++',   
    "decrement"     : '--',   
    "not"           : '!',    
    "bitwise_not"   : '~',    
    "left_bracket"  : '[',    
    "right_bracket" : ']',    
    "left_curly"    : '{',    
    "right_curly"   : '}',    
    "left_paren"    : '(',    
    "right_paren"   : ')'
} 


#
# Shared features
#

def __divider(node):
    operator = divider[node.type]
    result = ""
    for child in node:
        result += compress(child) + operator
    result = result[:-len(operator)]
    return result

def __postfix(node):
    for child in node:
        return compress(child) + postfix[node.type]

def __prefix(node):
    for child in node:
        return prefix[node.type] + compress(child)



#
# Main blocks
#

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
        result += compress(child) + ";"
    result = result[:-1]
    result += "}"

    return result


def var(node):
    result = "var "
    for child in node:
        result += compress(child) + ","
    result = result[:-1]

    return result


def identifier(node):
    result = node.value

    if hasattr(node, "initializer"):
        result += "=%s" % compress(node.initializer)

    return result
    

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
        result += compress(child) + ","
    result = result[:-1]
    return result
        


#
# Primitives
#

def number(node):
    return "%s" % node.value

def string(node):
    return json.dumps(node.value)
    
def true(node):
    return "true"

def false(node):
    return "false"


#
#
#

def object_init(node):
    result = "{"
    for child in node:
        result += compress(child)
        result += ","
    result = result[:-1] + "}"
    return result
    

def function(node):
    result = "function"
    
    result += "("
    if len(node.params) > 0:
        for param in node.params:
            result += param + ","
        result = result[:-1]
        
    result += "){"
    
    for child in node.body:
        result += compress(child)
        
    if result.endswith(";"):
        result = result[:-1]
        
    result += "}"
    
    return result