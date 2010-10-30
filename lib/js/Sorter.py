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



    def __addSorted(self, classObj, result):
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
            result.append("-- wait --")

        result.append(classObj)

        # Insert runtime dependencies as soon as possible
        runDeps = self.__getRuntimeDeps(classObj)
        if runDeps:
            for depName in runDeps:
                depObj = self.__names[depName]
                if not depObj in result:
                    self.__addSorted(depObj, result)



    def __getLoadDeps(self, classObj):
        """ Returns load time dependencies of given class """

        if not classObj in self.__loadDeps:
            result = self.__recursivelyCollect(classObj, [])

        return self.__loadDeps[classObj]



    def __recursivelyCollect(self, classObj, stack):
        if classObj in stack:
            raise CircularDependencyBreaker(classObj)
    
        stack.append(classObj)

        result = set()
        circular = set()

        classDeps = classObj.getDependencies(self.__permutation).filter(self.__names)
        classMeta = classObj.getMeta(self.__permutation)

        for depObj in classDeps:
            depName = depObj.getName()
            
            if depName in classMeta.breaks:
                pass
            
            elif depObj in self.__loadDeps:
                result.update(self.__loadDeps[depObj])
                result.add(depObj)
        
            else:
                try:
                    current = self.__recursivelyCollect(depObj, list(stack))
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



    def __getRuntimeDeps(self, classObj):
        """ Returns user defined """
        runtimeDeps = set()

        className = classObj.getName()
        if className in self.__circularDeps:
            circular = self.__circularDeps[className]
            if circular:
                logging.debug("Auto break: %s to %s" % (classObj, ", ".join(list(circular))))
                runtimeDeps.update(circular)

        meta = classObj.getMeta(self.__permutation)
        runtimeDeps.update(meta.breaks)

        return runtimeDeps

