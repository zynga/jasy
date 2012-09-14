#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import hashlib


__all__ = ["Permutation", "getPermutation"]


"""Central cache for all permutations"""
registry = {}

def getPermutation(combination):
    """
    Small wrapper to omit double creation of identical permutations in filter() method 
    As these instances don't have any reference to session etc. they are actually cacheable globally.
    """
    
    key = str(combination)
    if key in registry:
        return registry[key]
        
    registry[key] = Permutation(combination)
    return registry[key]


class Permutation:
    """Object to store a single kind of permutation"""
    
    def __init__(self, combination):
        
        self.__combination = combination
        self.__key = self.__buildKey(combination)
        self.__checksum = hashlib.sha1(self.__key.encode("ascii")).hexdigest()
        
        
    def __buildKey(self, combination):
        """Computes the permutations' key based on the given combination"""
        
        result = []
        for key in sorted(combination):
            value = combination[key]
            
            # Basic translation like in JavaScript frontend
            # We don't have a special threadment for strings, numbers, etc.
            if value == True:
                value = "true"
            elif value == False:
                value = "false"
            elif value == None:
                value = "null"
            
            result.append("%s:%s" % (key, value))

        return ";".join(result)
        
        
    def has(self, key):
        """Whether the permutation holds a value for the given key"""
        return key in self.__combination
        
        
    def get(self, key):
        """Returns the value of the given key in the permutation"""
        
        if key in self.__combination:
            return self.__combination[key]
            
        return None
        
        
    def getKey(self):
        """Returns the computed key from this permutation"""
        return self.__key
        
        
    def getChecksum(self):
        """Returns the computed (SHA1) checksum based on the key of this permutation"""
        return self.__checksum
        
        
    def filter(self, available):
        """Returns a variant of that permutation which only holds values for the available keys."""
        
        filtered = {}
        for key in self.__combination:
            if key in available:
                filtered[key] = self.__combination[key]
        
        if not filtered:
            return None
            
        return getPermutation(filtered)


    # Map Python built-ins
    __repr__ = getKey
    __str__ = getKey

