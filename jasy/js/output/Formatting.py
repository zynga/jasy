#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

__all__ = ["Formatting"]


class Formatting:
    """
    Configures an formatting object which can be used to compress classes afterwards.
    The optimization set is frozen after initialization which also generates the unique
    key based on the given formatting options.
    """
    
    __key = None

    
    def __init__(self, *args):
        self.__formatting = set()
        
        for identifier in args:
            self.__formatting.add(identifier)
            
        self.__key = "+".join(sorted(self.__formatting))
        
        
    def has(self, key):
        """
        Whether the given formatting is enabled.
        """

        return key in self.__formatting
    
    
    def enable(self, flag):
        self.__formatting.add(flag)
        self.__key = None


    def disable(self, flag):
        self.__formatting.remove(flag)
        self.__key = None        
        
        
    def getKey(self):
        """
        Returns a unique key to identify this formatting set
        """

        if self.__key is None:
            self.__key = "+".join(sorted(self.__formatting))
        
        return self.__key


    # Map Python built-ins
    __repr__ = getKey
    __str__ = getKey


