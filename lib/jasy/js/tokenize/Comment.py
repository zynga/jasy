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
    
    tagMatcher = re.compile(r"#([a-zA-Z][a-zA-Z0-9]+)(\((\S+)\))?(\s|$)")
    
    
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

        text = self.__extractTags(text)
        text = self.__extractJsdoc(text)
        
        print("PARAMS:")
        print(self.params)
        print("RETURNS:")
        print(self.returns)
        print("THROWS:")
        print(self.throws)
        print("TAGS:")
        print(self.tags)

        return text            
            
            
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

        return self.tagMatcher.sub(collectTags, text)
        
        
    def __extractJsdoc(self, text):
        """
        Extract classic JSDoc style items
        """

        # Supports 
        # - @tagname comment
        parseTags = re.compile(r"^@([a-zA-Z]+)")
        
        # Supports:
        # - @param name {Type} description
        # - @param name {Type?} description
        # - @param name {Type?defaultValue} description
        parseParams1 = re.compile(r"^@(param)\s+([a-zA-Z0-9]+)\s+\{([a-zA-Z0-9_\|\[\]]+)(\s*(\?)\s*(\S+))?\}")

        # Supports:
        # - @param name description
        # - @param {Type} name description 
        # - @param {Type} [optionalName=defaultValue] description
        # - @param {Type} [optionalName] description
        parseParams2 = re.compile(r"^@(param)(\s+\{([a-zA-Z0-9_\|\[\]]+)\})?(\s+(\[?)(([a-zA-Z0-9]+)(=([\S+]))?)\]?)")
        
        # Supports:
        # - @return {Type} comment
        parseReturnThrow = re.compile(r"^@(returns|throws|return|throw)(\s+\{([a-zA-Z0-9_\.\|\[\]]+)\})?")
        
        # Some tags form JSDoc could be converted easily: http://code.google.com/p/jsdoc-toolkit/wiki/TagReference
        # The tags: "deprecated", "since" and "version" might have small description blocks
        # The tags: "param", "returns" and "throws" support type info too
        translate = ('@constant ', '@constructor ', '@deprecated ', '@field ', '@function ', 
          '@param ', '@private ', '@property ', '@public ', '@return ', '@returns ', '@static ', 
          '@since ', '@throw ', '@throws ', '@type ', '@version ')


        active = False
        description = ""
        name = ""

        
        def store():
            
            if name == "param":
                
                if self.params is None:
                    self.params = {}
                
                self.params[paramName] = {
                    "optional": paramOptional,
                    "type" : paramType,
                    "default" : paramDefault,
                    "description" : description
                }
                
            elif name == "return" or name == "returns":
                
                self.returns = {
                    "type" : returnThrowType,
                    "decription" : description
                }
            
            elif name == "throw" or name == "throws":
            
                self.throws = {
                    "type" : returnThrowType,
                    "decription" : description
                }
                
            elif name:
                
                if self.tags is None:
                    self.tags = {}
                
                self.tags[name] = True
                
                
                
        
        for line in text.split("\n"):
            
            if line.startswith(translate):
                
                # Save previous
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
                                paramOptional = matched.group(5) is not None
                                paramName = matched.group(7)
                                paramDefault = matched.group(9)

                                # Remove matched content from line
                                line = parseParams2.sub("", line)
                                
                            
                            else:
                                # Ignore parse error
                                logging.error("Failed to parse line: %s", line)
                                continue

                    
                    # Match throws/returns with optional type definition
                    elif name in ("throw", "throws", "return", "returns"):
                        matched = parseReturnThrow.match(line)

                        # Ignore parse error
                        if not matched:
                            logging.error("Failed to parse line: %s", line)
                            continue
                        
                        returnThrowType = matched.group(3)
                        
                        # Remove matched content from line
                        line = parseReturnThrow.sub("", line)
                  
                  
                    else:
                        print("OTHER: %s" % name)
                  
                        
                    # Build new description
                    description = line.strip()
                        
                    # Mark as active (for capturing next lines, if needed)
                    active = True
                    

            elif active:
                # Append to previous line
                if description:
                    description += " "
                    
                description += line.strip()
                
                
        # Store last entry
        store()
        
        return text