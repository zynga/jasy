#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import logging
from js.core.Profiler import *

__all__ = ["Resolver"]

class Resolver():
    debug = False
    
    def __init__(self, session, permutation=None):
        # Required classes by the user
        self.required = []
        
        # Keep session/permutation reference
        self.session = session
        self.permutation = permutation
        
        # Collecting all available classes
        self.classes = {}
        for project in session.getProjects():
            self.classes.update(project.getClasses())      

        # Included classes after dependency calculation
        self.included = []
        
        
    def addClassName(self, className):
        """ Adds a class to the initial dependencies """
        
        projects = self.session.getProjects()
        for project in projects:
            classObj = project.getClassByName(className)
            if classObj:
                break

        if not classObj:
            raise Exception("Unknown Class: %s" % className)
            
        logging.info("Adding class: %s" % className)
        self.required.append(classObj)
        
        if self.included:
            self.included = []
        
        
    def removeClassName(self, className):
        """ Removes a class name from dependencies """
        
        for classObj in self.required:
            if classObj.getName() == className:
                self.required.remove(classObj)
                if self.included:
                    self.included = []
                return True
                
        return False


    def getIncludedClasses(self):
        """ Returns a final set of classes after resolving dependencies """

        if self.included:
            return self.included
        
        pstart()
        logging.info("Collecting included classes...")
        
        collection = set()
        for classObj in self.required:
            self.__resolveDependencies(classObj, collection)
        
        self.included = collection
        logging.info(" - %s classes" % len(self.included))
        pstop()
        
        return self.included


    def __resolveDependencies(self, classObj, collection):
        """ Internal resolver engine which works recursively through all dependencies """
        
        logging.debug("Resolving dependencies of %s..." % classObj)

        collection.add(classObj)
        dependencies = classObj.getDependencies(self.permutation).filter(self.classes)
        
        for depObj in dependencies:
            if not depObj in collection:
                self.__resolveDependencies(depObj, collection)
                    