#!/usr/bin/env python
################################################################################
#
#  qooxdoo - the new era of web development
#
#  http://qooxdoo.org
#
#  Copyright:
#    2006-2010 1&1 Internet AG, Germany, http://www.1und1.de
#
#  License:
#    LGPL: http://www.gnu.org/licenses/lgpl.html
#    EPL: http://www.eclipse.org/org/documents/epl-v10.php
#    See the LICENSE file in the project's top-level directory for details.
#
#  Authors:
#    * Sebastian Werner (wpbasti)
#    * Alessandro Sala (asala)
#
################################################################################

import sys, re
from js.input import lang, comment


R_WHITESPACE = re.compile(ur"(?:\s+|\ufeff)",re.UNICODE)  # space or BOM
R_NONWHITESPACE = re.compile("\S+",re.UNICODE)
R_NUMBER = re.compile("^\d+",re.UNICODE)
R_NEWLINE = re.compile(r"(\n)")  # don't touch this subgroup!

# Ideas from: http://www.regular-expressions.info/examplesprogrammer.html
# Multicomment RegExp inspired by: http://ostermiller.org/findcomment.html

# Build Regexps for JavaScript
# quoted strings (single and double)
S_STRING_A = "'[^'\\\n]*(?:\\.|\n[^'\\\n]*)*'"
S_STRING_B = '"[^"\\\n]*(?:\\.|\n[^"\\\n]*)*"'

S_FLOAT = "(?:[0-9]*\.[0-9]+(?:[eE][+-]?[0-9]+)?)"

S_OPERATORS_2 = r"==|!=|\+\+|--|-=|\+=|\*=|/=|%=|&&|\|\||\>=|\<=|>>|<<|\^\||\|=|\^=|&=|::|\.\."
S_OPERATORS_3 = r"===|!==|\<\<=|\>\>=|\>\>\>"
S_OPERATORS_4 = r"\>\>\>="
S_OPERATORS = "(?:" + S_OPERATORS_4 + "|" + S_OPERATORS_3 + "|" + S_OPERATORS_2 + ")"

S_REGEXP   = "(?:\/(?!\*)[^\t\n\r\f\v\/]+?\/[mgi]*)"
S_REGEXP_A = "\.(?:match|search|split)\s*\(\s*\(*\s*" + S_REGEXP + "\s*\)*\s*\)"
S_REGEXP_B = "\.(?:replace)\s*\(\s*\(*\s*" + S_REGEXP + "\s*\)*\s*?,?"
S_REGEXP_C = "\s*\(*\s*" + S_REGEXP + "\)*\.(?:test|exec)\s*\(\s*"
S_REGEXP_D = "(?::|=|\?)\s*\(*\s*" + S_REGEXP + "\s*\)*"
S_REGEXP_E = "[\(,]\s*" + S_REGEXP + "\s*[,\)]"          # regexp as parameter/tuple entry
S_REGEXP_ALL = S_REGEXP_A + "|" + S_REGEXP_B + "|" + S_REGEXP_C + "|" + S_REGEXP_D + "|" + S_REGEXP_E
#S_REGEXP_ALL = "(?P<REGEXP>" + S_REGEXP_A + "|" + S_REGEXP_B + "|" + S_REGEXP_C + "|" + S_REGEXP_D + ")"
            # I would rather group only on the top-level expression, and there create a named group
            # (sub-groups only if in dire need); the named groups provide not only the match, but
            # also the classification (like "REGEXP"), to be retrieved through mo.groupdict(). this
            # would allow you to build a tokenizer through regexps entirely.

S_ALL = "(?:" + comment.S_BLOCK_COMMENT + "|" + comment.S_INLINE_COMMENT + "|" + S_STRING_A + "|" + S_STRING_B + "|" + S_REGEXP_ALL + "|" + S_FLOAT + "|" + S_OPERATORS + ")"

# compile regexp strings
R_STRING_A = re.compile("^" + S_STRING_A + "$")
R_STRING_B = re.compile("^" + S_STRING_B + "$")
R_FLOAT = re.compile("^" + S_FLOAT + "$")
R_OPERATORS = re.compile(S_OPERATORS)
R_REGEXP = re.compile(S_REGEXP)
R_REGEXP_A = re.compile(S_REGEXP_A)
R_REGEXP_B = re.compile(S_REGEXP_B)
R_REGEXP_C = re.compile(S_REGEXP_C)
R_REGEXP_D = re.compile(S_REGEXP_D)
R_REGEXP_E = re.compile(S_REGEXP_E)
R_ALL = re.compile(S_ALL)



