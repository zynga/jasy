#
# JavaScript Tools - Compressor Module
# Copyright 2010 Sebastian Werner
# 

import re, sys, json

__all__ = [ "compress" ]


#
# Main
#

def compress(node):
    type = node.type
    
    if type in simple:
        return type
    elif type in prefixes:
        return prefixes[node.type] + compress(node[0])
    elif type in postfixes:
        return compress(node[0]) + postfixes[node.type]
    elif type in dividers:
        return dividers[node.type].join(map(compress, node))
    else:
        try:
            return globals()["__" + type](node)
        except KeyError:
            print "Compressor does not support type '%s' from line %s in file %s" % (type, node.line, node.getFileName())
            print node.toJson()
            sys.exit(1)



#
# Data
#

simple = ["true", "false", "null", "this", "debugger"]

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
# Data types
#

def __regexp(node):
    return node.value

def __number(node):
    return u"%s" % node.value

def __string(node):
    return json.JSONEncoder().encode(node.value)

def __object_init(node):
    return u"{%s}" % u",".join(map(compress, node))

def __array_init(node):
    return u"[%s]" % u",".join(map(compress, node))
            

#
# Core features
#

def __script(node):
    result = u""
    for child in node:
        result += compress(child)
        
        if result[-1] != ";":
            result += ";"
        
    return result

def __block(node, simplify=False):
    if simplify and len(node) == 1:
        return compress(node[0])
    else:
        return u"{%s}" % u";".join(map(compress, node))
    
def __let_block(node):
    begin = u"let(%s)" % u",".join(map(compress, node.variables))
    if hasattr(node, "block"):
        end = compress(node.block)
    elif hasattr(node, "expression"):
        end = compress(node.expression)    
    
    return begin + end
    
def __group(node):
    return "(%s)" % compress(node[0])

def __const(node):
    return u"const %s" % u",".join(map(compress, node))

def __var(node):
    return u"var %s" % u",".join(map(compress, node))

def __let(node):
    return u"let %s" % u",".join(map(compress, node))

def __list(node):
    return ",".join(map(compress, node))
        
def __index(node):
    return "%s[%s]" % (compress(node[0]), compress(node[1]))

def __semicolon(node):
    return "" if not node.expression else compress(node.expression)

def __identifier(node):
    result = node.value

    if hasattr(node, "initializer"):
        result += "=%s" % compress(node.initializer)

    return result
    
def __assign(node):
    dist = node[0]
    source = node[1]

    assignOp = getattr(node[0], "assignOp", None)
    oper = "=" if not assignOp else dividers[assignOp] + "="

    return compress(node[0]) + oper + compress(node[1])


#
# Functions
#

def __call(node):
    return "%s(%s)" % (compress(node[0]), compress(node[1]))
    
def __new_with_args(node):
    return "new %s(%s)" % (compress(node[0]), compress(node[1]))    

def __function(node):
    result = "function"
    if hasattr(node, "value"):
        result += " %s" % node.value
    
    result += "(%s)" % (",".join(node.params))
    
    if node.functionForm == "expressed_form":
        result += compress(node.body)
    else:
        result += "{%s}" % (";".join(map(compress, node.body)))    
        
    return result
    
def __return(node):
    result = "return"
    if hasattr(node, "value"):
        valueCode = compress(node.value)

        # Micro optimization: Don't need a space when a block/map/array/group is returned
        if not valueCode.startswith(("(","[","{")): 
            result += " "
            
        result += valueCode
        
    return result
    
        
      
#
# Exception Handling
#            
    
def __throw(node):
    return "throw %s" % compress(node.exception)

def __try(node):
    result = "try%s" % compress(node.tryBlock)
    
    for catch in node.catches:
        result += "catch(%s)%s" % (catch.varName, compress(catch.block))

    if hasattr(node, "finallyBlock"):
        result += "finally%s" % compress(node.finallyBlock)

    return result

    
    
#
# Flow
#    
    
def __label(node):
    return "%s:%s" % (node.label, compress(node.statement))
    
def __break(node):
    return "break" if not hasattr(node, "label") else "break %s" % node.label

def __continue(node):
    return "continue" if not hasattr(node, "label") else "continue %s" % node.label

    

#
# Loops
#    
    
def __while(node):
    return "while(%s)%s" % (compress(node.condition), compress(node.body))

def __do(node):
    return "do%swhile(%s)" % (compress(node.body), compress(node.condition))

def __for_in(node):
    return "for(%s in %s)%s" % (compress(node.iterator), compress(node.object), compress(node.body))
    
def __for(node):
    result = "for("
    
    if node.setup: result += compress(node.setup)
    result += ";"
    if node.condition: result += compress(node.condition)
    result += ";"
    if node.update: result += compress(node.update)
        
    result += ")%s" % compress(node.body)
    
    return result
    
       
       
#       
# Conditionals
#

def __hook(node):
    """aka ternary operator"""
    result = ""
    for pos, child in enumerate(node):
        result += compress(child)
        if pos == 0:
            result += "?"
        elif pos == 1:
            result += ":"

    return result
    

def __if(node):
    result = "if(%s)" % compress(node.condition)
    
    # Micro optimization: Omit block curly braces when it only contains one child
    if node.thenPart.type == "block":
        result += __block(node.thenPart, True)
    else:
        result += compress(node.thenPart)
    
    if hasattr(node, "elsePart"):
        # if-blocks without braces require a semicolon here
        if not result.endswith((";","}")): 
            result += ";"            
        
        result += "else" 
        
        # Micro optimization: Omit curly braces when block contains only one child
        if node.elsePart.type == "block":
            elseCode = __block(node.elsePart, True)
        else:
            elseCode = compress(node.elsePart)
        
        # Micro optimization: Don't need a space when the child is a block/map/array/group
        if not elseCode.startswith(("(","[","{")): 
            result += " "        
            
        result += elseCode
        
    return result
    
        
def __switch(node):
    result = "switch(%s){" % compress(node.discriminant)
    for case in node.cases:
        if hasattr(case, "label"):
            result += "case %s:" % compress(case.label)
        else:
            result += "default:"
        
        for statement in case.statements:
            result += compress(statement) + ";"
        
    result += "}"
    return result
        