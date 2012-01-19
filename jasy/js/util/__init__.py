
nodeTypeToDocType = {

    # Primitives
    "string": "String",
    "number": "Number",
    "not": "Boolean",
    "true": "Boolean",
    "false": "Boolean",

    # Literals
    "function": "Function",
    "regexp": "RegExp",
    "object_init": "Map",
    "array_init": "Array",

    # We could figure out the real class automatically - at least that's the case quite often
    "new": "Object",
    "new_with_args": "Object",
    
    # Comparisons
    "eq" : "Boolean",
    "ne" : "Boolean",
    "strict_eq" : "Boolean",
    "strict_ne" : "Boolean",
    "lt" : "Boolean",
    "le" : "Boolean",
    "gt" : "Boolean",
    "ge" : "Boolean",
    "in" : "Boolean",
    "instanceof" : "Boolean",
    
    # Numbers
    "lsh": "Number",
    "rsh": "Number",
    "ursh": "Number",
    "minus": "Number",
    "mul": "Number",
    "div": "Number",
    "mod": "Number",
    "bitwise_and": "Number",
    "bitwise_xor": "Number",
    "bitwise_or": "Number",
    "bitwise_not": "Number",
    "increment": "Number",
    "decrement": "Number",
    "unary_minus": "Number",
    "unary_plus": "Number",
    
    # This is not 100% correct, but I don't like to introduce a BooleanLike type.
    # If the author likes something different he is still able to override it via API docs
    "and": "Boolean",
    "or": "Boolean",
    
    # Operators/Built-ins
    "void": "undefined",
    "null": "null",
    "typeof": "String",
    "delete": "Boolean",
    
    # These are not real types, we try to figure out the real value behind automatically
    "call": "Call",
    "hook": "Hook",
    "assign": "Assign",
    "plus": "Plus",
    "identifier" : "Identifier",
    "dot": "Object"
    
}


def getNumberOfLines(node):
    start = node.line
    end = node.line
    
    def counter(node):
        nonlocal end
        
        if node.line > end:
            end = node.line
    
    query(node, counter)
    
    return end - start + 1



def findAssignments(name, node):

    # Looking for all script blocks
    scripts = []
    parent = node
    while parent:
        if parent.type == "script":
            scope = getattr(parent, "scope", None)
            if scope and name in scope.modified:
                scripts.append(parent)
            
        parent = getattr(parent, "parent", None)
        
    def assignMatcher(node):
        if node.type == "assign" and node[0].type == "identifier" and node[0].value == name:
            return True
        
        if node.type == "declaration" and node.name == name and getattr(node, "initializer", None):
            return True
            
        if node.type == "function" and node.functionForm == "declared_form" and node.name == name:
            return True
            
        return False
    
    # Query all relevant script nodes
    assignments = []
    for script in scripts:
        queryResult = queryAll(script, assignMatcher, False)
        assignments.extend(queryResult)
    
    # Collect assigned values
    values = []
    for assignment in assignments:
        if assignment.type == "function":
            values.append(assignment)
        elif assignment.type == "assign":
            values.append(assignment[1])
        else:
            values.append(assignment.initializer)
            
    return assignments, values



def findFunction(node):
    def matcher(node):
        return node.type == "function"
    
    return query(node, matcher)


def findCommentNode(node):
    def matcher(node):
        comments = getattr(node, "comments", None)
        if comments:
            for comment in comments:
                if comment.variant == "doc":
                    return True

    return query(node, matcher)
    
    
def getDocComment(node):
    comments = getattr(node, "comments", None)
    if comments:
        for comment in comments:
            if comment.variant == "doc":
                return comment
                
    return None


def findReturn(node):
    def matcher(node):
        return node.type == "return"
        
    return query(node, matcher, True)



def queryAll(node, matcher, deep=True, inner=False, result=None):
    # - node: any node
    # - matcher: function which should return a truish value when node matches
    # - deep: whether inner scopes should be scanned, too
    # - inner: used internally to differentiate between current and inner nodes
    # - result: can be used to extend an existing list, otherwise a new list is created and returned
    
    if result == None:
        result = []

    # Don't do in closure functions
    if inner and node.type == "script" and not deep:
        return None

    if matcher(node):
        result.append(node)

    for child in node:
        queryAll(child, matcher, deep, True, result)

    return result
        


def query(node, matcher, deep=True, inner=False):
    # - node: any node
    # - matcher: function which should return a truish value when node matches
    # - deep: whether inner scopes should be scanned, too
    # - inner: used internally to differentiate between current and inner nodes
    
    # Don't do in closure functions
    if inner and node.type == "script" and not deep:
        return None
    
    if matcher(node):
        return node
    
    for child in node:
        result = query(child, matcher, deep, True)
        if result is not None:
            return result

    return None


def findCall(node, methodName):
    def matcher(node):
        if node.type == "call":
            
            if "." in methodName and node[0].type == "dot" and assembleDot(node[0]) == methodName:
                return node
            elif node[0].type == "identifier" and node[0].value == methodName:
                return node
    
    return query(node, matcher)
    
    
def getParameterFromCall(call, index=0):
    if call.type != "call":
        raise Exception("Invalid call node: %s" % node)

    return call[1][index]


def getParamNamesFromFunction(func):
    params = getattr(func, "params", None)
    if params:
        return [identifier.value for identifier in params]
    else:
        return None
    

def detectPlusType(plusNode):
    
    if plusNode[0].type == "string" or plusNode[1].type == "string":
        return "String"
    elif plusNode[0].type == "plus" and detectPlusType(plusNode[0]) == "String":
        return "String"
    else:
        return "Number"


def detectObjectType(objectNode):
    
    if objectNode.type in ("new", "new_with_args"):
        construct = objectNode[0]
    else:
        construct = objectNode
    
    # Only support built-in top level constructs
    if construct.type == "identifier" and construct.value in ("Array", "Boolean", "Date", "Function", "Number", "Object", "String", "RegExp"):
        return construct.value
        
    # And namespaced custom classes
    elif construct.type == "dot":
        assembled = assembleDot(construct)
        if assembled:
            return assembled

    return "Object"
    
    
def assembleDot(node, result=None):
    if result == None:
        result = []

    for child in node:
        if child.type == "identifier":
            result.append(child.value)
        elif child.type == "dot":
            assembleDot(child, result)
        else:
            return None

    return ".".join(result)