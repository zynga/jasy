#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging, hashlib

__all__ = ["Permutation", "getPermutation"]


PermutationCache = {}


def getPermutation(combination):
    """ Small wrapper to omit double creation of identical permutations in filter() method """
    
    key = str(combination)
    if key in PermutationCache:
        return PermutationCache[key]
        
    PermutationCache[key] = Permutation(combination)
    return PermutationCache[key]


class Permutation:
    def __init__(self, combination):
        
        self.__combination = combination
        self.__key = self.__buildKey(combination)
        self.__checksum = None
        
        
    def __buildKey(self, combination):
        """ Computes the permutations' key based on the given combination """
        
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
        """ Whether the permutation holds a value for the given key """
        
        return key in self.__combination
        
        
    def get(self, key):
        """ Returns the value of the given key in the permutation """
        
        if key in self.__combination:
            return self.__combination[key]
            
        return None
        
        
    def getKey(self):
        """ Returns the computed key from this permutation """
        
        return self.__key
        
        
    def getChecksum(self):
        """ Returns the computed checksum based on the key of this permutation """

        if self.__checksum is None:
        
            # Convert to same value as in JavaScript
            # Python 3 returns the unsigned value for better compliance with the standard.
            # http://bugs.python.org/issue1202
            # checksum = binascii.crc32(self.__key.encode("ascii"))
            # checksum = zlib.adler32(self.__key.encode("ascii"))
            # checksum = checksum - ((checksum & 0x80000000) <<1)
        
            #if checksum < 0:
            #    checksum = "a%s" % hex(abs(checksum))[2:]
            #else:
            #    checksum = "b%s" % hex(checksum)[2:]
            
            checksum = hashlib.sha1(self.__key.encode("ascii")).hexdigest()
            
            self.__checksum = checksum        
        
        return self.__checksum
        
        
    # Map Python built-ins
    __repr__ = getKey
    __str__ = getKey
    
    
    def filter(self, available):
        filtered = {}
        for key in self.__combination:
            if key in available:
                filtered[key] = self.__combination[key]
        
        return getPermutation(filtered)
