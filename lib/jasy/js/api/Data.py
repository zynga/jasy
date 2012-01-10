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
    
    
def getParameter(call, index=0):
    if call.type != "call":
        raise Exception("Invalid call node: %s" % node)

    return call[1][index]



def addMember(name, value, collection):
    logging.info("Member: %s" % name)
    pass


class ApiException():
    pass


class ApiData():
    
    def __init__(self, tree, fileId):
        
        logging.info("Initializing API Data: %s" % fileId)
        
        constructor = {}
        statics = {}
        members = {}
        properties = {}
        events = {}
        
        coreClass = findCall(tree, "core.Class")
        if coreClass:
            configMap = getParameter(coreClass, 1)
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
                            addMember(memberEntry[0].value, memberEntry[1], members)
                        
                        
                        
                        
                        