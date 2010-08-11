#
# JavaScript Tools - Parser Module
# License: MPL 1.1/GPL 2.0/LGPL 2.1
# Authors: 
#   - Brendan Eich <brendan@mozilla.org> (Original JavaScript) (2004)
#   - JT Olds <jtolds@xnet5.com> (Python Translation) (2009)
#   - Sebastian Werner <info@sebastian-werner.net> (Refactoring Python) (2010)
#

import json


class Node(list):
    def __init__(self, tokenizer=None, type=None, args=[]):
        list.__init__(self)

        if tokenizer:
            token = tokenizer.token
            if token:
                # We may define a custom type but use the same positioning as another token
                # e.g. transform curlys in block nodes, etc.
                if type:
                    self.type = type
                
                else:
                    self.type = getattr(token, "type", None)
                
                if hasattr(token, "comments"):
                    self.comments = token.comments
                
                self.line = token.line
                
                # Start & end are file positions for error handling.
                self.start = token.start
                self.end = token.end
            
            else:
                self.start = None
                self.end = None
                self.type = type
                self.line = tokenizer.line

            # nodes use a tokenizer for debugging (getSource, filename getter)
            self.tokenizer = tokenizer
            
        elif type:
            self.type = type

        # print "CREATE: %s" % self.type

        for arg in args:
            self.append(arg)


    # Always use push to add operands to an expression, to update start and end.
    def append(self, kid, rel=None):
        # kid can be null e.g. [1, , 2].
        if kid:
            # Debug
            if not isinstance(kid, Node):
                raise Exception("Invalid kid: %s" % kid)
            
            if kid.start < self.start:
                self.start = kid.start

            if self.end < kid.end:
                self.end = kid.end
                
            kid.parent = self
            
            # alias for function
            if rel != None:
                setattr(self, rel, kid)
                setattr(kid, "rel", rel)

        return list.append(self, kid)

    
    # Replaces the given kid with the given replacement kid
    def replace(self, kid, repl):
        self[self.index(kid)] = repl
        
        if hasattr(kid, "rel"):
            repl.rel = kid.rel
            setattr(self, kid.rel, repl)
        
        return kid
        

    # Converts the node to XML
    def toXml(self, format=True, indent=0, tab="  "):
        lead = tab * indent if format else ""
        innerLead = tab * (indent+1) if format else ""
        lineBreak = "\n" if format else ""

        relatedChildren = []
        attrsCollection = []
        for name in dir(self):
            if name not in ("type", "parent", "rel", "start", "end") and name[0] != "_":
                value = getattr(self, name)
                if isinstance(value, Node):
                    if hasattr(value, "rel"):
                        relatedChildren.append(value)

                elif type(value) in (bool, int, long, float, basestring, str, unicode, list):
                    if type(value) == bool:
                        value = "true" if value else "false" 
                    elif type(value) in (int, long, float):
                        value = str(value)
                    elif type(value) == list:
                        try:
                            value = ",".join(value)
                        except TypeError:
                            raise Exception("Invalid non related child at: %s" % name)
                                
                    attrsCollection.append('%s=%s' % (name, json.dumps(value)))

        attrs = (" " + " ".join(attrsCollection)) if len(attrsCollection) > 0 else ""

        if len(self) == 0 and len(relatedChildren) == 0:
            result = "%s<%s%s/>%s" % (lead, self.type, attrs, lineBreak)

        else:
            result = "%s<%s%s>%s" % (lead, self.type, attrs, lineBreak)

            for child in self:
                if not hasattr(child, "rel"):
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
            if name not in ("parent", "rel", "start", "end") and name[0] != "_":
                value = getattr(self, name)
                if isinstance(value, Node) and hasattr(value, "rel"):
                    attrs[name] = value.export()
                elif type(value) in (bool, int, long, float, basestring, str, unicode, list):
                    attrs[name] = value
        
        for child in self:
            if not hasattr(child, "rel"):
                if not "children" in attrs:
                    attrs["children"] = []
                attrs["children"].append(child.export())
        
        return attrs    
        
        
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
        return self.tokenizer.filename


    # Map Python built-ins
    __repr__ = toXml
    __str__ = toXml

    def __nonzero__(self): 
        return True
