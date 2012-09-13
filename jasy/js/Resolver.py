#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import jasy.js.Sorter as Sorter
import jasy.core.Console as Console

__all__ = ["Resolver"]

class Resolver():
    """Resolves dependencies between JavaScript files"""

    def __init__(self, session):
        
        # Keep session reference
        self.__session = session

        # Keep permutation reference
        self.__permutation = session.getCurrentPermutation()

        # Required classes by the user
        self.__required = []

        # Hard excluded classes (used for filtering previously included classes etc.)
        self.__excluded = []
        
        # Included classes after dependency calculation
        self.__included = []

        # Collecting all available classes
        self.__classes = {}
        for project in session.getProjects():
            self.__classes.update(project.getClasses())
        
        
    def addClassName(self, className):
        """ Adds a class to the initial dependencies """
        
        if not className in self.__classes:
            raise Exception("Unknown Class: %s" % className)
            
        Console.debug("Adding class: %s", className)
        self.__required.append(self.__classes[className])
        
        del self.__included[:]
        
        return self
            
            
    def removeClassName(self, className):
        """ Removes a class name from dependencies """
        
        for classObj in self.__required:
            if classObj.getId() == className:
                self.__required.remove(classObj)
                if self.__included:
                    self.__included = []
                return True
                
        return False


    def excludeClasses(self, classObjects):
        """ Excludes the given class objects (just a hard-exclude which is applied after calculating the current dependencies) """
        
        self.__excluded.extend(classObjects)
        
        # Invalidate included list
        self.__included = None
        
        return self
        

    def getRequiredClasses(self):
        """ Returns the user added classes - the so-called required classes. """
        
        return self.__required


    def getIncludedClasses(self):
        """ Returns a final set of classes after resolving dependencies """

        if self.__included:
            return self.__included
        
        Console.info("Detecting class dependencies...")
        Console.indent()
        
        collection = set()
        for classObj in self.__required:
            self.__resolveDependencies(classObj, collection)
            
        # Filter excluded classes
        for classObj in self.__excluded:
            if classObj in collection:
                collection.remove(classObj)
        
        self.__included = collection

        Console.outdent()
        Console.debug("Including %s classes", len(collection))
        
        return self.__included
        
        
    def getSortedClasses(self):
        """ Returns a list of sorted classes """

        return Sorter.Sorter(self, self.__session).getSortedClasses()


    def __resolveDependencies(self, classObj, collection):
        """ Internal resolver engine which works recursively through all dependencies """
        
        collection.add(classObj)
        dependencies = classObj.getDependencies(self.__permutation, classes=self.__classes)
        
        for depObj in dependencies:
            if not depObj in collection:
                self.__resolveDependencies(depObj, collection)
                    