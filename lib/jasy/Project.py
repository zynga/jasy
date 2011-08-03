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
        path = os.path.normpath(path)

        if not os.path.isdir(path):
            raise ProjectException("Invalid project path: %s (Absolute: %s)" % (path, os.path.abspath(path)))
        
        # Only store and work with full path
        path = os.path.abspath(path)
        
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
        
        # Read name from manifest or use the basename of the project's path
        if "name" in manifestData:
            self.__name = manifestData["name"]
        else:
            self.__name = os.path.basename(path)

        # Detect kind automatically
        if "kind" in manifestData:
            self.__kind = manifestData["kind"]
        elif os.path.isdir(os.path.join(self.__path, "source", "class")):
            self.__kind = "full"
        elif os.path.isdir(os.path.join(self.__path, "class")):
            self.__kind = "basic"
        elif os.path.isdir(os.path.join(self.__path, "src")):
            self.__kind = "classic"
        else:
            self.__kind = "flat"
                
        # Defined whenever no package is defined and classes/assets are not stored in the toplevel structure.
        if "package" in manifestData:
            self.__package = manifestData["package"]
        else:
            self.__package = self.__name
        
        # Whether we need to parse files for get their correct name (using @name attributes)
        if "fuzzy" in manifestData:
            self.__fuzzy = manifestData["fuzzy"]
        else:
            self.__fuzzy = False
            
        # Read fields (for injecting data into the project and build permuations)
        if "fields" in manifestData:
            self.__fields = manifestData["fields"]
        else:
            self.__fields = {}

        logging.info("Initialized project %s (%s)" % (self.__name, self.__kind))

        # Do kind specific intialization
        if self.__kind == "full":
            self.classPath = os.path.join(self.__path, "source", "class")
            self.assetPath = os.path.join(self.__path, "source", "asset")
            self.translationPath = os.path.join(self.__path, "source", "translation")
        elif self.__kind == "basic":
            self.classPath = os.path.join(self.__path, "class")
            self.assetPath = os.path.join(self.__path, "asset")
            self.translationPath = os.path.join(self.__path, "translation")
        elif self.__kind == "classic":
            self.classPath = os.path.join(self.__path, "src")
            self.assetPath = os.path.join(self.__path, "src")
            self.translationPath = None
        elif self.__kind == "flat":
            self.classPath = self.__path
            self.assetPath = self.__path
            self.translationPath = None
        else:
            raise ProjectException("Unsupported kind of project: %s" % self.__kind)
    
    
    def __str__(self):
        return self.__path

    
    def getName(self):
        return self.__name

    
    def getPackage(self):
        return self.__package
        
    
    def isFuzzy(self):
        return self.__fuzzy
        
        
    def getCache(self):
        return self.__cache
    
    
    def clearCache(self):
        self.__cache.clear()
        
        
    def close(self):
        self.__cache.close()
        
        
    def getFields(self):
        """ Return the project defined fields which may be configured by the build script """
        return self.__fields
        
        
    def getClassByName(self, className):
        try:
            return self.getClasses()[className]
        except KeyError:
            return None         
        
    
    def getClassPath(self):
        """ Returns the full path to the JavaScript classes """
        return self.classPath

    def getAssetPath(self):
        """ Returns the full path to the assets (images, stylesheets, etc.) """
        return self.assetPath

    def getTranslationPath(self):
        """ Returns the full path to the translation files (gettext *.po files) """
        return self.translationPath


    def getClasses(self):
        """ Returns all project JavaScript classes """
        try:
            return self.classes
            
        except AttributeError:
            classPath = self.classPath
            classes = {}
            
            if classPath and os.path.exists(classPath):
                for dirPath, dirNames, fileNames in os.walk(classPath):
                    for dirName in dirNames:
                        if dirName in self.__dirFilter:
                            dirNames.remove(dirName)

                    for fileName in fileNames:
                        if fileName.endswith(".js") and fileName[0] != ".":
                            classObj = Class(os.path.join(dirPath, fileName), self)
                            className = classObj.getName()
                            
                            if className in classes:
                                raise Exception("Class duplication detected: %s and %s" % (classObj.getPath(), classes[className].getPath()))
                                
                            classes[className] = classObj
                
            logging.info("Project %s contains %s classes", self.__name, len(classes))
            self.classes = classes
            return classes


    def getAssets(self):
        """ Returns all project asssets (images, stylesheets, etc.) """
        try:
            return self.assets
            
        except AttributeError:
            assetPath = self.assetPath
            assets = {}
            package = self.__package

            if assetPath and os.path.exists(assetPath):
                assetPathLen = len(assetPath) + 1
                for dirPath, dirNames, fileNames in os.walk(assetPath):
                    for dirName in dirNames:
                        if dirName in self.__dirFilter:
                            dirNames.remove(dirName)

                    for fileName in fileNames:
                        if fileName in ("manifest.json", "generate.py", "cache"):
                            continue
                            
                        if fileName[0] == "." or fileName.endswith((".js", ".txt", ".md")):
                            continue

                        filePath = os.path.join(dirPath, fileName)
                        relPath = filePath[assetPathLen:]
                        
                        # Support for pre-fixed package which is not used in filesystem, but in assets
                        if package:
                            name = "%s%s%s" % (package, os.sep, relPath)
                        else:
                            name = relPath
                            
                        # always using unix paths for the asset ID
                        assets[name.replace(os.sep, "/")] = filePath
                    
            logging.info("Project %s contains %s assets", self.__name, len(assets))
            self.assets = assets
            return assets


    def getTranslations(self):
        """ Returns all translation files (gettext *.po files)"""
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
        
        