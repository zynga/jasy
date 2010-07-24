#
# JavaScript Tools - Parser Module
# License: MPL 1.1/GPL 2.0/LGPL 2.1
# Authors: 
#   - Brendan Eich <brendan@mozilla.org> (Original JavaScript) (2004)
#   - JT Olds <jtolds@xnet5.com> (Python Translation) (2009)
#   - Sebastian Werner <info@sebastian-werner.net> (Refactoring Python) (2010)
#

import re

__all__ = [ "Tokenizer", "keywords" ]

keywords = [
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

assignOps = ['|', '^', '&', '<<', '>>', '>>>', '+', '-', '*', '/', '%']


# Operator and punctuator mapping from token to tree node type name.
# NB: superstring tokens (e.g., ++) must come before their substring token
# counterparts (+ in the example), so that the "symbolMatcher" regular expression
# synthesized from this list makes the longest possible match.
symbolNames = [
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
for symbol, name in symbolNames:
    if symbol == "\n": 
        continue
    if symbolMatcherCode != "^": 
        symbolMatcherCode += "|^"

    symbolMatcherCode += re.sub(r'[?|^&(){}\[\]+\-*\/\.]', lambda x: "\\%s" % x.group(0), symbol)

# Convert symbolNames to an actual dictionary now that we don't care about ordering
symbolNames = dict(symbolNames)



#
# Regular expressions for matching in tokenizer
#

# Matches all operators and punctuators
symbolMatcher = re.compile(symbolMatcherCode)

# Matches line feeds
newlineMatcher = re.compile(r'\n')

# Matches both comment styles
commentMatcher = re.compile(r'^\/(?:\*(?:.|\n)*?\*\/|\/.*)')

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



#
# Classes
#

class Token: 
    pass


class ParseError(Exception):
    def __init__(self, message, filename, line):
        Exception.__init__(self, "Syntax error: %s\n%s:%s" % (message, filename, line))


class Tokenizer(object):
    def __init__(self, source, filename):
        self.cursor = 0
        self.source = str(source)
        self.tokens = {}
        self.tokenIndex = 0
        self.lookahead = 0
        self.scanNewlines = False
        self.scanOperand = True
        self.filename = filename
        self.line = 1

    input_ = property(lambda self: self.source[self.cursor:])
    done = property(lambda self: self.peek() == "end")
    token = property(lambda self: self.tokens.get(self.tokenIndex))


    def match(self, tokenType):
        return self.get() == tokenType or self.unget()


    def mustMatch(self, tokenType):
        if not self.match(tokenType):
            raise ParseError("Missing " + tokenType, self.filename, self.line)
        return self.token


    def peek(self):
        if self.lookahead:
            next = self.tokens.get((self.tokenIndex + self.lookahead) & 3)
            if self.scanNewlines and (getattr(next, "line", None) != getattr(self, "line", None)):
                tokenType = "newline"
            else:
                tokenType = getattr(next, "type", None)
        else:
            tokenType = self.get()
            self.unget()
            
        return tokenType


    def peekOnSameLine(self):
        self.scanNewlines = True
        tokenType = self.peek()
        self.scanNewlines = False
        return tokenType


    def get(self):
        while self.lookahead:
            self.lookahead -= 1
            self.tokenIndex = (self.tokenIndex + 1) & 3
            token = self.tokens.get(self.tokenIndex)
            if getattr(token, "type", None) != "newline" or self.scanNewlines:
                return getattr(token, "type", None)

        comments = []
        while True:
            input__ = self.input_
            if self.scanNewlines:
                match = re.match(r'^[ \t]+', input__)
            else:
                match = re.match(r'^\s+', input__)
            if match:
                spaces = match.group(0)
                self.cursor += len(spaces)
                newlines = newlineMatcher.findall(spaces)
                if newlines:
                    self.line += len(newlines)
                input__ = self.input_

            match = commentMatcher.match(input__)
            if not match:
                break
                
            comment = match.group(0)
            comments.append(comment)
            self.cursor += len(comment)
            newlines = newlineMatcher.findall(comment)
            if newlines:
                self.line += len(newlines)
                
        self.tokenIndex = (self.tokenIndex + 1) & 3
        token = self.tokens[self.tokenIndex] = Token()
            
        # Store comments
        if len(comments) > 0:
            token.comments = comments;

        # Update token
        if input__:
            token.start = self.cursor        
            self.cursor += len(self.matchInput(token, input__))
            token.end = self.cursor
            token.line = self.line
        else:
            token.type = "end"
            
        # Return token type
        return getattr(token, "type", None)
        
        
    def matchInput(self, token, text):
        match = floatMatcher.match(text)
        if match:
            token.type = "number"
            token.value = float(match.group(0))
            return match.group(0)

        match = numberMatcher.match(text)
        if match:
            token.type = "number"
            token.value = eval(match.group(0))
            return match.group(0)

        match = identifierMatcher.match(text)
        if match:
            identifier = match.group(0)
            if identifier in keywords:
                token.type = identifier
            else:
                token.type = "identifier"
                token.value = identifier
            return identifier

        match = stringMatcher.match(text)
        if match:
            token.type = "string"
            # Force to parse the string into an unicode string
            token.value = eval("u"+match.group(0))
            
            return match.group(0)

        if self.scanOperand:
            match = regularExprMatcher.match(text)
            if match:
                token.type = "regexp"
                token.value = match.group(0)
                return match.group(0)

        match = symbolMatcher.match(text)
        if match:
            op = match.group(0)
            if op in assignOps and text[len(op)] == '=':
                token.type = "assign"
                token.assignOp = symbolNames[op]
                token.value = op
                return match.group(0) + "="

            token.type = symbolNames[op]
            
            # Detect unary operators
            if self.scanOperand and token.type in ("plus", "minus"):
                token.type = "unary_" + token.type
                
            token.assignOp = None
            return match.group(0)

        if self.scanNewlines:
            match = re.match(r'^\n', text)
            if match:
                token.type = "newline"
                return match.group(0)

        raise ParseError("Illegal token", self.filename, self.line)
        

    def unget(self):
        self.lookahead += 1
        
        if self.lookahead == 4: 
            raise "PANIC: too much lookahead!"
        
        self.tokenIndex = (self.tokenIndex - 1) & 3
