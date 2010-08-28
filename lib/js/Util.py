#
# JavaScript Tools - Compressor Module
# Copyright 2010 Sebastian Werner
#

import string


def baseEncode(num, alphabet=string.ascii_letters):
    if (num == 0):
        return alphabet[0]
    arr = []
    base = len(alphabet)
    while num:
        rem = num % base
        num = num // base
        arr.append(alphabet[rem])
    arr.reverse()
    return "".join(arr)    

    
def compareToKey(mycmp):
    'Convert a cmp= function into a key= function'
    class K(object):
        def __init__(self, obj, *args):
            self.obj = obj
        def __lt__(self, other):
            return mycmp(self.obj, other.obj) < 0
        def __gt__(self, other):
            return mycmp(self.obj, other.obj) > 0
        def __eq__(self, other):
            return mycmp(self.obj, other.obj) == 0
        def __le__(self, other):
            return mycmp(self.obj, other.obj) <= 0
        def __ge__(self, other):
            return mycmp(self.obj, other.obj) >= 0
        def __ne__(self, other):
            return mycmp(self.obj, other.obj) != 0
    return K    
    
    
def combineVariable(node):
    """ Combines an identifier node to a namespaced variable. Only returns a (string) value when value is part of a namespaced variable """

    if getattr(node, "scope", False) and node.parent.type == "dot":
        variable = __combineVariableRecurser(node)
        if "." in variable:
            return variable

    return None


def __combineVariableRecurser(node):
    """ Internal helper for namespace builder """
    result = node.value

    # Don't go deeper if name starts with a upper-case
    # This is normally a hint for a class name.
    if result[0].upper() == result[0]:
        return result

    parent = node.parent
    if parent.type == "dot":
        if parent[0] is node:
            result += "." + __combineVariableRecurser(parent[1])
        else:
            parentParent = parent.parent
            if parentParent.type == "dot" and parentParent[0] is parent:
                result += "." + __combineVariableRecurser(parentParent[1])

    return result