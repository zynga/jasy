#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import re

import jasy.core.Markdown as Markdown

from jasy import UserError
from jasy.js.util import *
import jasy.core.Console as Console

__all__ = ["CommentException", "Comment"]


# Used to measure the doc indent size (with leading stars in front of content)
docIndentReg = re.compile(r"^(\s*\*\s*)(\S*)")

# Used to split type lists as supported by throw, return and params
listSplit = re.compile("\s*\|\s*")

# Used to remove markup sequences after doc processing of comment text
stripMarkup = re.compile(r"<.*?>")



# Matches return blocks in comments
returnMatcher = re.compile(r"^\s*\{([a-zA-Z0-9_ \.\|\[\]]+)\}")

# Matches type definitions in comments
typeMatcher = re.compile(r"^\s*\{=([a-zA-Z0-9_ \.]+)\}")

# Matches tags
tagMatcher = re.compile(r"#([a-zA-Z][a-zA-Z0-9]+)(\((\S+)\))?(\s|$)")

# Matches param declarations in own dialect
paramMatcher = re.compile(r"@([a-zA-Z0-9_][a-zA-Z0-9_\.]*[a-zA-Z0-9_]|[a-zA-Z0-9_]+)(\s*\{([a-zA-Z0-9_ \.\|\[\]]+?)(\s*\.{3}\s*)?((\s*\?\s*(\S+))|(\s*\?\s*))?\})?")

# Matches links in own dialect
linkMatcher = re.compile(r"(\{((static|member|property|event)\:)?([a-zA-Z0-9_\.]+)?(\#([a-zA-Z0-9_]+))?\})")

# matches backticks and has a built-in failsafe for backticks which do not terminate on the same line
tickMatcher = re.compile(r"(`[^\n`]*?`)")


class CommentException(Exception):
    """
    Thrown when errors during comment processing are detected.
    """

    def __init__(self, message, lineNo=0):
        Exception.__init__(self, "Comment error: %s (line: %s)" % (message, lineNo+1))




