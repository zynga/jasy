#
# JavaScript Tools - Dependency Wrapper
# Copyright 2010 Sebastian Werner
#

class Dependencies:
    """ Data structure to hold all dependency information """
    def __init__(self, node):
        # top-level node in tree is a script node containing 
        # the relevant "shared" and "packages" data
        
        deps = set()
        stats = node.stats
        deps.update(set(stats.shared))
        deps.update(set(stats.packages))

        self.__deps = deps
        
    
    def all(self):
        return self.__deps
        
        
    def filter(self, classes):
        """ Returns a new list of dependencies filtered by the known classes """
        
        deps = self.__deps
        result = set()
        
        for name in deps:
            if name in classes:
                result.add(name)
            elif "." in name:
                splitted = name.split(".")
                while splitted:
                    splitted.pop()
                    temp = ".".join(splitted)
                    if temp in classes:
                        result.add(temp)
                        break
        
        return result

