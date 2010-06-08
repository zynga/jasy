import re
from next.Tokenizer import *

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

    def __str__(self):
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
    __repr__ = __str__

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