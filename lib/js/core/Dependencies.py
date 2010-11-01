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
    
    def __init__(self, tree, name):
        # top-level node in tree is a script node containing 
        # the relevant "shared" and "packages" data
        
        self.__tree = tree
        self.__name = name
        
        
    def names(self):
        return self.__tree.stats.shared
        
    
    def packages(self):
        return self.__tree.stats.packages
        
        
    def filter(self, classes):
        """ 
        Returns a set of dependencies seen through the given list of known 
        classes (ignoring all unknown items in original set) 
        """
        
        stats = self.__tree.stats
        me = self.__name
        result = set()
        
        for name in stats.shared:
            if name != me and name in classes:
                result.add(classes[name])
                    
        count = 0
        for package in stats.packages:
            if package in aliases and package in classes:
                result.add(classes[package])
            
            else:
                orig = package
                while True:
                    count += 1
                
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

