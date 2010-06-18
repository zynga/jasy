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
# This version was refactored by the original Python port by Sebastian 
# Werner <info@sebastian-werner.net> for a cleaner Python-like implementation
# with less globals and better structure.
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

keywords = [
    "end",

    "conditional",

    "unary_plus", "unary_minus",

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
    "while", "with"
]

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
