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

    indentLevel = 0



    def exportList(self, input):
        return "--list--"



    def export(self):
        filterAttr = [ "filename", "indentLevel"]
        
        result = {}
        
        if len(self) > 0:
            result["children"] = children = []
            for child in self:
                children.append(child.export())        
        
        for attr in dir(self):
            if attr in filterAttr or attr.startswith("_") or attr.endswith("_"):
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
        

    __repr__ = toJson
    __str__ = toJson
    
    
    
    
    
    


    def __stxxxxr__(self):
        return ""





        
        a = list((str(i), v) for i, v in enumerate(self))
        s = "%s<%s" % (Node.indentLevel * "", tokenstr(self.type_).lower())
        
        if len(self): 
            s += ' length="%s"' % len(self)
            
        childLike = ("initializer", "funDecls", "varDecls")
        
        for attr in dir(self):
            if attr.startswith("_"):
                continue
            elif attr in ("tokenizer", "append", "count", "extend", "getSource", "index", "insert", "pop", "remove", "reverse", "sort", "type_", "target", "filename", "indentLevel", "type"):
                continue
            elif attr in ("lineno", "start", "end"):
                s += ' %s="%s"' % (attr, getattr(self, attr))
            elif attr in childLike:
                a.append((attr, getattr(self, attr)))
                pass
            else:
                value = getattr(self, attr)
                s += ' %s="%s"' % (attr, value)

                print "YY: %s = %s" % (attr, value)


                #print "ATTR: %s" % attr
                #a.append((attr, getattr(self, attr)))
        
        s += ">\n"
        
        Node.indentLevel += 1
        
        for i, value in a:
            if i == "value" and self.type_ == REGEXP:
                s += "/%s/%s" % (value["regexp"], value["modifiers"])
            elif value is None:
                s += "null"
            elif value is False:
                s += "false"
            elif value is True:
                s += "true"
            elif type(value) == list:
                s += ','.join((str(x) for x in value))
            else:
                s += str(value)

        Node.indentLevel -= 1
        s += "%s</%s>\n" % (Node.indentLevel * "", tokenstr(self.type_).lower())
        
        return s



        a = list((str(i), v) for i, v in enumerate(self))
        for attr in dir(self):
            if attr[0] == "_": continue
            elif attr == "tokenizer":
                a.append((attr, "[object Object]"))
            elif attr in ("append", "count", "extend", "getSource", "index",
                    "insert", "pop", "remove", "reverse", "sort", "type_",
                    "target", "filename", "indentLevel", "type"):
                continue
            else:
                a.append((attr, getattr(self, attr)))
        if len(self): a.append(("length", len(self)))
        a.sort(lambda a, b: cmp(a[0], b[0]))
        


        print a
        return ""
        
        INDENTATION = "    "
        Node.indentLevel += 1
        n = Node.indentLevel
        s = "{\n%stype: %s" % ((INDENTATION * n), tokenstr(self.type_))
        for i, value in a:
            s += ",\n%s%s: " % ((INDENTATION * n), i)
            if i == "value" and self.type_ == REGEXP:
                s += "/%s/%s" % (value["regexp"], value["modifiers"])
            elif value is None:
                s += "null"
            elif value is False:
                s += "false"
            elif value is True:
                s += "true"
            elif type(value) == list:
                s += ','.join((str(x) for x in value))
            else:
                s += str(value)
        Node.indentLevel -= 1
        n = Node.indentLevel
        s += "\n%s}" % (INDENTATION * n)
        return s
    #__repr__ = __str__

    def getSource(self):
        if getattr(self, "start", None) is not None:
            if getattr(self, "end", None) is not None:
                return self.tokenizer.source[self.start:self.end]
            return self.tokenizer.source[self.start:]
        if getattr(self, "end", None) is not None:
            return self.tokenizer.source[:self.end]
        return self.tokenizer.source[:]

    filename = property(lambda self: self.tokenizer.filename)

    def __nonzero__(self): return True

# Statement stack and nested statement handler.
def nest(t, x, node, func, end=None):
    x.stmtStack.append(node)
    n = func(t, x)
    x.stmtStack.pop()
    if end: t.mustMatch(end)
    return n

def tokenstr(tt):
    t = tokens[tt]
    if re.match(r'^\W', t):
        return opTypeNames[t]
    return t.upper()