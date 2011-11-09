#
# Jasy - JavaScript Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import os, logging, json

from jasy.core.Class import Class
from jasy.core.Cache import Cache
from jasy.Error import *
        
class Project():
    def __init__(self, path):
        """
        Constructor call of the project. First param is the path of the project relative to the current working directory.
        """
        
        path = os.path.normpath(path)

        if not os.path.isdir(path):
            raise JasyError("Invalid project path: %s (Absolute: %s)" % (path, os.path.abspath(path)))
        
        # Only store and work with full path
        path = os.path.abspath(path)
        
        self.__path = path
        self.__dirFilter = [".svn", ".git", ".hg", ".bzr"]

        try:
            self.__cache = Cache(self.__path)
        except IOError as err:
            raise JasyError("Could not initialize project. Cache file could not be initialized! %s" % err)
        
        projectConfigPath = os.path.join(path, "jasyproject.json")
        if not os.path.exists(projectConfigPath):
            raise JasyError("Missing jasyproject.json at: %s" % projectConfigPath)
        
        try:
            projectData = json.load(open(projectConfigPath))
        except ValueError as err:
            raise JasyError("Could not parse jasyproject.json at %s: %s" % (projectConfigPath, err))
        
        # Read name from manifest or use the basename of the project's path
        if "name" in projectData:
            self.__name = projectData["name"]
        else:
            self.__name = os.path.basename(path)
            
        # Detect kind automatically
        if "kind" in projectData:
            self.__kind = projectData["kind"]
        elif os.path.isdir(os.path.join(self.__path, "source", "class")):
            self.__kind = "full"
        elif os.path.isdir(os.path.join(self.__path, "class")):
            self.__kind = "basic"
        elif os.path.isdir(os.path.join(self.__path, "src")):
            self.__kind = "classic"
        else:
            self.__kind = "flat"
                
        # Defined whenever no package is defined and classes/assets are not stored in the toplevel structure.
        if "package" in projectData:
            self.__package = projectData["package"]
        else:
            self.__package = self.__name
        
        # Whether we need to parse files for get their correct name (using @name attributes)
        if "fuzzy" in projectData:
            self.__fuzzy = projectData["fuzzy"]
        else:
            self.__fuzzy = False
            
        # Read fields (for injecting data into the project and build permuations)
        if "fields" in projectData:
            self.__fields = projectData["fields"]
        else:
            self.__fields = {}

        logging.info("Initialized project %s (%s)" % (self.__name, self.__kind))

        # Do kind specific intialization
        if self.__kind == "full":
            self.__classPath = os.path.join("source", "class")
            self.__assetPath = os.path.join("source", "asset")
            self.__translationPath = os.path.join("source", "translation")
        elif self.__kind == "basic":
            self.__classPath = "class"
            self.__assetPath = "asset"
            self.__translationPath = "translation"
        elif self.__kind == "classic":
            self.__classPath = "src"
            self.__assetPath = "src"
            self.__translationPath = None
        elif self.__kind == "flat":
            self.__classPath = ""
            self.__assetPath = ""
            self.__translationPath = None
        else:
            raise JasyError("Unsupported kind of project: %s" % self.__kind)
    
    
    def __str__(self):
        return self.__path

    
    def getName(self):
        return self.__name

    
    def getPath(self):
        return self.__path

    
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
        
    
    def getClassPath(self, relative=False):
        """ Returns the full path to the JavaScript classes """

        if self.__classPath is None:
            return None

        return self.__classPath if relative else os.path.join(self.__path, self.__classPath)

    def getAssetPath(self, relative=False):
        """ Returns the full path to the assets (images, stylesheets, etc.) """

        if self.__assetPath is None:
            return None

        return self.__assetPath if relative else os.path.join(self.__path, self.__assetPath)

    def getTranslationPath(self, relative=False):
        """ Returns the full path to the translation files (gettext *.po files) """
        
        if self.__translationPath is None:
            return None
        
        return self.__translationPath if relative else os.path.join(self.__path, self.__translationPath)


    def getClasses(self):
        """ Returns all project JavaScript classes """
        
        if self.__classPath is None:
            return None
        
        try:
            return self.classes
            
        except AttributeError:
            classPath = os.path.join(self.__path, self.__classPath)
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
                
            logging.debug("Project %s contains %s classes", self.__name, len(classes))
            self.classes = classes
            return classes


    def getAssets(self):
        """ Returns all project asssets (images, stylesheets, etc.) """
        
        if self.__assetPath is None:
            return None
        
        try:
            return self.assets
            
        except AttributeError:
            assetPath = os.path.join(self.__path, self.__assetPath)
            assets = {}
            package = self.__package

            if assetPath and os.path.exists(assetPath):
                assetPathLen = len(assetPath) + 1
                for dirPath, dirNames, fileNames in os.walk(assetPath):
                    for dirName in dirNames:
                        if dirName in self.__dirFilter:
                            dirNames.remove(dirName)

                    for fileName in fileNames:
                        # Exclude internally managed files
                        if fileName in ("jasyproject.json", "jasyscript.py", "cache", "cache.db"):
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
                    
            logging.debug("Project %s contains %s assets", self.__name, len(assets))
            self.assets = assets
            return assets


    def getTranslations(self):
        """ Returns all translation files (gettext *.po files)"""
        
        if self.__translationPath is None:
            return None
        
        try:
            return self.translations
            
        except AttributeError:
            translationPath = os.path.join(self.__path, self.__translationPath)
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
            
            logging.debug("Project %s contains %s translations", self.__name, len(translations))
            self.translations = translations
            return translations
        
        