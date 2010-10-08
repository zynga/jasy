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
    def __init__(self, session, permutation=None):
        # Keep session/permutation reference
        self.session = session
        self.permutation = permutation
        
        # Load time dependencies of every class
        self.loadDeps = {}
        self.circularDeps = {}       
        
        # Collecting all available classes
        self.classes = {}
        for project in session.getProjects():
            self.classes.update(project.getClasses())
        
        # Sorted included classes
        self.sorted = []        
        
        
    def __getFilteredDeps(self, classObj):
        """ Returns dependencies of the given class to other classes """

        permutation = self.permutation
        deps = classObj.getDependencies(permutation)
        breakDeps = classObj.getBreakDependencies(permutation)

        result = []
        for key in deps:
            if key in self.classes and not key in breakDeps:
                result.append(key)

        return result        
        

    def getLoadDeps(self, classObj):
        """ Returns load time dependencies of given class """

        className = classObj.getName()
        if not className in self.loadDeps:
            result = self.__recursivelyCollect(className, [])

        return self.loadDeps[className]



    def __recursivelyCollect(self, className, stack):
        if className in stack:
            raise JsCircularDependencyBreaker(className)
    
        indent1 = "  " * len(stack)

        #logging.debug("%sBegin: %s", indent1, className)
    
        stack.append(className)
        indent = "  " * len(stack)

        result = set()
        circular = set()

        classObj = self.classes[className]
        classDeps = self.__getFilteredDeps(classObj)

        for depName in classDeps:
            if depName in self.loadDeps:
                #logging.debug("%sFast: %s", indent, depName)
                result.update(self.loadDeps[depName])
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
 
 
        self.loadDeps[className] = result
        self.circularDeps[className] = circular

        #logging.debug("%sSuccessful %s: %s (circular: %s)", indent1, className, result, circular)

        return result      



    def getRuntimeDeps(self, classObj):
        """ Returns user defined """
        runtimeDeps = set()

        className = classObj.getName()
        if className in self.circularDeps:
            circular = self.circularDeps[className]
            if circular:
                logging.debug("Auto break: %s to %s" % (classObj, ", ".join(list(circular))))
                runtimeDeps.update(circular)

        breakDeps = classObj.getBreakDependencies(self.permutation)
        runtimeDeps.update(breakDeps)

        return runtimeDeps



    def getSortedClasses(self, classes):
        """ Returns the sorted class list """

        if not self.sorted:
            logging.info("Sorting %s classes..." % len(classes))
    
            result = []
            for classObj in classes:
                self.__addSorted(classObj, result)
        
            self.sorted = result
    
        return self.sorted



    def __addSorted(self, classObj, result):
        """ Adds a single class and its dependencies to the given sorted result list """

        if classObj in result:
            return
            
        loadDeps = self.getLoadDeps(classObj)
        runDeps = self.getRuntimeDeps(classObj)

        for depName in loadDeps:
            depObj = self.classes[depName]
            if not depObj in result:
                self.__addSorted(depObj, result)

        if classObj in result:
            return

        result.append(classObj)

        # Insert runtime dependencies as soon as possible
        if runDeps:
            for depName in runDeps:
                depObj = self.classes[depName]
                if not depObj in result:
                    self.__addSorted(depObj, result)
