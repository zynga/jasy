#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Sebastian Werner
#

from jasy.js.util import *
import logging
import json

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
    return [identifier.value for identifier in func.params]
    
    






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
        
        logging.info("Generate API Data: %s" % fileId)
        


        coreModule = findCall(tree, "core.Module")
        if coreModule:
            self.setMain("core.Module", coreModule.parent)
            
            staticsMap = getParameterFromCall(coreModule, 1)
            if staticsMap:
                self.statics = {}
                for staticsEntry in staticsMap:
                    self.addEntry(staticsEntry[0].value, staticsEntry[1], self.getDocComment(staticsEntry), self.statics)

                    

        
        coreClass = findCall(tree, "core.Class")
        if coreClass:
            
            self.setMain("core.Class", coreClass.parent)
            
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
                        
                        if sectionValue.type != "object_init":
                            raise ApiException("Invalid structure in member section of core.Class declaration in: %s" % fileId)
                        
                        for memberEntry in sectionValue:
                            self.addEntry(memberEntry[0].value, memberEntry[1], self.getDocComment(memberEntry), self.members)
                        

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
        



    def setMain(self, mainType, mainNode):
        
        self.main = {
            "type" : mainType,
            "line" : mainNode.line
        }
        
        # Find comment node on call parent (semicolon node)
        callComment = self.getDocComment(mainNode)
        if callComment:
            self.main["doc"] = callComment.html        



    def addEntry(self, name, value, comment, collection):
        valueType = value.type

        logging.info("Member: %s (%s) at line %s", name, valueType, value.line)

        if valueType == "function":
            funcParams = getParamNamesFromFunction(value)
            params = {}

            if comment:
                for paramName in funcParams:
                    if paramName in comment.params:
                        params[paramName] = comment.params[paramName]
                    else:
                        params[paramName] = None
                        self.warn('Missing documentation for parameter "%s"' % paramName, value.line)
            else:
                params = {paramName: None for paramName in funcParams}

            collection[name] = {
                "type" : "function",
                "params" : params
            }
            
            if comment:
                collection[name]["doc"] = comment.html

        else:
            self.warn("Unsupported entry type %s" % valueType, value.line)




    def getDocComment(self, node):
        comments = getattr(node, "comments", None)
        if comments:
            for comment in comments:
                if comment.variant == "doc":
                    return comment

        self.warn("Missing documentation", node.line)
        return None                        