#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import logging, time
from js.core.Profiler import *


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
        
        self.__lastWait = -1


    def getSortedClasses(self):
        """ Returns the sorted class list (caches result) """

        if not self.__sortedClasses:
            pstart()
            logging.info("Computing load dependencies...")
            for classObj in self.__classes:
                self.__getLoadDeps(classObj)
            pstop()

            logging.info("Sorting classes for final loading...")
            result = []
            self.__classes = list(sorted(self.__classes, key=lambda depObj: len(self.__loadDeps[depObj])))
            for classObj in self.__classes:
                if not classObj in result:
                    logging.debug("Start adding with: %s", classObj)
                    self.__addSorted(classObj, result)

            self.__sortedClasses = result
            pstop()

        return self.__sortedClasses
        
        
    def __addSorted(self, classObj, result, postponed=False):
        """ Adds a single class and its dependencies to the sorted result list """

        wait = False
        loadDeps = self.__getLoadDeps(classObj)
        
        for depObj in loadDeps:
            if not depObj in result:
                self.__addSorted(depObj, result)
                wait = True

        if classObj in result:
            return
            
        # Reprocess list to check whether all dependencies are after the last "WAIT"
        if not wait:
            for depObj in loadDeps:
                if result.index(depObj) > self.__lastWait:
                    wait = True
                    break

        # When this class had required classes when we need
        # to wait for them being loaded. This is mainly information
        # for a more granular system where you need more than
        # just a final list of classes.
        if wait and result[-1] != "WAIT":
            logging.debug("Adding wait command")
            self.__lastWait = len(result)
            result.append("WAIT")

        logging.debug("Adding class: %s", classObj)
        result.append(classObj)

        # Insert runtime dependencies as soon as possible
        if classObj in self.__circularDeps:
            circularDeps = self.__circularDeps[classObj]
            for depObj in circularDeps:
                if not depObj in result:
                    self.__addSorted(depObj, result, True)



    def __getLoadDeps(self, classObj):
        """ Returns load time dependencies of given class """

        if not classObj in self.__loadDeps:
            self.__getLoadDepsRecurser(classObj, [])

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
            stack.append(classObj)
            msg = " >> ".join([x.getName() for x in stack[stack.index(classObj):]])
            logging.debug("Circular Dependency: %s" % msg)
            raise CircularDependencyBreaker(classObj)
    
        stack.append(classObj)

        classDeps = classObj.getDependencies(self.__permutation).filter(self.__names)
        classMeta = classObj.getMeta(self.__permutation)
        
        result = set()
        circular = set()
        
        # Respect manually defined breaks
        # Breaks are dependencies which are down-priorized to break
        # circular dependencies between classes.
        for breakName in classMeta.breaks:
            if breakName in self.__names:
                circular.add(self.__names[breakName])

        # Now process the deps of the given class
        loadDeps = self.__loadDeps
        for depObj in classDeps:
            if depObj is classObj:
                continue
            
            depName = depObj.getName()
            
            if depName in classMeta.breaks:
                logging.debug("Manual Break: %s => %s" % (classObj, depObj))
                pass
            
            elif depObj in loadDeps:
                result.update(loadDeps[depObj])
                result.add(depObj)
        
            else:
                try:
                    current = self.__getLoadDepsRecurser(depObj, stack[:])
                except CircularDependencyBreaker as circularError:
                    if circularError.breakAt == classObj:
                        logging.info("Auto Break: %s |> %s" % (classObj, depObj))
                        circular.add(depObj)
                        continue  
                    else:
                        raise circularError
        
                result.update(current)
                result.add(depObj)
        
        # Sort dependencies by number of other dependencies
        # For performance reasions we access the __loadDeps 
        # dict directly as this data is already stored
        result = sorted(result, key=lambda depObj: len(self.__loadDeps[depObj]))
        
        loadDeps[classObj] = result
        
        if circular:
            self.__circularDeps[classObj] = circular
        
        return result
