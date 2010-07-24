#
# JavaScript Tools - Node Module
# Copyright 2010 Sebastian Werner
#

# ***** BEGIN LICENSE BLOCK *****
# Version: MPL 1.1/GPL 2.0/LGPL 2.1
#
# The contents of this file are subject to the Mozilla Public License Version
# 1.1 (the "License"); you may not use this file except in compliance with
# the License. You may obtain a copy of the License at
# http://www.mozilla.org/MPL/
#
# Software distributed under the License is distributed on an "AS IS" basis,
# WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
# for the specific language governing rights and limitations under the
# License.
#
# The Original Code is the Narcissus JavaScript engine, written in Javascript.
#
# The Initial Developer of the Original Code is
# Brendan Eich <brendan@mozilla.org>.
# Portions created by the Initial Developer are Copyright (C) 2004
# the Initial Developer. All Rights Reserved.
#
# The Python version of the code was created by JT Olds <jtolds@xnet5.com>,
# and is a direct translation from the Javascript version.
#
# This version was refactored by the original Python port by Sebastian 
# Werner <info@sebastian-werner.net> for a cleaner Python-like implementation
# with less globals and better structure.
#
# Alternatively, the contents of this file may be used under the terms of
# either the GNU General Public License Version 2 or later (the "GPL"), or
# the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
# in which case the provisions of the GPL or the LGPL are applicable instead
# of those above. If you wish to allow use of your version of this file only
# under the terms of either the GPL or the LGPL, and not to allow others to
# use your version of this file under the terms of the MPL, indicate your
# decision by deleting the provisions above and replace them with the notice
# and other provisions required by the GPL or the LGPL. If you do not delete
# the provisions above, a recipient may use your version of this file under
# the terms of any one of the MPL, the GPL or the LGPL.
#
# ***** END LICENSE BLOCK ***** */

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
