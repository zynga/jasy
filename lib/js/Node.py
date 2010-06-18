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

import simplejson as json

class Node(list):

    def __init__(self, tokenizer, type=None, args=[]):
        list.__init__(self)

        token = tokenizer.token
        if token:
            if type:
                self.type = type
            else:
                self.type = getattr(token, "type", None)
                
            if hasattr(token, "comments"):
                self.comments = token.comments
                
            self.line = token.line
            self.start = token.start
            self.end = token.end

            if hasattr(token, "value"):
                self.value = token.value
            
            if hasattr(token, "variant"):
                self.variant = token.variant            

        else:
            self.type = type
            self.line = tokenizer.line

        self.tokenizer = tokenizer

        for arg in args:
            self.append(arg)


    # Always use push to add operands to an expression, to update start and end.
    def append(self, kid, numbers=[]):
        if kid:
            if hasattr(self, "start") and kid.start < self.start:
                self.start = kid.start

            if hasattr(self, "end") and self.end < kid.end:
                self.end = kid.end

        return list.append(self, kid)


    # Converts node to an object structure containing all public information
    def export(self):
        result = {}
        blockAttr = ["tokenizer", "target", "start", "end"]
        
        if len(self) > 0:
            result["children"] = children = []
            for child in self:
                children.append(child.export())        
        
        for attr in dir(self):
            if attr in blockAttr or attr.startswith("_") or attr.endswith("_"):
                continue
                
            else:
                value = getattr(self, attr)
                
                if isinstance(value, (basestring, int, bool)):
                    pass
                elif isinstance(value, Node):
                    value = value.export()
                elif attr == "value" and self.type == REGEXP:
                    value = "/%s/%s" % (value["regexp"], value["modifiers"])
                elif type(value) == list:
                    temp = []
                    for entry in value:
                        if isinstance(entry, Node):
                            temp.append(entry.export())
                        else:
                            temp.append(entry)
                    
                    value = temp
                    
                else:
                    continue
                
                result[attr] = value
                
        return result


    # Returns the JSON representation of the node object
    def toJson(self, compact=False):
        if compact:
            return json.dumps(self.export(), sort_keys=True, ensure_ascii=False, separators=(',',':'))
        else:
            return json.dumps(self.export(), sort_keys=True, ensure_ascii=False, indent=2)


    # Returns the source code of the node
    def getSource(self):
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
    __repr__ = toJson
    __str__ = toJson

    def __nonzero__(self): 
        return True
