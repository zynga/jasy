import simplejson as json
import sys

def compress(node):
    type = node.type
    
    if type in prefixes:
        return prefix(node)
    elif type in postfixes:
        return postfix(node)
    elif type in dividers:
        return divider(node)
    else:
        try:
            return globals()["__" + type](node)
        except KeyError:
            print "Compressor does not support type: %s from line: %s" % (type, node.line)
            print node.toJson()
            sys.exit(1)


dividers = {
    "plus"          : '+',    
    "minus"         : '-',    
    "mul"           : '*',    
    "div"           : '/',    
    "mod"           : '%',
    "dot"           : '.',    
    "property_init" : ":",
    "or"            : "||",
    "and"           : "&&",
    
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
    
}

postfixes = {
    "increment"     : "++",
    "decrement"     : "--",
}

prefixes = {
    "not"           : "!",
    "unary_plus"    : "+",
    "unary_minus"   : "-",
}




symbols = {
    "newline"       : '\n',   
    "semicolon"     : ';',    
    "comma"         : ',',    
    "hook"          : '?',    
    "colon"         : ':',    
    "bitwise_or"    : '|',    
    "bitwise_xor"   : '^',    
    "bitwise_and"   : '&',    
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

def divider(node):
    operator = dividers[node.type]
    result = ""
    for child in node:
        result += compress(child) + operator
    result = result[:-len(operator)]
    return result

def postfix(node):
    for child in node:
        return compress(child) + postfixes[node.type]

def prefix(node):
    for child in node:
        return prefixes[node.type] + compress(child)


#
# Primitives
#

def __number(node):
    return "%s" % node.value

def __string(node):
    return json.dumps(node.value)

def __true(node):
    return "true"

def __false(node):
    return "false"

def __null(node):
    return "null"

def __this(node):
    return "this"
            

#
# Main blocks
#

def __script(node):
    result = ""
    for child in node:
        result += compress(child)
        
        # Verify that each script ends with a semicolon so we can
        # append files after each other without a line feed
        if result[-1] != ";":
            result += ";"
    return result


def __block(node):
    result = "{"
    for child in node:
        result += compress(child) + ";"
            
    result = result[:-1]
    result += "}"

    return result
    
    
def __index(node):
    result = ""
    for pos, child in enumerate(node):
        result += compress(child)
        if pos == 0:
            result += "["
        elif pos == 1:
            result += "]"

    return result    


def __hook(node):
    result = ""
    for pos, child in enumerate(node):
        result += compress(child)
        if pos == 0:
            result += "?"
        elif pos == 1:
            result += ":"

    return result
    

def __var(node):
    result = "var "
    for child in node:
        result += compress(child) + ","
    result = result[:-1]

    return result


def __identifier(node):
    result = node.value

    if hasattr(node, "initializer"):
        result += "=%s" % compress(node.initializer)

    return result
    

def __semicolon(node):
    result = ""
    if node.expression:
        result += compress(node.expression)
    return result


def __call(node):
    result = compress(node[0]) + "("
    for index, child in enumerate(node):
        if index > 0:
            result += compress(child)
    result += ")"
    return result


def __list(node):
    result = ""
    for child in node:
        result += compress(child) + ","
    result = result[:-1]
    return result
        

def __object_init(node):
    result = "{"
    for child in node:
        result += compress(child)
        result += ","
    result = result[:-1] + "}"
    return result


def __array_init(node):
    result = "["
    for child in node:
        result += compress(child)
        result += ","
    result = result[:-1] + "]"
    return result


def __function(node):
    result = "function"
    
    result += "("
    if len(node.params) > 0:
        for param in node.params:
            result += param + ","
        result = result[:-1]
        
    result += "){"
    
    for child in node.body:
        result += compress(child) + ";"
        
    if result.endswith(";"):
        result = result[:-1]
        
    result += "}"
    
    return result
    
    
def __throw(node):
    return "throw " + compress(node.exception)
    
    
def __return(node):
    result = "return"
    if hasattr(node, "value"):
        # TODO: Access to value!!!
        # Micro optimization, don't need a space when a block/map/array is returned
        if not getattr(node.value, "type", None) in ("block", "object_init", "array_init"):
            result += " "
        result += compress(node.value)
    return result
    
    
def __new_with_args(node):
    result = ""
    for child in node:
        if result == "":
            result += "new " + compress(child) + "("
        else:
            result += compress(child)
            
    result += ")"
    return result
    
    
def __assign(node):
    result = ""
    for child in node:
        result += compress(child) + "="
    result = result[:-1]
    return result
    
    
def __if(node):
    result = "if(" + compress(node.condition) + ")" + compress(node.thenPart)
    if hasattr(node, "elsePart"):
        result += "else" 
        # Micro optimization, don't need a space when a block/map/array is returned
        if not getattr(node.value, "type", None) in ("block", "object_init", "array_init"):
            result += " "
        result += compress(node.elsePart)
        
    return result
    
    
def __group(node):
    for child in node:
        return "(" + compress(child) + ")"
        