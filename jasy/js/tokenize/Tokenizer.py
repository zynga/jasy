#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

#
# License: MPL 1.1/GPL 2.0/LGPL 2.1
# Authors: 
#   - Brendan Eich <brendan@mozilla.org> (Original JavaScript) (2004-2010)
#   - Sebastian Werner <info@sebastian-werner.net> (Python Port) (2010)
#

import re, copy

import jasy.js.tokenize.Lang as Lang
import jasy.js.api.Comment as Comment
import jasy.core.Console as Console

__all__ = [ "Tokenizer" ]


# Operator and punctuator mapping from token to tree node type name.
# NB: because the lexer doesn't backtrack, all token prefixes must themselves
# be valid tokens (e.g. !== is acceptable because its prefixes are the valid
# tokens != and !).
operatorNames = {
    '<'   : 'lt', 
    '>'   : 'gt', 
    '<='  : 'le', 
    '>='  : 'ge', 
    '!='  : 'ne', 
    '!'   : 'not', 
    '=='  : 'eq', 
    '===' : 'strict_eq', 
    '!==' : 'strict_ne', 

    '>>'  : 'rsh', 
    '<<'  : 'lsh',
    '>>>' : 'ursh', 
     
    '+'   : 'plus', 
    '*'   : 'mul', 
    '-'   : 'minus', 
    '/'   : 'div', 
    '%'   : 'mod', 

    ','   : 'comma', 
    ';'   : 'semicolon', 
    ':'   : 'colon', 
    '='   : 'assign', 
    '?'   : 'hook', 

    '&&'  : 'and', 
    '||'  : 'or', 

    '++'  : 'increment', 
    '--'  : 'decrement', 

    ')'   : 'right_paren', 
    '('   : 'left_paren', 
    '['   : 'left_bracket', 
    ']'   : 'right_bracket', 
    '{'   : 'left_curly', 
    '}'   : 'right_curly', 

    '&'   : 'bitwise_and', 
    '^'   : 'bitwise_xor', 
    '|'   : 'bitwise_or', 
    '~'   : 'bitwise_not'
}


# Assignment operators
assignOperators = ["|", "^", "&", "<<", ">>", ">>>", "+", "-", "*", "/", "%"]




#
# Classes
#

class Token: 
    __slots__ = ["type", "start", "line", "assignOp", "end", "value"]


class ParseError(Exception):
    def __init__(self, message, fileId, line):
        Exception.__init__(self, "Syntax error: %s\n%s:%s" % (message, fileId, line))


