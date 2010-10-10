#
# JavaScript Tools - Dependency Analyser Module
# Copyright 2010 Sebastian Werner
#

import logging

def collect(node, ownName):
    """ Computes and returns the dependencies of the given node """
    # All declared variables (is copied at every function scope)
    declared = set()
    
    # All external variables/classes accessed
    dependencies = set()
    
    # Register breaks (depencies with lower priority)
    breaks = set()
    
    # User defined tags for pre-processor (us)
    tags = {
        "require" : set(),
        "optional" : set(),
        "break" : set()
    }
    
    # Start inspection
    __inspect(node, declared, dependencies, tags)
    
    # Filter own name
    if ownName in dependencies:
        dependencies.remove(ownName)
    if ownName in breaks:
        breaks.remove(ownName)
    
    # Process tags
    for className in tags["optional"]:
        try:
            dependencies.remove(className)
        except KeyError:
            logging.warn("Useless #optional pre-processor hint %s in %s" % (className, ownName))
            
    for className in tags["require"]:
        if className in dependencies:
            logging.warn("Auto detected #require pre-processor hint %s in %s" % (className, ownName))
            
        dependencies.add(className)
        
    for className in tags["break"]:
        if not className in dependencies:
            logging.warn("Could not break non existing dependency to %s in %s" % (className, ownName))

        breaks.add(className)        
            
    return dependencies, breaks
    
    
def __inspect(node, declared, dependencies, tags):
    """ The internal inspection routine used to collect the data for deps() """
    if node.type == "script":
        variables = getattr(node, "variables", None)
        functions = getattr(node, "functions", None)
        exceptions = getattr(node, "exceptions", None)
        params = getattr(node, "params", None)

        if variables or functions or exceptions or params:
            # Protect outer from changes
            declared = declared.copy()

            if variables: declared.update(variables)
            if functions: declared.update(functions)
            if exceptions: declared.update(exceptions)
            if params: declared.update(params)

        # Filter uses by known items
        uses = getattr(node, "uses", None)
        if uses:
            for value in uses:
                if not value in declared:
                    dependencies.add(value)
                    
    # Detect namespaced identifiers
    elif node.type == "identifier":
        value = node.value 
        
        if not value in declared:
            name = combineVariable(node)
            if name:
                dependencies.add(name)
                
    # Process comments
    try:
        comments = node.comments
    except AttributeError:
        comments = None
    
    if comments:
        for comment in comments:
            commentTags = comment.getTags()
            if commentTags:
                if "require" in commentTags:
                    tags["require"].update(set(commentTags["require"]))
                if "optional" in commentTags:
                    tags["optional"].update(set(commentTags["optional"]))
                if "break" in commentTags:
                    tags["break"].update(set(commentTags["break"]))

    # Process children
    for child in node:
        __inspect(child, declared, dependencies, tags)
        
        
def combineVariable(node):
    """ Combines an identifier node to a namespaced variable. Only returns a (string) value when value is part of a namespaced variable """

    if getattr(node, "scope", False) and node.parent.type == "dot":
        variable = __combineVariableRecurser(node)
        if "." in variable:
            return variable

    return None


def __combineVariableRecurser(node):
    """ Internal helper for namespace builder """
    result = node.value

    # Don't go deeper if name starts with a upper-case
    # This is normally a hint for a class name.
    if result[0].upper() == result[0]:
        return result

    parent = node.parent
    if parent.type == "dot":
        if parent[0] is node:
            result += "." + __combineVariableRecurser(parent[1])
        else:
            parentParent = parent.parent
            if parentParent.type == "dot" and parentParent[0] is parent:
                result += "." + __combineVariableRecurser(parentParent[1])

    return result        
