#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Sebastian Werner
#

from jasy.js.util import *
import logging

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
        
        logging.info("Generate API Data: %s" % self.fileId)


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




        #
        # Debug
        #
        from pprint import pprint 

        print("==== Main ======================")
        pprint(self.main)

        print("==== Constructor ======================")
        pprint(self.constructor)

        print("==== Statics ======================")
        pprint(self.statics)
                        
        print("==== Properties ======================")
        pprint(self.properties)

        print("==== Events ======================")
        pprint(self.events)

        print("==== Members ======================")
        pprint(self.members)




    def warn(self, message, line):
        logging.warn("%s at line %s in %s" % (message, line, self.fileId))



    def setRoot(self, mainType, mainNode):
        
        callComment = self.getDocComment(mainNode, "root node")

        self.main = {
            "type" : mainType,
            "line" : mainNode.line,
            "doc" : callComment.html if callComment else None
        }




    def addEntry(self, name, value, definiton, collection, valueType=None):

        # If value type is not enforced we figure it out automatically
        if valueType is None:
            valueType = value.type

        # Create entry in collection map
        entry = collection[name] = {
            "type" : valueType
        }

        # Add function types
        if valueType == "function":
            funcParams = getParamNamesFromFunction(value)
            if funcParams:
                entry["params"] = {paramName: None for paramName in funcParams}
            
            # Use comment for enrich existing data
            comment = self.getDocComment(definiton, "function %s" % name)
            if comment:
                if comment.html:
                    entry["doc"] = comment.html

                if comment.returns:
                    entry["returns"] = comment.returns
                
                if funcParams:
                    if not comment.params:
                        self.warn("Documentation for parameters of function %s are missing" % name, value.line)
                    else:
                        for paramName in funcParams:
                            if paramName in comment.params:
                                entry["params"][paramName] = comment.params[paramName]
                            else:
                                self.warn("Missing documentation for parameter %s in function %s" % (paramName, name), value.line)

                                
        # Add call types
        elif valueType == "call":
            
            # Calls default to typeof function when comment does not explicitely say otherwise (via static type hint)
            
            comment = self.getDocComment(definiton, "call %s" % name)
            
            
            
        # Add others
        else:
            
            comment = self.getDocComment(definiton, "misc %s" % name)
            self.warn("Unsupported entry type %s in %s" % (valueType, name), value.line)



    def getDocComment(self, node, msg):
        comments = getattr(node, "comments", None)
        if comments:
            for comment in comments:
                if comment.variant == "doc":
                    if not comment.text:
                        self.warn("Missing documentation text (%s)" % msg, node.line)
                        
                    return comment

        self.warn("Missing documentation (%s)" % msg, node.line)
        return None
        
        
        
        
        