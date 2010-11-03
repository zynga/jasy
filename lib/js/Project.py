#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import os, logging
from configparser import SafeConfigParser
from js.core.Class import Class
from js.core.Cache import Cache
        
class Project():
    def __init__(self, path):
        self.path = path
        self.dirFilter = [".svn",".git",".hg"]
        self.cache = Cache(self.path)
        
        manifestPath = os.path.join(path, "manifest.cfg")
        if not os.path.exists(manifestPath):
            raise Exception("Invalid manifest configuration: %s" % manifestPath)
        
        parser = SafeConfigParser()
        parser.read(manifestPath)

        self.namespace = parser.get("main", "namespace")
        logging.info("Initialized project %s" % self.namespace)
        
        self.classPath = os.path.join(self.path, "source", "class")
        self.resourcePath = os.path.join(self.path, "source", "resource")
        self.translationPath = os.path.join(self.path, "source", "translation")
        
        
    def clearCache(self):
        self.cache.clear()
        
        
    def close(self):
        self.cache.close()
        
        
    def setSession(self, session):
        self.session = session
        
    def getSession(self):
        return self.session


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
                
            logging.info("Project %s contains %s classes", self.namespace, len(classes))
            self.classes = classes
            return classes


    def getResources(self):
        try:
            return self.resources
            
        except AttributeError:
            resourcePath = self.resourcePath
            resources = {}
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
                    
            logging.info("Project %s contains %s resources", self.namespace, len(resources))
            self.resources = resources
            return resources


    def getTranslations(self):
        try:
            return self.translations
            
        except AttributeError:
            translationPath = self.translationPath
            translations = {}
            for dirPath, dirNames, fileNames in os.walk(translationPath):
                for dirName in dirNames:
                    if dirName in self.dirFilter:
                        dirNames.remove(dirName)

                for fileName in fileNames:    
                    if fileName[0] == "." or not fileName.endswith(".po"):
                        continue

                    translations[os.path.splitext(fileName)[0]] = os.path.join(dirPath, fileName)
            
            logging.info("Project %s contains %s translations", self.namespace, len(translations))
            self.translations = translations
            return translations
        
        