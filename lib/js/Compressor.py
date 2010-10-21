#
# JavaScript Tools - Compressor Module
# Copyright 2010 Sebastian Werner
# 

import re, sys, json
from js.tokenizer.Lang import keywords
from js.parser.Lang import expressions

__all__ = [ "compress" ]


#
# Shared data
#

__simpleProperty = re.compile("^[a-zA-Z_$][a-zA-Z0-9_$]*$")
__semicolonSymbol = ";"
__commaSymbol = ","
__forcedSemicolon = False


#
# Main
#

def compress(node):
    type = node.type
    result = None
    
    if type in simple:
        result = type
    elif type in prefixes:
        if getattr(node, "postfix", False):
            result = compress(node[0]) + prefixes[node.type]
        else:
            result = prefixes[node.type] + compress(node[0])
            
    elif type in dividers:
        result = dividers[node.type].join(map(compress, node))

    else:
        try:
            result = globals()["__" + type](node)
        except KeyError:
            print("Compressor does not support type '%s' from line %s in file %s" % (type, node.line, node.getFileName()))
            print(node.toJson())
            sys.exit(1)
            
    if getattr(node, "parenthesized", None):
        return "(%s)" % result
    else:
        return result
        
def statements(node):
    result = []
    for child in node:
        result.append(compress(child))

    return "".join(result)
    
def handleForcedSemicolon(node):
    global __forcedSemicolon
    if node.type == "semicolon" and not hasattr(node, "expression"):
        __forcedSemicolon = True

def addSemicolon(result):
    if not result.endswith(__semicolonSymbol):
        return result + __semicolonSymbol
    else:
        return result

def removeSemicolon(result):
    global __forcedSemicolon
    if __forcedSemicolon:
        __forcedSemicolon = False
        return result
    
    if result.endswith(__semicolonSymbol):
        return result[:-len(__semicolonSymbol)]
    else:
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
    "comma"         : ','
}

prefixes = {
    "increment"     : "++",
    "decrement"     : "--",
    "bitwise_not"   : '~',
    "not"           : "!",
    "unary_plus"    : "+",
    "unary_minus"   : "-",
    "delete"        : "delete ",
    "new"           : "new ",
    "typeof"        : "typeof "
}



#
# Script Scope
#

def __script(node):
    return statements(node)



#
# Expressions
#

def __object_init(node):
    return "{%s}" % __commaSymbol.join(map(compress, node))

def __property_init(node):
    key = compress(node[0])
    value = compress(node[1])

    if type(key) in [int,float]:
        pass

    # Protect keywords and special characters
    elif key in keywords or not __simpleProperty.match(key):
        key = __string(node[0])

    return "%s:%s" % (key, value)
        
def __array_init(node):
    def helper(child):
        return compress(child) if child != None else ""
    
    return "[%s]" % ",".join(map(helper, node))

def __array_comp(node):
    return "[%s %s]" % (compress(node.expression), compress(node.tail))    

def __string(node):
    return json.JSONEncoder().encode(node.value)

def __number(node):
    value = node.value
    if int(value) == value:
        value = int(value)
    else:
        conv = str(value)
        if conv.startswith("0."):
            value = conv[1:]

    return "%s" % value

def __regexp(node):
    return node.value

def __identifier(node):
    return node.value

def __list(node):
    return ",".join(map(compress, node))

def __index(node):
    return "%s[%s]" % (compress(node[0]), compress(node[1]))

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
    assignOp = getattr(node, "assignOp", None)
    operator = "=" if not assignOp else dividers[assignOp] + "="
    
    return compress(node[0]) + operator + compress(node[1])

def __call(node):
    return "%s(%s)" % (compress(node[0]), compress(node[1]))

def __new_with_args(node):
    return "new %s(%s)" % (compress(node[0]), compress(node[1]))

def __exception(node):
    return node.value
    
def __generator(node):
    """ Generator Expression """
    result = compress(getattr(node, "expression"))
    tail = getattr(node, "tail", None)
    if tail:
        result += " %s" % compress(tail)

    return result

def __comp_tail(node):
    """  Comprehensions Tails """
    result = compress(getattr(node, "for"))
    guard = getattr(node, "guard", None)
    if guard:
        result += "if(%s)" % compress(guard)

    return result    
    
def __in(node):
    first = compress(node[0])
    second = compress(node[1])
    
    if first.endswith("'") or first.endswith('"'):
        pattern = "%sin %s"
    else:
        pattern = "%s in %s"
    
    return pattern % (first, second)
    
def __instanceof(node):
    first = compress(node[0])
    second = compress(node[1])

    return "%s in %s" % (first, second)    
    
    

#
# Statements :: Core
#

