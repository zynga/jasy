#!/usr/bin/env python
################################################################################
#
#  qooxdoo - the new era of web development
#
#  http://qooxdoo.org
#
#  Copyright:
#    2006-2010 1&1 Internet AG, Germany, http://www.1und1.de
#    2010 Deutsche Telekom AG, http://telekom.de
#
#  License:
#    LGPL: http://www.gnu.org/licenses/lgpl.html
#    EPL: http://www.eclipse.org/org/documents/epl-v10.php
#    See the LICENSE file in the project's top-level directory for details.
#
#  Authors:
#    * Sebastian Werner (wpbasti)
#    * Thomas Herchenroeder (thron7)
#
################################################################################

BUILTIN = [
    "ActiveXObject",
    "Array",
    "Boolean",
    "Date",
    "DOMParser",
    "Element",
    "Error",
    "EvalError",
    "Event",
    "Function",
    "Image",
    "JSON", 
    "Math",
    "Node",
    "Number",
    "Object",
    "Option",
    "Range",
    "RangeError",
    "ReferenceError",
    "RegExp",
    "String",
    "SyntaxError",
    "TypeError",
    "URIError",
    "XMLHttpRequest",
    "XMLSerializer",
    "XPathEvaluator",
    "XPathResult",
    "XSLTProcessor",
]

GLOBALS = BUILTIN + [
    # Core :: Reserved words
    "eval", "this", "arguments", "undefined", "NaN", "Infinity"

    # Core :: Global Objects
    "navigator", 'location', 'history', "console", 'sessionStorage', 'globalStorage', "localStorage", "event", 
    
    # Core :: Global methods
    "decodeURI", "decodeURIComponent", "encodeURIComponent",
    "escape", "unescape", "parseInt", "parseFloat", "isNaN", "isFinite",

    # Core :: Timeouts/Interval
    'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',

    # Core :: Crypto API
    'atob', 'btoa', 'crypto', 'pkcs11',
    
    # Core :: Event Listener
    'addEventListener', 'removeEventListener', 'dispatchEvent', 'captureEvents', 'releaseEvents', 'routeEvent', 
    
    # Browser :: Global Objects
    "document", "window", 
    
    # Browser :: Methods
    "getComputedStyle",

    # Browser :: Popups
    'openDialog', 'prompt', 'open', 'closed', 'moveTo', 'moveBy', 'resizeTo', 'resizeBy',
    'alert', 'confirm', 'focus', 'blur', 'fullScreen', 'opener', 

    # Browser :: Interface
    'menubar', 'toolbar', 'locationbar', 'personalbar', 'statusbar', 'scrollbars', 'status', 'defaultStatus', 

    # Browser :: User API
    'home', 'stop', 'print', 'close', 'find', 

    # Browser :: Frames
    "external", "frameElement", 'parent', 'top', 'frames', 'self', "name", 'length',
    
    # Browser :: Dimensions
    'innerWidth', 'innerHeight', 'outerWidth', 'outerHeight', 'pageXOffset', 'pageYOffset',
    "screenTop", "screenLeft", 'screenX', 'screenY', 
    
    # Browser :: Scrolling
    'scrollX', 'scrollY', 'scrollTo', 'scrollBy', 
    'scrollByLines', 'scrollByPages', 'scroll', 'scrollMaxX', 'scrollMaxY', 
    
    # Browser :: Plugin :: Java
    "java", "sun", "Packages",
]

PUNCTUATORS = {
    "." : "DOT",
    "," : "COMMA",
    ":" : "COLON",
    "?" : "HOOK",
    ";" : "SEMICOLON",
    "!" : "NOT",
    "~" : "BITNOT",
    "\\" : "BACKSLASH",

    "+" : "ADD",
    "-" : "SUB",
    "*" : "MUL",
    "/" : "DIV",
    "%" : "MOD",

    "{" : "LC",
    "}" : "RC",
    "(" : "LP",
    ")" : "RP",
    "[" : "LB",
    "]" : "RB",

    "<" : "LT",
    "<=" : "LE",
    ">" : "GT",
    ">=" : "GE",
    "==" : "EQ",
    "!=" : "NE",
    "===" : "SHEQ",
    "!==" : "SHNE",

    "=" : "ASSIGN",

    "+=" : "ASSIGN_ADD",
    "-=" : "ASSIGN_SUB",
    "*=" : "ASSIGN_MUL",
    "/=" : "ASSIGN_DIV",
    "%=" : "ASSIGN_MOD",

    "|=" : "ASSIGN_BITOR",
    "^=" : "ASSIGN_BITXOR",
    "&=" : "ASSIGN_BITAND",
    "<<=" : "ASSIGN_LSH",
    ">>=" : "ASSIGN_RSH",
    ">>>=" : "ASSIGN_URSH",

    "&&" : "AND",
    "||" : "OR",

    "|" : "BITOR",
    "^|" : "BITXOR",
    "&" : "BITAND",

    "^" : "POWEROF",

    "<<" : "LSH",
    ">>" : "RSH",
    ">>>" : "URSH",

    "++" : "INC",
    "--" : "DEC",

    "::" : "COLONCOLON",
    ".." : "DOTDOT",

    "@" : "XMLATTR",

    "//" : "SINGLE_COMMENT",
    "/*" : "COMMENT_START",
    "*/" : "COMMENT_STOP",
    "/*!" : "DOC_START"
}

