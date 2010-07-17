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

import re



#
# Main
#

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
            raise KeyError



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
    '\\': '\\\\',
    '"': '\\"',
    '\b': '\\b',
    '\f': '\\f',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
}



#
# Shared features
#

def divider(node):
    operator = dividers[node.type]
    result = u""
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
    return "for(%s in %s)%s" % (compress(node.iterator), compress(node.object), compress(node.body))

    
def __while(node):
    return "while(%s)%s" % (compress(node.condition), compress(node.body))


def __do(node):
    return "do%swhile(%s)" % (compress(node.body), compress(node.condition))
        
       
       
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
        