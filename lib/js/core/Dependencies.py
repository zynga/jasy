#
# JavaScript Tools - Dependency Wrapper
# Copyright 2010 Sebastian Werner
#

class Dependencies:
    """ Data structure to hold all dependency information """
    def __init__(self, classObj, tree):
        # top-level node in tree is a script node containing 
        # the relevant "shared" and "packages" data
        
        deps = set()
        stats = tree.stats
        deps.update(set(stats.shared))
        deps.update(set(stats.packages))

        self.__class = classObj
        self.__deps = deps
        
    
    def filter(self, classes):
        """ Returns a new list of dependencies filtered by the known classes """
        
        deps = self.__deps
        me = self.__class.getName()
        result = set()
        
        for name in deps:
            if name in classes:
                if name != me:
                    result.add(classes[name])
            elif "." in name:
                splitted = name.split(".")
                while splitted:
                    splitted.pop()
                    temp = ".".join(splitted)
                    if temp in classes:
                        if temp != me:
                            result.add(classes[temp])
                        break
        
        return result

