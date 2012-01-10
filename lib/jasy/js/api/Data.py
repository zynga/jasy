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
    return [identifier.value for identifier in func.params]
    
    



def addMember(name, value, comment, collection, fileId):
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
                    logging.warn('Missing documentation for parameter "%s" at line %s in file %s', paramName, value.line, fileId)
        else:
            params = {paramName: None for paramName in funcParams}
        
        collection[name] = {
            "type" : "function",
            "params" : params,
            "doc" : comment.html
        }
        
    else:
        raise ApiException("Unsupported member type %s at line: %s", valueType, value.line)

    
    
    
def getDocComment(node, fileId):
    comments = getattr(node, "comments", None)
    for comment in comments:
        if comment.variant == "doc":
            return comment
            
    logging.warn("Missing documentation at line %s in file %s", node.line, fileId)
    return None


class ApiException():
    pass


class ApiData():
    
    def __init__(self, tree, fileId):
        
        logging.info("Generate API Data: %s" % fileId)
        
        constructor = {}
        statics = {}
        members = {}
        properties = {}
        events = {}
        
        coreClass = findCall(tree, "core.Class")
        if coreClass:
            configMap = getParameterFromCall(coreClass, 1)
            if configMap:
                for propertyInit in configMap:
                    
                    configSectionName = propertyInit[0].value
                    configSectionValue = propertyInit[1]
                    
                    if configSectionName == "construct":
                        pass

                    elif configSectionName == "events":
                        pass

                    elif configSectionName == "properties":
                        pass
                    
                    elif configSectionName == "members":
                        
                        if configSectionValue.type != "object_init":
                            raise ApiException("Invalid structure in member section of core.Class declaration in: %s" % fileId)
                        
                        for memberEntry in configSectionValue:
                            addMember(memberEntry[0].value, memberEntry[1], getDocComment(memberEntry, fileId), members, fileId)
                        
                        print("Members")
                        print(members)
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        