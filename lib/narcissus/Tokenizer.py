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

import re, sys, types
from narcissus.Lang import *

class Token: 
    pass


class ParseError(Exception):
    def __init__(self, message, filename, lineno):
        Exception.__init__(self, "Syntax error: %s\n%s:%s" % (message, filename, lineno))


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
        self.lineno = 1

    input_ = property(lambda self: self.source[self.cursor:])
    done = property(lambda self: self.peek() == "end")
    token = property(lambda self: self.tokens.get(self.tokenIndex))


    def match(self, tokenType):
        return self.get() == tokenType or self.unget()


    def mustMatch(self, tokenType):
        if not self.match(tokenType):
            raise ParseError("Missing " + tokenType, self.filename, self.lineno)
        return self.token


    def peek(self):
        if self.lookahead:
            next = self.tokens.get((self.tokenIndex + self.lookahead) & 3)
            if self.scanNewlines and (getattr(next, "lineno", None) != getattr(self, "lineno", None)):
                tokenType = NEWLINE
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
                    self.lineno += len(newlines)
                input__ = self.input_

            match = commentMatcher.match(input__)
            if not match:
                break
                
            comment = match.group(0)
            comments.append(comment)
            self.cursor += len(comment)
            newlines = newlineMatcher.findall(comment)
            if newlines:
                self.lineno += len(newlines)
                
        self.tokenIndex = (self.tokenIndex + 1) & 3
        token = self.tokens.get(self.tokenIndex)
        if not token:
            token = Token()
            self.tokens[self.tokenIndex] = token
            
        # Store comments
        if len(comments) > 0:
            token.comments = comments;

        # Update token
        if input__:
            token.start = self.cursor        
            self.cursor += len(self.matchInput(token, input__))
            token.end = self.cursor
            token.lineno = self.lineno
        else:
            token.type = "end"

        # Return token type
        return getattr(token, "type", None)
        
        
    def matchInput(self, token, text):
        match = floatMatcher.match(text)
        if match:
            token.type = "number"
            token.value = float(match.group(0))
            token.variant = "float"
            return match.group(0)

        match = numberMatcher.match(text)
        if match:
            token.type = "number"
            token.value = eval(match.group(0))
            token.variant = "int"
            return match.group(0)

        match = identifierMatcher.match(text)
        if match:
            id_ = match.group(0)
            if id_ in keywords:
                token.type = id_
            else:
                token.type = "identifier"
            token.value = id_
            return id_

        match = stringMatcher.match(text)
        if match:
            token.type = "string"
            token.value = eval(match.group(0))
            if match.group(0)[0] == "'":
                token.variant = "single"
            else:
                token.variant = "double"
            return match.group(0)

        if self.scanOperand:
            match = regularExprMatcher.match(text)
            if match:
                token.type = "regexp"
                token.value = match.group(1)
                token.variant = match.group(2)
                return match.group(0)

        match = symbolMatcher.match(text)
        if match:
            op = match.group(0)
            if assignOps.has_key(op) and text[len(op)] == '=':
                token.type = "assign"
                token.assignOp = globals()[operatorPunctuatorNames[op]]
                token.value = op
                return match.group(0) + "="
            token.type = globals()[operatorPunctuatorNames[op]]
            
            # FIXME: What does this code do?
            #if self.scanOperand and (token.type in (PLUS, MINUS)):
            #    token.type += UNARY_PLUS - PLUS
                
            token.assignOp = None
            token.value = op
            return match.group(0)

        if self.scanNewlines:
            match = re.match(r'^\n', text)
            if match:
                token.type = "newline"
                return match.group(0)

        raise ParseError("Illegal token", self.filename, self.lineno)
        

    def unget(self):
        self.lookahead += 1
        
        if self.lookahead == 4: 
            raise "PANIC: too much lookahead!"
        
        self.tokenIndex = (self.tokenIndex - 1) & 3
