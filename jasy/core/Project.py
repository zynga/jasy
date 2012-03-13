#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os, logging, json

from jasy.core.Item import Item
from jasy.js.Class import Class

from jasy.core.Cache import Cache
from jasy.core.Error import *
from jasy.core.Markdown import *

__all__ = ["Project"]


extensions = {
    # Asset items
    ".jpg" : "assets",
    ".jpeg" : "assets",
    ".png" : "assets",
    ".gif" : "assets",
    ".json" : "assets",
    ".html" : "assets",
    ".txt" : "assets",
    ".css" : "assets",
    ".manifest" : "assets",

    # Processed items
    ".js" : "classes",
    ".sass" : "styles",
    ".scss" : "styles",
    ".less" : "styles",
    ".tmpl" : "templates",
    ".po": "translations"
}



def getKey(data, key, default=None):
    if key in data:
        return data[key]
    else:
        return default






def getProjectLevel(project):
    level = 0
    current = project.getParent()
    while current:
        level += 1
        current = project.getParent()
        
    return level



class Project():
    
    def __init__(self, path, config=None, parent=None):
        """
        Constructor call of the project. 

        - First param is the path of the project relative to the current working directory.
        - Config can be read from jasyproject.json or using constructor parameter @config
        - Parent is used for structural debug messages (dependency trees)
        """
        
        if not os.path.isdir(path):
            raise JasyError("Invalid project path: %s (absolute: %s)" % (path, os.path.abspath(path)))
        
        # Only store and work with full path
        self.__path = os.path.abspath(path)
        self.__parent = parent
        
        # Intialize item registries
        self.classes = {}
        self.styles = {}
        self.templates = {}
        self.translations = {}
        self.pkgdocs = {}
        self.assets = {}        

        # Load project configuration
        if not config:
            configFile = os.path.join(self.__path, "jasyproject.json")
            if not os.path.exists(configFile):
                raise JasyError("Missing jasyproject.json at: %s. Otherwise define a config via constructor." % configFile)
            
            try:
                config = json.load(open(configFile))
            except ValueError as err:
                raise JasyError("Could not parse jasyproject.json at %s: %s" % (configFile, err))
            
        # Initialize cache
        try:
            self.__cache = Cache(self.__path)
        except IOError as err:
            raise JasyError("Could not initialize project. Cache file could not be initialized! %s" % err)
        
        # Read name from manifest or use the basename of the project's path
        self.__name = getKey(config, "name", os.path.basename(self.__path))
            
        # Defined whenever no package is defined and classes/assets are not stored in the toplevel structure.
        self.__package = getKey(config, "package", self.__name)

        # Whether we need to parse files for get their correct name (using @name attributes)
        self.__fuzzy = getKey(config, "fuzzy", False)

        # Read fields (for injecting data into the project and build permuations)
        self.__fields = getKey(config, "fields", {})
        
        
        self.__level = getProjectLevel(self)
        
        logging.info("%s- Adding project %s" % (self.__level*"  ", self.__name))
        

        # Contains project name folder, like QUnit
        if self.hasDir(self.__name):
            pass
        
        # Application/Game projects
        elif self.hasDir("source"):
            if self.hasDir("source/class"):
                self.addDir("source/class")

            if self.hasDir("source/asset"):
                self.addDir("source/asset", lambda id, path, dist: dist==self.assets)
            
            if self.hasDir("source/translation"):
                self.addDir("source/translation")

        # Simple projects
        elif self.hasDir("src"):
            self.addDir("src")
        
        # Like Darwin
        elif self.hasDir("class"):
            self.addDir("class")

        # Like Hogan, Ender, 
        elif self.hasDir("lib"):
            pass
            



        
    def hasDir(self, directory):
        full = os.path.join(self.__path, directory)
        if os.path.exists(full):
            if not os.path.isdir(full):
                raise JasyError("Expecting %s to be a directory: %s" % full)
            
            return True
        
        return False
        
        
    def addDir(self, directory, check=None):
        
        path = os.path.join(self.__path, directory)

        if not os.path.exists(path):
            return result

        for dirPath, dirNames, fileNames in os.walk(path):
            for dirName in dirNames:
                # Filter dotted directories like .git, .bzr, .hg, .svn, etc.
                if dirName.startswith("."):
                    dirNames.remove(dirName)

                # Filter sub projects
                if os.path.exists(os.path.join(dirPath, dirName, "jasyproject.json")):
                    dirNames.remove(dirName)

            relDirPath = os.path.relpath(dirPath, path)

            for fileName in fileNames:
                fullPath = os.path.join(dirPath, fileName)
                relPath = os.path.join(relDirPath, fileName)

                # Filter dotted hidden files
                if fileName[0] == ".":
                    continue

                # Filter minified CSS/JS files
                if fileName.endswith(("-min.js", "-min.css")):
                    continue
                    
                fileSplits = os.path.splitext(fileName)
                fileBase = fileSplits[0]
                fileExtension = fileSplits[1]

                # Filter temporary files
                if fileExtension == ".tmp":
                    continue

                # Filter internal files
                if fileBase in ("jasyproject", "jasycache"):
                    continue

                # Generating file ID from relative path
                
                if fileName == "package.md":
                    fileId = os.path.dirname(relPath)
                elif fileExtension in (".js", ".tmpl", ".css", ".md", ".po"):
                    fileId = os.path.splitext(relPath)[0]
                else:
                    fileId = relPath
                    
                fileId = fileId.replace(os.sep, ".")

                if fileExtension == ".js":
                    item = Class(self, fileId).attach(fullPath)
                else:
                    item = Item(self, fileId).attach(fullPath)

                distname = None
                if fileExtension in extensions:
                    distname = extensions[fileExtension]
                    
                # Special named package.md files are used as package docs
                if fileName == "package.md":
                    distname = "pkgdocs"
                    
                if not distname:
                    logging.debug("Ignoring unsupported file extension: %s in %s", fileExtension, relPath)
                    continue

                # Get storage dict
                dist = getattr(self, distname)
                    
                print("ADD: %s (%s) => %s" % (fileId, item.kind, distname))
                    
                if check and not check(fileId, filePath, dist):
                    continue
                    
                if fileId in dist:
                    raise Exception("Item ID was registered before: %s" % fileId)
                    
                dist[fileId] = item
                
        

    def __str__(self):
        return self.__path
        
        
    def getParent(self):
        return self.__parent
        
    
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
        """
        Return the project defined fields which may be configured by the build script
        """
        
        return self.__fields
        
        
    def getClassByName(self, className):
        """
        Finds a class by its name.
        """
        
        try:
            return self.getClasses()[className]
        except KeyError:
            return None         
        
    
    def getClasses(self):
        """ Returns all project JavaScript classes. Requires all files to have a "js" extension. """
        return self.classes
            
            
    def getDocs(self):
        """ Returns all project doc files for JavaScript packages. Requires all files to have a "md" extension. """
        return self.pkgdocs
        
        # if fileName in ("package.md", "readme.md"):
        #     filePath = os.path.join(dirPath, fileName)
        #     relPath = filePath[classPathLen:]
        #     
        #     # Support for pre-fixed package which is not used in filesystem, but in assets
        #     if package:
        #         name = "%s%s%s" % (package, os.sep, relPath)
        #     else:
        #         name = relPath
        # 
        #     # always using dot syntax for the pkgdocs
        #     pkgdocs[name.replace(os.sep, ".")[:-len(fileName)-1]] = markdown(open(filePath).read())
            


    def getAssets(self):
        """ 
        Returns all project asssets (images, stylesheets, static data, etc.). Does not filter
        for specific extensions but ignores files starting with a dot or files used internally
        by Jasy like cache files or project configuration.
        """
        return self.assets



    def getTranslations(self):
        """ 
        Returns all translation files. Currently supports only gettext style PO files
        with a "po" extension.
        """
        return self.translations
        
        