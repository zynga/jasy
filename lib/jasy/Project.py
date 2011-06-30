#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import os, logging, json

from jasy.core.Class import Class
from jasy.core.Cache import Cache
        
class ProjectException(Exception):
    pass
        
class Project():
    def __init__(self, path):
        if not os.path.isdir(path):
            raise ProjectException("Invalid project path: %s (Absolute: %s)" % (path, os.path.abspath(path)))
        
        self.__path = path
        self.__dirFilter = [".svn",".git",".hg",".bzr"]
        self.__cache = Cache(self.__path)
        
        manifestPath = os.path.join(path, "manifest.json")
        if not os.path.exists(manifestPath):
            raise ProjectException("Missing manifest.json at: %s" % manifestPath)
        
        try:
            manifestData = json.load(open(manifestPath))
        except ValueError as err:
            raise ProjectException("Could not parse manifest.json at %s: %s" % (manifestPath, err))
        
        self.__name = manifestData["name"]
        self.__kind = manifestData["kind"]

        if "fuzzy" in manifestData:
            self.__fuzzy = manifestData["fuzzy"]
        else:
            self.__fuzzy = False
            
        # Read default values (for settings, variants, permutations, etc.)
        if "values" in manifestData:
            self.__values = manifestData["values"]
        else:
            self.__values = {}

        logging.info("Initialized project %s (%s)" % (self.__name, self.__kind))

        # Do kind specific intialization
        if self.__kind == "qooxdoo":
            self.classPath = os.path.join(self.__path, "source", "class")
            self.resourcePath = os.path.join(self.__path, "source", "resource")
            self.translationPath = os.path.join(self.__path, "source", "translation")
        elif self.__kind == "basic":
            self.classPath = os.path.join(self.__path, "src")
            self.resourcePath = None
            self.translationPath = None
        else:
            raise ProjectException("Unsupported kind of project: %s" % self.__kind)
    
    
    def __str__(self):
        return self.__path
        
        
    def getCache(self):
        return self.__cache
    
    
    def clearCache(self):
        self.__cache.clear()
        
        
    def close(self):
        self.__cache.close()
        
        
    def getValues(self):
        return self.__values
        
        
    def getClassByName(self, className):
        try:
            return self.getClasses()[className]
        except KeyError:
            return None            


    def getClasses(self):
        try:
            return self.classes
            
        except AttributeError:
            classPath = self.classPath
            classes = {}
            
            if classPath and os.path.exists(classPath):
                classPathLen = len(classPath) + 1
                for dirPath, dirNames, fileNames in os.walk(classPath):
                    for dirName in dirNames:
                        if dirName in self.__dirFilter:
                            dirNames.remove(dirName)

                    for fileName in fileNames:
                        if fileName[0] == "." or "_" in fileName or not fileName.endswith(".js"):
                            continue

                        filePath = os.path.join(dirPath, fileName)
                        relPath = filePath[classPathLen:]

                        classObj = Class(filePath, relPath, self)
                        className = classObj.getName()
                        
                        # This is by far slower and not the default but helps in specific project structures
                        if self.__fuzzy:
                            classNameForced = classObj.getMeta().name
                            if classNameForced != None:
                                classObj.setName(classNameForced)
                                className = classNameForced
                            else:
                                logging.warn("No name given to class: %s" % className)

                        classes[className] = classObj
                
            logging.info("Project %s contains %s classes", self.__name, len(classes))
            self.classes = classes
            return classes


    def getResources(self):
        try:
            return self.resources
            
        except AttributeError:
            resourcePath = self.resourcePath
            resources = {}

            if resourcePath and os.path.exists(resourcePath):
                resourcePathLen = len(resourcePath) + 1
                for dirPath, dirNames, fileNames in os.walk(resourcePath):
                    for dirName in dirNames:
                        if dirName in self.__dirFilter:
                            dirNames.remove(dirName)

                    for fileName in fileNames:    
                        if fileName[0] == ".":
                            continue

                        filePath = os.path.join(dirPath, fileName)
                        relPath = filePath[resourcePathLen:]            

                        resources[relPath] = filePath
                    
            logging.info("Project %s contains %s resources", self.__name, len(resources))
            self.resources = resources
            return resources


    def getTranslations(self):
        try:
            return self.translations
            
        except AttributeError:
            translationPath = self.translationPath
            translations = {}

            if translationPath and os.path.exists(translationPath):
                for dirPath, dirNames, fileNames in os.walk(translationPath):
                    for dirName in dirNames:
                        if dirName in self.__dirFilter:
                            dirNames.remove(dirName)

                    for fileName in fileNames:    
                        if fileName[0] == "." or not fileName.endswith(".po"):
                            continue

                        translations[os.path.splitext(fileName)[0]] = os.path.join(dirPath, fileName)
            
            logging.info("Project %s contains %s translations", self.__name, len(translations))
            self.translations = translations
            return translations
        
        