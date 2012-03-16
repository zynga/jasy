#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging, re
from jasy.core.Markdown import markdown
from jasy.js.util import *

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
paramMatcher = re.compile(r"@([a-zA-Z0-9]+\.[a-zA-Z0-9]+|[a-zA-Z0-9]+)(\s*\{([a-zA-Z0-9_ \.\|\[\]]+?)(\s*\.{3}\s*)?((\s*\?\s*(\S+))|(\s*\?\s*))?\})?")

# Matches links in own dialect
linkMatcher = re.compile(r"\{((static|member|property|event)\:)?([a-zA-Z0-9_\.]+)?(\#([a-zA-Z0-9_]+))?\}")


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
    
    # Text of the comment converted to HTML (only for doc comment)
    html = None
    
    
    def __init__(self, text, context=None, lineNo=0, indent="", fileId=None):
        # Store context (relation to code)
        self.context = context
        
        # Store fileId
        self.fileId = fileId
        
        # Convert
        if text.startswith("//"):
            # "// hello" => "   hello"
            text = "  " + text[2:]
            self.variant = "single"
            
        elif text.startswith("/**"):
            # "/** hello */" => "    hello "
            text = "   " + text[3:-2]
            self.variant = "doc"

        elif text.startswith("/*!"):
            # "/*! hello */" => "    hello "
            text = "   " + text[3:-2]
            self.variant = "protected"
            
        elif text.startswith("/*"):
            # "/* hello */" => "   hello "
            text = "  " + text[2:-2]
            self.variant = "multi"
            
        else:
            raise CommentException("Invalid comment text: %s" % text, lineNo)

        if "\n" in text:
            # Outdent indention
            text = self.__outdent(text, indent, lineNo)
            
        else:
            # Strip white space from single line comments
            # " hello " => "hello"
            text = text.strip()

        # Extract docs
        if self.variant == "doc":
            text = self.__processDoc(text, lineNo)
            html = text
            
            # Apply markdown convertion
            self.html = markdown(html)
            
            # Post process text to not contain any markup
            if "<" in text:
                text = stripMarkup.sub("", text)
        
        self.text = text
        
    
    
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
        for lineNo, line in enumerate((indent+text).split("\n")):
            if line.startswith(indent):
                lines.append(line[len(indent):].rstrip())
            elif line.strip() == "":
                lines.append("")
            else:
                logging.error("Could not outdent comment at line %s in %s", startLineNo+lineNo, self.fileId)
                return text
                
        # Find first line with real content
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

        # Process outdenting to all lines
        if outdentString != "":
            lineNo = 0
            outdentStringLen = len(outdentString)

            for lineNo, line in enumerate(lines):
                if len(line) <= outdentStringLen:
                    lines[lineNo] = ""
                else:
                    if not line.startswith(outdentString):
                        logging.error("Invalid indention in doc string at line %s in %s", startLineNo+lineNo, self.fileId)
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

        text = self.__processParams(text)
        text = self.__processLinks(text)
        
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
            fullName = paramName


            # Support field declartions for parameter maps
            # TODO validate later and ensure we only have these on Object|Map
            if paramName.find('.') != -1:

                mapName, paramName = paramName.split('.')

                # Ensure we have the map object in the params
                if not mapName in self.params:
                    self.params[mapName] = {}

                params = self.params[mapName]

                if not "fields" in params:
                    params["fields"] = {}

                params = params["fields"]
                fullName = mapName + "." + paramName


            # Add new entries and overwrite if a type is defined in this entry
            if not paramName in params or paramTypes is not None:
                paramEntry = params[paramName] = {}
                
                if paramTypes is not None:
                    paramEntry["type"] = paramTypes
                
                if paramDynamic:
                    paramEntry["dynamic"] = paramDynamic
                    
                if paramOptional:
                    paramEntry["optional"] = paramOptional
                    
                if paramDefault is not None:
                    paramEntry["default"] = paramDefault
            
            return '<code class="param">%s</code>' % fullName
            
        return paramMatcher.sub(collectParams, text)
        
        
        
    def __processLinks(self, text):
        
        def formatTypes(match):
            
            parsedSection = match.group(2)
            parsedFile = match.group(3)
            parsedItem = match.group(5)
            
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
        
        
        
        
