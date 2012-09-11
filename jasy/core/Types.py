#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

class CaseInsensitiveDict(dict):
    """
    A case-insensitive dict subclass.
    Each key is changed on entry to str(key).title().
    """
    
    def __getitem__(self, key):
        return dict.__getitem__(self, str(key).title())
    
    def __setitem__(self, key, value):
        dict.__setitem__(self, str(key).title(), value)
    
    def __delitem__(self, key):
        dict.__delitem__(self, str(key).title())
    
    def __contains__(self, key):
        return dict.__contains__(self, str(key).title())
    
    def get(self, key, default=None):
        return dict.get(self, str(key).title(), default)
    
    if hasattr({}, 'has_key'):
        def has_key(self, key):
            return dict.has_key(self, str(key).title())
    
    def update(self, E):
        for k in E.keys():
            self[str(k).title()] = E[k]
    
    def fromkeys(cls, seq, value=None):
        newdict = cls()
        for k in seq:
            newdict[str(k).title()] = value
        return newdict
    fromkeys = classmethod(fromkeys)
    
    def setdefault(self, key, x=None):
        key = str(key).title()
        try:
            return self[key]
        except KeyError:
            self[key] = x
            return x
    
    def pop(self, key, default):
        return dict.pop(self, str(key).title(), default)