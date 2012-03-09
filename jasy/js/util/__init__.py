#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

from jasy.js.output.Compressor import Compressor

# Shared instance
compressor = Compressor()

pseudoTypes = set(["var", "undefined", "null", "true", "false", "this", "arguments"])
builtinTypes = set(["Object", "String", "Number", "Boolean", "Array", "Function", "RegExp", "Date"])

# Basic user friendly node type to human type
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
    "this": "This",
    
    # These are not real types, we try to figure out the real value behind automatically
    "call": "Call",
    "hook": "Hook",
    "assign": "Assign",
    "plus": "Plus",
    "identifier" : "Identifier",
    "dot": "Object",
    "index": "var"
}


def getVisibility(name):
    """
    Returns the visibility of the given name by convention
    """
    
    if name.startswith("__"):
        return "private"
    elif name.startswith("_"):
        return "internal"
    else:
        return "public"


def requiresDocumentation(name):
    """ 
    Whether the given name suggests that documentation is required
    """
    
    return not name.startswith("_")


def getKeyValue(dict, key):
    """
    Returns the value node of the given key inside the given object initializer.
    """
    
    for propertyInit in dict:
        if propertyInit[0].value == key:
            return propertyInit[1]


def findAssignments(name, node):
    """
    Returns a list of assignments which might have impact on the value used in the given node.
    """

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
    """
    Returns the first function inside the given node
    """
    
    return query(node, lambda node: node.type == "function")


def findCommentNode(node):
    """
    Finds the first doc comment node inside the given node
    """
    
    def matcher(node):
        comments = getattr(node, "comments", None)
        if comments:
            for comment in comments:
                if comment.variant == "doc":
                    return True

    return query(node, matcher)
    
    
def getDocComment(node):
    """
    Returns the first doc comment of the given node.
    """
    
    comments = getattr(node, "comments", None)
    if comments:
        for comment in comments:
            if comment.variant == "doc":
                return comment
                
    return None


def findReturn(node):
    """
    Finds the first return inside the given node
    """
    
    return query(node, lambda node: node.type == "return", True)
    
    
    
def valueToString(node):
    """
    Converts the value of the given node into something human friendly
    """
    
    if node.type in ("number", "string", "false", "true", "regexp", "null"):
        return compressor.compress(node)
    elif node.type in nodeTypeToDocType:
        if node.type == "plus":
            return detectPlusType(node)
        elif node.type in ("new", "new_with_args", "dot"):
            return detectObjectType(node)
        else:
            return nodeTypeToDocType[node.type]
    else:
        return "Other"



def queryAll(node, matcher, deep=True, inner=False, result=None):
    """
    Recurses the tree starting with the given node and returns a list of nodes 
    matched by the given matcher method
    
    - node: any node
    - matcher: function which should return a truish value when node matches
    - deep: whether inner scopes should be scanned, too
    - inner: used internally to differentiate between current and inner nodes
    - result: can be used to extend an existing list, otherwise a new list is created and returned
    """
    
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
    """
    Recurses the tree starting with the given node and returns the first node
    which is matched by the given matcher method.
    
    - node: any node
    - matcher: function which should return a truish value when node matches
    - deep: whether inner scopes should be scanned, too
    - inner: used internally to differentiate between current and inner nodes
    """
    
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
    """
    Recurses the tree starting with the given node and returns the first node
    which calls the given method name (supports namespaces, too)
    """

    if type(methodName) is str:
        methodName = set([methodName])
    
    def matcher(node):
        call = getCallName(node)
        if call and call in methodName:
            return call
    
    return query(node, matcher)
    
    
def getCallName(node):
    if node.type == "call":
        if node[0].type == "dot":
            return assembleDot(node[0]) 
        elif node[0].type == "identifier":
            return node[0].value
    
    return None
    
    
def getParameterFromCall(call, index=0):
    """
    Returns a parameter node by index on the call node
    """
    
    try:
        return call[1][index]
    except:
        return None


def getParamNamesFromFunction(func):
    """
    Returns a human readable list of parameter names (sorted by their order in the given function)
    """
    
    params = getattr(func, "params", None)
    if params:
        return [identifier.value for identifier in params]
    else:
        return None
    

def detectPlusType(plusNode):
    """
    Analyses the given "plus" node and tries to figure out if a "string" or "number" result is produced.
    """
    
    if plusNode[0].type == "string" or plusNode[1].type == "string":
        return "String"
    elif plusNode[0].type == "number" and plusNode[1].type == "number":
        return "Number"
    elif plusNode[0].type == "plus" and detectPlusType(plusNode[0]) == "String":
        return "String"
    else:
        return "var"


def detectObjectType(objectNode):
    """
    Returns a human readable type information of the given node
    """
    
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
    
    

def resolveIdentifierNode(identifierNode):
    assignNodes, assignValues = findAssignments(identifierNode.value, identifierNode)
    if assignNodes:
    
        assignCommentNode = None
    
        # Find first relevant assignment with comment! Otherwise just first one.
        for assign in assignNodes:
        
            # The parent is the relevant doc comment container
            # It's either a "var" (declaration) or "semicolon" (assignment)
            if getDocComment(assign):
                assignCommentNode = assign
                break
            elif getDocComment(assign.parent):
                assignCommentNode = assign.parent
                break
        
        return assignValues[0], assignCommentNode or assignValues[0]
    
    return None, None
    
    
    
def assembleDot(node, result=None):
    """
    Joins a dot node (cascaded supported, too) into a single string like "foo.bar.Baz"
    """
    
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
    