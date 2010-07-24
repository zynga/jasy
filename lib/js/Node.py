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
                
                    if hasattr(token, "value"):
                        self.value = token.value
            
                if hasattr(token, "comments"):
                    self.comments = token.comments
                
                self.line = token.line
                self.start = token.start
                self.end = token.end
            
            else:
                self.type = type
                self.line = tokenizer.line

            self.tokenizer = tokenizer
            
        elif type:
            self.type = type

        for arg in args:
            self.append(arg)


    # Always use push to add operands to an expression, to update start and end.
    def append(self, kid, numbers=[]):
        if kid:
            if hasattr(self, "start") and kid.start < self.start:
                self.start = kid.start

            if hasattr(self, "end") and self.end < kid.end:
                self.end = kid.end
                
            kid.parent = self

        return list.append(self, kid)


    # Generator for listing the children
    def children(self):
        for child in self:
            yield child
        
        for key in dir(self):
            if not (key == "parent" or key == "target" or key[0] == "_"):
                value = getattr(self, key)
                if isinstance(value, Node):
                    yield value


    # Returns a data structure containing all relevant information about the node
    def export(self):
        children = []
        for child in self:
            children.append(child)

        attrs = {}
        blockAttr = ["tokenizer", "target", "start", "end", "parent"]
        for attr in dir(self):
            if attr in blockAttr or attr[0] == "_" or attr[-1] == "_":
                continue
            child = getattr(self, attr)

            # is a node or a list with nodes
            if isinstance(child, Node) or (type(child) == list and len(child) > 0 and isinstance(child[0], Node)):
                if len(self) > 0:
                    raise "Unexpected additional child %s in %s" % (attr, self.type)

                helper = Node(None, attr)

                if type(child) == list:
                    for listChild in child:
                        helper.append(listChild)
                else:
                    helper.append(child)

                children.append(helper)

            # primitive types or a list with primitive types
            elif type(child) in (bool, int, float, str, unicode, list):
                attrs[attr] = child

        return attrs, children        


    # Converts node to XML
    def toXml(self, format=True, indent=0, tab="  "):
        def attrs2Xml(attrs):
            result = []
            for name in attrs:
                if name != "type":
                    value = attrs[name]
                    if type(value) == bool:
                        value = "true" if value else "false" 
                    elif type(value) in (int, float):
                        value = str(value)
                    elif type(value) == list:
                        value = ",".join(value)
                    result.append('%s=%s' % (name, json.dumps(value)))
            return (" " + " ".join(result)) if len(result) > 0 else ""

        lead = tab * indent if format else ""
        lineBreak = "\n" if format else ""

        attrs, children = self.export()
        typeattr = attrs["type"]

        if len(children) == 0:
            result = "%s<%s%s/>%s" % (lead, typeattr, attrs2Xml(attrs), lineBreak)
        else:
            result = "%s<%s%s>%s" % (lead, typeattr, attrs2Xml(attrs), lineBreak)

            for child in children:
                result += child.toXml(format, indent+1)

            result += "%s</%s>%s" % (lead, typeattr, lineBreak)

        return result
        
        
    # Converts node to JSON
    def toJson(self, format=True, indent=0, tab="  "):
        lead = tab * indent if format else ""
        innerLead = tab * (indent+1) if format else ""
        lineBreak = "\n" if format else ""
        
        attrs, children = self.export()
        blocks = []

        for name in attrs:
            value = json.dumps(attrs[name], separators=(',',':'))
            blocks.append("%s%s:%s" % (innerLead, name, value))

        if len(children) > 0:
            content = "%schildren:%s" % (innerLead, lineBreak)
            content += "%s[%s" % (innerLead, lineBreak)
            for child in children:
                content += child.toJson(format, indent+2)
            content += "%s]" % innerLead
            blocks.append(content)

        if len(blocks) > 0:
            blocks = (",%s" % lineBreak).join(blocks) + lineBreak

        return "%s{%s%s%s}%s" % (lead, lineBreak, blocks, lead, lineBreak)
        
        
    # Returns the source code of the node
    def getSource(self):
        if not self.tokenizer:
            raise "Could not find source for node '%s'" % node.type
            
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
