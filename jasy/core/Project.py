#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os, re

import jasy.core.Cache
import jasy.core.Config as Config
import jasy.core.File as File
import jasy.core.Console as Console
import jasy.core.Util as Util

import jasy.vcs.Repository as Repository

import jasy.item.Abstract
import jasy.item.Doc
import jasy.item.Translation
import jasy.item.Class
import jasy.item.Asset

from jasy import UserError


__all__ = ["Project", "getProjectFromPath", "getProjectDependencies"]


classExtensions = (".js")
# Gettext .po files + ICU formats (http://userguide.icu-project.org/locale/localizing) (all formats but without .java support)
translationExtensions = (".po", ".xlf", ".properties", ".txt")
docFiles = ("package.md", "readme.md")
repositoryFolder = re.compile(r"^([a-zA-Z0-9\.\ _-]+)-([a-f0-9]{40})$")


projects = {}


def getProjectFromPath(path, config=None, version=None):
    global projects
    
    if not path in projects:
        projects[path] = Project(path, config, version)

    return projects[path]


def getProjectDependencies(project, checkoutDirectory="external", updateRepositories=True):
    """ Returns a sorted list of projects depending on the given project (including the given one) """

    def __resolve(project):

        name = project.getName()

        # List of required projects
        Console.info("Getting requirements of %s...", Console.colorize(name, "bold"))
        Console.indent()
        requires = project.getRequires(checkoutDirectory, updateRepositories)
        Console.outdent()

        if not requires:
            return

        Console.debug("Processing %s requirements...", len(requires))
        Console.indent()

        # Adding all project in reverse order.
        # Adding all local ones first before going down to their requirements
        for requiredProject in reversed(requires):
            requiredName = requiredProject.getName()
            if not requiredName in names:
                Console.debug("Adding: %s %s (via %s)", requiredName, requiredProject.version, project.getName())
                names[requiredName] = True
                result.append(requiredProject)
            else:
                Console.debug("Blocking: %s %s (via %s)", requiredName, requiredProject.version, project.getName())

        # Process all requirements of added projects
        for requiredProject in requires:
            if requiredProject.hasRequires():
                __resolve(requiredProject)

        Console.outdent()

    result = [project]
    names = {
        project.getName() : True
    }

    __resolve(project)

    return result



def getProjectNameFromPath(path):
    name = os.path.basename(path)

    # Remove folder SHA1 postfix when cloned via git etc.
    clone = repositoryFolder.match(name)
    if clone is not None:
        name = clone.group(1)

    # Slashes are often used as a separator to optional data
    if "-" in name:
        name = name[:name.rindex("-")]

    return name


