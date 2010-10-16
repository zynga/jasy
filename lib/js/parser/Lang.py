#
# JavaScript Tools - Language Specification
# Copyright 2010 Sebastian Werner
#

# All allowed expression types of JavaScript 1.7
# They may be separated by "comma" which is quite of special 
# and not allowed everywhere e.g. in conditional statements
expressions = [
    # Primary Expression - Part 1
    "function",

    # Primary Expression - Part 2
    "object_init",
    "array_init",
    
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
