#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Sebastian Werner
#

from jasy.js.util import *
import logging, json, msgpack

__all__ = ["ApiData"]

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
            self.setMain("core.Module", coreModule.parent)
            
            staticsMap = getParameterFromCall(coreModule, 1)
            if staticsMap:
                self.statics = {}
                for staticsEntry in staticsMap:
                    self.addEntry(staticsEntry[0].value, staticsEntry[1], staticsEntry, self.statics)


        #
        # core.Interface
        #

        # TODO


        #
        # core.Class
        #
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
                        self.events = {}
                        for eventEntry in sectionValue:
                            self.addEvent(eventEntry[0].value, eventEntry[1], eventEntry, self.events)

                    elif sectionName == "properties":
                        pass
                    
                    elif sectionName == "members":
                        self.members = {}
                        for memberEntry in sectionValue:
                            self.addEntry(memberEntry[0].value, memberEntry[1], memberEntry, self.members)


        #
        # Export relevant usage data from scope scanner
        #
        self.main["uses"] = {}
        self.main["uses"].update(tree.scope.shared)
        self.main["uses"].update(tree.scope.packages)
        
        
        
    def export(self):
        return {
          "main": self.main,
          "constructor": self.constructor,
          "statics": self.statics,
          "properties": self.properties,
          "events": self.events,
          "members": self.members
        }        


    def toJSON(self, format=False):
        if format:
            return json.dumps(self.export(), sort_keys=True, indent=2)
        else:
            return json.dumps(self.export())
        
        
    def toMsgpack(self):
        return msgpack.packb(self.export())
        
        

    def warn(self, message, line):
        logging.warn("%s at line %s in %s" % (message, line, self.fileId))


    def getDocComment(self, node, msg=None, required=True):
        comments = getattr(node, "comments", None)
        if comments:
            for comment in comments:
                if comment.variant == "doc":
                    if not comment.text and msg and required:
                        self.warn("Missing documentation text (%s)" % msg, node.line)

                    return comment

        if msg and required:
            self.warn("Missing documentation (%s)" % msg, node.line)

        return None



    def setMain(self, mainType, mainNode):
        
        callComment = self.getDocComment(mainNode, "Main")

        self.main = {
            "type" : mainType,
            "line" : mainNode.line,
            "doc" : callComment.html if callComment else None
        }



    def addEvent(self, name, valueNode, commentNode, collection):
        entry = collection[name] = {}
        
        if valueNode.type == "dot":
            entry["type"] = assembleDot(valueNode)
        elif valueNode.type == "identifier":
            entry["type"] = valueNode.value
            
            # Try to resolve identifier with local variable assignment
            assignments, values = findAssignments(valueNode.value, valueNode)
            if assignments:
                
                # We prefer the same comment node as before as in these 
                # szenarios a reference might be used for different event types
                if not findCommentNode(commentNode):
                    commentNode = assignments[0]

                self.addEvent(name, values[0], commentNode, collection)
                return
        
        comment = self.getDocComment(commentNode, "Event '%s'" % name)
        if comment:
            
            # Prefer type but fall back to returns (if the developer has made an error here)
            if comment.stype:
                entry["type"] = comment.stype
            elif comment.returns:
                entry["type"] = comment.returns[0]

            if comment.html:
                entry["doc"] = comment.html



    def addEntry(self, name, valueNode, commentNode, collection):
        
        #
        # Use already existing type or get type from node info
        #
        if name in collection:
            entry = collection[name]
        else:
            entry = collection[name] = {
                "type" : nodeTypeToDocType[valueNode.type]
            }
        
        
        #
        # Store generic data like line number and visibility
        #
        entry["line"] = valueNode.line
        entry["visibility"] = getVisibility(name)
        
        
        # 
        # Complex structured types are processed in two steps
        #
        if entry["type"] == "Call" or entry["type"] == "Hook":
            
            commentNode = findCommentNode(commentNode)
            if commentNode:

                comment = self.getDocComment(commentNode, "Call/Hook '%s'" % name)
                if comment:

                    # Static type definition
                    if comment.stype:
                        entry["type"] = comment.stype
                        self.addEntry(name, valueNode, commentNode, collection)
                        return
                
                    else:
                    
                        # Maybe type function: We need to ignore returns etc. which are often
                        # the parent of the comment.
                        funcValueNode = findFunction(commentNode)
                        if funcValueNode:
                        
                            # Switch to function type for re-analysis
                            entry["type"] = "Function"
                            self.addEntry(name, funcValueNode, commentNode, collection)
                            return
                        
            if entry["type"] == "Call":
                
                if valueNode[0].type == "function":
                    callFunction = valueNode[0]
                
                elif valueNode[0].type == "identifier":
                    assignNodes, assignValues = findAssignments(valueNode[0].value, valueNode[0])
                    if assignNodes:
                        callFunction = assignValues[0]
                
                if callFunction:
                    # We try to analyze what the first return node returns
                    returnNode = findReturn(callFunction)
                    if returnNode and len(returnNode) > 0:
                        returnValue = returnNode[0]
                        entry["type"] = nodeTypeToDocType[returnValue.type]
                        self.addEntry(name, returnValue, returnValue, collection)
                    
            elif entry["type"] == "Hook":

                thenEntry = valueNode[1]
                thenType = nodeTypeToDocType[thenEntry.type]
                if not thenType in ("void", "null"):
                    entry["type"] = thenType
                    self.addEntry(name, thenEntry, thenEntry, collection)

                # Try second item for better data then null/void
                else:
                    elseEntry = valueNode[2]
                    elseType = nodeTypeToDocType[elseEntry.type]
                    entry["type"] = elseType
                    self.addEntry(name, elseEntry, elseEntry, collection)
                
            return
            
            
        #
        # Try to resolve identifiers
        #
        if entry["type"] == "Identifier":
            
            assignNodes, assignValues = findAssignments(valueNode.value, valueNode)
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
                
                assignType = assignValues[0].type
                
                entry["type"] = nodeTypeToDocType[assignType]
                
                # Prefer comment from assignment, not from value if available
                self.addEntry(name, assignValues[0], assignCommentNode or assignValues[0], collection)
            
                return



        #
        # Processes special types:
        #
        # - Plus: Whether a string or number is created
        # - Object: Figures out the class instance which is created
        #
        if entry["type"] == "Plus":
            entry["type"] = detectPlusType(valueNode)
        
        elif entry["type"] == "Object":
            entry["type"] = detectObjectType(valueNode)
        
        
        
        #
        # Read data from comment and add documentation
        #
        comment = self.getDocComment(commentNode, "Member/Static %s (%s)" % (name, entry["type"]), requiresDocumentation(name))
        if comment:
            
            if comment.stype:
                entry["type"] = comment.stype
                
            if comment.html:
                entry["doc"] = comment.html
        
        elif requiresDocumentation(name):
            
            entry["errornous"] = True
        
        
        
        #
        # Add additional data for function types (params, returns)
        #
        if entry["type"] == "Function":
            
            # Add basic param data
            funcParams = getParamNamesFromFunction(valueNode)
            if funcParams:
                entry["params"] = {}
                for paramName in funcParams:
                    entry["params"][paramName] = {}
            
            
            
            # TODO: Automatic return analysis?



            # Use comment for enrich existing data
            if comment:
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
            



        
        
        
        
        