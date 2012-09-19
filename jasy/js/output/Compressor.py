#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import re, sys, json

from jasy.js.tokenize.Lang import keywords
from jasy.js.parse.Lang import expressions, futureReserved

all = [ "Compressor" ]

high_unicode = re.compile(r"\\u[2-9a-fA-F]{2}[0-9A-Fa-f]{2}")
ascii_encoder = json.JSONEncoder(ensure_ascii=True)
unicode_encoder = json.JSONEncoder(ensure_ascii=False)

#
# Class
#

class Compressor:
    __semicolonSymbol = ";"
    __commaSymbol = ","
    

    def __init__(self, format=None):
        if format:
            if format.has("semicolon"):
                self.__semicolonSymbol = ";\n"
            
            if format.has("comma"):
                self.__commaSymbol = ",\n"
            
        self.__forcedSemicolon = False



    #
    # Main
    #

    def compress(self, node):
        type = node.type
        result = None
    
        if type in self.__simple:
            result = type
        elif type in self.__prefixes:
            if getattr(node, "postfix", False):
                result = self.compress(node[0]) + self.__prefixes[node.type]
            else:
                result = self.__prefixes[node.type] + self.compress(node[0])
        
        elif type in self.__dividers:
            first = self.compress(node[0])
            second = self.compress(node[1])
            divider = self.__dividers[node.type]
            
            # Fast path
            if node.type not in ("plus", "minus"):
                result = "%s%s%s" % (first, divider, second)
                
            # Special code for dealing with situations like x + ++y and y-- - x
            else:
                result = first
                if first.endswith(divider):
                    result += " "
            
                result += divider
            
                if second.startswith(divider):
                    result += " "
                
                result += second

        else:
            try:
                result = getattr(self, "type_%s" % type)(node)
            except KeyError:
                print("Compressor does not support type '%s' from line %s in file %s" % (type, node.line, node.getFileName()))
                sys.exit(1)
            
        if getattr(node, "parenthesized", None):
            return "(%s)" % result
        else:
            return result
    
    
    
    #
    # Helpers
    #
    
    def __statements(self, node):
        result = []
        for child in node:
            result.append(self.compress(child))

        return "".join(result)
    
    def __handleForcedSemicolon(self, node):
        if node.type == "semicolon" and not hasattr(node, "expression"):
            self.__forcedSemicolon = True

    def __addSemicolon(self, result):
        if not result.endswith(self.__semicolonSymbol):
            if self.__forcedSemicolon:
                self.__forcedSemicolon = False
        
            return result + self.__semicolonSymbol

        else:
            return result

    def __removeSemicolon(self, result):
        if self.__forcedSemicolon:
            self.__forcedSemicolon = False
            return result
    
        if result.endswith(self.__semicolonSymbol):
            return result[:-len(self.__semicolonSymbol)]
        else:
            return result


    #
    # Data
    #
    
    __simple_property = re.compile(r"^[a-zA-Z_$][a-zA-Z0-9_$]*$")
    __number_property = re.compile(r"^[0-9]+$")

    __simple = ["true", "false", "null", "this", "debugger"]

    __dividers = {
        "plus"        : '+',
        "minus"       : '-',
        "mul"         : '*',
        "div"         : '/',
        "mod"         : '%',
        "dot"         : '.',
        "or"          : "||",
        "and"         : "&&",
        "strict_eq"   : '===',
        "eq"          : '==',
        "strict_ne"   : '!==',
        "ne"          : '!=',
        "lsh"         : '<<',
        "le"          : '<=',
        "lt"          : '<',
        "ursh"        : '>>>',
        "rsh"         : '>>',
        "ge"          : '>=',
        "gt"          : '>',
        "bitwise_or"  : '|',
        "bitwise_xor" : '^',
        "bitwise_and" : '&'
    }

    __prefixes = {    
        "increment"   : "++",
        "decrement"   : "--",
        "bitwise_not" : '~',
        "not"         : "!",
        "unary_plus"  : "+",
        "unary_minus" : "-",
        "delete"      : "delete ",
        "new"         : "new ",
        "typeof"      : "typeof ",
        "void"        : "void "
    }



    #
    # Script Scope
    #

    def type_script(self, node):
        return self.__statements(node)



    #
    # Expressions
    #
    
    def type_comma(self, node):
        return self.__commaSymbol.join(map(self.compress, node))

    def type_object_init(self, node):
        return "{%s}" % self.__commaSymbol.join(map(self.compress, node))

    def type_property_init(self, node):
        key = self.compress(node[0])
        value = self.compress(node[1])

        if type(key) in (int, float):
            pass

        elif self.__number_property.match(key):
            pass

        # Protect keywords and special characters
        elif key in keywords or key in futureReserved or not self.__simple_property.match(key):
            key = self.type_string(node[0])

        return "%s:%s" % (key, value)
        
    def type_array_init(self, node):
        def helper(child):
            return self.compress(child) if child != None else ""
    
        return "[%s]" % ",".join(map(helper, node))

    def type_array_comp(self, node):
        return "[%s %s]" % (self.compress(node.expression), self.compress(node.tail))    

    def type_string(self, node):
        # Omit writing real high unicode character which are not supported well by browsers
        ascii = ascii_encoder.encode(node.value)
        if high_unicode.search(ascii):
            return ascii
        else:
            return unicode_encoder.encode(node.value)

    def type_number(self, node):
        value = node.value

        # Special handling for protected float/exponential
        if type(value) == str:
            # Convert zero-prefix
            if value.startswith("0.") and len(value) > 2:
                value = value[1:]
                
            # Convert zero postfix
            elif value.endswith(".0"):
                value = value[:-2]

        elif int(value) == value and node.parent.type != "dot":
            value = int(value)

        return "%s" % value

    def type_regexp(self, node):
        return node.value

    def type_identifier(self, node):
        return node.value

    def type_list(self, node):
        return ",".join(map(self.compress, node))

    def type_index(self, node):
        return "%s[%s]" % (self.compress(node[0]), self.compress(node[1]))

    def type_declaration(self, node):
        names = getattr(node, "names", None)
        if names:
            result = self.compress(names)
        else:
            result = node.name    

        initializer = getattr(node, "initializer", None)
        if initializer:
            result += "=%s" % self.compress(node.initializer)

        return result

    def type_assign(self, node):
        assignOp = getattr(node, "assignOp", None)
        operator = "=" if not assignOp else self.__dividers[assignOp] + "="
    
        return self.compress(node[0]) + operator + self.compress(node[1])

    def type_call(self, node):
        return "%s(%s)" % (self.compress(node[0]), self.compress(node[1]))

    def type_new_with_args(self, node):
        result = "new %s" % self.compress(node[0])
        
        # Compress new Object(); => new Object;
        if len(node[1]) > 0:
            result += "(%s)" % self.compress(node[1])
        else:
            parent = getattr(node, "parent", None)
            if parent and parent.type is "dot":
                result += "()"
            
        return result

    def type_exception(self, node):
        return node.value
    
    def type_generator(self, node):
        """ Generator Expression """
        result = self.compress(getattr(node, "expression"))
        tail = getattr(node, "tail", None)
        if tail:
            result += " %s" % self.compress(tail)

        return result

    def type_comp_tail(self, node):
        """  Comprehensions Tails """
        result = self.compress(getattr(node, "for"))
        guard = getattr(node, "guard", None)
        if guard:
            result += "if(%s)" % self.compress(guard)

        return result    
    
    def type_in(self, node):
        first = self.compress(node[0])
        second = self.compress(node[1])
    
        if first.endswith("'") or first.endswith('"'):
            pattern = "%sin %s"
        else:
            pattern = "%s in %s"
    
        return pattern % (first, second)
    
    def type_instanceof(self, node):
        first = self.compress(node[0])
        second = self.compress(node[1])

        return "%s instanceof %s" % (first, second)    
    
    

    #
    # Statements :: Core
    #

    def type_block(self, node):
        return "{%s}" % self.__removeSemicolon(self.__statements(node))
    
    def type_let_block(self, node):
        begin = "let(%s)" % ",".join(map(self.compress, node.variables))
        if hasattr(node, "block"):
            end = self.compress(node.block)
        elif hasattr(node, "expression"):
            end = self.compress(node.expression)    
    
        return begin + end

    def type_const(self, node):
        return self.__addSemicolon("const %s" % self.type_list(node))

    def type_var(self, node):
        return self.__addSemicolon("var %s" % self.type_list(node))

    def type_let(self, node):
        return self.__addSemicolon("let %s" % self.type_list(node))

    def type_semicolon(self, node):
        expression = getattr(node, "expression", None)
        return self.__addSemicolon(self.compress(expression) if expression else "")

    def type_label(self, node):
        return self.__addSemicolon("%s:%s" % (node.label, self.compress(node.statement)))

    def type_break(self, node):
        return self.__addSemicolon("break" if not hasattr(node, "label") else "break %s" % node.label)

    def type_continue(self, node):
        return self.__addSemicolon("continue" if not hasattr(node, "label") else "continue %s" % node.label)


    #
    # Statements :: Functions
    #

    def type_function(self, node):
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
        result += "(%s)" % self.compress(params) if params else "()"
    
        # keep expression closure format (may be micro-optimized for other code, too)
        if getattr(node, "expressionClosure", False):
            result += self.compress(node.body)
        else:
            result += "{%s}" % self.__removeSemicolon(self.compress(node.body))
        
        return result

    def type_getter(self, node):
        return self.type_function(node)
    
    def type_setter(self, node):
        return self.type_function(node)
    
    def type_return(self, node):
        result = "return"
        if hasattr(node, "value"):
            valueCode = self.compress(node.value)

            # Micro optimization: Don't need a space when a block/map/array/group/strings are returned
            if not valueCode.startswith(("(","[","{","'",'"',"!","-","/")): 
                result += " "

            result += valueCode

        return self.__addSemicolon(result)



    #
    # Statements :: Exception Handling
    #            
    
    def type_throw(self, node):
        return self.__addSemicolon("throw %s" % self.compress(node.exception))

    def type_try(self, node):
        result = "try%s" % self.compress(node.tryBlock)
    
        for catch in node:
            if catch.type == "catch":
                if hasattr(catch, "guard"):
                    result += "catch(%s if %s)%s" % (self.compress(catch.exception), self.compress(catch.guard), self.compress(catch.block))
                else:
                    result += "catch(%s)%s" % (self.compress(catch.exception), self.compress(catch.block))

        if hasattr(node, "finallyBlock"):
            result += "finally%s" % self.compress(node.finallyBlock)

        return result



    #
    # Statements :: Loops
    #    
    
    def type_while(self, node):
        result = "while(%s)%s" % (self.compress(node.condition), self.compress(node.body))
        self.__handleForcedSemicolon(node.body)
        return result


    def type_do(self, node):
        # block unwrapping don't help to reduce size on this loop type
        # but if it happens (don't like to modify a global function to fix a local issue), we
        # need to fix the body and re-add braces around the statement
        body = self.compress(node.body)
        if not body.startswith("{"):
            body = "{%s}" % body
        
        return self.__addSemicolon("do%swhile(%s)" % (body, self.compress(node.condition)))


    def type_for_in(self, node):
        # Optional variable declarations
        varDecl = getattr(node, "varDecl", None)

        # Body is optional - at least in comprehensions tails
        body = getattr(node, "body", None)
        if body:
            body = self.compress(body)
        else:
            body = ""
        
        result = "for"
        if node.isEach:
            result += " each"
    
        result += "(%s in %s)%s" % (self.__removeSemicolon(self.compress(node.iterator)), self.compress(node.object), body)
    
        if body:
            self.__handleForcedSemicolon(node.body)
        
        return result
    
    
    def type_for(self, node):
        setup = getattr(node, "setup", None)
        condition = getattr(node, "condition", None)
        update = getattr(node, "update", None)

        result = "for("
        result += self.__addSemicolon(self.compress(setup) if setup else "")
        result += self.__addSemicolon(self.compress(condition) if condition else "")
        result += self.compress(update) if update else ""
        result += ")%s" % self.compress(node.body)

        self.__handleForcedSemicolon(node.body)
        return result
    
       
       
    #       
    # Statements :: Conditionals
    #

    def type_hook(self, node):
        """aka ternary operator"""
        condition = node.condition
        thenPart = node.thenPart
        elsePart = node.elsePart
    
        if condition.type == "not":
            [thenPart,elsePart] = [elsePart,thenPart]
            condition = condition[0]
    
        return "%s?%s:%s" % (self.compress(condition), self.compress(thenPart), self.compress(elsePart))
    
    
    def type_if(self, node):
        result = "if(%s)%s" % (self.compress(node.condition), self.compress(node.thenPart))

        elsePart = getattr(node, "elsePart", None)
        if elsePart:
            result += "else"

            elseCode = self.compress(elsePart)
        
            # Micro optimization: Don't need a space when the child is a block
            # At this time the brace could not be part of a map declaration (would be a syntax error)
            if not elseCode.startswith(("{", "(", ";")):
                result += " "        
            
            result += elseCode
        
            self.__handleForcedSemicolon(elsePart)
        
        return result


    def type_switch(self, node):
        result = "switch(%s){" % self.compress(node.discriminant)
        for case in node:
            if case.type == "case":
                labelCode = self.compress(case.label)
                if labelCode.startswith('"'):
                    result += "case%s:" % labelCode
                else:
                    result += "case %s:" % labelCode
            elif case.type == "default":
                result += "default:"
            else:
                continue
        
            for statement in case.statements:
                temp = self.compress(statement)
                if len(temp) > 0:
                    result += self.__addSemicolon(temp)
        
        return "%s}" % self.__removeSemicolon(result)
        