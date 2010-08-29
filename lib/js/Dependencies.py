#
# JavaScript Tools - Dependency Analyser Module
# Copyright 2010 Sebastian Werner
#

from js.Util import combineVariable


def collect(node):
    """ Computes and returns the dependencies of the given node """
    # All declared variables (is copied at every function scope)
    declared = set()
    
    # All external variables/classes accessed
    dependencies = set()
    
    # User defined flags for pre-processor (us)
    flags = {}
    
    # Start inspection
    __inspect(node, declared, dependencies, flags)
    

    # Process flags
    if "optional" in flags:
        for className in flags["optional"]:
            try:
                dependencies.remove(className)
            except KeyError:
                print("Invalid #optional pre-processor hint: %s" % className)
            
    if "require" in flags:
        for className in flags["require"]:
            if className in dependencies:
                print("Auto detected #require pre-processor hint: %s" % className)
                
            dependencies.add(className)
            
    return dependencies
    
    
def __inspect(node, declared, dependencies, flags):
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
    if not flags:
        try:
            comments = node.comments
        except AttributeError:
            comments = None
        
        if comments:
            for comment in comments:
                commentFlags = comment.getFlags()
                if commentFlags:
                    flags.update(commentFlags)

    # Process children
    for child in node:
        __inspect(child, declared, dependencies, flags)
