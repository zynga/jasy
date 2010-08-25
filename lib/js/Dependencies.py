#
# JavaScript Tools - Dependency Analyser Module
# Copyright 2010 Sebastian Werner
#

from js.Util import combineVariable

def deps(node):
    names = set()
    declared = set()
    namespaced = set()
    __inspect(node, declared, names, namespaced)
    
    return names, namespaced
    
    
def __inspect(node, declared, names, namespaced):
    if node.type == "script":
        variables = getattr(node, "variables", None)
        functions = getattr(node, "functions", None)
        params = getattr(node, "params", None)

        if variables or functions or params:
            # Protect outer from changes
            declared = declared.copy()

            if variables: declared.update(variables)
            if functions: declared.update(functions)
            if params: declared.update(params)

        # Filter uses by known items
        uses = getattr(node, "uses", None)
        if uses:
            for item in uses:
                if not item in declared:
                    names.add(item)
                        
    # Detect namespaced identifiers
    if node.type == "identifier" and not node.value in declared:
        name = combineVariable(node)
        if name:
            namespaced.add(name)

    # Process children
    for child in node:
        __inspect(child, declared, names, namespaced)
        
    

    