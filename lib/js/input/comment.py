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
#    * Fabian Jakobs (fjakobs)
#
################################################################################

import sys, string, re

from js.input import tree
from textile import textile

##
# Many Regexp's
S_INLINE_COMMENT = "//.*"
R_INLINE_COMMENT = re.compile("^" + S_INLINE_COMMENT + "$")

R_INLINE_COMMENT_TIGHT = re.compile("^//\S+")
R_INLINE_COMMENT_PURE = re.compile("^//")



S_BLOCK_COMMENT = "/\*(?:[^*]|[\n]|(?:\*+(?:[^*/]|[\n])))*\*+/"
R_BLOCK_COMMENT = re.compile("^" + S_BLOCK_COMMENT + "$")

R_BLOCK_COMMENT_JAVADOC = re.compile("^/\*\*")
R_BLOCK_COMMENT_QTDOC = re.compile("^/\*!")
R_BLOCK_COMMENT_AREA = re.compile("^/\*\n\s*\*\*\*\*\*")
R_BLOCK_COMMENT_DIVIDER = re.compile("^/\*\n\s*----")
R_BLOCK_COMMENT_HEADER = re.compile("^/\* \*\*\*\*")

R_BLOCK_COMMENT_TIGHT_START = re.compile("^/\*\S+")
R_BLOCK_COMMENT_TIGHT_END = re.compile("\S+\*/$")
R_BLOCK_COMMENT_PURE_START = re.compile("^/\*")
R_BLOCK_COMMENT_PURE_END = re.compile("\*/$")

R_ATTRIBUTE = re.compile('[^{]@(\w+)\s*')
R_JAVADOC_STARS = re.compile(r'^\s*\*')



R_NAMED_TYPE = re.compile(r'^\s*([a-zA-Z0-9_\.#-]+)\s*({([^}]+)})?')
R_SIMPLE_TYPE = re.compile(r'^\s*({([^}]+)})?')



def outdent(source, indent): # indent is number!
    return re.compile("\n\s{%s}" % indent).sub("\n", source)



#def indent(source, indent):
#  return re.compile("\n").sub("\n" + (" " * indent), source)
def indent(source, indent):  # indent is string!
    return re.compile("\n").sub("\n" + indent, source)



def correctInline(source):
    if R_INLINE_COMMENT_TIGHT.match(source):
        return R_INLINE_COMMENT_PURE.sub("// ", source)

    return source



def findComment(node):
    
    def findCommentBefore(node):
        while node:
            if node.hasChild("commentsBefore"):
                for comment in node.getChild("commentsBefore").children:
                    if comment.get("detail") in ["javadoc", "qtdoc"]:
                        comments = parseNode(node)
                        return comments
            if node.hasParent():
                node = node.parent
            else:
                return None
            
    def findCommentAfter(node):
        while node:
            if node.hasChild("commentsBefore"):
                for comment in node.getChild("commentsBefore").children:
                    if comment.get("detail") in ["javadoc", "qtdoc"]:
                        comments = parseNode(node)
                        return comments
            if node.hasChildren():
                node = node.children[0]
            else:
                return None   
            
    if node.type == "file":
        return findCommentAfter(node)
    else:
        return findCommentBefore(node)  


def parseNode(node):
    """Takes the last doc comment from the commentsBefore child, parses it and
    returns a Node representing the doc comment"""

    # Find the last doc comment
    commentsBefore = node.getChild("commentsBefore", False)
    if commentsBefore and commentsBefore.hasChildren():
        for child in commentsBefore.children:
            if child.type == "comment" and child.get("detail") in ["javadoc", "qtdoc"]:
                return parseText(child.get("text"))

    return []



def parseText(intext, format=True):
    # print "Parse: " + intext

    # Strip "/**", "/*!" and "*/"
    intext = intext[3:-2]

    # Strip leading stars in every line
    text = ""
    for line in intext.split("\n"):
        text += R_JAVADOC_STARS.sub("", line) + "\n"

    # Autodent
    text = autoOutdent(text)

    # Search for attributes
    desc = { "category" : "description", "text" : "" }
    attribs = [desc]
    pos = 0

    while True:
        # this is necessary to match ^ at the beginning of a line
        if pos > 0 and  text[pos-1] == "\n": pos -= 1
        match = R_ATTRIBUTE.search(text, pos)

        if match == None:
            prevText = text[pos:].rstrip()

            if len(attribs) == 0:
                desc["text"] = prevText
            else:
                attribs[-1]["text"] = prevText

            break

        prevText = text[pos:match.start(0)].rstrip()
        pos = match.end(0)

        if len(attribs) == 0:
            desc["text"] = prevText
        else:
            attribs[-1]["text"] = prevText

        attribs.append({ "category" : match.group(1), "text" : "" })

    # parse details
    for attrib in attribs:
        parseDetail(attrib, format)

    return attribs