RESERVED = {
    "break" : "BREAK",
    "case" : "CASE",
    "catch" : "CATCH",
    "continue" : "CONTINUE",
    "default" : "DEFAULT",
    "delete" : "DELETE",
    "do" : "DO",
    "else" : "ELSE",
    "finally" : "FINALLY",
    "for" : "FOR",
    "function" : "FUNCTION",
    "if" : "IF",
    "in" : "IN",
    "instanceof" : "INSTANCEOF",
    "new" : "NEW",
    "return" : "RETURN",
    "switch" : "SWITCH",
    "this" : "THIS",
    "throw" : "THROW",
    "try" : "TRY",
    "typeof" : "TYPEOF",
    "var" : "VAR",
    "void" : "VOID",
    "while" : "WHILE",
    "with" : "WITH",

    "null" : "NULL",

    "true" : "TRUE",
    "false" : "FALSE",

    "abstract": "FUTURE_RESERVED_WORD",
    "enum": "FUTURE_RESERVED_WORD",
    "int": "FUTURE_RESERVED_WORD",
    "short": "FUTURE_RESERVED_WORD",
    "boolean": "FUTURE_RESERVED_WORD",
    "export": "FUTURE_RESERVED_WORD",
    "interface": "FUTURE_RESERVED_WORD",
    "static": "FUTURE_RESERVED_WORD",
    "byte": "FUTURE_RESERVED_WORD",
    "extends": "FUTURE_RESERVED_WORD",
    "long": "FUTURE_RESERVED_WORD",
    "super": "FUTURE_RESERVED_WORD",
    "char": "FUTURE_RESERVED_WORD",
    "final": "FUTURE_RESERVED_WORD",
    "native": "FUTURE_RESERVED_WORD",
    "synchronized": "FUTURE_RESERVED_WORD",
    "class": "FUTURE_RESERVED_WORD",
    "float": "FUTURE_RESERVED_WORD",
    "package": "FUTURE_RESERVED_WORD",
    "throws": "FUTURE_RESERVED_WORD",
    "const": "FUTURE_RESERVED_WORD",
    "goto": "FUTURE_RESERVED_WORD",
    "private": "FUTURE_RESERVED_WORD",
    "transient": "FUTURE_RESERVED_WORD",
    "implements": "FUTURE_RESERVED_WORD",
    "protected": "FUTURE_RESERVED_WORD",
    "volatile": "FUTURE_RESERVED_WORD",
    "double": "FUTURE_RESERVED_WORD",
    "import": "FUTURE_RESERVED_WORD",
    "public": "FUTURE_RESERVED_WORD"
}

SPACE_BEFORE = ["INSTANCEOF", "IN"]
SPACE_AFTER = ["VAR", "NEW", "GOTO", "INSTANCEOF", "TYPEOF", "DELETE", "IN", "THROW", "CASE", "VOID"]
SPACE_AFTER_USAGE = ["RETURN", "FUNCTION"]
PARANTHESIS_BEFORE = ["ELSE", "FINALLY", "CATCH", "WHILE"]

IDENTIFIER_CHARS          = r'(?u)[\.\w$]'
IDENTIFIER_ILLEGAL_CHARS  = r'(?u)[^\.\w$]'
IDENTIFIER_REGEXP         = r'%s+' % IDENTIFIER_CHARS

# Re-creating some Unicode information here, as it is not provided by Python
# source: http://www.fileformat.info/info/unicode/category/Zs/list.htm
UNICODE_CATEGORY_Zs = ur'''(?u)[\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000]'''
