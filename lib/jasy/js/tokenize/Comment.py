#
# Jasy - Web Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import logging, re

class CommentException(Exception):
    def __init__(self, message, lineNo=0):
        Exception.__init__(self, "Comment error: %s (line: %s)" % (message, lineNo+1))
            

class Comment():
    context = None
    tags = None
    params = None
    throws = None
    returns = None
    
    
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
        first = splitted[0]
        
        # first line is the master line which defines the indent of the following lines
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
        
        # cut out indent from all following lines
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
        return "|".join(re.compile("\s*\|\s*").split(decl)).strip()



    def __extractReturn(self, text):
        """
        Extracts leading type defintion to use it as a return value
        """

        returnMatcher = re.compile(r"^\s*\{([a-zA-Z0-9_ \|\[\]]+)\}")
        
        def collectReturn(match):
            self.returns = {
                "type" : self.__compactTypeDecl(match.group(1)),
                "description" : None
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
        Extract classic JSDoc style items with support for both JSDoc like params and qooxdoo like params
        """

        # Supports 
        # - @tagname comment
        parseTags = re.compile(r"^@([a-zA-Z]+)")
        
        # Supports:
        # - @param name {Type} description
        # - @param name {Type?} description
        # - @param name {Type?defaultValue} description
        parseParams1 = re.compile(r"^@(param)\s+([a-zA-Z0-9]+)\s+\{([a-zA-Z0-9_ \|\[\]]+)(\s*(\?)\s*([a-zA-Z0-9 \.\"\'_-]+)?)?\}")

        # Supports:
        # - @param name description
        # - @param {Type} name description 
        # - @param {Type} [optionalName=defaultValue] description
        # - @param {Type} [optionalName] description
        parseParams2 = re.compile(r"^@(param)(\s+\{([a-zA-Z0-9_ \|\[\]]+)\})?(\s+(\[?)(([a-zA-Z0-9]+)(\s*=\s*([a-zA-Z0-9 \.\"\'_-]+))?)\]?)")
        
        # Supports:
        # - @return {Type} comment
        parseReturnThrow = re.compile(r"^@(returns|throws|return|throw)(\s+\{([a-zA-Z0-9_\.\|\[\]]+)\})?")
        
        # Translate basic param, throw and return tags from JSDOC: http://code.google.com/p/jsdoc-toolkit/wiki/TagReference
        supportedTags = ('@param ', '@return ', '@returns ', '@throw ', '@throws ')


        addToDescription = False
        description = ""
        name = ""
        remainingText = []

        
        def store():
            
            if not name:
                return
            
            if name == "param":
                storeType = paramType
            else:
                storeType = returnThrowType
                
            if storeType:
                storeType = self.__compactTypeDecl(storeType)
                
            if name == "param":
                
                if self.params is None:
                    self.params = {}
                
                self.params[paramName] = {
                    "optional": paramOptional,
                    "type" : storeType, 
                    "default" : paramDefault,
                    "description" : description
                }
                
            elif name == "return" or name == "returns":
                
                self.returns = {
                    "type" : storeType,
                    "description" : description
                }
            
            elif name == "throw" or name == "throws":
            
                self.throws = {
                    "type" : storeType,
                    "description" : description
                }
                
                
        
        for line in text.split("\n"):
            
            if line.startswith(supportedTags):
                
                # Save previous attribute (aka jsdoc tag)
                store()
                name = ""
                
                # Parse current line
                matched = parseTags.match(line)
                if matched:
                    name = matched.group(1)
                    
                    # Match against two possible param formats
                    if name == "param":
                        matched = parseParams1.match(line)
                        if matched:
                            
                            paramName = matched.group(2)
                            paramType = matched.group(3)
                            paramOptional = matched.group(5) is not None
                            paramDefault = matched.group(6)

                            # Remove matched content from line
                            line = parseParams1.sub("", line)

                        else:
                            matched = parseParams2.match(line)
                            
                            if matched:
                                
                                paramType = matched.group(3)
                                paramOptional = matched.group(5) is not ""
                                paramName = matched.group(7)
                                paramDefault = matched.group(9)
                                
                                # Remove matched content from line
                                line = parseParams2.sub("", line)
                                
                            
                            else:
                                # Ignore parse error
                                logging.error("Failed to parse line: %s", line)
                                name = ""
                                continue

                    
                    # Match throws/returns with optional type definition
                    else:
                        matched = parseReturnThrow.match(line)

                        # Ignore parse error
                        if not matched:
                            logging.error("Failed to parse line: %s", line)
                            name = ""
                            continue
                        
                        returnThrowType = matched.group(3)
                        
                        # Remove matched content from line
                        line = parseReturnThrow.sub("", line)
                  
                  
                    # Build new description from tag filtered line content
                    description = line.strip()
                        
                    # Mark as active for adding description text (for capturing next lines, if needed)
                    addToDescription = True
                    

            elif line.startswith("@"):

                # Unsupported tag leads to deactivation
                logging.debug("Do not support tag line: %s" % line)
                addToDescription = False

            elif addToDescription:
                
                # Append to previous line
                if description:
                    description += " "
                    
                description += line.strip()
                
            else:
                
                remainingText.append(line)
                
                
        # Store last entry
        store()
        
        return "\n".join(remainingText).strip("\n ")
        
        
        
    def __processParams(self, text):

        paramMatcher = re.compile(r"@([a-zA-Z0-9]+)(\s*\{([a-zA-Z0-9_ \|\[\]]+)((\s*\?\s*(\S+))|(\s*\?\s*))?\})?")
        
        def collectParams(match):
            paramName = match.group(1)
            paramType = match.group(3)
            paramOptional = match.group(4) is not None
            paramDefault = match.group(5)
            
            if self.params is None:
                self.params = {}
            
            self.params[paramName] = {
                "optional": paramOptional,
                "type" : paramType, 
                "default" : paramDefault,
                "description" : ""
            }
            
            if paramOptional:
                return '<code class="param optional">%s</code>' % paramName
            else:
                return '<code class="param">%s</code>' % paramName
            
        return paramMatcher.sub(collectParams, text)
        
        
        
    def __processTypes(self, text):
        
        
        return text
        
        