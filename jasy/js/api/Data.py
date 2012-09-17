#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import jasy.js.api.Text as Text

from jasy.js.util import *
import jasy.core.Console as Console
from jasy import UserError


__all__ = ["ApiData"]


class ApiData():
    """
    Container for all relevant API data. 
    Automatically generated, filled and cached by jasy.item.Class.getApiDocs().
    """


    __slots__ = [
        "main", "construct", "statics", "properties", "events", "members", 
        
        "id", 
        "package", "basename", 
        "errors", "size", "assets", "permutations", 
        "content", "isEmpty",
        
        "uses", "usedBy", 
        "includes", "includedBy", 
        "implements", "implementedBy",
        
        "highlight"
    ]
    
    
    def __init__(self, id, highlight=True):
        
        self.id = id
        self.highlight = highlight
        
        splits = id.split(".")
        self.basename = splits.pop()
        self.package = ".".join(splits)
        self.isEmpty = False
        
        self.uses = set()
        self.main = {
            "type" : "Unsupported",
            "name" : id,
            "line" : 1
        }
        
        
    def addSize(self, size):
        """ 
        Adds the statistics on different size aspects 
        """
        
        self.size = size
        
    def addAssets(self, assets):
        """ 
        Adds the info about used assets
        """
        
        self.assets = assets
        
    def addUses(self, uses):
        self.uses.add(uses)

    def removeUses(self, uses):
        self.uses.remove(uses)
        
    def addFields(self, permutations):
        self.permutations = permutations


    def scanTree(self, tree):
        self.uses.update(tree.scope.shared)

        for package in tree.scope.packages:
            splits = package.split(".")
            current = splits[0]
            for split in splits[1:]:
                current = "%s.%s" % (current, split)
                self.uses.add(current)
        
        try:
            if not self.__processTree(tree):
                self.main["errornous"] = True
                
        except UserError as UserError:
            raise UserError
                
        except Exception as error:
            self.main["errors"] = ({
                "line": 1,
                "message": "%s" % error
            })
            self.main["errornous"] = True
            self.warn("Error during processing file: %s" % error, 1)
    
    
    def __processTree(self, tree):
            
        success = False
        
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
                    success = True
                    self.statics = {}
                    for staticsEntry in staticsMap:
                        self.addEntry(staticsEntry[0].value, staticsEntry[1], staticsEntry, self.statics)
                        
                else:
                    self.warn("Invalid core.Module()", callNode.line)


            #
            # core.Interface
            #
            elif callName == "core.Interface":
                self.setMain(callName, callNode.parent, self.id)
        
                configMap = getParameterFromCall(callNode, 1)
                if configMap:
                    success = True
                    
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
                            self.warn('Invalid core.Interface section "%s"' % sectionName, propertyInit.line) 

                else:
                    self.warn("Invalid core.Interface()", callNode.line)


            #
            # core.Class
            #
            elif callName == "core.Class":
                self.setMain(callName, callNode.parent, self.id)
            
                configMap = getParameterFromCall(callNode, 1)
                if configMap:
                    success = True
                    
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
                            self.warn('Invalid core.Class section "%s"' % sectionName, propertyInit.line)
                            
                else:
                    self.warn("Invalid core.Class()", callNode.line)


            #
            # core.Main.declareNamespace
            #
            elif callName == "core.Main.declareNamespace":
                target = getParameterFromCall(callNode, 0)
                assigned = getParameterFromCall(callNode, 1)
                
                if target:
                    success = True
                    
                    if assigned and assigned.type == "function":
                        # Use callNode call for constructor, find first doc comment for main documentation
                        self.setMain("core.Main", findCommentNode(tree), target.value)
                        self.addConstructor(assigned, callNode.parent)

                    else:
                        self.setMain("core.Main", callNode.parent, target.value)

                        if assigned and assigned.type == "object_init":
                            self.statics = {}
                            for staticsEntry in assigned:
                                self.addEntry(staticsEntry[0].value, staticsEntry[1], staticsEntry, self.statics)
        
        #
        # Handle plain JS namespace -> object assignments
        #
        else:

            def assignMatcher(node):

                if node.type == "assign" and node[0].type == "dot":
                    if node[1].type == "object_init":
                        doc = getDocComment(node.parent)
                        if not doc is None:
                            return True
                    elif node[1].type == "function":
                        doc = getDocComment(node.parent)
                        if not doc is None:
                            return True
                    
                return False

            result = query(tree, assignMatcher)

            if not result is None:
                name = assembleDot(result[0])
                self.setMain("Native", result.parent, name)
                success = True


                if result[1].type == "object_init":

                    # Ingore empty objects and do not produce namespaces for them
                    #
                    # e.g. some.namespace.foo = {};
                    if len(result[1]) == 0:
                        success = False
                        self.isEmpty = True

                    self.statics = {}
                    for prop in result[1]:
                        self.addEntry(prop[0].value, prop[1], prop, self.statics)
                
                elif result[1].type == "function":
                    self.addConstructor(result[1], result.parent)
                    
                    def memberMatcher(node):
                        if node is not result and node.type == "assign" and node[0].type == "dot":
                            assignName = assembleDot(node[0])
                            if assignName is not None and assignName != name and assignName.startswith(name) and len(assignName) > len(name):
                                localName = assignName[len(name):]
                                if localName.startswith("."):
                                    localName = localName[1:]

                                    # Support for MyClass.prototype.memberFoo = function() {}
                                    if "." in localName:
                                        splittedLocalName = localName.split(".")
                                        if len(splittedLocalName) == 2 and splittedLocalName[0] == "prototype":
                                            if not hasattr(self, "members"):
                                                self.members = {}
                                                
                                            self.addEntry(splittedLocalName[1], node[1], node.parent, self.members)                             
                                        
                                    # Support for MyClass.staticFoo = function() {}
                                    elif localName != "prototype":
                                        if not hasattr(self, "statics"):
                                            self.statics = {}                                        
                                    
                                        self.addEntry(localName, node[1], node.parent, self.statics)
                                    
                                    else:
                                        if not hasattr(self, "members"):
                                            self.members = {}
                                        
                                        # Support for MyClass.prototype = {};
                                        if node[1].type == "object_init":
                                            membersMap = node[1]
                                            for membersEntry in membersMap:
                                                self.addEntry(membersEntry[0].value, membersEntry[1], membersEntry, self.members)                                            
                                        
                                        # Support for MyClass.prototype = new BaseClass;
                                        elif node[1].type == "new" or node[1].type == "new_with_args":
                                            self.includes = [valueToString(node[1][0])]
                    
                    queryAll(tree, memberMatcher)
        
        
        
        #
        # core.Main.addStatics
        #
        addStatics = findCall(tree, "core.Main.addStatics")
        if addStatics:
            target = getParameterFromCall(addStatics, 0)
            staticsMap = getParameterFromCall(addStatics, 1)
            
            if target and staticsMap and target.type == "string" and staticsMap.type == "object_init":
            
                if self.main["type"] == "Unsupported":
                    self.setMain("core.Main", addStatics.parent, target.value)
            
                success = True
                if not hasattr(self, "statics"):
                    self.statics = {}
                    
                for staticsEntry in staticsMap:
                    self.addEntry(staticsEntry[0].value, staticsEntry[1], staticsEntry, self.statics)
                        
            else:
                self.warn("Invalid core.Main.addStatics()")
        
        
        #
        # core.Main.addMembers
        #
        addMembers = findCall(tree, "core.Main.addMembers")
        if addMembers:
            target = getParameterFromCall(addMembers, 0)
            membersMap = getParameterFromCall(addMembers, 1)

            if target and membersMap and target.type == "string" and membersMap.type == "object_init":
                
                if self.main["type"] == "Unsupported":
                    self.setMain("core.Main", addMembers.parent, target.value)

                success = True
                if not hasattr(self, "members"):
                    self.members = {}

                for membersEntry in membersMap:
                    self.addEntry(membersEntry[0].value, membersEntry[1], membersEntry, self.members)                    
                        
            else:
                self.warn("Invalid core.Main.addMembers()")


        return success
        


    def export(self):
        
        ret = {}
        for name in self.__slots__:
            if hasattr(self, name):
                ret[name] = getattr(self, name)
                
        return ret


    def warn(self, message, line):
        Console.warn("%s at line %s in %s" % (message, line, self.id))


    def setMain(self, mainType, mainNode, exportName):
        
        callComment = getDocComment(mainNode)

        entry = self.main = {
            "type" : mainType,
            "name" : exportName,
            "line" : mainNode.line
        }
        
        if callComment:
            
            if callComment.text:
                html = callComment.getHtml(self.highlight)
                entry["doc"] = html
                entry["summary"] = Text.extractSummary(html)
        
            if hasattr(callComment, "tags"):
                entry["tags"] = callComment.tags
        
        if callComment is None or not callComment.text:
            entry["errornous"] = True
            self.warn('Missing comment on "%s" namespace' % exportName, mainNode.line)


    def addProperty(self, name, valueNode, commentNode, collection):
        
        entry = collection[name] = {
            "line": (commentNode or valueNode).line
        }
        comment = getDocComment(commentNode)
        
        if comment is None or not comment.text:
            entry["errornous"] = True
            self.warn('Missing or empty comment on property "%s"' % name, valueNode.line)

        else:
            html = comment.getHtml(self.highlight)
            entry["doc"] = html
            entry["summary"] = Text.extractSummary(html)
            
        if comment and comment.tags:
            entry["tags"] = comment.tags
        
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
        entry = self.construct = {
            "line" : (commentNode or valueNode).line
        }
        
        if commentNode is None:
            commentNode = valueNode
            
        # Root doc comment is optional for constructors
        comment = getDocComment(commentNode)
        if comment and comment.hasContent():
            html = comment.getHtml(self.highlight)
            entry["doc"] = html
            entry["summary"] = Text.extractSummary(html)

        if comment and comment.tags:
            entry["tags"] = comment.tags
        
        entry["init"] = self.main["name"]
        
        funcParams = getParamNamesFromFunction(valueNode)
        if funcParams:
            entry["params"] = {}
            for paramPos, paramName in enumerate(funcParams):
                entry["params"][paramName] = {
                    "position" : paramPos
                }
            
            # Use comment for enrich existing data
            comment = getDocComment(commentNode)
            if comment:
                if not comment.params:
                    self.warn("Documentation for parameters of constructor are missing", valueNode.line)
                    for paramName in funcParams:
                        entry["params"][paramName]["errornous"] = True

                else:
                    for paramName in funcParams:
                        if paramName in comment.params:
                            entry["params"][paramName].update(comment.params[paramName])
                        else:
                            entry["params"][paramName]["errornous"] = True
                            self.warn("Missing documentation for parameter %s in constructor" % paramName, valueNode.line)
                            
            else:
                entry["errornous"] = True


    def addEvent(self, name, valueNode, commentNode, collection):
        entry = collection[name] = {
            "line" : (commentNode or valueNode).line
        }
        
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
        
        comment = getDocComment(commentNode)
        if comment:
            
            if comment.tags:
                entry["tags"] = comment.tags
            
            # Prefer type but fall back to returns (if the developer has made an error here)
            if comment.type:
                entry["type"] = comment.type
            elif comment.returns:
                entry["type"] = comment.returns[0]

            if comment.hasContent():
                html = comment.getHtml(self.highlight)
                entry["doc"] = html
                entry["summary"] = Text.extractSummary(html)
            else:
                self.warn("Comment contains invalid HTML", commentNode.line)
                entry["errornous"] = True
                
        else:
            self.warn("Invalid doc comment", commentNode.line)
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

                comment = getDocComment(commentNode)
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
            
            assignTypeNode, assignCommentNode = resolveIdentifierNode(valueNode)
            if assignTypeNode is not None:
                entry["type"] = nodeTypeToDocType[assignTypeNode.type]
                
                # Prefer comment from assignment, not from value if available
                self.addEntry(name, assignTypeNode, assignCommentNode, collection)
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
        comment = getDocComment(commentNode)
        if comment:
            
            if comment.tags:
                entry["tags"] = comment.tags
            
            if comment.type:
                entry["type"] = comment.type
                
            if comment.hasContent():
                html = comment.getHtml(self.highlight)
                entry["doc"] = html
                entry["summary"] = Text.extractSummary(html)
            else:
                entry["errornous"] = True
                
            if comment.tags:
                entry["tags"] = comment.tags
                
        else:
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
                autoReturnType = nodeTypeToDocType[returnNode[0].type]
                if autoReturnType == "Plus":
                    autoReturnType = detectPlusType(returnNode[0])
                elif autoReturnType in ("Call", "Object"):
                    autoReturnType = "var"
            
                autoReturnEntry = { 
                    "name" : autoReturnType,
                    "auto" : True
                }
                
                if autoReturnType in builtinTypes:
                    autoReturnEntry["builtin"] = True
                    
                if autoReturnType in pseudoTypes:
                    autoReturnEntry["pseudo"] = True

                entry["returns"] = [autoReturnEntry]

            # Use comment for enrich existing data
            if comment:
                if comment.returns:
                    entry["returns"] = comment.returns

                if funcParams:
                    if not comment.params:
                        for paramName in funcParams:
                            entry["params"][paramName]["errornous"] = True
                            
                    else:
                        for paramName in funcParams:
                            if paramName in comment.params:
                                entry["params"][paramName].update(comment.params[paramName])
                            else:
                                entry["params"][paramName]["errornous"] = True

