#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os, json, re

from jasy.core.Cache import Cache
from jasy.core.Repository import isRepository, getRepositoryType, getRepositoryFolder, updateRepository
from jasy.core.Error import JasyError
from jasy.core.Util import getKey
from jasy.core.Logging import *
from jasy.env.Config import Config
from jasy.env.State import setPermutation, header, loadLibrary

# Item types
from jasy.core.Item import Item
from jasy.core.Doc import Doc
from jasy.js.Class import Class
from jasy.asset.Asset import Asset


__all__ = ["Project", "getProjectFromPath", "getProjectDependencies"]


classExtensions = (".js")
translationExtensions = (".po")
docFiles = ("package.md", "readme.md")
repositoryFolder = re.compile(r"^([a-zA-Z0-9\.\ _-]+)-([a-f0-9]{40})$")


projects = {}


def getProjectFromPath(path, config=None, version=None):
    global projects
    
    if not path in projects:
        projects[path] = Project(path, config, version)

    return projects[path]
    
    
def getProjectDependencies(project):
    """ Returns a sorted list of projects depending on the given project (including the given one) """
    
    def __resolve(project):

        name = project.getName()

        if name in names:
            debug("Ignore already known project %s", name)
            return

        names[name] = project
        result.insert(0, project)

        if project.version:
            info("Processing %s @ %s", colorize(name, "bold"), colorize(project.version, "magenta"))
        else:
            info("Processing %s", colorize(name, "bold"))

        indent()
        requires = project.getRequires()

        for require in reversed(requires):
            __resolve(require)

        outdent()

    result= []
    names = {}
    
    info("Detecting dependencies...")
    indent()

    __resolve(project)
    
    outdent()

    return result


def getProjectNameFromPath(path):
    basename = os.path.basename(path)

    clone = repositoryFolder.match(basename)
    if clone is not None:
        return clone.group(1)
    else:
        return basename


