#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Sebastian Werner
#

from jasy.js.util import *
import logging

__all__ = ["ApiData", "ApiException"]


def query(node, matcher):
    if matcher(node):
        return node
    
    for child in node:
        result = query(child, matcher)
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
    
    






class ApiException():
    pass


class ApiData():
    
    main = None
    constructor = None
    statics = None
    properties = None
    events = None
    members = None
    
    
    def __init__(self, tree, fileId):
        
        self.fileId = fileId
        
        # logging.info("Generate API Data: %s" % self.fileId)


        #
        # core.Module
        #
        coreModule = findCall(tree, "core.Module")
        if coreModule:
            self.setRoot("core.Module", coreModule.parent)
            
            staticsMap = getParameterFromCall(coreModule, 1)
            if staticsMap:
                self.statics = {}
                for staticsEntry in staticsMap:
                    self.addEntry(staticsEntry[0].value, staticsEntry[1], staticsEntry, self.statics)


        #
        # core.Class
        #
        coreClass = findCall(tree, "core.Class")
        if coreClass:
            
            self.setRoot("core.Class", coreClass.parent)
            
            configMap = getParameterFromCall(coreClass, 1)
            if configMap:
                for propertyInit in configMap:
                    
                    sectionName = propertyInit[0].value
                    sectionValue = propertyInit[1]
                    
                    if sectionName == "construct":
                        pass

                    elif sectionName == "events":
                        pass

                    elif sectionName == "properties":
                        pass
                    
                    elif sectionName == "members":
                        self.members = {}
                        for memberEntry in sectionValue:
                            self.addEntry(memberEntry[0].value, memberEntry[1], memberEntry, self.members)






    def warn(self, message, line):
        logging.warn("%s at line %s in %s" % (message, line, self.fileId))



    def setRoot(self, mainType, mainNode):
        
        callComment = self.getDocComment(mainNode, "root node")

        self.main = {
            "type" : mainType,
            "line" : mainNode.line,
            "doc" : callComment.html if callComment else None
        }



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
        "plus": "Number",
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
        
        # These are not real types, we try to figure out the real value behind automatically
        "call": "Call",
        "hook": "Hook",
        "assign": "Assign"
    }


    def addEntry(self, name, valueNode, definition, collection):

        if name in collection:
            entry = collection[name]
            valueType = entry["type"]
        else:
            if not valueNode.type in self.nodeTypeToDocType:
                self.warn("Unsupported node value type: %s" % valueNode.type, valueNode.line)
            
            valueType = self.nodeTypeToDocType[valueNode.type]
            entry = collection[name] = {
                "type" : valueType
            }
            

        # Add function types
        if valueType == "Function":
            funcParams = getParamNamesFromFunction(valueNode)
            if funcParams:
                entry["params"] = {paramName: None for paramName in funcParams}
            
            # Use comment for enrich existing data
            comment = self.getDocComment(definition, "Function %s" % name)
            if comment:
                if comment.html:
                    entry["doc"] = comment.html

                if comment.returns:
                    entry["returns"] = comment.returns
                
                if funcParams:
                    if not comment.params:
                        self.warn("Documentation for parameters of function %s are missing" % name, valueNode.line)
                    else:
                        for paramName in funcParams:
                            if paramName in comment.params:
                                entry["params"][paramName] = comment.params[paramName]
                            else:
                                self.warn("Missing documentation for parameter %s in function %s" % (paramName, name), valueNode.line)

                                
        # Add call/hook types
        elif valueType in ("Call", "Hook"):
            
            # TODO: Look for return values, left values in hooks first???
            
            # Calls default to typeof function when comment does not explicitely say otherwise (via static type hint)
            
            comment = self.getDocComment(definition)
            
            if not comment:
                def commentMatcher(node):
                    return self.getDocComment(node)
                
                realDefinition = query(valueNode, commentMatcher)
                if realDefinition:
                    definition = realDefinition
                    
                comment = self.getDocComment(definition, "Call %s" % name)
            
            if comment:

                # Static Type
                if comment.stype:
                    entry["type"] = "StaticType"
                    self.addEntry(name, valueNode, definition, collection)
                
                # Function Type
                elif comment.returns or comment.params:
                    entry["type"] = "Function"
                    self.addEntry(name, valueNode, definition, collection)

                # Uncommented
                else:
                    entry["doc"] = comment.html
                    self.warn("Missing documentation comment for unspecified function call result in %s" % name, definition.line)
            
        
        # Add others
        else:
            
            comment = self.getDocComment(definition, valueType + " %s" % name)
            if comment:
                
                if comment.stype:
                    entry["type"] = comment.stype
                    
                if comment.html:
                    entry["doc"] = comment.html
            


    def getDocComment(self, node, msg=None):
        comments = getattr(node, "comments", None)
        if comments:
            for comment in comments:
                if comment.variant == "doc":
                    if not comment.text and msg:
                        self.warn("Missing documentation text (%s)" % msg, node.line)
                        
                    return comment

        if msg:
            self.warn("Missing documentation (%s)" % msg, node.line)
            
        return None
        
        
        
        
        