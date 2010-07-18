#
# JavaScript Tools - Compressor Module
# Copyright 2010 Sebastian Werner
# 
# ---------------------------------------------------------------------------------------------
#
# Uses code by:
#
# Copyright (c) 2006 Bob Ippolito
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
# of the Software, and to permit persons to whom the Software is furnished to do
# so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

import re, sys

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
            print "Compressor does not support type: %s from line: %s" % (type, node.line)
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
# String encoder
# Borrowed from SimpleJSON
#

ESCAPE = re.compile(r'[\x00-\x1f\\"\b\f\n\r\t]')
ESCAPE_DCT = {
    '\\' : '\\\\',
    '"'  : '\\"',
    '\b' : '\\b',
    '\f' : '\\f',
    '\n' : '\\n',
    '\r' : '\\r',
    '\t' : '\\t',
}


#
# Data types
#

def __regexp(node):
    return node.value

def __number(node):
    return u"%s" % node.value

def __string(node):
    """Return a JSON representation of a Python string"""
    def replace(match):
        return ESCAPE_DCT[match.group(0)]
        
    return '"' + ESCAPE.sub(replace, node.value) + '"'

def __object_init(node):
    return u"{%s}" % u",".join(map(compress, node))

def __array_init(node):
    return u"[%s]" % u",".join(map(compress, node))
            

#
# Structure blocks
#

def __script(node):
    result = u""
    for child in node:
        result += compress(child)
        
        if result[-1] != ";":
            result += ";"
        
    return result


def __block(node):
    return u"{%s}" % u";".join(map(compress, node))
    
def __const(node):
    return u"const %s" % u",".join(map(compress, node))

def __var(node):
    return u"var %s" % u",".join(map(compress, node))
    

def __list(node):
    result = ""
    if len(node) > 0:
        for child in node:
            result += compress(child) + ","
        result = result[:-1]
    return result
            
    
def __group(node):
    for child in node:
        return "(%s)" % compress(child)
    
    
def __index(node):
    return "%s[%s]" % (compress(node[0]), compress(node[1]))


def __identifier(node):
    result = node.value

    if hasattr(node, "initializer"):
        result += "=%s" % compress(node.initializer)

    return result
    

def __semicolon(node):
    return "" if not node.expression else compress(node.expression)



#
# Functions
#

def __call(node):
    return "%s(%s)" % (compress(node[0]), compress(node[1]))
    
def __new_with_args(node):
    return "new %s(%s)" % (compress(node[0]), compress(node[1]))    

def __function(node):
    result = "function"
    if hasattr(node, "name"):
        result += " %s" % node.name
    
    result += "(%s){%s}" % (",".join(node.params), ";".join(map(compress, node.body)))    
    return result
    
    
def __return(node):
    result = "return"
    if hasattr(node, "value"):
        valueCode = compress(node.value)

        # Micro optimization, don't need a space when a block/map/array is returned
        if not valueCode.startswith(("[","{")): result += " "
        result += valueCode
        
    return result
    
        
      
#
# Exception Handling
#            
    
def __throw(node):
    return "throw %s" % compress(node.exception)

def __try(node):
    result = "try%s" % compress(node.tryBlock)
    
    for catch in node.catchClauses:
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
    result = "if(%s)%s" % (compress(node.condition), compress(node.thenPart))
    if hasattr(node, "elsePart"):
        result += "else" 
        elseCode = compress(node.elsePart)
        
        # Micro optimization, don't need a space when the child is a block/map/array
        if not elseCode.startswith(("[","{")): result += " "        
        result += elseCode
        
    return result
    
        
def __switch(node):
    result = "switch(%s){" % compress(node.discriminant)
    for case in node.cases:
        if hasattr(case, "caseLabel"):
            result += "case %s:" % compress(case.caseLabel)
        else:
            result += "default:"
        
        for statement in case.statements:
            result += compress(statement) + ";"
        
    result += "}"
    return result
        