#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import logging

__all__ = ["Sorter"]


class CircularDependencyBreaker(Exception):
    def __init__(self, className):
        self.breakAt = className
        Exception.__init__(self, "Circular dependency to: %s" % className)


class Sorter:
    def __init__(self, classes, permutation=None):
        # Keep classes/permutation reference
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

        loadDeps = self.__getLoadDeps(classObj)
        runDeps = self.__getRuntimeDeps(classObj)

        wait = False
        for depName in loadDeps:
            depObj = self.__names[depName]
            if not depObj in result:
                wait = True
                self.__addSorted(depObj, result)

        if classObj in result:
            return

        if wait:
            result.append("-- wait --")

        result.append(classObj)

        # Insert runtime dependencies as soon as possible
        if runDeps:
            for depName in runDeps:
                depObj = self.__names[depName]
                if not depObj in result:
                    self.__addSorted(depObj, result)



    def __getLoadDeps(self, classObj):
        """ Returns load time dependencies of given class """

        className = classObj.getName()
        if not className in self.__loadDeps:
            result = self.__recursivelyCollect(className, [])

        return self.__loadDeps[className]



    def __recursivelyCollect(self, className, stack):
        if className in stack:
            raise CircularDependencyBreaker(className)
    
        stack.append(className)

        result = set()
        circular = set()

        classObj = self.__names[className]
        classDeps = classObj.getDependencies(self.__permutation).filter(self.__names)
        classMeta = classObj.getMetaData(self.__permutation)

        for depName in classDeps:
            if depName in classMeta.breaks:
                pass
            
            elif depName in self.__loadDeps:
                result.update(self.__loadDeps[depName])
                result.add(depName)
        
            else:
                try:
                    current = self.__recursivelyCollect(depName, list(stack))
                except CircularDependencyBreaker as circularError:
                    if circularError.breakAt == className:
                        circular.add(depName)
                        continue  
                    else:
                        raise circularError
        
                result.update(current)
                result.add(depName)
        
        self.__loadDeps[className] = result
        self.__circularDeps[className] = circular

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

        meta = classObj.getMetaData(self.__permutation)
        runtimeDeps.update(meta.breaks)

        return runtimeDeps