class Project():
    
    kind = "none"
    scanned = False


    def __init__(self, path, config=None, version=None):
        """
        Constructor call of the project. 

        - First param is the path of the project relative to the current working directory.
        - Config can be read from jasyproject.json or using constructor parameter @config
        - Parent is used for structural debug messages (dependency trees)
        """
        
        if not os.path.isdir(path):
            raise UserError("Invalid project path: %s" % path)
        
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
        self.__config = Config.Config(config)
        self.__config.loadValues(os.path.join(self.__path, "jasyproject"), optional=True)

        # Initialize cache
        try:
            File.mkdir(os.path.join(self.__path, ".jasy"))
            self.__cache = jasy.core.Cache.Cache(self.__path, filename=".jasy/cache")
        except IOError as err:
            raise UserError("Could not initialize project. Cache file in %s could not be initialized! %s" % (self.__path, err))
        
        # Detect version changes
        if version is None:
            self.__modified = True
        else:
            cachedVersion = self.__cache.read("project[version]")
            self.__modified = cachedVersion != version
            self.__cache.store("project[version]", version)

        # Read name from manifest or use the basename of the project's path
        self.__name = self.__config.get("name", getProjectNameFromPath(self.__path))
            
        # Read requires
        self.__requires = self.__config.get("requires", {})
        
        # Defined whenever no package is defined and classes/assets are not stored in the toplevel structure.
        self.__package = self.__config.get("package", self.__name if self.__config.has("name") else None)

        # Read fields (for injecting data into the project and build permutations)
        self.__fields = self.__config.get("fields", {})

        # Read setup for running command pre-scan
        self.__setup = self.__config.get("setup")



    #
    # Project Scan/Init
    #

    def scan(self):

        if self.scanned:
            return

        updatemsg = "[updated]" if self.__modified else "[cached]"
        Console.info("Scanning project %s %s...", self.__name, Console.colorize(updatemsg, "grey"))
        Console.indent()

        # Support for pre-initialize projects...
        setup = self.__setup
        if setup and self.__modified:
            Console.info("Running setup...")
            Console.indent()

            for cmd in setup:
                Console.info("Executing %s...", cmd)

                result = None
                try:
                    result = None
                    result = Util.executeCommand(cmd, "Failed to execute setup command %s" % cmd, path=self.__path)
                except Exception as ex:
                    if result:
                        Console.error(result)

                    raise UserError("Could not scan project %s: %s" % (self.__name, ex))

            Console.outdent()
        
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

        # Print out
        if summary:
            Console.info("Done %s: %s" % (Console.colorize("[%s]" % self.kind, "grey"), Console.colorize(", ".join(summary), "green")))
        else:
            Console.error("Project is empty!")

        self.scanned = True

        Console.outdent()




    #
    # FILE SYSTEM INDEXER
    #
    
    def __hasDir(self, directory):
        full = os.path.join(self.__path, directory)
        if os.path.exists(full):
            if not os.path.isdir(full):
                raise UserError("Expecting %s to be a directory: %s" % full)
            
            return True
        
        return False
        
        
    def __addContent(self, content):
        Console.debug("Adding manual content")
        
        Console.indent()
        for fileId in content:
            fileContent = content[fileId]
            if len(fileContent) == 0:
                raise UserError("Empty content!")
                
            # If the user defines a file extension for JS public idenfiers 
            # (which is not required) we filter them out
            if fileId.endswith(".js"):
                raise UserError("JavaScript files should define the exported name, not a file name: %s" % fileId)

            fileExtension = os.path.splitext(fileContent[0])[1]
            
            # Support for joining text content
            if len(fileContent) == 1:
                filePath = os.path.join(self.__path, fileContent[0])
            else:
                filePath = [os.path.join(self.__path, filePart) for filePart in fileContent]
            
            # Structure files
            if fileExtension in classExtensions:
                construct = jasy.item.Class.ClassItem
                dist = self.classes
            elif fileExtension in translationExtensions:
                construct = jasy.item.Translation.TranslationItem
                dist = self.translations
            else:
                construct = jasy.item.Asset.AssetItem
                dist = self.assets
                
            # Check for duplication
            if fileId in dist:
                raise UserError("Item ID was registered before: %s" % fileId)
            
            # Create instance
            item = construct(self, fileId).attach(filePath)
            Console.debug("Registering %s %s" % (item.kind, fileId))
            dist[fileId] = item
            
        Console.outdent()
        
        
    def __addDir(self, directory, distname):
        
        Console.debug("Scanning directory: %s" % directory)
        Console.indent()
        
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
        
        Console.outdent()


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
            construct = jasy.item.Class.ClassItem
            dist = self.classes
        elif fileExtension in translationExtensions and distname == "translations":
            fileId += os.path.splitext(relPath)[0]
            construct = jasy.item.Translation.TranslationItem
            dist = self.translations
        elif fileName in docFiles:
            fileId += os.path.dirname(relPath)
            fileId = fileId.strip("/") # edge case when top level directory
            construct = jasy.item.Doc.DocItem
            dist = self.docs
        else:
            fileId += relPath
            construct = jasy.item.Asset.AssetItem
            dist = self.assets

        # Only assets keep unix style paths identifiers
        if construct != jasy.item.Asset.AssetItem:
            fileId = fileId.replace("/", ".")

        # Check for duplication
        if fileId in dist and not override:
            raise UserError("Item ID was registered before: %s" % fileId)

        # Create instance
        item = construct(self, fileId).attach(fullPath)
        Console.debug("Registering %s %s" % (item.kind, fileId))
        dist[fileId] = item
        
        
    

    #
    # ESSENTIALS
    #

    def hasRequires(self):
        return len(self.__requires) > 0

    
    def getRequires(self, checkoutDirectory="external", updateRepositories=True):
        """
        Return the project requirements as project instances
        """

        global projects
        
        result = []
        
        for entry in self.__requires:
            
            if type(entry) is dict:
                source = entry["source"]
                config = Util.getKey(entry, "config")
                version = Util.getKey(entry, "version")
                kind = Util.getKey(entry, "kind")
            else:
                source = entry
                config = None
                version = None
                kind = None

            # Versions are expected being string type
            if version is not None:
                version = str(version)

            revision = None
            
            if Repository.isUrl(source):
                kind = kind or Repository.getType(source)
                path = os.path.abspath(os.path.join(checkoutDirectory, Repository.getTargetFolder(source, version)))
                
                # Only clone and update when the folder is unique in this session
                # This reduces git/hg/svn calls which are typically quite expensive
                if not path in projects:
                    revision = Repository.update(source, version, path, updateRepositories)
                    if revision is None:
                        raise UserError("Could not update repository %s" % source)
            
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
        
        Console.info("Clearing cache of %s..." % self.__name)
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

        if not self.scanned:
            self.scan()

        return self.docs

    def getClasses(self):
        """ Returns all project JavaScript classes. Requires all files to have a "js" extension. """

        if not self.scanned:
            self.scan()

        return self.classes

    def getAssets(self):
        """ Returns all project asssets (images, stylesheets, static data, etc.). """

        if not self.scanned:
            self.scan()

        return self.assets

    def getTranslations(self):
        """ Returns all translation objects """

        if not self.scanned:
            self.scan()

        return self.translations

        