#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import threading

class JsCircularDependencyBreaker(Exception):
    def __init__(self, className):
        self.breakAt = className
        Exception.__init__(self, "Circular dependency to: %s" % className)


class JsResolver():
    debug = False
    
    def __init__(self, session):
        # Required classes by the user
        self.required = []
        
        # Keep session reference
        self.session = session
        
        # Collecting all available classes
        self.classes = {}
        for project in session.getProjects():
            self.classes.update(project.getClasses())      

        # Included classes after dependency calculation
        self.included = []
        
        # Load time dependencies of every class
        self.loadDeps = {}
        self.circularDeps = {}
        
        # Sorted included classes
        self.sorted = []
        
        
        
    def addClassName(self, className):
        """ Adds a class to the initial dependencies """
        projects = self.session.getProjects()
        for project in projects:
            classObj = project.getClassByName(className)
            if classObj:
                break

        if not classObj:
            raise Exception("Unknown Class: %s" % className)
            
        self.required.append(classObj)



    def getIncludedClasses(self):
        """ Returns the unsorted list of classes with resolved dependencies """

        if self.included:
            return self.included
        
        collection = {}
        threads = {}
        for classObj in self.required:
            self.__resolveDependencies(classObj, collection, threads)


        while len(threads) > 0:
            copy = dict(threads)
            for className in copy:
                if className in threads:
                    if threads[className]:
                        try:
                            if threads[className].is_alive():
                                threads[className].join()
                        except KeyError:
                            pass
                    
        self.included = list(collection.values())
        print("Included classes: %s" % len(self.included))      
        
        return self.included



    def __getDeps(self, classObj):
        """ Returns dependencies of the given class to other classes """
        result = []
        breakDeps = classObj.getBreakDependencies()
        for key in classObj.getDependencies():
            if key in self.classes and not key in breakDeps:
                result.append(key)
                
        

        return result



    def __resolveDependencies(self, classObj, collection, threads):
        # Add current
        className = classObj.getName()
        collection[className] = classObj

        # Process dependencies
        dependencies = self.__getDeps(classObj)
        for depClassName in dependencies:
            if not depClassName in self.classes:
                continue

            elif depClassName == className or depClassName in collection:
                continue

            elif not depClassName in collection and not depClassName in threads:
                threads[depClassName] = None
                # print("Start: %s" % depClassName)
                depClassObj = self.classes[depClassName]
                t = threading.Thread(name=depClassName, target=self.__resolveDependencies, args=(depClassObj, collection, threads))
                threads[depClassName] = t
                t.start()
                
        if className in threads:
            del threads[className]



    def getLoadDeps(self, classObj, debug=False):
        """ Returns load time dependencies of given class """
        
        className = classObj.getName()
        if not className in self.loadDeps:
            result = self.__recursivelyCollect(className, [], debug)
        
        return self.loadDeps[className]



    def __recursivelyCollect(self, className, stack, debug=False):
        if className in stack:
            raise JsCircularDependencyBreaker(className)
            
        indent1 = "  " * len(stack)
        
        if debug:
            print("%sBegin: %s" % (indent1, className))
            
        stack.append(className)
        indent = "  " * len(stack)

        result = set()
        circular = set()
        
        classObj = self.classes[className]
        classDeps = self.__getDeps(classObj)
        
        for depName in classDeps:
            if depName in self.loadDeps:
                if debug:
                    print("%sFast: %s" % (indent, depName))
                result.update(self.loadDeps[depName])
                result.add(depName)
                
            else:
                try:
                    current = self.__recursivelyCollect(depName, list(stack))
                except JsCircularDependencyBreaker as circularError:
                    if circularError.breakAt == className:
                        if debug:
                            print("%sIgnoring circular %s" % (indent, depName))
                        circular.add(depName)
                        continue  
                    else:
                        if debug:
                            print("%sBubble circular: %s" % (indent, circularError.breakAt))
                        raise circularError
                
                result.update(current)
                result.add(depName)
         
         
        self.loadDeps[className] = result
        self.circularDeps[className] = circular
        
        if debug:
            print("%sSuccessful %s: %s (circular: %s)" % (indent1, className, result, circular))
        
        return result      



    def getRuntimeDeps(self, classObj):
        """ Returns user defined """
        runtimeDeps = set()

        className = classObj.getName()
        if className in self.circularDeps:
            circular = self.circularDeps[className]
            if circular:
                # print("Auto break: %s to %s" % (classObj, ", ".join(list(circular))))
                runtimeDeps.update(circular)
    
        breakDeps = classObj.getBreakDependencies()
        runtimeDeps.update(breakDeps)
        
        return runtimeDeps



    def getSortedClasses(self):
        """ Returns the sorted class list """

        if not self.sorted:
            result = []
            for classObj in self.getIncludedClasses():
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

                    