parseLine = 1
parseColumn = 1



def protectEscape(s):
    return s.replace("\\\\", "__$ESCAPE0$__").replace("\\\"", "__$ESCAPE1$__").replace("\\\'", "__$ESCAPE2__").replace("\/", "__$ESCAPE3__").replace("\!", "__$ESCAPE4__")



def recoverEscape(s):
    return s.replace("__$ESCAPE0$__", "\\\\").replace("__$ESCAPE1$__", "\\\"").replace("__$ESCAPE2__", "\\'").replace("__$ESCAPE3__", "\/").replace("__$ESCAPE4__", "\!")



def parseElement(element, tokens=[]):
    global parseLine
    global parseColumn

    if lang.RESERVED.has_key(element):
        tok = { "type" : "reserved", "detail" : lang.RESERVED[element], "text" : element, "line" : parseLine, "column" : parseColumn }

    elif element in lang.BUILTIN:
        tok = { "type" : "builtin", "detail" : "", "text" : element, "line" : parseLine, "column" : parseColumn }

    elif R_NUMBER.search(element):
        tok = { "type" : "number", "detail" : "int", "text" : element, "line" : parseLine, "column" : parseColumn }

    elif len(element) > 0:
        tok = { "type" : "name", "detail" : "", "text" : element, "line" : parseLine, "column" : parseColumn }

    parseColumn += len(element)
    tokens.append(tok)

    return tokens



def parsePart(part, tokens=[]):
    global parseLine
    global parseColumn

    element = ""

    for line in R_NEWLINE.split(part):
        if line == "\n":
            tokens.append({ "type" : "eol", "text" : "", "detail" : "", "line" : parseLine, "column" : parseColumn })
            parseColumn = 1
            parseLine += 1

        else:
            for item in R_WHITESPACE.split(line):
                if item == "":
                    continue

                if not R_NONWHITESPACE.search(item):
                    parseColumn += len(item)
                    continue

                # print "ITEM: '%s'" % item

                # doing the per-char iteration by hand, to be able to leap
                # forward
                i = 0
                while item[i:]:
                #for char in item:
                    # look for a regexp
                    mo = R_REGEXP.match(item[i:])
                    if mo:
                        # if this thingy looks like a regexp, look that the preceding token is no
                        # "left-hand operand" that might turn the expression into a division

                        # convert existing element
                        if element != "":
                            if R_NONWHITESPACE.search(element):
                                parseElement(element, tokens)

                            element = ""

                        # look behind: this is only a regexp if there is nothing
                        # preceding it which makes it something else
                        if (    len(tokens) == 0 or (
                                (tokens[-1]['detail'] != 'int')   and
                                (tokens[-1]['detail'] != 'float') and
                                (tokens[-1]['detail'] != 'RP')    and
                                (tokens[-1]['detail'] != 'public'))):
                            tokens.append({ "type" : "regexp", "detail" : "", "text" : recoverEscape(mo.group(0)), "line" : parseLine, "column" : parseColumn })
                            parseColumn += len(mo.group(0))
                            i += len(mo.group(0))
                        

                    # work on single character tokens, otherwise concat to a bigger element

                    if i>=len(item):
                        continue
                    char = item[i]
                    i += 1
                    if lang.PUNCTUATORS.has_key(char):
                        # convert existing element
                        if element != "":
                            if R_NONWHITESPACE.search(element):
                                parseElement(element, tokens)

                            element = ""

                        # add character to token list
                        tokens.append({ "type" : "punctuator", "detail" : lang.PUNCTUATORS[char], "text" : char, "line" : parseLine, "column" : parseColumn })
                        parseColumn += 1

                    else:
                        element += char

                # convert remaining stuff to tokens
                if element != "":
                    if R_NONWHITESPACE.search(element):
                        parseElement(element, tokens)

                    element = ""

    return tokens



##
# parseFragmentLead -- find starting char POS of pattern match result <fragment>
#       in source text <content>, process <content>'s prefix up to POS, thereby
#       building up token array <tokens>,
#       and return <content> without the processed prefix
#

def parseFragmentLead(content, fragment, tokens):
    pos = content.find(fragment)

    if pos > 0:
        parsePart(recoverEscape(content[0:pos]), tokens)

    return content[pos+len(fragment):]


