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
        if variant == "single":
            text = text[2:].strip()
            
        elif variant == "multi":
            text = self.__outdent(text, indent)
            if text.startswith("/**"):
                variant = "doc"
                text = self.__processDoc(text)
            else:
                text = text[2:-2]

        self.text = text
        self.variant = variant
        self.context = context
        
        tags = None
        #tags = self.getTags()
        if tags:
            print("Tags: %s" % tags)
        
    hasName = ["param"]
    hasType = ["return", "type", "enum", "implements", "require", "optional", "break"]
    hasDescription = ["deprecated", "license", "preserve", "param", "return"]        
        
        
        
    def __processDoc(self, text):
        if not "\n" in text:
            return text[3:-2].strip()
            
        splitted = text.split("\n")[1:-1]
        first = splitted[0]
        
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
        
        indentLength = len(indent)
        result = []
        for line in splitted:
            if len(line) <= indentLength:
                line = ""
            elif not line.startswith(indent):
                raise CommentException("Invalid indention in docstring: '%s'" % line)
            
            result.append(line[indentLength:])
        
        return "\n".join(result)
            
        
        
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
        
   
        
        
    def getTags(self):
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
        
        # pre-compiler
        @require {Type}
        @optional {Type}
        @break {Type}        
        """
        
        try:
            return self.tags
        except AttributeError:
            description = ""
            tag = None
            result = {}
            
            for line in self.text.split("\n"):
                if len(line) == 0:
                    continue
                    
                elif line[0] == "@":
                    # Create new tag, move identifier to results
                    tag = self.__parseLine(line)
                    identifier = tag["identifier"]
                    if identifier in result:
                        if identifier in self.hasName:
                            result[identifier][tag["name"]] = tag
                            del tag["name"]
                        else:
                            raise CommentException("Duplicated tag found", identifier)
                        
                    else:
                        if identifier in self.hasName:
                            result[identifier] = {}
                            result[identifier][tag["name"]] = tag
                            del tag["name"]
                        else:
                            result[identifier] = tag
                        
                    del tag["identifier"]
                    
                elif tag:
                    tag["description"] += " %s" % line
                    
                else:
                    description += " %s" % line
                    
            # Cleanup empty descriptions in all tags
            for tag in result:
                if description in tag and not tag["description"]:
                    del tag["description"]
                    
            # Store overall description
            result["description"] = description
            
            self.tags = result
            return result
                
                
                
    def __parseLine(self, line):
        data = {}
        identifier = ""
        mode = "identifier"
        description = ""
        type = ""
        name = ""
        
        for char in line:
            if mode == "done":
                break
                
            elif mode == "description":
                description += char
                
            elif char == " ":
                if mode == "identifier":
                    if identifier in self.hasName:
                        mode = "name"
                    elif identifier in self.hasType:
                        mode = "type"
                    elif identifier in self.hasDescription:
                        mode = "description"
                    else:
                        mode = "done"
                        
                elif mode == "name":
                    mode = "type"
                    
                elif mode == "type":
                    if identifier in self.hasDescription:
                        mode = "description"
                    else:
                        mode = "done"
                
            else:
                if mode == "identifier":
                    # omit first "@" symbol
                    if identifier or char != "@":
                        identifier += char
                elif mode == "description":
                    description += char
                elif mode == "type":
                    type += char
                elif mode == "name":
                    name += char
                 
        data["identifier"] = identifier
        
        if name:
            data["name"] = name
        elif identifier == "param":
            raise CommentError("Parameter tag is missing name!")

        if type:
            # Cut out leading "{" and trailing "}"
            if type[0] != "{" or type[-1] != "}":
                raise CommentError("Invalid type string in tag!", identifier)
            data["type"] = type[1:-1]
            
        elif identifier in ["param", "return", "type", "enum", "implements"]:
            raise CommentError("Doc: Type information missing in tag!", identifier)

        data["description"] = description
                        
        return data