def __block(node):
    return "{%s}" % removeSemicolon(statements(node))
    
def __let_block(node):
    begin = "let(%s)" % ",".join(map(compress, node.variables))
    if hasattr(node, "block"):
        end = compress(node.block)
    elif hasattr(node, "expression"):
        end = compress(node.expression)    
    
    return begin + end

def __const(node):
    return addSemicolon("const %s" % __list(node))

def __var(node):
    return addSemicolon("var %s" % __list(node))

def __let(node):
    return addSemicolon("let %s" % __list(node))

def __semicolon(node):
    expression = getattr(node, "expression", None)
    return addSemicolon(compress(expression) if expression else "")

def __label(node):
    return addSemicolon("%s:%s" % (node.label, compress(node.statement)))

def __break(node):
    return addSemicolon("break" if not hasattr(node, "label") else "break %s" % node.label)

def __continue(node):
    return addSemicolon("continue" if not hasattr(node, "label") else "continue %s" % node.label)


#
# Statements :: Functions
#

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
    result += "(%s)" % compress(params) if params else "()"
    
    # keep expression closure format (may be micro-optimized for other code, too)
    if getattr(node, "expressionClosure", False):
        result += compress(node.body)
    else:
        result += "{%s}" % removeSemicolon(compress(node.body))
        
    return result

def __getter(node):
    return __function(node)
    
def __setter(node):
    return __function(node)
    
def __return(node):
    result = "return"
    if hasattr(node, "value"):
        valueCode = compress(node.value)

        # Micro optimization: Don't need a space when a block/map/array/group/strings are returned
        if not valueCode.startswith(("(","[","{","'",'"')): 
            result += " "

        result += valueCode

    return addSemicolon(result)



#
# Statements :: Exception Handling
#            
    
def __throw(node):
    return addSemicolon("throw %s" % compress(node.exception))

def __try(node):
    result = "try%s" % compress(node.tryBlock)
    
    for catch in node:
        if catch.type == "catch":
            if hasattr(catch, "guard"):
                result += "catch(%s if %s)%s" % (compress(catch.exception), compress(catch.guard), compress(catch.block))
            else:
                result += "catch(%s)%s" % (compress(catch.exception), compress(catch.block))

    if hasattr(node, "finallyBlock"):
        result += "finally%s" % compress(node.finallyBlock)

    return result



#
# Statements :: Loops
#    
    
def __while(node):
    result = "while(%s)%s" % (compress(node.condition), compress(node.body))
    handleForcedSemicolon(node.body)
    return result


def __do(node):
    # block unwrapping don't help to reduce size on this loop type
    # but if it happens (don't like to modify a global function to fix a local issue), we
    # need to fix the body and re-add braces around the statement
    body = compress(node.body)
    if not body.startswith("{"):
        body = "{%s}" % body
        
    return addSemicolon("do%swhile(%s)" % (body, compress(node.condition)))


def __for_in(node):
    # Optional variable declarations
    varDecl = getattr(node, "varDecl", None)

    # Body is optional - at least in comprehensions tails
    body = getattr(node, "body", None)
    if body:
        body = compress(body)
    else:
        body = ""
        
    result = "for(%s in %s)%s" % (compress(node.iterator), compress(node.object), body)
    
    if body:
        handleForcedSemicolon(node.body)
        
    return result
    
    
def __for(node):
    setup = getattr(node, "setup", None)
    condition = getattr(node, "condition", None)
    update = getattr(node, "update", None)

    result = "for("
    result += addSemicolon(compress(setup) if setup else "")
    result += addSemicolon(compress(condition) if condition else "")
    result += compress(update) if update else ""
    result += ")%s" % compress(node.body)

    handleForcedSemicolon(node.body)
    return result
    
       
       
#       
# Statements :: Conditionals
#

def __hook(node):
    """aka ternary operator"""
    condition = node.condition
    thenPart = node.thenPart
    elsePart = node.elsePart
    
    if condition.type == "not":
        [thenPart,elsePart] = [elsePart,thenPart]
        condition = condition[0]
    
    return "%s?%s:%s" % (compress(condition), compress(thenPart), compress(elsePart))
    
    
def __if(node):
    result = "if(%s)%s" % (compress(node.condition), compress(node.thenPart))

    elsePart = getattr(node, "elsePart", None)
    if elsePart:
        result += "else"

        elseCode = compress(elsePart)
        
        # Micro optimization: Don't need a space when the child is a block
        # At this time the brace could not be part of a map declaration (would be a syntax error)
        if not elseCode.startswith(("{", "(")):
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
            temp = compress(statement)
            if len(temp) > 0:
                result += addSemicolon(temp)
        
    return "%s}" % removeSemicolon(result)
        