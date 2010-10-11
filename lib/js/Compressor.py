#
# JavaScript Tools - Compressor Module
# Copyright 2010 Sebastian Werner
# 

import re, sys, json
from js.tokenizer.Lang import keywords

__all__ = [ "compress" ]


#
# Shared data
#

__simpleProperty = re.compile("^[a-zA-Z_$][a-zA-Z0-9_$]*$")
__semicolonSymbol = ";\n"


#
# Status flags
#

__endsBlock = False


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
            print("Compressor does not support type '%s' from line %s in file %s" % (type, node.line, node.getFileName()))
            print(node.toJson())
            sys.exit(1)
        
        
def statements(node):
    result = ""
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
            result += __semicolonSymbol

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
            
    return "%s" % value

def __string(node):
    return json.JSONEncoder().encode(node.value)

def __object_init(node):
    return "{%s}" % ",".join(map(compress, node))

def __array_init(node):
    def helper(child):
        return compress(child) if child != None else ""
    
    return "[%s]" % ",".join(map(helper, node))
          
def __array_comp(node):
    return "[%s %s]" % (compress(node.expression), compress(node.tail))
            
def __property_init(node):
    key = compress(node[0])
    value = compress(node[1])
    
    if type(key) in [int,float]:
        pass
        
    # Protect keywords and special characters
    elif key in keywords or not __simpleProperty.match(key):
        key = '"%s"' % key
    
    return "%s:%s" % (key, value)

#
# Core features
#

def __script(node):
    result = statements(node)
    
    # add file separator semicolon
    if not hasattr(node, "parent") and not result.endswith(__semicolonSymbol):
        result += __semicolonSymbol
    
    return result

def __block(node):
    global __endsBlock
    
    if len(node) == 1:
        result = compress(node[0])
        
        # Need to add a semicolon
        # when the last character in the result string
        # was not created by an ending block (pretty magic)
        if not __endsBlock and not result.endswith(__semicolonSymbol) :
            result = result + __semicolonSymbol
            
        endsblock = False
        return result
    
    result = "{%s}" % statements(node)
    __endsBlock = True
    
    return result
    
def __let_block(node):
    begin = "let(%s)" % ",".join(map(compress, node.variables))
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
    return "const %s" % ",".join(map(compress, node))

def __var(node):
    return "var %s" % ",".join(map(compress, node))

def __let(node):
    return "let %s" % ",".join(map(compress, node))

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
    global __endsBlock
    
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
    result += "(%s)" % compress(params) if params else "()"
    
    # keep expression closure format (may be micro-optimized for other code, too)
    if getattr(node, "expressionClosure", False):
        result += compress(node.body)
    else:
        result += "{%s}" % compress(node.body)
        __endsBlock = True
        
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
    global __endsBlock
    
    result = "try{%s}" % statements(node.tryBlock)
    
    for catch in node:
        if catch.type == "catch":
            if hasattr(catch, "guard"):
                result += "catch(%s if %s){%s}" % (compress(catch.exception), compress(catch.guard), statements(catch.block))
            else:
                result += "catch(%s){%s}" % (compress(catch.exception), statements(catch.block))

    if hasattr(node, "finallyBlock"):
        result += "finally{%s}" % statements(node.finallyBlock)

    # Try statement is like a block
    __endsBlock = True

    return result

def __exception(node):
    return node.value

    
    
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
    body = compress(node.body)
    return "while(%s)%s" % (compress(node.condition), body)


def __do(node):
    # block unwrapping don't help to reduce size on this loop type
    # but if it happens (don't like to modify a global function to fix a local issue), we
    # need to fix the body and re-add braces around the statement
    body = compress(node.body)
    if not body.startswith("{"):
        body = "{%s}" % body
        
    return "do%swhile(%s)" % (body, compress(node.condition))


def __for_in(node):
    # Optional variable declarations
    varDecl = getattr(node, "varDecl", None)

    # Body is optional - at least in comprehensions tails
    body = getattr(node, "body", None)
    if body:
        body = compress(body)
    else:
        body = ""
    
    return "for(%s in %s)%s" % (compress(node.iterator), compress(node.object), body)
    
    
def __for(node):
    result = "for("
    
    setup = getattr(node, "setup", None)
    condition = getattr(node, "condition", None)
    update = getattr(node, "update", None)
    
    if setup: result += compress(setup)
    result += __semicolonSymbol
    if condition: result += compress(condition)
    result += __semicolonSymbol
    if update: result += compress(update)
        
    body = compress(node.body)
    result += ")%s" % body
    
    return result
    
       
       
#       
# Conditionals
#

def __hook(node):
    """aka ternary operator"""
    return "%s?%s:%s" % (compress(node.condition), compress(node.thenPart), compress(node.elsePart))
    

def __if(node):
    result = "if(%s)" % compress(node.condition)
    result += compress(node.thenPart)
    
    elsePart = getattr(node, "elsePart", None)
    if elsePart:
        result += "else"

        elseCode = compress(elsePart)
        
        # Micro optimization: Don't need a space when the child is a block
        # At this time the brace could not be part of a map declaration (would be a syntax error)
        if not elseCode.startswith("{"):
            result += " "        
            
        result += elseCode
        
    return result
    
        
def __switch(node):
    global __endsBlock
    
    result = "switch(%s){" % compress(node.discriminant)
    for case in node:
        if case.type == "case":
            result += "case %s:" % compress(case.label)
        elif case.type == "default":
            result += "default:"
        else:
            continue
        
        for statement in case.statements:
            result += compress(statement) + __semicolonSymbol
        
    if result.endswith(__semicolonSymbol):
        result = result[:-len(__semicolonSymbol)]
        
    result += "}"
    
    # Switch statement is like a block
    __endsBlock = True
    
    return result
        