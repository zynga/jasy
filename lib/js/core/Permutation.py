#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import hashlib

class Permutation:
    def __init__(self, combination, timestamp=None, timed=False):
        self.__combination = combination
        self.__timestamp = timestamp
        self.__key = self.__buildKey(combination, timed)
        self.__hash = hashlib.md5(self.getKey().encode("utf-8")).hexdigest()
        
    def __buildKey(self, combination, timed=False):
        result = []
        for key in sorted(combination):
            result.append("%s:%s" % (key, combination[key]))

        if timed:
            result.append("time:%s" % self.__timestamp)

        return "; ".join(result)
            
    def has(self, variant):
        return variant in self.__combination
        
    def get(self, variant):
        if variant in self.__combination:
            return self.__combination[variant]
            
        return None
        
    def getKey(self):
        return self.__key

    def getHash(self):
        return self.__hash
        
    # Map Python built-ins
    __repr__ = getKey
    __str__ = getKey