class Project():
    
    kind = "none"
    
    def __init__(self, path, config=None, version=None):
        """
        Constructor call of the project. 

        - First param is the path of the project relative to the current working directory.
        - Config can be read from jasyproject.json or using constructor parameter @config
        - Parent is used for structural debug messages (dependency trees)
        """
        
        if not os.path.isdir(path):
            raise JasyError("Invalid project path: %s" % path)
        
        # Only store and work with full path
        self.__path = os.path.abspath(os.path.expanduser(path))
        
        # Store given params
        self.version = version
        
        # Intialize item registries
        self.classes = {}
        self.assets = {}        
        self.docs = {}
        self.translations = {}

        # Load project configuration
        self.__config = Config(config)
        self.__config.loadValues(os.path.join(self.__path, "jasyproject"), optional=True)

        # Initialize cache
        try:
            self.__cache = Cache(self.__path)
        except IOError as err:
            raise JasyError("Could not initialize project. Cache file in %s could not be initialized! %s" % (self.__path, err))
        
        # Read name from manifest or use the basename of the project's path
        self.__name = self.__config.get("name", getProjectNameFromPath(self.__path))
            
        # Read requires
        self.__requires = self.__config.get("requires", {})
        
        # Defined whenever no package is defined and classes/assets are not stored in the toplevel structure.
        self.__package = self.__config.get("package", self.__name if self.__config.has("name") else None)

        # Read fields (for injecting data into the project and build permutations)
        self.__fields = self.__config.get("fields", {})



    #
    # Project Scan/Init
    #

    def scan(self):
        
        # Processing custom content section. Only supports classes and assets.
        if self.__config.has("content"):
            self.kind = "manual"
            self.__addContent(self.__config.get("content"))

        # Application projects
        elif self.__hasDir("source"):
            self.kind = "application"

            if self.__hasDir("source/class"):
                self.__addDir("source/class", "classes")
            if self.__hasDir("source/asset"):
                self.__addDir("source/asset", "assets")
            if self.__hasDir("source/translation"):
                self.__addDir("source/translation", "translations")
                
        # Compat - please change to class/style/asset instead
        elif self.__hasDir("src"):
            self.kind = "resource"
            self.__addDir("src", "classes")

        # Resource projects
        else:
            self.kind = "resource"

            if self.__hasDir("class"):
                self.__addDir("class", "classes")
            if self.__hasDir("asset"):
                self.__addDir("asset", "assets")
            if self.__hasDir("translation"):
                self.__addDir("translation", "translations")

        # Generate summary
        summary = []
        for section in ["classes", "assets", "translations"]:
            content = getattr(self, section, None)
            if content:
                summary.append("%s %s" % (len(content), section))

        # Import library methods
        libraryPath = os.path.join(self.__path, "jasylibrary.py")
        if os.path.exists(libraryPath):
            methodNumber = loadLibrary(self.__name, libraryPath)
            summary.append("%s methods" % methodNumber)

        # Print out
        if summary:
            info("Scanned %s %s: %s" % (colorize(self.__name, "bold"), colorize("[%s]" % self.kind, "grey"), colorize(", ".join(summary), "green")))
        else:
            error("Project %s is empty!", self.__name)





    #
    # FILE SYSTEM INDEXER
    #
    
    def __hasDir(self, directory):
        full = os.path.join(self.__path, directory)
        if os.path.exists(full):
            if not os.path.isdir(full):
                raise JasyError("Expecting %s to be a directory: %s" % full)
            
            return True
        
        return False
        
        
    def __addContent(self, content):
        debug("Adding manual content")
        
        indent()
        for fileId in content:
            fileContent = content[fileId]
            if len(fileContent) == 0:
                raise JasyError("Empty content!")
                
            # If the user defines a file extension for JS public idenfiers 
            # (which is not required) we filter them out
            if fileId.endswith(".js"):
                raise JasyError("JavaScript files should define the exported name, not a file name: %s" % fileId)

            fileExtension = os.path.splitext(fileContent[0])[1]
            
            # Support for joining text content
            if len(fileContent) == 1:
                filePath = os.path.join(self.__path, fileContent[0])
            else:
                filePath = [os.path.join(self.__path, filePart) for filePart in fileContent]
            
            # Structure files
            if fileExtension in classExtensions:
                construct = Class
                dist = self.classes
            elif fileExtension in translationExtensions:
                construct = Translation
                dist = self.translations
            else:
                construct = Asset
                dist = self.assets
                
            # Check for duplication
            if fileId in dist:
                raise JasyError("Item ID was registered before: %s" % fileId)
            
            # Create instance
            item = construct(self, fileId).attach(filePath)
            debug("Registering %s %s" % (item.kind, fileId))
            dist[fileId] = item
            
        outdent()
        
        
    def __addDir(self, directory, distname):
        
        debug("Scanning directory: %s" % directory)
        indent()
        
        path = os.path.join(self.__path, directory)
        if not os.path.exists(path):
            return
            
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
                
                if fileName[0] == ".":
                    continue
                    
                relPath = os.path.normpath(os.path.join(relDirPath, fileName)).replace(os.sep, "/")
                fullPath = os.path.join(dirPath, fileName)
                
                self.addFile(relPath, fullPath, distname)
        
        outdent()


    def addFile(self, relPath, fullPath, distname, override=False):
        
        fileName = os.path.basename(relPath)
        fileExtension = os.path.splitext(fileName)[1]

        # Prepand package
        if self.__package:
            fileId = "%s/" % self.__package
        else:
            fileId = ""



        # Structure files  
        if fileExtension in classExtensions and distname == "classes":
            fileId += os.path.splitext(relPath)[0]
            construct = Class
            dist = self.classes
        elif fileExtension in translationExtensions and distname == "translations":
            fileId += os.path.splitext(relPath)[0]
            construct = Translation
            dist = self.translations
        elif fileName in docFiles:
            fileId += os.path.dirname(relPath)
            fileId = fileId.strip("/") # edge case when top level directory
            construct = Doc
            dist = self.docs
        else:
            fileId += relPath
            construct = Asset
            dist = self.assets

        # Only assets keep unix style paths identifiers
        if construct != Asset:
            fileId = fileId.replace("/", ".")

        # Check for duplication
        if fileId in dist and not override:
            raise JasyError("Item ID was registered before: %s" % fileId)

        # Create instance
        item = construct(self, fileId).attach(fullPath)
        debug("Registering %s %s" % (item.kind, fileId))
        dist[fileId] = item
        
        
    

    #
    # ESSENTIALS
    #
    
    def getRequires(self, prefix="external"):
        """
        Return the project requirements as project instances
        """

        global projects
        
        result = []
        
        for entry in self.__requires:
            
            if type(entry) is dict:
                source = entry["source"]
                config = getKey(entry, "config")
                version = getKey(entry, "version")
                kind = getKey(entry, "kind")
            else:
                source = entry
                config = None
                version = None
                kind = None

            revision = None
            
            if isRepository(source):
                kind = kind or getRepositoryType(source)
                path = os.path.abspath(os.path.join(prefix, getRepositoryFolder(source, version, kind)))
                
                # Only clone and update when the folder is unique in this session
                # This reduces git/hg/svn calls which are typically quite expensive
                if not path in projects:
                    revision = updateRepository(source, version, path)
                    if revision is None:
                        raise JasyError("Could not update repository %s" % source)
            
            else:
                kind = "local"
                if not source.startswith(("/", "~")):
                    path = os.path.join(self.__path, source)
                else:
                    path = os.path.abspath(os.path.expanduser(source))
            
            if path in projects:
                project = projects[path]
                
            else:
                fullversion = []
                
                # Produce user readable version when non is defined
                if version is None and revision is not None:
                    version = "master"
                
                if version is not None:
                    if "/" in version:
                        fullversion.append(version[version.rindex("/")+1:])
                    else:
                        fullversion.append(version)
                    
                if revision is not None:
                    # Shorten typical long revisions as used by e.g. Git
                    if type(revision) is str and len(revision) > 20:
                        fullversion.append(revision[:10])
                    else:
                        fullversion.append(revision)
                        
                if fullversion:
                    fullversion = "-".join(fullversion)
                else:
                    fullversion = None

                project = Project(path, config, fullversion)
                projects[path] = project
            
            result.append(project)
        
        return result


    def getFields(self):
        """ Return the project defined fields which may be configured by the build script """
        return self.__fields


    def getClassByName(self, className):
        """ Finds a class by its name."""

        try:
            return self.getClasses()[className]
        except KeyError:
            return None

    def getName(self):
        return self.__name
    
    def getPath(self):
        return self.__path
    
    def getPackage(self):
        return self.__package

    def getConfigValue(self, key, default=None):
        return self.__config.get(key, default)
        
    def toRelativeUrl(self, path, prefix="", subpath="source"):
        root = os.path.join(self.__path, subpath)
        relpath = os.path.relpath(path, root)

        if prefix:
            if not prefix[-1] == os.sep:
                prefix += os.sep
                
            relpath = os.path.normpath(prefix + relpath)
            
        return relpath.replace(os.sep, "/")



    #
    # CACHE API
    #
    
    def getCache(self):
        """Returns the cache instance"""
        
        return self.__cache
    
    def clean(self):
        """Clears the cache of the project"""
        
        info("Clearing cache of %s..." % self.__name)
        self.__cache.clear()
        
    def close(self):
        """Closes the project which deletes the internal caches"""
        
        if self.__cache:
            self.__cache.close()
            self.__cache = None
        
        self.classes = None
        self.assets = None
        self.docs = None
        self.translations = None
        
    def pause(self):
        """Pauses the project so that other processes could modify/access it"""
        
        self.__cache.close()
        
    def resume(self):
        """Resumes the paused project"""
        
        self.__cache.open()



    #
    # LIST ACCESSORS
    #
    
    def getDocs(self):
        """Returns all package docs"""
        return self.docs

    def getClasses(self):
        """ Returns all project JavaScript classes. Requires all files to have a "js" extension. """
        return self.classes

    def getAssets(self):
        """ Returns all project asssets (images, stylesheets, static data, etc.). """
        return self.assets

    def getTranslations(self):
        """ Returns all translation files. Supports gettext style PO files with .po extension. """
        return self.translations

        