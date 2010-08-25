#
# JavaScript Tools - Dependency Analyser Module
# Copyright 2010 Sebastian Werner
#

from js.Util import combineVariable

def deps(node):
    # All declared variables (is copied at every function scope)
    declared = set()
    
    # All top level variables accessed (e.g. browser objects like "window" or top-level namespaces)
    toplevel = set()
    
    # All namespaced variables accessed (e.g. class names like qx.ui.core.Widget)
    namespaced = set()
    
    # Start inspection
    __inspect(node, declared, toplevel, namespaced)
    
    return toplevel, namespaced
    
    
def __inspect(node, declared, toplevel, namespaced):
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
            for item in uses:
                if not item in declared:
                    toplevel.add(item)
                    
    # Detect namespaced identifiers
    elif node.type == "identifier" and not node.value in declared:
        name = combineVariable(node)
        if name:
            namespaced.add(name)

    # Process children
    for child in node:
        __inspect(child, declared, toplevel, namespaced)
        
    

    