class Tokenizer(object):
    def __init__(self, source, fileId="", line=1):
        # source: JavaScript source
        # fileId: Filename (for debugging proposes)
        # line: Line number (for debugging proposes)
        self.cursor = 0
        self.source = str(source)
        self.tokens = {}
        self.tokenIndex = 0
        self.lookahead = 0
        self.scanNewlines = False
        self.fileId = fileId
        self.line = line
        self.comments = []

    input_ = property(lambda self: self.source[self.cursor:])
    token = property(lambda self: self.tokens.get(self.tokenIndex))


    def done(self):
        # We need to set scanOperand to true here because the first thing
        # might be a regexp.
        return self.peek(True) == "end"
        

    def match(self, tokenType, scanOperand=False):
        return self.get(scanOperand) == tokenType or self.unget()


    def mustMatch(self, tokenType):
        if not self.match(tokenType):
            raise ParseError("Missing " + tokenType, self.fileId, self.line)
            
        return self.token


    def peek(self, scanOperand=False):
        if self.lookahead:
            next = self.tokens.get((self.tokenIndex + self.lookahead) & 3)
            if self.scanNewlines and (getattr(next, "line", None) != getattr(self, "line", None)):
                tokenType = "newline"
            else:
                tokenType = getattr(next, "type", None)
        else:
            tokenType = self.get(scanOperand)
            self.unget()
            
        return tokenType


    def peekOnSameLine(self, scanOperand=False):
        self.scanNewlines = True
        tokenType = self.peek(scanOperand)
        self.scanNewlines = False
        return tokenType
        

    def getComments(self):
        if self.comments:
            comments = self.comments
            self.comments = []
            return comments
            
        return None


    def skip(self):
        """Eats comments and whitespace."""
        input = self.source
        startLine = self.line

        # Whether this is the first called as happen on start parsing a file (eat leading comments/white space)
        startOfFile = self.cursor is 0
        
        indent = ""
        
        while (True):
            if len(input) > self.cursor:
                ch = input[self.cursor]
            else:
                return
                
            self.cursor += 1
            
            if len(input) > self.cursor:
                next = input[self.cursor]
            else:
                next = None

            if ch == "\n" and not self.scanNewlines:
                self.line += 1
                indent = ""
                
            elif ch == "/" and next == "*":
                self.cursor += 1
                text = "/*"
                inline = startLine == self.line and startLine > 1
                commentStartLine = self.line
                if startLine == self.line and not startOfFile:
                    mode = "inline"
                elif (self.line-1) > startLine:
                    # distance before this comment means it is a comment block for a whole section (multiple lines of code)
                    mode = "section"
                else:
                    # comment for maybe multiple following lines of code, but not that important (no visual white space divider)
                    mode = "block"
                    
                while (True):
                    try:
                        ch = input[self.cursor]
                        self.cursor += 1
                    except IndexError:
                        raise ParseError("Unterminated comment", self.fileId, self.line)
                        
                    if ch == "*":
                        next = input[self.cursor]
                        if next == "/":
                            text += "*/"
                            self.cursor += 1
                            break
                            
                    elif ch == "\n":
                        self.line += 1
                        
                    text += ch
                    
                
                # Filter escaping on slash-star combinations in comment text
                text = text.replace("*\/", "*/")
                
                try:
                    self.comments.append(Comment.Comment(text, mode, commentStartLine, indent, self.fileId))
                except Comment.CommentException as commentError:
                    Console.error("Ignoring comment in %s: %s", self.fileId, commentError)
                    
                    
            elif ch == "/" and next == "/":
                self.cursor += 1
                text = "//"
                if startLine == self.line and not startOfFile:
                    mode = "inline"
                elif (self.line-1) > startLine:
                    # distance before this comment means it is a comment block for a whole section (multiple lines of code)
                    mode = "section"
                else:
                    # comment for maybe multiple following lines of code, but not that important (no visual white space divider)
                    mode = "block"
                    
                while (True):
                    try:
                        ch = input[self.cursor]
                        self.cursor += 1
                    except IndexError:
                        # end of file etc.
                        break

                    if ch == "\n":
                        self.line += 1
                        break
                    
                    text += ch
                    
                try:
                    self.comments.append(Comment.Comment(text, mode, self.line-1, "", self.fileId))
                except Comment.CommentException:
                    Console.error("Ignoring comment in %s: %s", self.fileId, commentError)

            # check for whitespace, also for special cases like 0xA0
            elif ch in "\xA0 \t":
                indent += ch

            else:
                self.cursor -= 1
                return


    # Lexes the exponential part of a number, if present. Returns True if an
    # exponential part was found.
    def lexExponent(self):
        input = self.source
        next = input[self.cursor]
        if next == "e" or next == "E":
            self.cursor += 1
            ch = input[self.cursor]
            self.cursor += 1
            if ch == "+" or ch == "-":
                ch = input[self.cursor]
                self.cursor += 1

            if ch < "0" or ch > "9":
                raise ParseError("Missing exponent", self.fileId, self.line)

            while(True):
                ch = input[self.cursor]
                self.cursor += 1
                if not (ch >= "0" and ch <= "9"):
                    break
                
            self.cursor -= 1
            return True

        return False


    def lexZeroNumber(self, ch):
        token = self.token
        input = self.source
        token.type = "number"

        ch = input[self.cursor]
        self.cursor += 1
        if ch == ".":
            while(True):
                ch = input[self.cursor]
                self.cursor += 1
                if not (ch >= "0" and ch <= "9"):
                    break
                
            self.cursor -= 1
            self.lexExponent()
            token.value = input[token.start:self.cursor]
            
        elif ch == "x" or ch == "X":
            while(True):
                ch = input[self.cursor]
                self.cursor += 1
                if not ((ch >= "0" and ch <= "9") or (ch >= "a" and ch <= "f") or (ch >= "A" and ch <= "F")):
                    break
                    
            self.cursor -= 1
            token.value = input[token.start:self.cursor]

        elif ch >= "0" and ch <= "7":
            while(True):
                ch = input[self.cursor]
                self.cursor += 1
                if not (ch >= "0" and ch <= "7"):
                    break
                    
            self.cursor -= 1
            token.value = input[token.start:self.cursor]

        else:
            self.cursor -= 1
            self.lexExponent()     # 0E1, &c.
            token.value = 0
    

    def lexNumber(self, ch):
        token = self.token
        input = self.source
        token.type = "number"

        floating = False
        while(True):
            ch = input[self.cursor]
            self.cursor += 1
            
            if ch == "." and not floating:
                floating = True
                ch = input[self.cursor]
                self.cursor += 1
                
            if not (ch >= "0" and ch <= "9"):
                break

        self.cursor -= 1

        exponent = self.lexExponent()
        segment = input[token.start:self.cursor]
        
        # Protect float or exponent numbers
        if floating or exponent:
            token.value = segment
        else:
            token.value = int(segment)


    def lexDot(self, ch):
        token = self.token
        input = self.source
        next = input[self.cursor]
        
        if next >= "0" and next <= "9":
            while (True):
                ch = input[self.cursor]
                self.cursor += 1
                if not (ch >= "0" and ch <= "9"):
                    break

            self.cursor -= 1
            self.lexExponent()

            token.type = "number"
            token.value = input[token.start:self.cursor]

        else:
            token.type = "dot"


    def lexString(self, ch):
        token = self.token
        input = self.source
        token.type = "string"

        hasEscapes = False
        delim = ch
        ch = input[self.cursor]
        self.cursor += 1
        while ch != delim:
            if ch == "\\":
                hasEscapes = True
                self.cursor += 1

            ch = input[self.cursor]
            self.cursor += 1

        if hasEscapes:
            token.value = eval(input[token.start:self.cursor])
        else:
            token.value = input[token.start+1:self.cursor-1]


    def lexRegExp(self, ch):
        token = self.token
        input = self.source
        token.type = "regexp"

        while (True):
            try:
                ch = input[self.cursor]
                self.cursor += 1
            except IndexError:
                raise ParseError("Unterminated regex", self.fileId, self.line)

            if ch == "\\":
                self.cursor += 1
                
            elif ch == "[":
                while (True):
                    if ch == "\\":
                        self.cursor += 1

                    try:
                        ch = input[self.cursor]
                        self.cursor += 1
                    except IndexError:
                        raise ParseError("Unterminated character class", self.fileId, self.line)
                    
                    if ch == "]":
                        break
                    
            if ch == "/":
                break

        while(True):
            ch = input[self.cursor]
            self.cursor += 1
            if not (ch >= "a" and ch <= "z"):
                break

        self.cursor -= 1
        token.value = input[token.start:self.cursor]
    

    def lexOp(self, ch):
        token = self.token
        input = self.source

        op = ch
        while(True):
            try:
                next = input[self.cursor]
            except IndexError:
                break
                
            if (op + next) in operatorNames:
                self.cursor += 1
                op += next
            else:
                break
        
        try:
            next = input[self.cursor]
        except IndexError:
            next = None

        if next == "=" and op in assignOperators:
            self.cursor += 1
            token.type = "assign"
            token.assignOp = operatorNames[op]
            op += "="
            
        else:
            token.type = operatorNames[op]
            token.assignOp = None


    # FIXME: Unicode escape sequences
    # FIXME: Unicode identifiers
    def lexIdent(self, ch):
        token = self.token
        input = self.source

        try:
            while True:
                ch = input[self.cursor]
                self.cursor += 1
            
                if not ((ch >= "a" and ch <= "z") or (ch >= "A" and ch <= "Z") or (ch >= "0" and ch <= "9") or ch == "$" or ch == "_"):
                    break
                    
        except IndexError:
            self.cursor += 1
            pass
        
        # Put the non-word character back.
        self.cursor -= 1

        identifier = input[token.start:self.cursor]
        if identifier in Lang.keywords:
            token.type = identifier
        else:
            token.type = "identifier"
            token.value = identifier


    def get(self, scanOperand=False):
        """ 
        It consumes input *only* if there is no lookahead.
        Dispatches to the appropriate lexing function depending on the input.
        """
        while self.lookahead:
            self.lookahead -= 1
            self.tokenIndex = (self.tokenIndex + 1) & 3
            token = self.tokens[self.tokenIndex]
            if token.type != "newline" or self.scanNewlines:
                return token.type

        self.skip()

        self.tokenIndex = (self.tokenIndex + 1) & 3
        self.tokens[self.tokenIndex] = token = Token()

        token.start = self.cursor
        token.line = self.line

        input = self.source
        if self.cursor == len(input):
            token.end = token.start
            token.type = "end"
            return token.type

        ch = input[self.cursor]
        self.cursor += 1
        
        if (ch >= "a" and ch <= "z") or (ch >= "A" and ch <= "Z") or ch == "$" or ch == "_":
            self.lexIdent(ch)
        
        elif scanOperand and ch == "/":
            self.lexRegExp(ch)
        
        elif ch == ".":
            self.lexDot(ch)

        elif self.scanNewlines and ch == "\n":
            token.type = "newline"
            self.line += 1

        elif ch in operatorNames:
            self.lexOp(ch)
        
        elif ch >= "1" and ch <= "9":
            self.lexNumber(ch)
        
        elif ch == "0":
            self.lexZeroNumber(ch)
        
        elif ch == '"' or ch == "'":
            self.lexString(ch)
        
        else:
            raise ParseError("Illegal token: %s (Code: %s)" % (ch, ord(ch)), self.fileId, self.line)

        token.end = self.cursor
        return token.type
        

    def unget(self):
        """ Match depends on unget returning undefined."""
        self.lookahead += 1
        
        if self.lookahead == 4: 
            raise ParseError("PANIC: too much lookahead!", self.fileId, self.line)
        
        self.tokenIndex = (self.tokenIndex - 1) & 3
        
    
    def save(self):
        return {
            "cursor" : self.cursor,
            "tokenIndex": self.tokenIndex,
            "tokens": copy.copy(self.tokens),
            "lookahead": self.lookahead,
            "scanNewlines": self.scanNewlines,
            "line": self.line
        }

    
    def rewind(self, point):
        self.cursor = point["cursor"]
        self.tokenIndex = point["tokenIndex"]
        self.tokens = copy.copy(point["tokens"])
        self.lookahead = point["lookahead"]
        self.scanNewline = point["scanNewline"]
        self.line = point["line"]
