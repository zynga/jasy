#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import logging

__all__ = ["Sorter"]


class CircularDependencyBreaker(Exception):
    def __init__(self, classObj):
        self.breakAt = classObj
        Exception.__init__(self, "Circular dependency to: %s" % classObj)


class Sorter:
    def __init__(self, classes, permutation=None):
        # Keep classes/permutation reference
        # Classes is set(classObj, ...)
        self.__classes = classes
        self.__permutation = permutation

        # Build class name dict
        self.__names = dict([(classObj.getName(), classObj) for classObj in classes])
        
        # Initialize fields
        self.__loadDeps = {}
        self.__circularDeps = {}
        self.__sortedClasses = []



    def getSortedClasses(self):
        """ Returns the sorted class list (caches result) """

        if not self.__sortedClasses:
            logging.info("Sorting classes...")

            result = []
            for classObj in self.__classes:
                self.__addSorted(classObj, result)

            self.__sortedClasses = result

        return self.__sortedClasses



    def __addSorted(self, classObj, result, postponed=False):
        """ Adds a single class and its dependencies to the given sorted result list """

        if classObj in result:
            return

        wait = False
        loadDeps = self.__getLoadDeps(classObj)
        for depObj in loadDeps:
            if not depObj in result:
                self.__addSorted(depObj, result)
                wait = True

        if classObj in result:
            return

        # When this class had required classes when we need
        # to wait for them being loaded. This is mainly information
        # for a more granular system where you need more than
        # just a final list of classes.
        if wait:
            result.append("-- wait for load --")
        
        # Debug only
        # if postponed:
        #    result.append("-- post poned item --")

        result.append(classObj)

        # Insert runtime dependencies as soon as possible
        circularDeps = self.__circularDeps[classObj]
        for depObj in circularDeps:
            if not depObj in result:
                self.__addSorted(depObj, result, True)



    def __getLoadDeps(self, classObj):
        """ Returns load time dependencies of given class """

        if not classObj in self.__loadDeps:
            result = self.__getLoadDepsRecurser(classObj, [])

        return self.__loadDeps[classObj]



    def __getLoadDepsRecurser(self, classObj, stack):
        """ 
        This is the main routine which tries to control over a system
        of unsorted classes. It directly tries to fullfil every dependency
        a class have, but has some kind of exception based loop protection
        to prevent circular dependencies from breaking the build.
        
        It respects break information given by file specific meta data, but
        also adds custom hints where it found recursions. This lead to a valid 
        sort, but might lead to problems between exeactly the two affected classes.
        Without doing an exact execution it's not possible to whether found out
        which of two each-other referencing classes needs to be loaded first.
        This is basically only interesting in cases where one class needs another
        during the definition phase which is not the case that often.
        """
        
        if classObj in stack:
            raise CircularDependencyBreaker(classObj)
    
        stack.append(classObj)

        classDeps = classObj.getDependencies(self.__permutation).filter(self.__names)
        classMeta = classObj.getMeta(self.__permutation)
        
        result = set()
        circular = set()
        
        for breakName in classMeta.breaks:
            circular.add(self.__names[breakName])

        for depObj in classDeps:
            depName = depObj.getName()
            
            if depName in classMeta.breaks:
                pass
            
            elif depObj in self.__loadDeps:
                result.update(self.__loadDeps[depObj])
                result.add(depObj)
        
            else:
                try:
                    current = self.__getLoadDepsRecurser(depObj, list(stack))
                except CircularDependencyBreaker as circularError:
                    if circularError.breakAt == classObj:
                        circular.add(depObj)
                        continue  
                    else:
                        raise circularError
        
                result.update(current)
                result.add(depObj)
        
        self.__loadDeps[classObj] = result
        self.__circularDeps[classObj] = circular

        return result
