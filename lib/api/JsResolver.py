#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import logging

__all__ = ["JsResolver"]

class JsResolver():
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
            
        logging.info("Add class: %s" % className)
        self.required.append(classObj)


    def getIncludedClasses(self):
        """ Returns the unsorted list of classes with resolved dependencies """

        if self.included:
            return self.included
        
        logging.info("Collecting included classes...")
        
        collection = {}
        for classObj in self.required:
            self.__resolveDependencies(classObj, collection)
        
        self.included = list(collection.values())
        logging.info("Included classes: %s" % len(self.included))      
        
        return self.included


    def __resolveDependencies(self, classObj, collection):
        # Add current
        className = classObj.getName()
        collection[className] = classObj
        
        logging.debug("%s: Resolving dependencies..." % classObj)

        # Process dependencies
        dependencies = classObj.getDependencies(self.permutation).filter(self.classes)
        for depClassName in dependencies:
            if depClassName != className and not depClassName in collection:
                self.__resolveDependencies(self.classes[depClassName], collection)
                    