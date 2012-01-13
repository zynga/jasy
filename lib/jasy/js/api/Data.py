#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Sebastian Werner
#

from jasy.js.util import *
import logging

__all__ = ["ApiData", "ApiException"]





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
        # Processes special types:
        #
        # - Plus: Whether a string or number is created
        # - Object: Figures out the class instance which is created
        # - Call/Hooks: Might have real doc comment inside the structure. We can also deep 
        #     analyse them to figure out the real type via return statement checks or hook analysis
        #
        if entry["type"] == "Plus":
            entry["type"] = detectPlusType(valueNode)
        
        elif entry["type"] == "Object":
            entry["type"] = detectObjectType(valueNode)
                
        elif entry["type"] in ("Call", "Hook"):
            
            # TODO: Look for return values, left values in hooks first???
            
            commentNode = findCommentNode(commentNode)
            comment = self.getDocComment(commentNode, "Call %s" % name)
            
            if comment:

                # Static type definition
                if comment.stype:
                    entry["type"] = comment.stype
                    self.addEntry(name, valueNode, commentNode, collection)
                
                else:
                    
                    # Maybe type function: We need to ignore returns etc. which are often
                    # the parent of the comment.
                    valueNode = findFunction(commentNode)
                    if valueNode:
                        
                        # Switch to function type for re-analysis
                        entry["type"] = "Function"
                        self.addEntry(name, valueNode, commentNode, collection)
                        
            else:
                print("TODO: Auto deep type analysis")

            return
        

        
        
        #
        # Read data from comment and add documentation
        #
        comment = self.getDocComment(commentNode, "%s %s" % (entry["type"], name))
        if comment:
            
            if comment.stype:
                entry["type"] = comment.stype
                
            if comment.html:
                entry["doc"] = comment.html
            
            
        #
        # Add additional data for function types (params, returns)
        #
        if entry["type"] == "Function":
            funcParams = getParamNamesFromFunction(valueNode)
            if funcParams:
                entry["params"] = {paramName: None for paramName in funcParams}

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
        
        
        
        
        