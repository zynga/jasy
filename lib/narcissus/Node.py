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

"""
 PyNarcissus

 A lexical scanner and parser. JS implemented in JS, ported to Python.
"""

import re
from narcissus.Lang import *
import simplejson as json

class Node(list):

    def __init__(self, t, type_=None, args=[]):
        list.__init__(self)

        token = t.token
        if token:
            if type_:
                self.type_ = type_
            else:
                self.type_ = getattr(token, "type_", None)
                
            self.comments = token.comments
            self.value = token.value
            self.lineno = token.lineno
            self.start = token.start
            self.end = token.end

        else:
            self.type_ = type_
            self.lineno = t.lineno

        self.tokenizer = t

        for arg in args:
            self.append(arg)


    type = property(lambda self: tokenstr(self.type_))
    filename = property(lambda self: self.tokenizer.filename)


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
        blockAttr = ["tokenizer", "target", "filename", "start", "end"]
        
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
                elif attr == "value" and self.type_ == REGEXP:
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
            return json.dumps(self.export(), sort_keys=True, separators=(',',':'))
        else:
            return json.dumps(self.export(), sort_keys=True, indent=2)


    # Returns the source code of the node
    def getSource(self):
        if getattr(self, "start", None) is not None:
            if getattr(self, "end", None) is not None:
                return self.tokenizer.source[self.start:self.end]
            return self.tokenizer.source[self.start:]
        
        if getattr(self, "end", None) is not None:
            return self.tokenizer.source[:self.end]
        
        return self.tokenizer.source[:]


    __repr__ = toJson
    __str__ = toJson

    def __nonzero__(self): 
        return True
    
    
def tokenstr(tt):
    t = tokens[tt]
    if re.match(r'^\W', t):
        return opTypeNames[t]
    return t.upper()