def parseDetail(attrib, format=True):
    text = attrib["text"]

    if attrib["category"] in ["param", "event", "see", "state", "appearance", "childControl"]:
        match = R_NAMED_TYPE.search(text)
    else:
        match = R_SIMPLE_TYPE.search(text)

    if match:
        text = text[match.end(0):]

        if attrib["category"] in ["param", "event", "see", "state", "appearance", "childControl"]:
            attrib["name"] = match.group(1)
            #print ">>> NAME: %s" % match.group(1)
            remain = match.group(3)
        else:
            remain = match.group(2)

        if remain != None:
            defIndex = remain.rfind("?")
            if defIndex != -1:
                attrib["defaultValue"] = remain[defIndex+1:].strip()
                remain = remain[0:defIndex].strip()
                #print ">>> DEFAULT: %s" % attrib["defaultValue"]

            typValues = []
            for typ in remain.split("|"):
                typValue = typ.strip()
                arrayIndex = typValue.find("[")

                if arrayIndex != -1:
                    arrayValue = (len(typValue) - arrayIndex) / 2
                    typValue = typValue[0:arrayIndex]
                else:
                    arrayValue = 0

                typValues.append({ "type" : typValue, "dimensions" : arrayValue })

            if len(typValues) > 0:
                attrib["type"] = typValues
                #print ">>> TYPE: %s" % attrib["type"]

    if format:
        attrib["text"] = formatText(text)
    else:
        attrib["text"] = cleanupText(text)

    if attrib["text"] == "":
        del attrib["text"]




def autoOutdent(text):
    lines = text.split("\n")

    if len(lines) <= 1:
        return text.strip()

    for line in lines:
        if len(line) > 0 and line[0] != " ":
            return text

    result = ""
    for line in lines:
        if len(line) >= 0:
            result += line[1:]

        result += "\n"

    return result



def cleanupText(text):
    #print "============= INTEXT ========================="
    #print text

    text = text.replace("<p>", "\n")
    text = text.replace("<br/>", "\n")
    text = text.replace("<br>", "\n")
    text = text.replace("</p>", " ")

    # on single lines strip the content
    if not "\n" in text:
        text = text.strip()

    else:
        newline = False
        lines = text.split("\n")
        text = u""

        for line in lines:
            if line == "":
                if not newline:
                    newline = True

            else:
                if text != "":
                    text += "\n"

                if newline:
                    text += "\n"
                    newline = False

                text += line

    #print "============= OUTTEXT ========================="
    #print text

    # Process TODOC the same as no text
    if text == "TODOC":
        return ""

    return text



def formatText(text):
    text = cleanupText(text)

    #if "\n" in text:
    #  print
    #  print "------------- ORIGINAL ----------------"
    #  print text

    text = text.replace("<pre", "\n\n<pre").replace("</pre>", "</pre>\n\n")

    # encode to ascii leads into a translation of umlauts to their XML code.
    text = unicode(textile.textile(text.encode("utf-8"), output="ascii"))

    #if "\n" in text:
    #  print "------------- TEXTILED ----------------"
    #  print text

    return text








def getAttrib(attribList, category):
    for attrib in attribList:
        if attrib["category"] == category:
            return attrib



def getParam(attribList, name):
    for attrib in attribList:
        if attrib["category"] == "param":
            if attrib.has_key("name") and attrib["name"] == name:
                return attrib



def attribHas(attrib, key):
    if attrib != None and attrib.has_key(key) and not attrib[key] in ["", None]:
        return True

    return False



def splitText(orig, attrib=True):
    res = ""
    first = True

    for line in orig.split("\n"):
        if attrib:
            if first:
                res += " %s\n" % line
            else:
                res += " *   %s\n" % line

        else:
            res += " * %s\n" % line

        first = False

    if not res.endswith("\n"):
        res += "\n"

    return res



def parseType(vtype):
    typeText = ""

    firstType = True
    for entry in vtype:
        if not firstType:
            typeText += " | "

        typeText += entry["type"]

        if entry.has_key("dimensions") and entry["dimensions"] > 0:
            typeText += "[]" * entry["dimensions"]

        firstType = False

    return typeText



