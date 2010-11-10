#
# JavaScript Tools - Dependency Wrapper
# Copyright 2010 Sebastian Werner
#

import logging

__all__ = ["Dependencies"]

# Used for caching relation between raw package dependencies and classes
aliases = {}

class Dependencies:
    """
    Data structure to hold all dependency information 
    
    Hint: Must be a clean data class without links to other 
    systems for optiomal cachability using Pickle
    """
    
    def __init__(self, tree, meta, name):
        # Store own name
        self.__name = name
        
        # Extract data from input params
        self.__shared = tree.stats.shared
        self.__packages = tree.stats.packages
        self.__requires = meta.requires
        
    def names(self):
        return self.__shared
        
    def packages(self):
        return self.__packages
        
    def filter(self, classes):
        """ 
        Returns a set of dependencies seen through the given list of known 
        classes (ignoring all unknown items in original set) 
        """
        
        me = self.__name
        result = set()
        
        # Manually defined names/classes
        for name in self.__requires:
            if name != me and name in classes:
                result.add(classes[name])
        
        # Globally modified names (mostly relevant when working without namespaces)
        for name in self.__shared:
            if name != me and name in classes:
                result.add(classes[name])
        
        # Real filtering
        for package in self.__packages:
            if package in aliases and package in classes:
                result.add(classes[package])
            
            else:
                orig = package
                while True:
                    if package == me:
                        break
                
                    elif package in classes:
                        aliases[orig] = package
                        result.add(classes[package])
                        break
                
                    else:
                        pos = package.rfind(".")
                        if pos == -1:
                            break
                        
                        package = package[0:pos]
        
        return result