class Comment():
    """
    Comment class is attached to parsed nodes and used to store all comment related information.
    
    The class supports a new Markdown and TomDoc inspired dialect to make developers life easier and work less repeative.
    """
    
    # Relation to code
    context = None
    
    # Dictionary of tags
    tags = None
    
    # Dictionary of params
    params = None

    # List of return types
    returns = None
    
    # Static type
    type = None
    
    # Collected text of the comment (without the extracted doc relevant data)
    text = None
    
    # Text with extracted / parsed data
    __processedText = None

    # Text of the comment converted to HTML including highlighting (only for doc comment)
    __highlightedText = None

    # Text / Code Blocks in the comment
    __blocks = None

    
    def __init__(self, text, context=None, lineNo=0, indent="", fileId=None):

        # Store context (relation to code)
        self.context = context
        
        # Store fileId
        self.fileId = fileId
        
        # Figure out the type of the comment based on the starting characters

        # Inline comments
        if text.startswith("//"):
            # "// hello" => "   hello"
            text = "  " + text[2:]
            self.variant = "single"
            
        # Doc comments
        elif text.startswith("/**"):
            # "/** hello */" => "    hello "
            text = "   " + text[3:-2]
            self.variant = "doc"

        # Protected comments which should not be removed (e.g these are used for license blocks)
        elif text.startswith("/*!"):
            # "/*! hello */" => "    hello "
            text = "   " + text[3:-2]
            self.variant = "protected"
            
        # A normal multiline comment
        elif text.startswith("/*"):
            # "/* hello */" => "   hello "
            text = "  " + text[2:-2]
            self.variant = "multi"
            
        else:
            raise CommentException("Invalid comment text: %s" % text, lineNo)

        # Multi line comments need to have their indentation removed
        if "\n" in text:
            text = self.__outdent(text, indent, lineNo)

        # For single line comments strip the surrounding whitespace
        else:
            # " hello " => "hello"
            text = text.strip()

        # The text of the comment before any processing took place
        self.text = text


        # Perform annotation parsing, markdown conversion and code highlighting on doc blocks
        if self.variant == "doc":

            # Separate text and code blocks
            self.__blocks = self.__splitBlocks(text)

            # Re-combine everything and apply processing and formatting
            plainText = '' # text without annotations but with markdown
            for b in self.__blocks:

                if b["type"] == "comment":

                    processed = self.__processDoc(b["text"], lineNo)
                    b["processed"] = processed

                    if "<" in processed:
                        plainText += stripMarkup.sub("", processed)

                    else:
                        plainText += processed

                else:
                    plainText += "\n\n" + b["text"] + "\n\n"

            # The without any annotations 
            self.text = plainText.strip()


    def __splitBlocks(self, text):

        """Splits up text and code blocks in comments.
        
        This will try to use Misaka for Markdown parsing if available and will 
        fallback to a simpler implementation in order to allow processing of
        doc parameters and links without Misaka being installed."""

        if Markdown.markdown is None:
            return self.__splitSimple(text)
        
        marked = Markdown.markdown(text, False)

        def unescape(html):
            html = html.replace('&lt;', '<')
            html = html.replace('&gt;', '>')
            html = html.replace('&amp;', '&')
            html = html.replace('&quot;', '"')
            return html.replace('&#39;', "'")

        parts = []

        lineNo = 0
        lines = text.split("\n")
        markedLines = marked.split("\n")

        i = 0
        while i < len(markedLines):

            l = markedLines[i]

            # the original text of the line
            parsed = unescape(stripMarkup.sub("", l))

            # start of a code block, grab all text before it and move it into a block
            if l.startswith('<pre><code>'):

                # everything since the last code block and before this one must be text
                comment = []
                for s in range(lineNo, len(lines)):

                    source = lines[s]
                    if source.strip() == parsed.strip():
                        lineNo = s
                        break

                    comment.append(source)

                parts.append({
                    "type": "comment",
                    "text": "\n".join(comment)
                })

                # Find the end of the code block
                e = i
                while i < len(markedLines):
                    l = markedLines[i]
                    i += 1

                    if l.startswith('</code></pre>'):
                        break

                lineCount = (i - e) - 1

                # add the code block
                parts.append({
                    "type": "code",
                    "text": "\n".join(lines[lineNo:lineNo + lineCount])
                })

                lineNo += lineCount

            else:
                i += 1
            
        # append the rest of the comment as text
        parts.append({
            "type": "comment",
            "text": "\n".join(lines[lineNo:])
        })

        return parts


    def __splitSimple(self, text):

        """Splits comment text and code blocks by manually parsing a subset of markdown"""
        
        inCode = False
        oldIndent = 0
        parts = []
        wasEmpty = False
        wasList = False
        
        lineNo = 0
        lines = text.split("\n")

        for s, l in enumerate(lines):

            # ignore empty lines
            if not l.strip() == "":

                # get indentation value and change
                indent = len(l) - len(l.lstrip())
                change = indent - oldIndent

                # detect code blocks
                if change >= 4 and wasEmpty:
                    if not wasList:
                        oldIndent = indent
                        inCode = True
                    
                        parts.append({
                            "type": "comment",
                            "text": "\n".join(lines[lineNo:s])
                        })

                        lineNo = s

                # detect outdents
                elif change < 0:
                    inCode = False

                    parts.append({
                        "type": "code",
                        "text": "\n".join(lines[lineNo:s - 1])
                    })

                    lineNo = s

                # only keep track of old previous indentation outside of comments
                if not inCode:
                    oldIndent = indent

                # remember whether this marked a list or not
                wasList = l.strip().startswith('-') or l.strip().startswith('*')
                wasEmpty = False

            else:
                wasEmpty = True

        parts.append({
            "type": "code" if inCode else "comment",
            "text": "\n".join(lines[lineNo:])
        })
        
        return parts

    def getHtml(self, highlight=True):
        """Returns the comment text converted to HTML"""

        if highlight:

            # lazily generate highlighted version
            if self.__highlightedText is None:

                if Markdown.markdown is None:
                    raise UserError("Markdown is not supported by the system. Documentation comments could converted to HTML.")

                highlightedText = '' # text with both markdown and code highlightiong
                for b in self.__blocks:
                    if b["type"] == "comment":
                        highlightedText += Markdown.markdown(b["processed"])

                    else:
                        highlightedText += "\n" + Markdown.markdown(b["text"], True)

                self.__highlightedText = highlightedText

            return self.__highlightedText

        else:
            
            if self.__processedText is None:
            
                if Markdown.markdown is None:
                    raise UserError("Markdown is not supported by the system. Documentation comments could converted to HTML.")

                processedText = ''
                for b in self.__blocks:

                    if b["type"] == "comment":

                        processedText += Markdown.markdown(b["processed"]) 

                    else:
                        processedText += "\n" + b["text"] + "\n\n"

                # Store original, unstripped text for later Markdown conversion
                self.__processedText = processedText.strip()

            return self.__processedText
    
    
    def hasContent(self):
        return self.variant == "doc" and len(self.text)
    
    def getTags(self):
        return self.tags
        
    def hasTag(self, name):
        if not self.tags:
            return False

        return name in self.tags

    def __outdent(self, text, indent, startLineNo):
        """
        Outdent multi line comment text and filtering empty lines
        """
        
        lines = []

        # First, split up the comments lines and remove the leading indentation
        for lineNo, line in enumerate((indent+text).split("\n")):

            if line.startswith(indent):
                lines.append(line[len(indent):].rstrip())

            elif line.strip() == "":
                lines.append("")

            else:
                # Only warn for doc comments, otherwise it might just be code commented out 
                # which is sometimes formatted pretty crazy when commented out
                if self.variant == "doc":
                    Console.warn("Could not outdent doc comment at line %s in %s", startLineNo+lineNo, self.fileId)
                    
                return text

        # Find first line with real content, then grab the one after it to get the 
        # characters which need 
        outdentString = ""
        for lineNo, line in enumerate(lines):

            if line != "" and line.strip() != "":
                matchedDocIndent = docIndentReg.match(line)
                
                if not matchedDocIndent:
                    # As soon as we find a non doc indent like line we stop
                    break
                    
                elif matchedDocIndent.group(2) != "":
                    # otherwise we look for content behind the indent to get the 
                    # correct real indent (with spaces)
                    outdentString = matchedDocIndent.group(1)
                    break
                
            lineNo += 1

        # Process outdenting to all lines (remove the outdentString from the start of the lines)
        if outdentString != "":

            lineNo = 0
            outdentStringLen = len(outdentString)

            for lineNo, line in enumerate(lines):
                if len(line) <= outdentStringLen:
                    lines[lineNo] = ""

                else:
                    if not line.startswith(outdentString):
                        
                        # Only warn for doc comments, otherwise it might just be code commented out 
                        # which is sometimes formatted pretty crazy when commented out
                        if self.variant == "doc":
                            Console.warn("Invalid indentation in doc comment at line %s in %s", startLineNo+lineNo, self.fileId)
                        
                    else:
                        lines[lineNo] = line[outdentStringLen:]

        # Merge final lines and remove leading and trailing new lines
        return "\n".join(lines).strip("\n")
            
            
    def __processDoc(self, text, startLineNo):

        text = self.__extractStaticType(text)
        text = self.__extractReturns(text)
        text = self.__extractTags(text)
        
        # Collapse new empty lines at start/end
        text = text.strip("\n\t ")

        parsed = ''

        # Now parse only the text outside of backticks
        last = 0
        def split(match):

            # Grab the text before the back tick and process any parameters in it
            nonlocal parsed
            nonlocal last
            start, end = match.span() 
            before = text[last:start]
            parsed += self.__processParams(before) + match.group(1)
            last = end

        tickMatcher.sub(split, text)

        # add the rest of the text
        parsed += self.__processParams(text[last:])

        text = self.__processLinks(parsed)

        return text
            

    def __splitTypeList(self, decl):
        
        if decl is None:
            return decl
        
        splitted = listSplit.split(decl.strip())

        result = []
        for entry in splitted:

            # Figure out if it is marked as array
            isArray = False
            if entry.endswith("[]"):
                isArray = True
                entry = entry[:-2]
            
            store = { 
                "name" : entry 
            }
            
            if isArray:
                store["array"] = True
                
            if entry in builtinTypes:
                store["builtin"] = True
                
            if entry in pseudoTypes:
                store["pseudo"] = True
            
            result.append(store)
            
        return result



    def __extractReturns(self, text):
        """
        Extracts leading return defintion (when type is function)
        """

        def collectReturn(match):
            self.returns = self.__splitTypeList(match.group(1))
            return ""
            
        return returnMatcher.sub(collectReturn, text)
        
        
        
    def __extractStaticType(self, text):
        """
        Extracts leading type defintion (when value is a static type)
        """

        def collectType(match):
            self.type = match.group(1).strip()
            return ""

        return typeMatcher.sub(collectType, text)
        
        
        
    def __extractTags(self, text):
        """
        Extract all tags inside the give doc comment. These are replaced from 
        the text and collected inside the "tags" key as a dict.
        """
        
        def collectTags(match):
             if not self.tags:
                 self.tags = {}

             name = match.group(1)
             param = match.group(3)

             if name in self.tags:
                 self.tags[name].add(param)
             elif param:
                 self.tags[name] = set([param])
             else:
                 self.tags[name] = True

             return ""

        return tagMatcher.sub(collectTags, text)
        
        
        
    def __processParams(self, text):
        
        def collectParams(match):

            paramName = match.group(1)
            paramTypes = match.group(3)
            paramDynamic = match.group(4) is not None
            paramOptional = match.group(5) is not None
            paramDefault = match.group(7)
            
            if paramTypes:
                paramTypes = self.__splitTypeList(paramTypes)
            
            if self.params is None:
                self.params = {}

            params = self.params
            fullName = match.group(1).strip()
            names = fullName.split('.')

            for i, mapName in enumerate(names):

                # Ensure we have the map object in the params
                if not mapName in params:
                    params[mapName] = {}

                # Add new entries and overwrite if a type is defined in this entry
                if not mapName in params or paramTypes is not None:
                
                    # Make sure to not overwrite something like @options {Object} with the type of @options.x {Number}
                    if i == len(names) - 1:

                        paramEntry = params[mapName] = {}

                        if paramTypes is not None:
                            paramEntry["type"] = paramTypes
                        
                        if paramDynamic:
                            paramEntry["dynamic"] = paramDynamic
                            
                        if paramOptional:
                            paramEntry["optional"] = paramOptional
                            
                        if paramDefault is not None:
                            paramEntry["default"] = paramDefault

                    else:
                        paramEntry = params[mapName]


                else:
                    paramEntry = params[mapName]

                # create fields for new map level
                if i + 1 < len(names):
                    if not "fields" in paramEntry:
                        paramEntry["fields"] = {}

                    params = paramEntry["fields"]

            return '<code class="param">%s</code>' % fullName
            
        return paramMatcher.sub(collectParams, text)
        
        
    def __processLinks(self, text):
        
        def formatTypes(match):
            
            parsedSection = match.group(3)
            parsedFile = match.group(4)
            parsedItem = match.group(6)
            
            # Do not match {}
            if parsedSection is None and parsedFile is None and parsedItem is None:
                return match.group(1)

            # Minor corrections
            if parsedSection and not parsedItem:
                parsedSection = ""
            
            attr = ""
            link = ""
            label = ""
            
            if parsedSection:
                link += '%s:' % parsedSection
            
            if parsedFile:
                link += parsedFile
                label += parsedFile
                
            if parsedItem:
                link += "~%s" % parsedItem
                if label == "":
                    label = parsedItem
                else:
                    label += "#%s" % parsedItem
                
            # add link to attributes list
            attr += ' href="#%s"' % link
            
            # build final HTML
            return '<a%s><code>%s</code></a>' % (attr, label)

        return linkMatcher.sub(formatTypes, text)
        
