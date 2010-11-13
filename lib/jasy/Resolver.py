#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging
from jasy.core.Profiler import *

__all__ = ["Resolver"]

class Resolver():
    def __init__(self, session, permutation=None):
        # Keep session/permutation reference
        self.__session = session
        self.__permutation = permutation

        # Required classes by the user
        self.__required = []
        
        # Included classes after dependency calculation
        self.__included = []

        # Collecting all available classes
        self.__classes = {}
        for project in session.getProjects():
            self.__classes.update(project.getClasses())
        
        
    def addClassName(self, className):
        """ Adds a class to the initial dependencies """
        
        projects = self.__session.getProjects()
        for project in projects:
            classObj = project.getClassByName(className)
            if classObj:
                break

        if not classObj:
            raise Exception("Unknown Class: %s" % className)
            
        logging.info("Adding class: %s" % className)
        self.__required.append(classObj)
        
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


    def getRequiredClasses(self):
        return self.__required


    def getIncludedClasses(self):
        """ Returns a final set of classes after resolving dependencies """

        if self.__included:
            return self.__included
        
        pstart()
        logging.info("Collecting included classes...")
        
        collection = set()
        for classObj in self.__required:
            self.__resolveDependencies(classObj, collection)
        
        self.__included = collection
        logging.info(" - %s classes" % len(collection))
        pstop()
        
        return self.__included


    def __resolveDependencies(self, classObj, collection):
        """ Internal resolver engine which works recursively through all dependencies """
        
        logging.debug("Resolving dependencies of %s..." % classObj)

        collection.add(classObj)
        dependencies = classObj.getDependencies(self.__permutation, classes=self.__classes)
        
        for depObj in dependencies:
            if not depObj in collection:
                self.__resolveDependencies(depObj, collection)
                    