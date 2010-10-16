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
__semicolonSymbol = ";\n"
__commaSymbol = ",\n"


#
# Main
#

def compress(node):
    type = node.type
    result = None
    
    if type in simple:
        result = type
    elif type in prefixes:
        result = prefixes[node.type] + compress(node[0])
    elif type in postfixes:
        result = compress(node[0]) + postfixes[node.type]
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
        if pos != length and not result.endswith(__semicolonSymbol):
            result += __semicolonSymbol

    return result
    

def assignOperator(node):
    assignOp = getattr(node, "assignOp", None)
    return "=" if not assignOp else dividers[assignOp] + "="
            

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
    return "{%s}" % __commaSymbol.join(map(compress, node))

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
        key = __string(node[0])
    
    return "%s:%s" % (key, value)

#
# Core features
#

def __script(node):
    return statements(node)

def __block(node):
    if len(node) == 0:
        return __semicolonSymbol
    
    elif len(node) == 1:
        return compress(node[0])
    
    compressed = statements(node)
    if compressed.endswith(__semicolonSymbol):
        compressed = compressed[:-len(__semicolonSymbol)]
    
    return "{%s}" % compressed
    
def __let_block(node):
    begin = "let(%s)" % ",".join(map(compress, node.variables))
    if hasattr(node, "block"):
        end = compress(node.block)
    elif hasattr(node, "expression"):
        end = compress(node.expression)    
    
    return begin + end

def __identifier(node):
    return node.value
    
def __const(node):
    return "const %s%s" % (__list(node), __semicolonSymbol)

def __var(node):
    return "var %s%s" % (__list(node), __semicolonSymbol)

def __let(node):
    return "let %s%s" % (__list(node), __semicolonSymbol)

def __list(node):
    return ",".join(map(compress, node))
        
def __index(node):
    return "%s[%s]" % (compress(node[0]), compress(node[1]))

def __semicolon(node):
    expression = getattr(node, "expression", None)
    code = "%s" % compress(expression) if expression else ""
    
    return "%s%s" % (code, __semicolonSymbol)

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
    result = compress(node[0]) + assignOperator(node[0]) + compress(node[1])
    
    return result


#
# Functions
#

def __call(node):
    result = "%s(%s)" % (compress(node[0]), compress(node[1]))
    return result
    
def __new_with_args(node):
    result = "new %s(%s)" % (compress(node[0]), compress(node[1]))
    return result
    

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
        body = compress(node.body)
        
        if body.endswith(__semicolonSymbol):
            body = body[:-len(__semicolonSymbol)]
        
        result += "{%s}" % body
        
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
        if not valueCode.startswith(("(","[","{","'",'"')): 
            result += " "
            
        result += valueCode
                
    return result
    
        
      
#
# Exception Handling
#            
    
def __throw(node):
    return "throw %s" % compress(node.exception)

def __try(node):
    result = "try{%s}" % statements(node.tryBlock)
    
    for catch in node:
        if catch.type == "catch":
            if hasattr(catch, "guard"):
                result += "catch(%s if %s){%s}" % (compress(catch.exception), compress(catch.guard), statements(catch.block))
            else:
                result += "catch(%s){%s}" % (compress(catch.exception), statements(catch.block))

    if hasattr(node, "finallyBlock"):
        result += "finally{%s}" % statements(node.finallyBlock)

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
    condition = node.condition
    thenPart = node.thenPart
    elsePart = node.elsePart
    
    if condition.type == "not":
        [thenPart,elsePart] = [elsePart,thenPart]
        condition = condition[0]
    
    return "%s?%s:%s" % (compress(condition), compress(thenPart), compress(elsePart))
    
    
def containsIf(node):
    """ helper for __if handling """
    if node.type == "if":
        return True
        
    for child in node:
        if containsIf(child):
            return True
        
    return False


def __if(node):
    thenPart = node.thenPart
    condition = node.condition
    elsePart = getattr(node, "elsePart", None)
    
    # Optimize "not" expression
    if thenPart and elsePart and condition.type == "not":
        [thenPart,elsePart] = [elsePart,thenPart]
        condition = condition[0]
    
    
    # Pre-checks for deeper optimization
    if thenPart and elsePart:
        thenContent = thenPart[0] if thenPart.type == "block" and len(thenPart) == 1 else thenPart
        elseContent = elsePart[0] if elsePart.type == "block" and len(elsePart) == 1 else elsePart

        # Our strategy for if-else is to use hooks/ternary operators to create
        # a more compact alternative to the classic if-else construction.
        # There is only a little limitation that hooks only works with expressions 
        # and not typical statements. Semicolon statements are typically wrappers
        # around expression, so we directly filter them out here.
        if thenContent.type == "semicolon":
            thenContent = thenContent.expression
        if elseContent.type == "semicolon":
            elseContent = elseContent.expression
        
        # Merge equal types. This works very well for "return" and "assign" statements
        # and creates even more compact versions than the normal hook translation.
        if thenContent.type == elseContent.type:
            # Merge return statements
            if thenContent.type == "return":
                return "return %s?%s:%s" % (compress(condition), compress(thenContent.value), compress(elseContent.value))
                
            elif thenContent.type == "assign":
                operator = assignOperator(thenContent)
                if operator == assignOperator(elseContent):
                    firstTargetCode = compress(thenContent[0])
                    if firstTargetCode == compress(elseContent[0]):
                        return "%s%s%s?%s:%s" % (firstTargetCode, operator, compress(condition), compress(thenContent[1]), compress(elseContent[1]))
        
        # Reached the original idea to use hook statements instead of if-else constructs
        if thenContent.type != "comma" and thenContent.type in expressions and elseContent.type != "comma" and elseContent.type in expressions:
            return "%s?%s:%s" % (compress(condition), compress(thenContent), compress(elseContent))
        
    else:
        pass
        #if condition.type == "not":
        #    result = "%s||%s" % (compress(condition[0]), compress(thenPart))
        #else:
        #    result = "%s&&%s" % (compress(condition), compress(thenPart))
        #
        #return result
        
    
    
    # The normal if-compression
    result = "if(%s)" % compress(condition)
    thenCode = compress(thenPart)

    if elsePart:
        # Special handling for cascaded if-else-if cases where the else might be 
        # attached to the wrong if in cases where the braces are omitted.
        if len(thenPart) == 1 and containsIf(thenPart):
            if thenCode.endswith(__semicolonSymbol):
                thenCode = "{%s}" % thenCode[:-len(__semicolonSymbol)]
            else:
                thenCode = "{%s}" % thenCode
    
    # Finally append code
    result += thenCode 

    # Now process else part
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
            result += temp
            if len(temp) > 0 and not temp.endswith(__semicolonSymbol):
                result += __semicolonSymbol
        
    if result.endswith(__semicolonSymbol):
        result = result[:-len(__semicolonSymbol)]
        
    result += "}"
    
    return result
        