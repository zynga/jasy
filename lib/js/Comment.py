#
# JavaScript Tools - Comment Parser
# Copyright 2010 Sebastian Werner
#

class CommentException(Exception):
    def __init__(self, message, tag=None):
        if tag:
            Exception.__init__(self, "Comment error in tag %s: %s" % (tag, message))
        else:
            Exception.__init__(self, "Comment error: %s" % message)
            

class Comment():
    def __init__(self, text, style, mode):
        self.text = text
        self.style = style
        self.mode = mode
        
        tags = self.getTags()
        if tags:
            print("Tags: %s" % tags)
        
        
    def getTags(self):
        """
        Parses JavaDoc style tags (inspired by Google Compiler)
        
        BlockDescription
        
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

        @param name {Type} Description
        @return {Type} Description
        
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
                        if identifier == "param":
                            result[identifier].append(tag)
                        else:
                            raise CommentException("Duplicated tag found", identifier)
                        
                    else:
                        if identifier == "param":
                            result[identifier] = [tag]
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
            print("Char: %s (%s - %s)" % (char, mode, identifier))
            
            if mode == "done":
                break
                
            elif mode == "description":
                description += char
                
            elif char == " ":
                if mode == "identifier":
                    if identifier == "param":
                        mode = "name"
                    elif identifier in ["return", "type", "enum", "implements"]:
                        mode = "type"
                    elif identifier in ["deprecated", "license", "preserve"]:
                        mode = "description"
                    else:
                        mode = "done"
                elif mode == "name":
                    mode = "type"
                elif mode == "type":
                    if identifier in ["param", "return"]:
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