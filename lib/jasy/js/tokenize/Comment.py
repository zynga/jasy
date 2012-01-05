#
# Jasy - Web Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import logging, re

# Try two alternative implementations
try:
    import misaka

    htmlRenderer = misaka.HtmlRenderer()
    markdown = misaka.Markdown(htmlRenderer)
    
    def markdown2html(markdownStr):
        return markdown.render(markdownStr)

    logging.info("Using high performance C-based Markdown implementation")
    
except:
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
    
    
    
    def __init__(self, text, context=None, lineNo=0, indent=""):
        # Store context (relation to code)
        self.context = context

        # Convert
        if text.startswith("//"):
            # "// hello" => " hello"
            text = text[2:]
            self.variant = "single"
            
        elif text.startswith("/**"):
            # "/** hello */" => " hello "
            text = text[3:-2]
            self.variant = "doc"

        elif text.startswith("/*!"):
            # "/*! hello */" => " hello "
            text = text[3:-2]
            self.variant = "protected"
            
        elif text.startswith("/*"):
            # "/* hello */" => " hello "
            text = text[2:-2]
            self.variant = "multi"
            
        else:
            raise CommentException("Invalid comment text: %s" % text, lineNo)

        if "\n" in text:
            # Outdent indention
            text = self.__outdent(text, indent, lineNo)
            
            if self.variant == "doc":
                text = self.__docOutdent(text, lineNo)

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
        


    def __outdent(self, text, indent, lineNo):
        """
        Outdent multi line comment text and filtering empty lines
        """
        
        result = []
        text = indent + text
        for pos, line in enumerate(text.split("\n")):
            if line.startswith(indent):
                # Ignore empty lines (incl. special \xA0)
                if line.strip(" \n\t\xA0") != "":
                    result.append(line[len(indent):])
            else:
                logging.error("Invalid indention in comment at line %s", lineNo+pos)
                return text
                
        return "\n".join(result)
        
        
        
    def __docOutdent(self, text, startLineNo):
        splitted = text.split("\n")

        # Find first line with real content
        lineNo = 0
        while lineNo < len(splitted):
            first = splitted[lineNo]
            if first != "" and first.strip() == "":
                break
            else:
                lineNo += 1
        
        # Use this line is the master line which defines the indent of the following lines
        indent = ""
        for char in first:
            if char == " ":
                indent += char
            elif char == "*":
                if "*" in indent:
                    break
                else:
                    indent += char
            else:
                break
        
        # Cut out indent from all following lines
        indentLength = len(indent)
        result = []
        for lineNo, line in enumerate(splitted):
            if len(line) <= indentLength:
                line = ""
            elif not line.startswith(indent):
                raise CommentException("Invalid indention in documentation string.", startLineNo+lineNo)
            
            result.append(line[indentLength:])
        
        # build new text
        return "\n".join(result)
            
            
            
    def __processDoc(self, text, startLineNo):

        text = self.__extractJsdoc(text)
        text = self.__extractReturn(text)
        text = self.__extractTags(text)
        
        # Collapse new empty lines at start/end
        text = text.strip("\n\t ")

        text = self.__processParams(text)
        text = self.__processTypes(text)
        
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
        
        