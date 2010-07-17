import simplejson as json
import sys

def compress(node):
    type = node.type
    
    if type in simple:
        return type
    elif type in prefixes:
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


simple = ["true","false","null","this","debugger"]

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
    "bitwise_or"    : '|',    
    "bitwise_xor"   : '^',    
    "bitwise_and"   : '&',    
    "comma"         : ',',
    "instanceof"    : ' instanceof ',
    "in"            : ' in ',
}

postfixes = {
    "increment"     : "++",
    "decrement"     : "--",
}

prefixes = {
    "bitwise_not"   : '~',
    "not"           : "!",
    "unary_plus"    : "+",
    "unary_minus"   : "-",
    "delete"        : "delete ",
    "new"           : "new ",
    "typeof"        : "typeof "
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
# Value types
#

def __regexp(node):
    return node.value

def __number(node):
    return "%s" % node.value

def __string(node):
    return json.dumps(node.value)

def __object_init(node):
    result = "{"
    if len(node) > 0: 
        for child in node:
            result += compress(child) + ","
        result = result[:-1]

    result += "}"
    return result

def __array_init(node):
    result = "["
    if len(node) > 0: 
        for child in node:
            result += compress(child) + ","
        result = result[:-1]

    result += "]"
    return result
            

#
# Structure blocks
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

    if len(node) > 0: 
        for child in node:
            result += compress(child) + ";"        
        result = result[:-1]
        
    result += "}"
    return result

    
def __const(node):
    result = "const "
    for child in node:
        result += compress(child) + ","

    result = result[:-1]
    return result


def __var(node):
    result = "var "
    for child in node:
        result += compress(child) + ","

    result = result[:-1]
    return result    
    
    
def __group(node):
    for child in node:
        return "(%s)" % compress(child)
    
    
def __index(node):
    result = ""
    for pos, child in enumerate(node):
        result += compress(child)
        if pos == 0:
            result += "["
        elif pos == 1:
            result += "]"

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


def __list(node):
    result = ""
    for child in node:
        result += compress(child) + ","
    result = result[:-1]
    return result

    
def __assign(node):
    # may be multi assign
    result = ""
    for child in node:
        result += compress(child) + "="

    # remove last trailing equal sign when no further child is there
    result = result[:-1]
    return result



#
# Functions
#

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
    
    
def __call(node):
    result = compress(node[0]) + "("
    for index, child in enumerate(node):
        if index > 0:
            result += compress(child)
    result += ")"
    return result
    
    
def __new_with_args(node):
    return "new %s(%s)" % (compress(node[0]), compress(node[1]))    
            
    
def __return(node):
    result = "return"
    if hasattr(node, "value"):
        # Micro optimization, don't need a space when a block/map/array is returned
        if not getattr(node.value, "type", None) in ("block", "object_init", "array_init"):
            result += " "
        result += compress(node.value)
    return result
    
        
      
#
# Exception Handling
#            
    
def __try(node):
    result = "try" + compress(node.tryBlock)
    
    for catch in node.catchClauses:
        result += "catch(" + catch.varName + ")" + compress(catch.block)

    if hasattr(node, "finallyBlock"):
        result += "finally" + compress(node.finallyBlock)

    return result
    
    
def __throw(node):
    return "throw " + compress(node.exception)    
    
    

#
# Flow
#    
    
def __break(node):
    if hasattr(node, "label"):
        return "break %s" % node.label
    else:
        return "break"


def __continue(node):
    if hasattr(node, "label"):
        return "continue %s" % node.label
    else:
        return "continue"
    

#
# Loops
#    
    
def __for(node):
    result = "for("
    
    setup = node.setup
    if setup: result += compress(setup)
    result += ";"
    
    condition = node.condition
    if condition: result += compress(condition)
    result += ";"
    
    update = node.update
    if update: result += compress(update)
        
    result += ")" + compress(node.body)
    
    return result
    
        
def __for_in(node):
    return "for(" + compress(node.iterator) + " in " + compress(node.object) + ")" + compress(node.body)

    
def __while(node):
    return "while(" + compress(node.condition) + ")" + compress(node.body)


def __do(node):
    return "do" + compress(node.body) + "while(" + compress(node.condition) + ")"
        
       
       
#       
# Conditionals
#

def __hook(node):
    result = ""
    for pos, child in enumerate(node):
        result += compress(child)
        if pos == 0:
            result += "?"
        elif pos == 1:
            result += ":"

    return result
    

def __if(node):
    result = "if(" + compress(node.condition) + ")" + compress(node.thenPart)
    if hasattr(node, "elsePart"):
        result += "else" 
        elseCode = compress(node.elsePart)
        
        # Micro optimization, don't need a space when a block/map/array is returned
        if not elseCode[0] in ["{","["]:
            result += " "
        
        result += elseCode
        
    return result
    
        
def __switch(node):
    result = "switch(" + compress(node.discriminant) + "){"
    for case in node.cases:
        if hasattr(case, "caseLabel"):
            result += "case " + compress(case.caseLabel) + ":"
        else:
            result += "default:"
        
        for statement in case.statements:
            result += compress(statement) + ";"
        
    result += "}"
    return result
        