def cleanJavaDoc(text):
    splitted = text.split("\n")
    if len(splitted) > 1:
        indent = 0
        firstLine = splitted[1]
        for char in firstLine:
            if char == " " or char == "\t":
                indent = indent + 1
            else:
                break
        
        if indent > 0:
            result = []
            for line in splitted:
                result.append(line[indent+2:])
                
            return "\n".join(result)

    return text
    

##
# Main parsing routine, in that it qualifies tokens from the stream (operators,
# nums, strings, ...)
#
def parseStream(content):
    # make global variables available
    global parseLine
    global parseColumn

    # reset global stuff
    parseColumn = 1
    parseLine = 1

    # prepare storage
    tokens = []
    content = protectEscape(content)

    try:
        all = R_ALL.findall(content)
        
    except RuntimeError:
        msg += "\nGenerally this means that there is a syntactial problem with your source-code."
        msg += "\nPlease omit the usage of nested comments like '/* foo /* bar */'."
        raise RuntimeError(msg)

    while content:
        mo = R_ALL.search(content)
        if mo:
            fragment = mo.group(0)
        else:
            break

        # Handle block comments
        if comment.R_BLOCK_COMMENT.match(fragment):
            source = recoverEscape(fragment)
            content = parseFragmentLead(content, fragment, tokens)
            detail = "block"
            
            if source.startswith("/**"):        
                source = source[3:]
                detail = "doc"
                source = cleanJavaDoc(source)
                
            elif source.startswith("/*"):
                source = source[2:]

            if source.endswith("*/"):
                source = source[0:-2]
                            
            tokens.append({ "type" : "comment", "detail" : detail, "text" : source, "line" : parseLine, "column" : parseColumn })
            parseLine += len(fragment.split("\n")) - 1

        # Handle inline comments
        elif comment.R_INLINE_COMMENT.match(fragment):
            source = recoverEscape(fragment)
            content = parseFragmentLead(content, fragment, tokens)
            source = source[2:].strip()
            tokens.append({ "type" : "comment", "detail" : "inline", "text" : source, "line" : parseLine, "column" : parseColumn })

        # Handle strings A
        elif R_STRING_A.match(fragment):
            content = parseFragmentLead(content, fragment, tokens)
            source = recoverEscape(fragment)[1:-1]
            tokens.append({ "type" : "string", "detail" : "singlequotes", "text" : source.replace("\\\n",""), "line" : parseLine, "column" : parseColumn })
            newLines = source.count("\\\n")
            parseLine += newLines
            if newLines:
                parseColumn = len(source) - source.rfind("\\\n") + 2
            else:
                parseColumn += len(source) + 2

        # Handle strings B
        elif R_STRING_B.match(fragment):
            content = parseFragmentLead(content, fragment, tokens)
            source = recoverEscape(fragment)[1:-1]
            tokens.append({ "type" : "string", "detail" : "doublequotes", "text" : source.replace("\\\n",""), "line" : parseLine, "column" : parseColumn })
            newLines = source.count("\\\n")
            parseLine += newLines
            if newLines:
                parseColumn = len(source) - source.rfind("\\\n") + 2
            else:
                parseColumn += len(source) + 2

        # Handle float numbers
        elif R_FLOAT.match(fragment):
            content = parseFragmentLead(content, fragment, tokens)
            tokens.append({ "type" : "number", "detail" : "float", "text" : fragment, "line" : parseLine, "column" : parseColumn })

        # Handle operators
        elif R_OPERATORS.match(fragment):
            content = parseFragmentLead(content, fragment, tokens)
            tokens.append({ "type" : "punctuator", "detail" : lang.PUNCTUATORS[fragment], "text" : fragment, "line" : parseLine, "column" : parseColumn })

        # Handle everything else
        else:
            fragresult = R_REGEXP.search(fragment)

            if fragresult:
                if R_REGEXP_A.match(fragment) or R_REGEXP_B.match(fragment) or R_REGEXP_C.match(fragment) or R_REGEXP_D.match(fragment) or R_REGEXP_E.match(fragment):
                    content = parseFragmentLead(content, fragresult.group(0), tokens)
                    tokens.append({ "type" : "regexp", "detail" : "", "text" : recoverEscape(fragresult.group(0)), "line" : parseLine, "column" : parseColumn })

                else:
                    print "Bad regular expression: %s" % fragresult.group(0)

            else:
                print "Type:None!"

    parsePart(recoverEscape(content), tokens)
    tokens.append({ "type" : "eof", "text" : "", "detail" : "", "line" : parseLine, "column" : parseColumn })

    return tokens
