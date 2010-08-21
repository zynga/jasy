#
# JavaScript Tools - Compressor Module
# Copyright 2010 Sebastian Werner
# 

import re, sys, json
from js.Lang import keywords

__all__ = [ "compress" ]

COMBINE_DECLARATION = False


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


def block_unwrap(node):
    if node.type == "block" and len(node) == 1:
        return compress(node[0])
    else:
        return compress(node)
        
        
def statements(node):
    result = u""
    length = len(node)-1
    for pos, child in enumerate(node):
        code = compress(child)
        if code == "":
            continue
            
        result += code
        
        # Micro-Optimization: Omit semicolon in places where not required
        # Rule: Closing brace of the original child make a semicolon optional        
        
        # Functions might be defined as a modern expression closure without braces
        if child.type == "function" and not getattr(child, "expressionClosure", False):
            continue
            
        # Switch/Try statements must have braces
        if child.type in ("switch", "try"):
            continue
            
        # If blocks might have braces for both, if and else
        if child.type == "if" and len(child.thenPart) != 1:
            continue        
            
        # Loops might have braces => check body
        if child.type in ("while", "for_in", "for") and len(child.body) != 1:
            continue
            
        # Micro-Optimization: Omit semicolon on last statement
        if pos != length:
            result += ";"

    return result

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
    value = node.value
    if int(value) == value:
        value = int(value)
    else:
        conv = str(value)
        if conv.startswith("0."):
            value = conv[1:]
            
    return u"%s" % value

def __string(node):
    return json.JSONEncoder().encode(node.value)

def __object_init(node):
    return u"{%s}" % u",".join(map(compress, node))

def __array_init(node):
    def helper(child):
        return compress(child) if child != None else ""
    
    return u"[%s]" % u",".join(map(helper, node))
            
def __property_init(node):
    key = compress(node[0])
    value = compress(node[1])
    
    # Protect keywords
    if key in keywords:
        key = '"%s"' % key
    
    return u"%s:%s" % (key, value)

#
# Core features
#

def __script(node):
    result = ""

    if COMBINE_DECLARATION:
        varList = node.varDecls
        if varList:
            result += "var %s;" % ",".join(map(lambda node: node.value, varList))
    
    result += statements(node)
    
    # add file separator semicolon
    if not hasattr(node, "parent") and not result.endswith(";"):
        result += ";"
    
    return result

def __block(node):
    return "{%s}" % statements(node)
    
def __let_block(node):
    begin = u"let(%s)" % u",".join(map(compress, node.variables))
    if hasattr(node, "block"):
        end = compress(node.block)
    elif hasattr(node, "expression"):
        end = compress(node.expression)    
    
    return begin + end
    
def __group(node):
    return "(%s)" % compress(node[0])

def __identifier(node):
    return node.value
        
def __const(node):
    return u"const %s" % u",".join(map(compress, node))

def __var(node):
    if COMBINE_DECLARATION:
        result = []
        for child in node:
            initializer = getattr(child, "initializer", None)
            if initializer:
                result.append(u"%s=%s" % (child.value, compress(initializer)))
        return u",".join(result)
        
    else:
        return u"var %s" % u",".join(map(compress, node))

def __let(node):
    return u"let %s" % u",".join(map(compress, node))

def __list(node):
    return ",".join(map(compress, node))
        
def __index(node):
    return "%s[%s]" % (compress(node[0]), compress(node[1]))

def __semicolon(node):
    expr = getattr(node, "expression", None)
    return "" if not expr else compress(expr)

def __declaration(node):
    names = getattr(node, "names", None)
    if names:
        result = compress(names)
    else:
        result = node.name    
    
    initializer = getattr(node, "initializer", None)
    if initializer:
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
    if node.type == "setter":
        result = "set"
    elif node.type == "getter":
        result = "get"
    else:
        result = "function"
        
    name = getattr(node, "name", None)
    if name:
        result += " %s" % name
    
    params = getattr(node, "params", None)
    result += "(%s)" % compress(params) if params else ""
    
    # keep expression closure format (may be micro-optimized for other code, too)
    if getattr(node, "expressionClosure", False):
        result += compress(node.body)
    else:
        result += "{%s}" % compress(node.body)
        
    return result
    
def __generator(node):
    result = compress(getattr(node, "expression"))
    tail = getattr(node, "tail", None)
    if tail:
        result += " %s" % compress(tail)
        
    return result

def __comp_tail(node):
    result = compress(getattr(node, "for"))
    guard = getattr(node, "guard", None)
    if guard:
        result += "if(%s)" % compress(guard)
        
    return result

def __getter(node):
    return __function(node)
    
def __setter(node):
    return __function(node)
    
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
    
    for catch in node:
        if catch.type == "catch":
            if hasattr(catch, "guard"):
                result += "catch(%s if %s)%s" % (catch.varName, compress(catch.guard), compress(catch.block))
            else:
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
    return "while(%s)%s" % (compress(node.condition), block_unwrap(node.body))

def __do(node):
    # block unwrapping don't help to reduce size on this loop type
    return "do%swhile(%s)" % (compress(node.body), compress(node.condition))

def __for_in(node):
    # Optional variable declarations
    varDecl = getattr(node, "varDecl", None)

    # Body is optional - at least in comprehensions tails
    body = getattr(node, "body", None)
    if body:
        body = block_unwrap(body)
    else:
        body = ""
    
    return "for(%s in %s)%s" % (compress(node.iterator), compress(node.object), body)
    
def __for(node):
    result = "for("
    
    setup = getattr(node, "setup", None)
    condition = getattr(node, "condition", None)
    update = getattr(node, "update", None)
    
    if setup: result += compress(setup)
    result += ";"
    if condition: result += compress(condition)
    result += ";"
    if update: result += compress(update)
        
    result += ")%s" % block_unwrap(node.body)
    
    return result
    
       
       
#       
# Conditionals
#

def __hook(node):
    """aka ternary operator"""
    return "%s?%s:%s" % (compress(node.condition), compress(node.thenPart), compress(node.elsePart))
    

def __if(node):
    result = "if(%s)" % compress(node.condition)
    
    # Micro optimization: Omit block curly braces when it only contains one child
    result += block_unwrap(node.thenPart)
    
    elsePart = getattr(node, "elsePart", None)
    if elsePart:
        # if-blocks without braces require a semicolon here
        if not result.endswith((";","}")): 
            result += ";"            
        
        result += "else" 
        
        # Micro optimization: Omit curly braces when block contains only one child
        elseCode = block_unwrap(elsePart)
        
        # Micro optimization: Don't need a space when the child is a block/map/array/group
        if not elseCode.startswith(("(","[","{")): 
            result += " "        
            
        result += elseCode
        
    return result
    
        
def __switch(node):
    result = "switch(%s){" % compress(node.discriminant)
    for case in node:
        if case.type == "case":
            result += "case %s:" % compress(case.label)
        elif case.type == "default":
            result += "default:"
        else:
            continue
        
        for statement in case.statements:
            result += compress(statement) + ";"
        
    if result.endswith(";"):
        result = result[:-1]
        
    result += "}"
    return result
        