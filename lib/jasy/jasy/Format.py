#
# Jasy - JavaScript Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import zlib

__all__ = ["Format"]

class Format:
    def __init__(self, *args):
        self.__formatting = set()
        
        for identifier in args:
            self.enable(identifier)
        
    def enable(self, identifier):
        self.__formatting.add(identifier)
        
    def disable(self, identifier):
        self.__formatting.remove(identifier)
        
    def has(self, identifier):
        return identifier in self.__formatting

    def getKey(self):
        return "+".join(sorted(self.__formatting))
        
    # Map Python built-ins
    __repr__ = getKey
    __str__ = getKey

