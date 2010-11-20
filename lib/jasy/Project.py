#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import os, logging
from configparser import SafeConfigParser
from jasy.core.Class import Class
from jasy.core.Cache import Cache
        
class ProjectException(Exception):
    pass
        
class Project():
    def __init__(self, path):
        if not os.path.isdir(path):
            raise ProjectException("Invalid project path: %s (Absolute: %s)" % (path, os.path.abspath(path)))
        
        self.path = path
        self.dirFilter = [".svn",".git",".hg",".bzr"]
        self.cache = Cache(self.path)
        
        manifestPath = os.path.join(path, "manifest.cfg")
        if not os.path.exists(manifestPath):
            raise ProjectException("Missing manifest.cfg at: %s" % manifestPath)
        
        parser = SafeConfigParser()
        parser.read(manifestPath)

        try:
            self.name = parser.get("main", "name")
            self.kind = parser.get("main", "kind")
        except configparser.NoOptionError:
            raise ProjectException()
        
        logging.info("Initialized project %s (%s)" % (self.name, self.kind))

        if self.kind == "qooxdoo":
            self.classPath = os.path.join(self.path, "source", "class")
            self.resourcePath = os.path.join(self.path, "source", "resource")
            self.translationPath = os.path.join(self.path, "source", "translation")
        elif self.kind == "basic":
            self.classPath = os.path.join(self.path, "src")
            self.resourcePath = None
            self.translationPath = None
        else:
            raise ProjectException("Unsupported kind of project: %s" % self.kind)
        

    def __str__(self):
        return self.path

        
    def clearCache(self):
        self.cache.clear()
        
        
    def close(self):
        self.cache.close()
        
        
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
                        if dirName in self.dirFilter:
                            dirNames.remove(dirName)

                    for fileName in fileNames:
                        if fileName[0] == "." or "_" in fileName or not fileName.endswith(".js"):
                            continue

                        filePath = os.path.join(dirPath, fileName)
                        relPath = filePath[classPathLen:]

                        classObj = Class(filePath, relPath, self)
                        className = classObj.getName()

                        classes[className] = classObj
                
            logging.info("Project %s contains %s classes", self.name, len(classes))
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
                        if dirName in self.dirFilter:
                            dirNames.remove(dirName)

                    for fileName in fileNames:    
                        if fileName[0] == ".":
                            continue

                        filePath = os.path.join(dirPath, fileName)
                        relPath = filePath[resourcePathLen:]            

                        resources[relPath] = filePath
                    
            logging.info("Project %s contains %s resources", self.name, len(resources))
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
                        if dirName in self.dirFilter:
                            dirNames.remove(dirName)

                    for fileName in fileNames:    
                        if fileName[0] == "." or not fileName.endswith(".po"):
                            continue

                        translations[os.path.splitext(fileName)[0]] = os.path.join(dirPath, fileName)
            
            logging.info("Project %s contains %s translations", self.name, len(translations))
            self.translations = translations
            return translations
        
        