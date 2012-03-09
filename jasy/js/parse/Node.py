#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

#
# License: MPL 1.1/GPL 2.0/LGPL 2.1
# Authors: 
#   - Brendan Eich <brendan@mozilla.org> (Original JavaScript) (2004)
#   - Sebastian Werner <info@sebastian-werner.net> (Refactoring Python) (2010)
#

import json
import copy

class Node(list):
    def __init__(self, tokenizer=None, type=None, args=[]):
        list.__init__(self)
        
        self.start = 0
        self.end = 0
        self.line = None
        self.filename = None
        
        if tokenizer:
            token = getattr(tokenizer, "token", None)
            if token:
                # We may define a custom type but use the same positioning as another token
                # e.g. transform curlys in block nodes, etc.
                self.type = type if type else getattr(token, "type", None)
                self.line = token.line
                
                # Start & end are file positions for error handling.
                self.start = token.start
                self.end = token.end
            
            else:
                self.type = type
                self.line = tokenizer.line
                self.start = None
                self.end = None

            self.tokenizer = tokenizer
            
        elif type:
            self.type = type

        for arg in args:
            self.append(arg)
            
            
    def getUnrelatedChildren(self):
        """Collects all unrelated children"""
        collection = []
        for child in self:
            if not hasattr(child, "rel"):
                collection.append(child)
            
        return collection
        

    def getChildrenLength(self, filter=True):
        """Number of (per default unrelated) children"""
        count = 0
        for child in self:
            if not filter or not hasattr(child, "rel"):
                count += 1
        return count
            
    
    def remove(self, kid):
        if not kid in self:
            raise Exception("Given node is no child!")
        
        if hasattr(kid, "rel"):
            delattr(self, kid.rel)
            del kid.rel
            del kid.parent
            
        list.remove(self, kid)
        
        
    def insert(self, index, kid):
        if index is None:
            return self.append(kid)
            
        if hasattr(kid, "parent"):
            kid.parent.remove(kid)
            
        kid.parent = self

        return list.insert(self, index, kid)
            

    # Always use push to add operands to an expression, to update start and end.
    def append(self, kid, rel=None):
        # kid can be null e.g. [1, , 2].
        if kid:
            if hasattr(kid, "parent"):
                kid.parent.remove(kid)
            
            # Debug
            if not isinstance(kid, Node):
                raise Exception("Invalid kid: %s" % kid)
            
            if hasattr(kid, "tokenizer"):
                if hasattr(kid, "start"):
                    if not hasattr(self, "start") or self.start == None or kid.start < self.start:
                        self.start = kid.start

                if hasattr(kid, "end"):
                    if not hasattr(self, "end") or self.end == None or self.end < kid.end:
                        self.end = kid.end
                
            kid.parent = self
            
            # alias for function
            if rel != None:
                setattr(self, rel, kid)
                setattr(kid, "rel", rel)

        # Block None kids when they should be related
        if not kid and rel:
            return
            
        return list.append(self, kid)

    
    # Replaces the given kid with the given replacement kid
    def replace(self, kid, repl):
        if repl in self:
            self.remove(repl)
        
        self[self.index(kid)] = repl
        
        if hasattr(kid, "rel"):
            repl.rel = kid.rel
            setattr(self, kid.rel, repl)
            
            # cleanup old kid
            delattr(kid, "rel")
            
            
        elif hasattr(repl, "rel"):
            # delete old relation on new child
            delattr(repl, "rel")

        delattr(kid, "parent")
        repl.parent = self
        
        return kid
        

    # Converts the node to XML
    def toXml(self, format=True, indent=0, tab="  "):
        lead = tab * indent if format else ""
        innerLead = tab * (indent+1) if format else ""
        lineBreak = "\n" if format else ""

        relatedChildren = []
        attrsCollection = []
        for name in dir(self):
            # "type" is used as node name - no need to repeat it as an attribute
            # "parent" and "target" are relations to other nodes which are not children - for serialization we ignore them at the moment
            # "rel" is used internally to keep the relation to the parent - used by nodes which need to keep track of specific children
            # "start" and "end" are for debugging only
            if name not in ("type", "parent", "comments", "target", "rel", "start", "end") and name[0] != "_":
                value = getattr(self, name)
                if isinstance(value, Node):
                    if hasattr(value, "rel"):
                        relatedChildren.append(value)

                elif type(value) in (bool, int, float, str, list, set, dict):
                    if type(value) == bool:
                        value = "true" if value else "false" 
                    elif type(value) in (int, float):
                        value = str(value)
                    elif type(value) in (list, set, dict):
                        if type(value) == dict:
                            value = value.keys()
                        if len(value) == 0:
                            continue
                        try:
                            value = ",".join(value)
                        except TypeError:
                            raise Exception("Invalid attribute list child at: %s" % name)
                            
                    attrsCollection.append('%s=%s' % (name, json.dumps(value)))

        attrs = (" " + " ".join(attrsCollection)) if len(attrsCollection) > 0 else ""
        
        comments = getattr(self, "comments", None)
        scope = getattr(self, "scope", None)
        
        if len(self) == 0 and len(relatedChildren) == 0 and (not comments or len(comments) == 0) and not scope:
            result = "%s<%s%s/>%s" % (lead, self.type, attrs, lineBreak)

        else:
            result = "%s<%s%s>%s" % (lead, self.type, attrs, lineBreak)
            
            if comments:
                for comment in comments:
                    result += '%s<comment context="%s" variant="%s">%s</comment>%s' % (innerLead, comment.context, comment.variant, comment.text, lineBreak)
                    
            if scope:
                for statKey in scope:
                    statValue = scope[statKey]
                    if statValue != None and len(statValue) > 0:
                        if type(statValue) is set:
                            statValue = ",".join(statValue)
                        elif type(statValue) is dict:
                            statValue = ",".join(statValue.keys())
                        
                        result += '%s<stat name="%s">%s</stat>%s' % (innerLead, statKey, statValue, lineBreak)

            for child in self:
                if not child:
                    result += "%s<none/>%s" % (innerLead, lineBreak)
                elif not hasattr(child, "rel"):
                    result += child.toXml(format, indent+1)
                elif not child in relatedChildren:
                    raise Exception("Oops, irritated by non related: %s in %s - child says it is related as %s" % (child.type, self.type, child.rel))

            for child in relatedChildren:
                result += "%s<%s>%s" % (innerLead, child.rel, lineBreak)
                result += child.toXml(format, indent+2)
                result += "%s</%s>%s" % (innerLead, child.rel, lineBreak)

            result += "%s</%s>%s" % (lead, self.type, lineBreak)

        return result
        
        
    # Creates a python data structure containing all recursive data of the node
    def export(self):
        attrs = {}
        for name in dir(self):
            if name not in ("parent", "target", "rel", "start", "end") and name[0] != "_":
                value = getattr(self, name)
                if isinstance(value, Node) and hasattr(value, "rel"):
                    attrs[name] = value.export()
                elif type(value) in (bool, int, float, str, list):
                    attrs[name] = value
        
        for child in self:
            if not hasattr(child, "rel"):
                if not "children" in attrs:
                    attrs["children"] = []
                attrs["children"].append(child.export())
        
        return attrs    
        
        
    def __deepcopy__(self, memo):
        # Create copy
        if hasattr(self, "tokenizer"):
            result = Node(self.tokenizer)
        else:
            result = Node(None, self.type)
        
        # Copy children
        for child in self:
            rel = getattr(child, "rel", None)
            result.append(copy.deepcopy(child, memo), rel)
        
        # Sync attributes
        for name in dir(self):
            if not name in ("parent", "target") and name[0] != "_":
                value = getattr(self, name)
                if name == "scope" or type(value) in (bool, int, float, str):
                    setattr(result, name, value)
                elif name == "scope" or type(value) in (list, set):
                    setattr(result, name, copy.deepcopy(value, memo))
            
        # Note: "target" attribute is ignored because if recursion error
        #       This is used by "break" and "continue" statements only and refers
        #       to the parent block where the jump should go to. This is not typically
        #       good style in JS and is not used quite often.
        # Sync target
        # if hasattr(self, "target"):
        #   result.target = copy.deepcopy(self.target, memo)
        
        # Note: "parent" attribute is handled by append() already

        return result
        
        
    # Converts the node to JSON
    def toJson(self, format=True, indent=2, tab="  "):
        return json.dumps(self.export(), indent=indent)
        
        
    # Returns the source code of the node
    def getSource(self):
        if not self.tokenizer:
            raise Exception("Could not find source for node '%s'" % node.type)
            
        if getattr(self, "start", None) is not None:
            if getattr(self, "end", None) is not None:
                return self.tokenizer.source[self.start:self.end]
            return self.tokenizer.source[self.start:]
    
        if getattr(self, "end", None) is not None:
            return self.tokenizer.source[:self.end]
    
        return self.tokenizer.source[:]
        
    
    # Returns the file name
    def getFileName(self):
        return self.filename


    # Map Python built-ins
    __repr__ = toXml
    __str__ = toXml
    
    def __eq__(self, other):
        return self is other

    def __bool__(self): 
        return True
