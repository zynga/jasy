#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import logging

__all__ = ["JsSorter"]

class JsCircularDependencyBreaker(Exception):
    def __init__(self, className):
        self.breakAt = className
        Exception.__init__(self, "Circular dependency to: %s" % className)


class JsSorter:
    def __init__(self, classes, permutation=None):
        # Keep classes/session/permutation reference
        self.__classes = classes
        self.__permutation = permutation
        
        # Building map for name-based lookup
        self.__nameToClass = {}
        for classObj in classes:
            self.__nameToClass[classObj.getName()] = classObj
        
        # Load time dependencies of every class
        self.__loadDeps = {}
        self.__circularDeps = {}       
        
        # Sorted included classes
        self.__sortedClasses = []        
        
        
    def __getFilteredDeps(self, classObj):
        """ Returns dependencies of the given class to other classes """

        permutation = self.__permutation
        deps = classObj.getDependencies(permutation)
        breakDeps = classObj.getBreakDependencies(permutation)

        result = []
        for key in deps:
            if key in self.__nameToClass and not key in breakDeps:
                result.append(key)

        return result        
        

    def __getLoadDeps(self, classObj):
        """ Returns load time dependencies of given class """

        className = classObj.getName()
        if not className in self.__loadDeps:
            result = self.__recursivelyCollect(className, [])

        return self.__loadDeps[className]



    def __recursivelyCollect(self, className, stack):
        if className in stack:
            raise JsCircularDependencyBreaker(className)
    
        indent1 = "  " * len(stack)

        #logging.debug("%sBegin: %s", indent1, className)
    
        stack.append(className)
        indent = "  " * len(stack)

        result = set()
        circular = set()

        classObj = self.__nameToClass[className]
        classDeps = self.__getFilteredDeps(classObj)

        for depName in classDeps:
            if depName in self.__loadDeps:
                #logging.debug("%sFast: %s", indent, depName)
                result.update(self.__loadDeps[depName])
                result.add(depName)
        
            else:
                try:
                    current = self.__recursivelyCollect(depName, list(stack))
                except JsCircularDependencyBreaker as circularError:
                    if circularError.breakAt == className:
                        #logging.debug("%sIgnoring circular %s", indent, depName)
                        circular.add(depName)
                        continue  
                    else:
                        #logging.debug("%sBubble circular: %s", indent, circularError.breakAt)
                        raise circularError
        
                result.update(current)
                result.add(depName)
 
 
        self.__loadDeps[className] = result
        self.__circularDeps[className] = circular

        #logging.debug("%sSuccessful %s: %s (circular: %s)", indent1, className, result, circular)

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

        breakDeps = classObj.getBreakDependencies(self.__permutation)
        runtimeDeps.update(breakDeps)

        return runtimeDeps



    def getSortedClasses(self):
        """ Returns the sorted class list """

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

        for depName in loadDeps:
            depObj = self.__nameToClass[depName]
            if not depObj in result:
                self.__addSorted(depObj, result)

        if classObj in result:
            return

        result.append(classObj)

        # Insert runtime dependencies as soon as possible
        if runDeps:
            for depName in runDeps:
                depObj = self.__nameToClass[depName]
                if not depObj in result:
                    self.__addSorted(depObj, result)
