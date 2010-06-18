# ***** BEGIN LICENSE BLOCK *****
# Version: MPL 1.1/GPL 2.0/LGPL 2.1
#
# The contents of this file are subject to the Mozilla Public License Version
# 1.1 (the "License"); you may not use this file except in compliance with
# the License. You may obtain a copy of the License at
# http://www.mozilla.org/MPL/
#
# Software distributed under the License is distributed on an "AS IS" basis,
# WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
# for the specific language governing rights and limitations under the
# License.
#
# The Original Code is the Narcissus JavaScript engine, written in Javascript.
#
# The Initial Developer of the Original Code is
# Brendan Eich <brendan@mozilla.org>.
# Portions created by the Initial Developer are Copyright (C) 2004
# the Initial Developer. All Rights Reserved.
#
# The Python version of the code was created by JT Olds <jtolds@xnet5.com>,
# and is a direct translation from the Javascript version.
#
# Alternatively, the contents of this file may be used under the terms of
# either the GNU General Public License Version 2 or later (the "GPL"), or
# the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
# in which case the provisions of the GPL or the LGPL are applicable instead
# of those above. If you wish to allow use of your version of this file only
# under the terms of either the GPL or the LGPL, and not to allow others to
# use your version of this file under the terms of the MPL, indicate your
# decision by deleting the provisions above and replace them with the notice
# and other provisions required by the GPL or the LGPL. If you do not delete
# the provisions above, a recipient may use your version of this file under
# the terms of any one of the MPL, the GPL or the LGPL.
#
# ***** END LICENSE BLOCK ***** */

import re

tokens = dict(enumerate((
    # End of source.
    "end",

    # Operators and punctuators. Some pair-wise order matters, e.g. (+, -)
    # and (UNARY_PLUS, UNARY_MINUS).
    "\n", ";",
    ",",
    "=",
    "?", ":", "conditional",
    "||",
    "&&",
    "|",
    "^",
    "&",
    "==", "!=", "===", "!==",
    "<", "<=", ">=", ">",
    "<<", ">>", ">>>",
    "+", "-",
    "*", "/", "%",
    "!", "~", "unary_plus", "unary_minus",
    "++", "--",
    ".",
    "[", "]",
    "{", "}",
    "(", ")",

    # Nonterminal tree node type codes.
    "script", "block", "label", "for_in", "call", "new_with_args", "index",
    "array_init", "object_init", "property_init", "getter", "setter",
    "group", "list",

    # Terminals.
    "identifier", "number", "string", "regexp",

    # Keywords.
    "break",
    "case", "catch", "const", "continue",
    "debugger", "default", "delete", "do",
    "else", "enum",
    "false", "finally", "for", "function",
    "if", "in", "instanceof",
    "new", "null",
    "return",
    "switch",
    "this", "throw", "true", "try", "typeof",
    "var", "void",
    "while", "with"))
)



# Operator and punctuator mapping from token to tree node type name.
# NB: superstring tokens (e.g., ++) must come before their substring token
# counterparts (+ in the example), so that the "symbolMatcher" regular expression
# synthesized from this list makes the longest possible match.
operatorPunctuatorNames = [
    ('\n',   "newline"),
    (';',    "semicolon"),
    (',',    "comma"),
    ('?',    "hook"),
    (':',    "colon"),
    ('||',   "or"),
    ('&&',   "and"),
    ('|',    "bitwise_or"),
    ('^',    "bitwise_xor"),
    ('&',    "bitwise_and"),
    ('===',  "strict_eq"),
    ('==',   "eq"),
    ('=',    "assign"),
    ('!==',  "strict_ne"),
    ('!=',   "ne"),
    ('<<',   "lsh"),
    ('<=',   "le"),
    ('<',    "lt"),
    ('>>>',  "ursh"),
    ('>>',   "rsh"),
    ('>=',   "ge"),
    ('>',    "gt"),
    ('++',   "increment"),
    ('--',   "decrement"),
    ('+',    "plus"),
    ('-',    "minus"),
    ('*',    "mul"),
    ('/',    "div"),
    ('%',    "mod"),
    ('!',    "not"),
    ('~',    "bitwise_not"),
    ('.',    "dot"),
    ('[',    "left_bracket"),
    (']',    "right_bracket"),
    ('{',    "left_curly"),
    ('}',    "right_curly"),
    ('(',    "left_paren"),
    (')',    "right_paren"),
]           
    
    
#
# Prepare regular expressions
#    

# Build a regexp that recognizes operators and punctuators (except newline).
symbolMatcherCode = "^"
for operatorPunctuator, name in operatorPunctuatorNames:
    if operatorPunctuator == "\n": 
        continue
    if symbolMatcherCode != "^": 
        symbolMatcherCode += "|^"

    symbolMatcherCode += re.sub(r'[?|^&(){}\[\]+\-*\/\.]', lambda x: "\\%s" % x.group(0), operatorPunctuator)

# Convert operatorPunctuatorNames to an actual dictionary now that we don't care about ordering
operatorPunctuatorNames = dict(operatorPunctuatorNames)



#
#
#

# Define const END, etc., based on the token names.  Also map name to index.
keywords = {}
for i, t in tokens.copy().iteritems():
    if re.match(r'^[a-z]', t):
        const_name = t.upper()
        keywords[t] = i
    elif re.match(r'^\W', t):
        const_name = dict(operatorPunctuatorNames)[t]
    else:
        const_name = t
    #globals()[const_name] = i
    #print "MAP: %s => %s" % (t, i)
    tokens[t] = i


# Map assignment operators to their indexes in the tokens array.
assignOps = {}
for i, t in enumerate(['|', '^', '&', '<<', '>>', '>>>', '+', '-', '*', '/', '%']):
    assignOps[t] = tokens[t]
    assignOps[i] = t



#
# Regular expressions for matching in tokenizer
#

# Matches line feeds
newlineMatcher = re.compile(r'\n')

# Matches both comment styles
commentMatcher = re.compile(r'^\/(?:\*(?:.|\n)*?\*\/|\/.*)')

# Matches all operators and punctuators
symbolMatcher = re.compile(symbolMatcherCode)

# Matches floating point literals (but not integer literals).
floatMatcher = re.compile(r'^\d+\.\d*(?:[eE][-+]?\d+)?|^\d+(?:\.\d*)?[eE][-+]?\d+|^\.\d+(?:[eE][-+]?\d+)?')

# Matches all non-float numbers
numberMatcher = re.compile(r'^0[xX][\da-fA-F]+|^0[0-7]*|^\d+')

# Matches valid JavaScript identifiers
identifierMatcher = re.compile(r'^[$_\w]+')

# Matches both string types
stringMatcher = re.compile(r'^"(?:\\.|[^"])*"|^\'(?:\\.|[^\'])*\'')

# Matches regexp literals.
regularExprMatcher = re.compile(r'^\/((?:\\.|\[(?:\\.|[^\]])*\]|[^\/])+)\/([gimy]*)')
