#
# JavaScript Tools - Comment Parser
# Copyright 2010 Sebastian Werner
#

import markdown2

class CommentException(Exception):
    def __init__(self, message, tag=None):
        if tag:
            Exception.__init__(self, "Comment error in tag %s: %s" % (tag, message))
        else:
            Exception.__init__(self, "Comment error: %s" % message)
            

class Comment():
    def __init__(self, text, variant, context, indent=""):
        self.variant = variant
        self.context = context
        self.tags = None
        
        if variant == "single":
            text = text[2:].strip()
            
        elif variant == "multi":
            text = self.__outdent(text, indent)
            if text.startswith("/**"):
                variant = "doc"
                text = self.__processDoc(text)
                text = self.__extractTags(text)
            else:
                text = text[2:-2]

        self.text = text
        
    
    def getTags(self):
        return self.tags
        

    def __outdent(self, text, indent):
        # outdent multi line comment text
        if "\n" in text and indent != "":
            result = []
            text = indent + text
            for pos, line in enumerate(text.split("\n")):
                if line.startswith(indent):
                    result.append(line[len(indent):])
                else:
                    raise CommentException("Invalid indention in comment: %s" % text)
                    result.append(line)
                    
            text = "\n".join(result)        
        
        return text            
        
        
    def __processDoc(self, text):
        if not "\n" in text:
            return text[3:-2].strip()
            
        splitted = text.split("\n")[1:-1]
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
        for line in splitted:
            if len(line) <= indentLength:
                line = ""
            elif not line.startswith(indent):
                raise CommentException("Invalid indention in docstring: '%s'" % line)
            
            result.append(line[indentLength:])
        
        # build new text
        return "\n".join(result)
            

            
    hasName = ["param"]
    hasType = ["return", "param", "type", "enum", "implements", "require", "optional", "break"]
    hasDescription = ["deprecated", "license", "preserve", "param", "return"]        
    isList = ["require", "optional", "break"]
        
        
    def __extractTags(self, text):
        """
        Parses JavaDoc style tags (inspired by Google Compiler)

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

        # pre-compiler (lists)
        @require {Type}
        @optional {Type}
        @break {Type}        
        """        

        description = []
        tagData = None
        result = {}

        for line in text.split("\n"):
            if len(line) == 0:
                continue

            elif line[0] == "@":
                # Create new tag, move identifier to results
                tagIdentifier, tagName, tagData = self.__parseTagLine(line)
                if tagIdentifier in result:
                    if tagIdentifier in self.hasName:
                        result[tagIdentifier][tagName] = tagData
                    elif tagIdentifier in self.isList:
                        result[tagIdentifier].append(tagData)
                    else:
                        raise CommentException("Duplicated tag found", identifier)

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
            print(result)

        # Overall description as final comment text
        return "\n".join(description)        
        
        
                
    def __parseTagLine(self, line):
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
                    if tagIdentifier in self.hasDescription:
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
            raise CommentException("Parameter tag is missing name!")

        if tagType:
            # Cut out leading "{" and trailing "}"
            if tagType[0] != "{" or tagType[-1] != "}":
                raise CommentException("Invalid type string in tag!", tagIdentifier)
            tagType = tagType[1:-1]
            
        elif tagIdentifier in ["param", "return", "type", "enum", "implements"]:
            raise CommentException("Type information missing in tag!", tagIdentifier)

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