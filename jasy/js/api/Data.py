#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Sebastian Werner
#

import logging

from jasy.js.util import *
from jasy.js.output.Compressor import Compressor

# Shared instance
compressor = Compressor()

__all__ = ["ApiData"]

class ApiData():
    

    __slots__ = ["main", "construct", "statics", "properties", "events", "members", "id", "errornous", "package", "basename", "size", "uses", "usedBy", "includes", "includedBy", "implements", "implementedBy"]

    
    def __init__(self, id, tree=None):
        
        self.id = id
        
        splits = id.split(".")
        self.basename = splits.pop()
        self.package = ".".join(splits)
        
        self.main = {}
        self.uses = set()
        
        if tree:
            self.scan(tree)


    def scan(self, tree):
        
        self.uses.update(tree.scope.shared)
        
        for package in tree.scope.packages:
            splits = package.split(".")
            current = splits[0]
            for split in splits[1:]:
                current = "%s.%s" % (current, split)
                self.uses.add(current)
            
            
        callNode = findCall(tree, ("core.Module", "core.Interface", "core.Class", "core.Main.declareNamespace"))
        if callNode:
            callName = getCallName(callNode)

            #
            # core.Module
            #
            if callName == "core.Module":
                self.setMain(callName, callNode.parent, self.id)
            
                staticsMap = getParameterFromCall(callNode, 1)
                if staticsMap:
                    self.statics = {}
                    for staticsEntry in staticsMap:
                        self.addEntry(staticsEntry[0].value, staticsEntry[1], staticsEntry, self.statics)


            #
            # core.Interface
            #
            elif callName == "core.Interface":
                self.setMain(callName, callNode.parent, self.id)
        
                configMap = getParameterFromCall(callNode, 1)
                if configMap:
                    for propertyInit in configMap:
                
                        sectionName = propertyInit[0].value
                        sectionValue = propertyInit[1]
                
                        if sectionName == "properties":
                            self.properties = {}
                            for propertyEntry in sectionValue:
                                self.addProperty(propertyEntry[0].value, propertyEntry[1], propertyEntry, self.properties)
                
                        elif sectionName == "events":
                            self.events = {}
                            for eventEntry in sectionValue:
                                self.addEvent(eventEntry[0].value, eventEntry[1], eventEntry, self.events)

                        elif sectionName == "members":
                            self.members = {}
                            for memberEntry in sectionValue:
                                self.addEntry(memberEntry[0].value, memberEntry[1], memberEntry, self.members)
                        
                        else:
                            logging.warn("Invalid section \"%s\" (core.Interface) in %s", sectionName, self.id) 


            #
            # core.Class
            #
            elif callName == "core.Class":
                self.setMain(callName, callNode.parent, self.id)
            
                configMap = getParameterFromCall(callNode, 1)
                if configMap:
                    for propertyInit in configMap:
                    
                        sectionName = propertyInit[0].value
                        sectionValue = propertyInit[1]
                    
                        if sectionName == "construct":
                            self.addConstructor(sectionValue, propertyInit)

                        elif sectionName == "properties":
                            self.properties = {}
                            for propertyEntry in sectionValue:
                                self.addProperty(propertyEntry[0].value, propertyEntry[1], propertyEntry, self.properties)
                    
                        elif sectionName == "events":
                            self.events = {}
                            for eventEntry in sectionValue:
                                self.addEvent(eventEntry[0].value, eventEntry[1], eventEntry, self.events)

                        elif sectionName == "members":
                            self.members = {}
                            for memberEntry in sectionValue:
                                self.addEntry(memberEntry[0].value, memberEntry[1], memberEntry, self.members)
                            
                        elif sectionName == "include":
                            self.includes = [valueToString(entry) for entry in sectionValue]

                        elif sectionName == "implement":
                            self.implements = [valueToString(entry) for entry in sectionValue]

                        else:
                            logging.warn("Invalid section \"%s\" (core.Class) in %s", sectionName, self.id) 


            #
            # core.Main.declareNamespace
            #
            elif callName == "core.Main.declareNamespace":
                target = getParameterFromCall(callNode, 0)
                assigned = getParameterFromCall(callNode, 1)
                
                if target and assigned:
                    if assigned.type == "function":
                        # Use callNode call for constructor, find first doc comment for main documentation
                        self.setMain("core.Main", findCommentNode(tree), target.value)
                        self.addConstructor(assigned, callNode.parent)

                    else:
                        self.setMain("core.Main", callNode.parent, target.value)

                        if assigned.type == "object_init":
                            self.statics = {}
                            for staticsEntry in assigned:
                                self.addEntry(staticsEntry[0].value, staticsEntry[1], staticsEntry, self.statics)
        
        
        #
        # core.Main.addStatics
        #
        addStatics = findCall(tree, "core.Main.addStatics")
        if addStatics:
            target = getParameterFromCall(addStatics, 0)
            staticsMap = getParameterFromCall(addStatics, 1)
            
            if target and staticsMap:
                if target.type == "string" and staticsMap.type == "object_init":
                
                    if not self.main:
                        self.setMain("core.Main", addStatics.parent, target.value)
                
                    self.statics = {}
                    for staticsEntry in staticsMap:
                        self.addEntry(staticsEntry[0].value, staticsEntry[1], staticsEntry, self.statics)
        
        
        #
        # core.Main.addMembers
        #
        addMembers = findCall(tree, "core.Main.addMembers")
        if addMembers:
            target = getParameterFromCall(addMembers, 0)
            membersMap = getParameterFromCall(addMembers, 1)

            if target and membersMap:
                if target.type == "string" and membersMap.type == "object_init":
                
                    if not self.main:
                        self.setMain("core.Main", addMembers.parent, target.value)

                    self.members = {}
                    for membersEntry in membersMap:
                        self.addEntry(membersEntry[0].value, membersEntry[1], membersEntry, self.members)                    
        

        #
        # Other
        #
        if not (callNode or addStatics or addMembers):
            rootCommentNode = findCommentNode(tree)
            if rootCommentNode:
                rootComment = getDocComment(rootCommentNode)
                rootTags = getattr(rootComment, "tags", None)
                mainName = None

                if rootTags and "custom" in rootTags:
                    if type(rootComment.tags["custom"]) is set:
                        mainName = list(rootComment.tags["custom"])[0]
                    else:
                        mainName = None
                    
                    self.setMain("Other", rootCommentNode, mainName)
                
                else:
                    self.setMain("Unsupported", rootCommentNode, mainName)
                    logging.warn("Unsupported declaration type in %s. You might want to define a #custom(one) using documentation tags." % id)
                    
            else:
                self.setMain("Unsupported", tree, None)
        


    def export(self):
        
        ret = {}
        for name in self.__slots__:
            if hasattr(self, name):
                ret[name] = getattr(self, name)
                
        return ret


    def warn(self, message, line):
        logging.warn("%s at line %s in %s" % (message, line, self.id))


    def getDocComment(self, node, msg=None, required=True):
        comments = getattr(node, "comments", None)
        if comments:
            for comment in comments:
                if comment.variant == "doc":
                    if not comment.text and msg and required:
                        self.warn("Missing documentation text for %s" % msg, node.line)

                    return comment

        if msg and required:
            self.warn("Missing documentation for %s" % msg, node.line)

        return None



    def setMain(self, mainType, mainNode, exportName, requiredDoc=True):
        
        callComment = self.getDocComment(mainNode, "Main", required=requiredDoc)

        self.main = {
            "type" : mainType,
            "name" : exportName,
            "line" : mainNode.line,
            "doc" : callComment.html if callComment else None
        }
        
        if requiredDoc and (callComment is None or not callComment.text):
            self.errornous = True
            self.main["errornous"] = True


    def addProperty(self, name, valueNode, commentNode, collection):
        
        entry = collection[name] = {}
        comment = self.getDocComment(valueNode, "Property '%s'" % name)
        
        if comment is None or not comment.text:
            self.errornous = True
            entry["errornous"] = True
        
        # Copy over value
        ptype = getKeyValue(valueNode, "type")
        if ptype and ptype.type == "string":
            entry["type"] = ptype.value
            
        pfire = getKeyValue(valueNode, "fire")
        if pfire and pfire.type == "string":
            entry["fire"] = pfire.value

        # Produce nice output for init value
        pinit = getKeyValue(valueNode, "init")
        if pinit:
            entry["init"] = valueToString(pinit)
        
        # Handle nullable, default value is true when an init value is there. Otherwise false.
        pnullable = getKeyValue(valueNode, "nullable")
        if pnullable:
            entry["nullable"] = pnullable.type == "true"
        elif pinit is not None and pinit.type != "null":
            entry["nullable"] = False
        else:
            entry["nullable"] = True

        # Just store whether an apply routine was defined
        papply = getKeyValue(valueNode, "apply")
        if papply and papply.type == "function":
            entry["apply"] = True
        
        # Multi Properties
        pthemeable = getKeyValue(valueNode, "themeable")
        if pthemeable and pthemeable.type == "true":
            entry["themeable"] = True
        
        pinheritable = getKeyValue(valueNode, "inheritable")
        if pinheritable and pinheritable.type == "true":
            entry["inheritable"] = True
        
        pgroup = getKeyValue(valueNode, "group")
        if pgroup and len(pgroup) > 0:
            entry["group"] = [child.value for child in pgroup]
            
            pshorthand = getKeyValue(valueNode, "shorthand")
            if pshorthand and pshorthand.type == "true":
                entry["shorthand"] = True
        

    def addConstructor(self, valueNode, commentNode=None):
        entry = self.construct = {}
        
        if commentNode is None:
            commentNode = valueNode
            
        # Root doc comment is optional for constructors
        comment = getDocComment(commentNode)
        if comment and comment.html:
            entry["doc"] = comment.html
        
        funcParams = getParamNamesFromFunction(valueNode)
        if funcParams:
            entry["params"] = {}
            for paramPos, paramName in enumerate(funcParams):
                entry["params"][paramName] = {
                    "position" : paramPos
                }
            
            # Use comment for enrich existing data
            comment = self.getDocComment(commentNode, "Constructor")
            if comment:
                if not comment.params:
                    self.warn("Documentation for parameters of constructor are missing", valueNode.line)
                    self.errornous = True
                    entry["errornous"] = True
                    for paramName in funcParams:
                        entry["params"][paramName]["errornous"] = True
                else:
                    for paramName in funcParams:
                        if paramName in comment.params:
                            entry["params"][paramName].update(comment.params[paramName])
                        else:
                            self.errornous = True
                            entry["errornous"] = True
                            entry["params"][paramName]["errornous"] = True
                            self.warn("Missing documentation for parameter %s in constructor" % paramName, valueNode.line)
                            
            else:
                self.errornous = True
                entry["errornous"] = True


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
            if comment.type:
                entry["type"] = comment.type
            elif comment.returns:
                entry["type"] = comment.returns[0]

            if comment.html:
                entry["doc"] = comment.html
            else:
                self.errornous = True
                entry["errornous"] = True
                
        else:
            self.errornous = True
            entry["errornous"] = True
            


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
        
        if name.upper() == name:
            entry["constant"] = True
        
        
        # 
        # Complex structured types are processed in two steps
        #
        if entry["type"] == "Call" or entry["type"] == "Hook":
            
            commentNode = findCommentNode(commentNode)
            if commentNode:

                comment = self.getDocComment(commentNode, "Call/Hook '%s'" % name)
                if comment:

                    # Static type definition
                    if comment.type:
                        entry["type"] = comment.type
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
                
                callFunction = None
                
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
        # Add human readable value
        #
        valueNodeHumanValue = valueToString(valueNode)
        if valueNodeHumanValue != entry["type"] and not valueNodeHumanValue in ("Other", "Call"):
            entry["value"] = valueNodeHumanValue
        
        
        #
        # Read data from comment and add documentation
        #
        comment = self.getDocComment(commentNode, "member/static %s (%s)" % (name, entry["type"]), requiresDocumentation(name))
        if comment:
            
            if comment.type:
                entry["type"] = comment.type
                
            if comment.html:
                entry["doc"] = comment.html
            elif requiresDocumentation(name):
                self.errornous = True
                entry["errornous"] = True
                
            if comment.tags:
                entry["tags"] = comment.tags
                
                
                
        elif requiresDocumentation(name):
            
            self.errornous = True
            entry["errornous"] = True
        
        
        #
        # Add additional data for function types (params, returns)
        #
        if entry["type"] == "Function":
            
            # Add basic param data
            funcParams = getParamNamesFromFunction(valueNode)
            if funcParams:
                entry["params"] = {}
                for paramPos, paramName in enumerate(funcParams):
                    entry["params"][paramName] = {
                        "position" : paramPos
                    }
            
            # Detect return type automatically
            returnNode = findReturn(valueNode)
            if returnNode and len(returnNode) > 0:
                entry["returns"] = [nodeTypeToDocType[returnNode[0].type]]

            # Use comment for enrich existing data
            if comment:
                if comment.returns:
                    entry["returns"] = comment.returns

                if funcParams:
                    if not comment.params:
                        if requiresDocumentation(name):
                            self.warn("Missing documentation for parameters of function %s" % name, valueNode.line)
                            self.errornous = True
                            entry["errornous"] = True
                            for paramName in funcParams:
                                entry["params"][paramName]["errornous"] = True
                            
                    else:
                        for paramName in funcParams:
                            if paramName in comment.params:
                                entry["params"][paramName].update(comment.params[paramName])
                            elif requiresDocumentation(name):
                                self.errornous = True
                                entry["errornous"] = True
                                entry["params"][paramName]["errornous"] = True
                                self.warn("Missing documentation for parameter %s in function %s" % (paramName, name), valueNode.line)

