#
# JavaScript Tools - Meta Data Loader
# Copyright 2010 Sebastian Werner
#

class MetaData:
    """ 
    Data structure to hold all dependency information 

    Hint: Must be a clean data class without links to other 
    systems for optiomal cachability using Pickle
    """
    
    def __init__(self, tree):
        self.provides = set()
        self.requires = set()
        self.optionals = set()
        self.breaks = set()
        self.assets = set()
        
        self.__inspect(tree)
        
        
    def __inspect(self, node):
        """ The internal inspection routine """
    
        # Parse comments
        try:
            comments = node.comments
        except AttributeError:
            comments = None
    
        if comments:
            for comment in comments:
                commentTags = comment.getTags()
                if commentTags:
                    if "provide" in commentTags:
                        self.provides.update(set(commentTags["provide"]))
                    if "require" in commentTags:
                        self.requires.update(set(commentTags["require"]))
                    if "optional" in commentTags:
                        self.optionals.update(set(commentTags["optional"]))
                    if "break" in commentTags:
                        self.breaks.update(set(commentTags["break"]))
                    if "asset" in commentTags:
                        self.assets.update(set(commentTags["asset"]))

        # Process children
        for child in node:
            self.__inspect(child)
