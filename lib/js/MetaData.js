#
# JavaScript Tools - Meta Data Loader
# Copyright 2010 Sebastian Werner
#

#
# Public API
#

def collect(node, ownName=None):
    """ Computes and returns the dependencies of the given node """

    return __inspect(node, MetaData())



#
# Implementation
#

class MetaData:
    """ Data structure to hold all dependency information """
    def __init__(self):
        self.provides = set()
        self.requires = set()
        self.optionals = set()
        self.breaks = set()
        
        
def __inspect(node, meta):
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
                    meta.provides.update(set(commentTags["provide"]))
                if "require" in commentTags:
                    meta.requires.update(set(commentTags["require"]))
                if "optional" in commentTags:
                    meta.optionals.update(set(commentTags["optional"]))
                if "break" in commentTags:
                    meta.breaks.update(set(commentTags["break"]))

    # Process children
    for child in node:
        __inspect(child, meta)
        
    return data

