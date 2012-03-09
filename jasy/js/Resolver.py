#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging
from jasy.util.Profiler import *

__all__ = ["Resolver"]

class Resolver():
    def __init__(self, projects, permutation=None):
        # Keep session/permutation reference
        self.__permutation = permutation

        # Required classes by the user
        self.__required = []

        # Hard excluded classes (used for filtering previously included classes etc.)
        self.__excluded = []
        
        # Included classes after dependency calculation
        self.__included = []

        # Collecting all available classes
        self.__classes = {}
        for project in projects:
            self.__classes.update(project.getClasses())
        
        
    def addClassName(self, className):
        """ Adds a class to the initial dependencies """
        
        if not className in self.__classes:
            raise Exception("Unknown Class: %s" % className)
            
        logging.debug("Adding class: %s", className)
        self.__required.append(self.__classes[className])
        
        del self.__included[:]
            
            
    def removeClassName(self, className):
        """ Removes a class name from dependencies """
        
        for classObj in self.__required:
            if classObj.getName() == className:
                self.__required.remove(classObj)
                if self.__included:
                    self.__included = []
                return True
                
        return False


    def excludeClasses(self, classObjects):
        """ Excludes the given class objects (just a hard-exclude which is applied after calculating the current dependencies) """
        
        self.__excluded.extend(classObjects)
        

    def getRequiredClasses(self):
        """ Returns the user added classes - the so-called required classes. """
        
        return self.__required


    def getIncludedClasses(self):
        """ Returns a final set of classes after resolving dependencies """

        if self.__included:
            return self.__included
        
        pstart()
        logging.info("Detecting dependencies...")
        
        collection = set()
        for classObj in self.__required:
            self.__resolveDependencies(classObj, collection)
            
        # Filter excluded classes
        for classObj in self.__excluded:
            if classObj in collection:
                collection.remove(classObj)
        
        self.__included = collection
        logging.debug("Including %s classes", len(collection))
        pstop()
        
        return self.__included


    def __resolveDependencies(self, classObj, collection):
        """ Internal resolver engine which works recursively through all dependencies """
        
        collection.add(classObj)
        dependencies = classObj.getDependencies(self.__permutation, classes=self.__classes)
        
        for depObj in dependencies:
            if not depObj in collection:
                self.__resolveDependencies(depObj, collection)
                    