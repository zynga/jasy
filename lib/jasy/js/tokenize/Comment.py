#
# Jasy - Web Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

class CommentException(Exception):
    def __init__(self, message, lineNo=0):
        Exception.__init__(self, "Comment error: %s (line: %s)" % (message, lineNo+1))
            

class Comment():
    context = None
    tags = None
    
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
        else:
            # Strip white space from single line comments
            # " hello " => "hello"
            text = text.strip()

        # Extract docs
        if self.variant == "doc":
            pass
            #text = self.__processDoc(text, lineNo)

            # Docs first and last line is removed, we need to add the missing line here
            #text = self.__extractTags(text, lineNo+1)

        self.text = text
        
    
    def getTags(self):
        return self.tags
        

    def __outdent(self, text, indent, lineNo):
        """
        Outdent multi line comment text
        """
        
        result = []
        text = indent + text
        for pos, line in enumerate(text.split("\n")):
            if line.startswith(indent):
                result.append(line[len(indent):])
            else:
                raise CommentException("Invalid indention in comment", lineNo)
                
        return "\n".join(result)
        
        
    def __processDoc(self, text, startLineNo):
        if not "\n" in text:
            return text[3:-2].strip()
            
        splitted = text.split("\n")[1:-1]
        
        # empty check
        if not splitted:
            raise CommentException("Empty documentation string.", startLineNo)
        
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
            

            
    hasName = ["param"]
    hasType = ["return", "param", "type", "enum", "implements", "require", "optional", "break", "throws", "asset", "name"]
    hasDescription = ["deprecated", "license", "preserve", "param", "return", "throws"]        
    isList = ["require", "optional", "break", "throws", "asset"]
        
        
    def __extractTags(self, text, startLineNo):
        """
        Parses JavaDoc style tags, stores them on the instance 
        and returns the tag-free description text

        BlockDescription

        # Flags
        @const
        @constructor
        @interface
        @override
        @private

        @deprecated Description
        @license Description
        @preserve Description

        @type {Type}
        @enum {Type}
        @implements {Type}

        # functions
        @param name {Type} Description
        @return {Type} Description
        
        # lists
        @throws {Type} Description

        # pre-compiler
        @name {Type}

        # pre-compiler (lists)
        @require {Type}
        @optional {Type}
        @break {Type}
        @asset {Resource}
        """        

        description = []
        tagData = None
        result = {}

        for lineNo, line in enumerate(text.split("\n")):
            if len(line) == 0:
                continue

            elif line[0] == "@":
                # Create new tag, move identifier to results
                tagIdentifier, tagName, tagData = self.__parseTagLine(line, startLineNo+lineNo)
                if tagIdentifier in result:
                    if tagIdentifier in self.hasName:
                        result[tagIdentifier][tagName] = tagData
                    elif tagIdentifier in self.isList:
                        result[tagIdentifier].append(tagData)
                    else:
                        raise CommentException("Duplicated tag found %s" % tagIdentifier, startLineNo+lineNo)

                else:
                    if tagIdentifier in self.hasName:
                        result[tagIdentifier] = {}
                        result[tagIdentifier][tagName] = tagData
                    elif tagIdentifier in self.isList:
                        result[tagIdentifier] = []
                        result[tagIdentifier].append(tagData)
                    else:
                        result[tagIdentifier] = tagData

            elif tagData:
                if isinstance(tagData, dict):
                    tagData["description"] += "\n%s" % line
                else:
                    tagData += "\n%s" % line

            else:
                description.append(line)

        # Store tags
        if result:
            self.tags = result

        # Overall description as final comment text
        return "\n".join(description)        
        
        
                
    def __parseTagLine(self, line, lineNo):
        """ Parses a single tag line aka @foo """
        mode = "identifier"

        # Result data
        tagIdentifier = ""
        tagName = ""
        tagType = ""
        tagDescription = ""
        
        for char in line:
            if mode == "done":
                break
                
            elif mode == "description":
                tagDescription += char
                
            elif char == " ":
                if mode == "identifier":
                    if tagIdentifier in self.hasName:
                        mode = "name"
                    elif tagIdentifier in self.hasType:
                        mode = "type"
                    elif tagIdentifier in self.hasDescription:
                        mode = "description"
                    else:
                        mode = "done"
                        
                elif mode == "name":
                    if tagIdentifier in self.hasType:
                        mode = "type"
                    else:
                        mode = "done"
                    
                elif mode == "type":
                    if not tagType.endswith("}"):
                        tagType += " "
                    elif tagIdentifier in self.hasDescription:
                        mode = "description"
                    else:
                        mode = "done"
                
            else:
                if mode == "identifier":
                    # omit first "@" symbol
                    if tagIdentifier or char != "@":
                        tagIdentifier += char
                elif mode == "description":
                    tagDescription += char
                elif mode == "type":
                    tagType += char
                elif mode == "name":
                    tagName += char
                 
        if tagIdentifier == "param" and not tagName:
            raise CommentException("Parameter tag %s is missing name!" % tagIdentifier, lineNo)

        if tagType:
            # Cut out leading "{" and trailing "}"
            if tagType[0] != "{" or tagType[-1] != "}":
                raise CommentException("Invalid type was used!", lineNo)
            tagType = tagType[1:-1]
            
        elif tagIdentifier in ["param", "return", "type", "enum", "implements"]:
            raise CommentException("Type information is missing in tag!", lineNo)

        # Build return value
        tagData = None
        if tagIdentifier in self.hasType:
            tagData = tagType
            
        if tagIdentifier in self.hasDescription:
            if tagData == None:
                tagData = tagDescription
            else:
                tagData = {
                    "type" : tagType, 
                    "description" : tagDescription
                }
                        
        return tagIdentifier, tagName, tagData
