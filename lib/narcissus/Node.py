import re
from narcissus.Tokenizer import *
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
        
        if len(self) > 0:
            result["children"] = children = []
            for child in self:
                children.append(child.export())        
        
        for attr in dir(self):
            if attr.startswith("_") or attr.endswith("_"):
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


    def toJson(self, compact=False):
        if compact:
            return json.dumps(self.export(), sort_keys=True, separators=(',',':'))
        else:
            return json.dumps(self.export(), sort_keys=True, indent=2)


    def getSource(self):
        if getattr(self, "start", None) is not None:
            if getattr(self, "end", None) is not None:
                return self.tokenizer.source[self.start:self.end]
            return self.tokenizer.source[self.start:]
        
        if getattr(self, "end", None) is not None:
            return self.tokenizer.source[:self.end]
        
        return self.tokenizer.source[:]
        

    def getFileName(self):
        return self.tokenizer.filename


    __repr__ = toJson
    __str__ = toJson

    def __nonzero__(self): 
        return True
    
    
def tokenstr(tt):
    t = tokens[tt]
    if re.match(r'^\W', t):
        return opTypeNames[t]
    return t