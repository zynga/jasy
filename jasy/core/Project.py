#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os, json, re

from jasy.core.Cache import Cache
from jasy.core.Repository import cloneGit, isGitRepositoryUrl
from jasy.core.Error import JasyError
from jasy.core.Util import getKey
from jasy.core.Logging import *

# Item types
from jasy.core.Item import Item
from jasy.core.Doc import Doc
from jasy.js.Class import Class
from jasy.asset.Asset import Asset


__all__ = ["Project", "getProjectFromPath", "getProjectByName", "getProjectDependencies"]


classExtensions = (".js")
translationExtensions = (".po")
docFiles = ("package.md", "readme.md")
repositoryFolder = re.compile(r"^([a-zA-Z0-9\.\ _-]+)-([a-f0-9]{40})$")


__projects = {}


def getProjectFromPath(path, config=None, version=None, repo=None, revision=None):
    global __projects
    
    if not path in __projects:
        __projects[path] = Project(path, config, version, repo, revision)

    return __projects[path]
    
    
def getProjectByName(name):
    """ Returns a project by its name """
    for path in __projects:
        project = __projects[path]
        if project.getName() == name:
            return project
    
    return None


def getProjectDependencies(project):
    """ Returns a sorted list of projects depending on the given project (including the given one) """
    
    def __resolve(project, force=False):

        if project.getName() in names and not force:
            return

        names[project.getName()] = project
        todo = []

        for require in project.getRequires():
            if not require.getName() in names:
                names[require.getName()] = project
                todo.append(require)

        for require in todo:
            __resolve(require, True)

        result.append(project)
        
    result= []
    names = {}

    info("Detecting dependencies of project %s", project.getName())
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
    
    def __init__(self, path, config=None, version=None, repo=None, revision=None):
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
        self.__version = version
        self.__repo = repo
        self.__revision = revision
        
        # Intialize item registries
        self.classes = {}
        self.assets = {}        
        self.docs = {}
        self.translations = {}

        # Load project configuration
        configFilePath = os.path.join(self.__path, "jasyproject.json")
        isJasyProject = os.path.exists(configFilePath)
        if isJasyProject:
            try:
                storedConfig = json.load(open(configFilePath))
            except ValueError as err:
                raise JasyError("Could not parse jasyproject.json at %s: %s" % (configFilePath, err))
                
            if config:
                for key in storedConfig:
                    if not key in config:
                        config[key] = storedConfig[key]
            else:
                config = storedConfig
                
        if config is None:
            raise JasyError("Could not initialize project configuration in %s!" % self.__path)
            
        # Initialize cache
        try:
            self.__cache = Cache(self.__path)
        except IOError as err:
            raise JasyError("Could not initialize project. Cache file could not be initialized! %s" % err)
        
        # Read name from manifest or use the basename of the project's path
        self.__name = getKey(config, "name", getProjectNameFromPath(self.__path))
            
        # Read requires
        self.__requires = getKey(config, "requires", {})
        
        # Defined whenever no package is defined and classes/assets are not stored in the toplevel structure.
        self.__package = getKey(config, "package", self.__name if isJasyProject else None)

        # Read fields (for injecting data into the project and build permuations)
        self.__fields = getKey(config, "fields", {})

        # Store config
        self.__config = config
        
        # This section is a must for non jasy projects
        if not "content" in config and not isJasyProject:
            raise JasyError("Missing 'content' section for compat project!")


    #
    # Project Scan/Init
    #
    
    def init(self):
        
        config = self.__config
            
        # Processing custom content section. Only supports classes and assets.
        if "content" in config:
            self.__kind = "manual"
            self.__addContent(config["content"])

        # Application projects
        elif self.__hasDir("source"):
            self.__kind = "application"

            if self.__hasDir("source/class"):
                self.__addDir("source/class", "classes")
            if self.__hasDir("source/asset"):
                self.__addDir("source/asset", "assets")
            if self.__hasDir("source/translation"):
                self.__addDir("source/translation", "translations")
                
        # Compat - please change to class/style/asset instead
        elif self.__hasDir("src"):
            self.__kind = "resource"
            self.__addDir("src", "classes")

        # Resource projects
        else:
            self.__kind = "resource"

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

        if summary:
            msg = "%s " % colorize(self.getName(), "bold")
            
            if self.__version:
                msg += "@ %s" % colorize(self.__version, "magenta")

                rev = self.__revision
                if rev is not None:
                    if type(rev) is str and len(rev) > 10:
                        rev = rev[:6]
                    msg += colorize("-%s " % rev, "grey")
                    
                else:
                    msg += " "
                    
            msg += "[%s]: %s" % (colorize(self.__kind, "cyan"), colorize(", ".join(summary), "grey"))
            
            info(msg)
                
        else:
            error("Project %s is empty!", self.getName())





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

        result = []
        
        for entry in self.__requires:
            repo = None
            revision = None
            
            if type(entry) is dict:
                source = entry["source"]
                config = getKey(entry, "config")
                version = getKey(entry, "version")
            else:
                source = entry
                config = None
                version = None
            
            if version:
                info("Processing: %s @ %s", source, version)
            else:
                info("Processing: %s", source)
                
            indent()
            
            if isGitRepositoryUrl(source):
                if not version:
                    version = "master"

                # Auto cloning always happens relative to main project root folder (not to project requiring it)
                retval = cloneGit(source, version, prefix=prefix)
                if not retval:
                    raise JasyError("Could not clone GIT repository %s" % source)
                    
                path, revision = retval
                path = os.path.abspath(path)
                repo = "git"
                
            else:
                if not source.startswith(("/", "~")):
                    path = os.path.join(self.__path, source)
                else:
                    path = source
                
                # Other references to requires projects are always relative to the project requiring it
                path = os.path.normpath(os.path.expanduser(path))
                repo = "local"
                
            project = getProjectFromPath(path, config, version, repo, revision)
            result.append(project)
            
            outdent()
            
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

        