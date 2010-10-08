#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import hashlib

class Permutation:
    def __init__(self, combination, timestamp=None):
        self.__combination = combination
        self.__timestamp = timestamp
        
        
    def has(self, variant):
        return variant in self.__combination
        
        
    def get(self, variant):
        if variant in self.__combination:
            return self.__combination[variant]
            
        return None
        
        
    def getKey(self, timed=False):
        """
        Returns a key which can be used to identifier the permutation.
        This key is read and parsable to restore the set of permutations.
        Might be used for transfering the permutation for string-only communications etc.
        """

        combination = self.__combination
        result = []
        for key in sorted(combination):
            result.append("%s:%s" % (key, combination[key]))

        if timed:
            result.append("time:%s" % self.__timestamp)

        return ";".join(result)

    def getHash(self, timed=False):
        """
        Returns a 32 character long identifier for the permutation.
        May optionally be timed aka includes the build runtime which
        might be useful for correct invalidation (server caching)
        """

        key = self.getKey(timed)
        return hashlib.md5(key.encode("utf-8")).hexdigest()
        

    # Map Python built-ins
    __repr__ = getKey
    __str__ = getKey