#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

futureReserved = set([
    "abstract",
    "boolean",
    "byte",
    "char",
    "class",
    "const",
    "debugger",
    "double",
    "enum",
    "export",
    "extends",
    "final",
    "float",
    "goto",
    "implements",
    "import",
    "int",
    "interface",
    "long",
    "native",
    "package",
    "private",
    "protected",
    "public",
    "short",
    "static",
    "super",
    "synchronized",
    "throws",
    "transient",
    "volatile" 
])


statements = [
    # With semicolon at end
    "semicolon",
    "return",
    "throw",
    "label",
    "break",
    "continue",
    "var",
    "const",
    "debugger",

    # Only semicolon when no-block braces are created
    "block",
    "let_block",
    "while",
    "do",
    "for",
    "for_in",
    "if",
    "switch",
    "hook",
    "with",

    # no semicolons
    # function, setter and getter as statement_form or declared_form
    "function", 
    "setter",
    "getter",
    "try",
    "label"
]


# All allowed expression types of JavaScript 1.7
# They may be separated by "comma" which is quite of special 
# and not allowed everywhere e.g. in conditional statements
expressions = [
    # Primary Expression - Part 1 (expressed form)
    "function",

    # Primary Expression - Part 2
    "object_init",
    "array_init",
    "array_comp",
    
    # Primary Expression - Part 3
    "let",

    # Primary Expression - Part 4
    "null", 
    "this", 
    "true", 
    "false", 
    "identifier", 
    "number", 
    "string", 
    "regexp",

    # Member Expression - Part 1
    "new_with_args",
    "new",

    # Member Expression - Part 2
    "dot",
    "call",
    "index",

    # Unary Expression
    "unary_plus",
    "unary_minus",
    "delete",
    "void",
    "typeof",
    "not",
    "bitwise_not",
    "increment",
    "decrement",

    # Multiply Expression
    "mul",
    "div",
    "mod",

    # Add Expression
    "plus",
    "minus",
    
    # Shift Expression
    "lsh",
    "rsh",
    "ursh",
    
    # Relational Expression
    "lt",
    "le",
    "ge",
    "gt",
    "in",
    "instanceof",
    
    # Equality Expression
    "eq",
    "ne",
    "strict_eq",
    "strict_ne",
    
    # BitwiseAnd Expression
    "bitwise_and",
    
    # BitwiseXor Expression
    "bitwise_xor",
    
    # BitwiseOr Expression
    "bitwise_or",
    
    # And Expression
    "and",
    
    # Or Expression
    "or",
    
    # Conditional Expression
    "hook",
    
    # Assign Expression
    "assign",
    
    # Expression
    "comma"
]




def __createOrder():
    expressions = [
        ["comma"],
        ["assign"],
        ["hook"],
        ["or"],
        ["and"],
        ["bitwise_or"],
        ["bitwise_xor",],
        ["bitwise_and"],
        ["eq","ne","strict_eq","strict_ne"],
        ["lt","le","ge","gt","in","instanceof"],
        ["lsh","rsh","ursh"],
        ["plus","minus"],
        ["mul","div","mod"],
        ["unary_plus","unary_minus","delete","void","typeof","not","bitwise_not","increment","decrement"],
        ["dot","call","index"],
        ["new_with_args","new"],
        ["null","this","true","false","identifier","number","string","regexp"],
        ["let"],
        ["object_init","array_init","array_comp"],
        ["function"]
    ]
    
    result = {}
    for priority, itemList in enumerate(expressions):
        for item in itemList:
            result[item] = priority
            
    return result
    
expressionOrder = __createOrder()

