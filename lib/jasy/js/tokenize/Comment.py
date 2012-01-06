#
# Jasy - Web Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import logging, re

# Try two alternative implementations
try:
    import misaka

    misakaExt = misaka.EXT_AUTOLINK | misaka.EXT_NO_INTRA_EMPHASIS
    misakaRender = misaka.HTML_SKIP_STYLE | misaka.HTML_SMARTYPANTS
    
    def markdown2html(markdownStr):
        return misaka.html(markdownStr, misakaExt, misakaRender)

    logging.info("Using high performance C-based Markdown implementation")
    
except ImportError as ex:
    import markdown
    
    def markdown2html(markdownStr):
        return markdown.markdown(markdownStr)

    logging.info("Using Python Markdown implementation.")



class CommentException(Exception):
    def __init__(self, message, lineNo=0):
        Exception.__init__(self, "Comment error: %s (line: %s)" % (message, lineNo+1))
            

class Comment():
    context = None
    tags = None
    params = None
    throws = None
    returns = None
    
    
    # Supports:
    # - @tagname comment
    jsdocTags = re.compile(r"^@(param|return|throw)")
    
    # Supports:
    # - @param name {Type}
    # - @param name {Type?}
    # - @param name {Type?defaultValue}
    jsdocParamA = re.compile(r"^@(param)\s+([a-zA-Z0-9]+)\s+\{([a-zA-Z0-9_ \|\[\]]+)(\s*(\?)\s*([a-zA-Z0-9 \.\"\'_-]+)?)?\}")

    # Supports:
    # - @param name
    # - @param {Type} name 
    # - @param {Type} [optionalName=defaultValue]
    # - @param {Type} [optionalName]
    jsdocParamB = re.compile(r"^@(param)\s+(\{([a-zA-Z0-9_ \|\[\]]+)\}\s+)?((\[?)(([a-zA-Z0-9]+)(\s*=\s*([a-zA-Z0-9 \.\"\'_-]+))?)\]?)")
    
    # Supports:
    # - @return {Type}
    jsdocReturn = re.compile(r"^@(returns?)\s+(\{([a-zA-Z0-9_\.\|\[\]]+)\})?")

    # Supports:
    # - @throw {Type}
    jsdocThrow = re.compile(r"^@(throw?)\s+(\{([a-zA-Z0-9_\.\|\[\]]+)\})?")
    
    # Supports:
    # - @deprecated
    # - @private
    # - @public
    # - @static
    jsdocFlags = re.compile(r"^@(deprecated|private|public|static)")
    
    # Supports:
    # - @name Name
    # - @namespace Namespace
    # - @requires Name
    # - @since Version
    # - @version Version
    jsdocData = re.compile(r"^@(name|namespace|requires|since|version)\s+(\S+)")
    
    
    docIndentReg = re.compile(r"^(\s*\*\s*)(\S*)")
    
    
    
    def __init__(self, text, context=None, lineNo=0, indent=""):
        # Store context (relation to code)
        self.context = context
        
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

        self.text = text
        
    
    
    def getTags(self):
        return self.tags
        


    def __outdent(self, text, indent, startLineNo):
        """
        Outdent multi line comment text and filtering empty lines
        """
        
        lines = []
        for lineNo, line in enumerate((indent+text).split("\n")):
            if line.startswith(indent):
                lines.append(line[len(indent):].rstrip())
            else:
                logging.error("Could not outdent comment at line %s", startLineNo+lineNo)
                return text
                
        # Find first line with real content
        outdentString = ""
        for lineNo, line in enumerate(lines):
            if line != "" and line.strip() != "":
                matchedDocIndent = self.docIndentReg.match(line)
                
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
                        logging.error("Invalid indention in doc string at line %s", startLineNo+lineNo)
                    else:
                        lines[lineNo] = line[outdentStringLen:]

        # Merge final lines and remove leading and trailing new lines
        return "\n".join(lines).strip("\n")

            
            
    def __processDoc(self, text, startLineNo):

        text = self.__extractJsdoc(text)
        text = self.__extractReturn(text)
        text = self.__extractTags(text)
        
        # Collapse new empty lines at start/end
        text = text.strip("\n\t ")

        text = self.__processParams(text)
        text = self.__processTypes(text)
        
        # Apply markdown convertion
        if text != "":
            text = markdown2html(text)
        
            if text == None:
                text = ""
        
        return text            
            
            

    def __compactTypeDecl(self, decl):
        
        if decl is None:
            return decl
        
        return "|".join(re.compile("\s*\|\s*").split(decl)).strip()



    def __extractReturn(self, text):
        """
        Extracts leading type defintion to use it as a return value
        """

        returnMatcher = re.compile(r"^\s*\{([a-zA-Z0-9_ \|\[\]]+)\}")
        
        def collectReturn(match):
            self.returns = {
                "type" : self.__compactTypeDecl(match.group(1))
            }
            
            return ""
            
        text = returnMatcher.sub(collectReturn, text)
        
        return text
        
        
        
    def __extractTags(self, text):
        """
        Extract all tags inside the give doc comment. These are replaced from 
        the text and collected inside the "tags" key as a dict.
        """
        
        tagMatcher = re.compile(r"#([a-zA-Z][a-zA-Z0-9]+)(\((\S+)\))?(\s|$)")
        
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

        text = tagMatcher.sub(collectTags, text)

        return text
        
        
        
    def __extractJsdoc(self, text):
        """
        Extract classic JSDoc style items with support for both JSDoc like params and qooxdoo like params.
        
        Supports reading of flag and data like JSDoc tags and stores them into new style tags.
        
        See also: http://code.google.com/p/jsdoc-toolkit/wiki/TagReference
        """

        filterLine = False
        remainingText = []

        for line in text.split("\n"):
            
            matched = self.jsdocParamA.match(line)
            if matched:
                
                paramName = matched.group(2)
                paramType = matched.group(3)
                paramOptional = matched.group(5) is not None
                paramDefault = matched.group(6)

                if self.params is None:
                    self.params = {}

                self.params[paramName] = {
                    "optional": paramOptional,
                    "type" : self.__compactTypeDecl(paramType), 
                    "default" : paramDefault
                }

                filterLine = True
                continue


            matched = self.jsdocParamB.match(line)
            if matched:
                
                paramType = matched.group(3)
                paramOptional = matched.group(5) is not ""
                paramName = matched.group(7)
                paramDefault = matched.group(9)
            
                if self.params is None:
                    self.params = {}

                self.params[paramName] = {
                    "optional": paramOptional,
                    "type" : self.__compactTypeDecl(paramType), 
                    "default" : paramDefault
                }
            
                filterLine = True
                continue
                
            
            matched = self.jsdocReturn.match(line)
            if matched:
                self.returns = self.__compactTypeDecl(matched.group(3))
                filterLine = True
                continue
            
            matched = self.jsdocThrow.match(line)
            if matched:
                self.throws = self.__compactTypeDecl(matched.group(3))
                filterLine = True
                continue
                
            matched = self.jsdocFlags.match(line)
            if matched:
                if self.tags is None:
                    self.tags = {}

                self.tags[matched.group(1)] = True
                continue
            
            matched = self.jsdocData.match(line)
            if matched:
                if self.tags is None:
                    self.tags = {}

                self.tags[matched.group(1)] = matched.group(2)
                continue
            
            # Collect remaining lines
            if filterLine and line.strip() == "":
                filterLine = False
        
            elif not filterLine:
                remainingText.append(line)
                
                
        return "\n".join(remainingText).strip("\n ")
        
        
        
    def __processParams(self, text):

        paramMatcher = re.compile(r"@([a-zA-Z0-9]+)(\s*\{([a-zA-Z0-9_ \|\[\]]+)((\s*\?\s*(\S+))|(\s*\?\s*))?\})?")
        
        def collectParams(match):
            paramName = match.group(1)
            paramType = match.group(3)
            paramOptional = match.group(4) is not None
            paramDefault = match.group(6)
            
            if paramType:
                paramType = self.__compactTypeDecl(paramType)
            
            if self.params is None:
                self.params = {}
            
            # Add new entries and overwrite if a type is defined in this entry
            if not paramName in self.params or paramType is not None:
                self.params[paramName] = {
                    "type" : paramType, 
                    "optional": paramOptional,
                    "default" : paramDefault
                }
            
            return '<code class="param">%s</code>' % paramName
            
        return paramMatcher.sub(collectParams, text)
        
        
        
    def __processTypes(self, text):
        
        
        return text
        
        