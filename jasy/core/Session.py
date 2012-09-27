#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import itertools, time, atexit, json, os

import jasy.core.Locale
import jasy.core.Config
import jasy.core.Project
import jasy.core.Permutation

import jasy.asset.Manager
import jasy.item.Translation

from jasy import UserError
import jasy.core.Console as Console


class Session():
    """
    Manages all projects, fields, permutations, translations etc. Mainly like
    the main managment infrastructure. 
    """

    __currentPermutation = None
    __currentTranslationBundle = None
    __currentPrefix = None
    
    __timestamp = None
    __projects = None
    __fields = None
    __translationBundles = None
    __updateRepositories = True
    __scriptEnvironment = None


    #
    # Core
    #

    def __init__(self):

        atexit.register(self.close)

        self.__timestamp = time.time()

        self.__projects = []
        self.__fields = {}
        self.__translationBundles = {}
        

    def init(self, autoInitialize=True, updateRepositories=True, scriptEnvironment=None):
        """
        Initialize the actual session with projects

        :param autoInitialize: Whether the projects should be automatically added when the current folder contains a valid Jasy project.
        :param updateRepositories: Whether to update repositories of all project dependencies.
        :param scriptEnvironment: API object as being used for loadLibrary to add Python features offered by projects.
        """

        self.__scriptEnvironment = scriptEnvironment
        self.__updateRepositories = updateRepositories

        if autoInitialize and jasy.core.Config.findConfig("jasyproject"):

            try:
                self.addProject(jasy.core.Project.getProjectFromPath("."))

            except UserError as err:
                Console.outdent(True)
                Console.error(err)
                raise UserError("Critical: Could not initialize session!")

            Console.info("Active projects (%s):", len(self.__projects))
            Console.indent()

            for project in self.__projects:
                if project.version:
                    Console.info("%s @ %s", Console.colorize(project.getName(), "bold"), Console.colorize(project.version, "magenta"))
                else:
                    Console.info(Console.colorize(project.getName(), "bold"))

            Console.outdent()        

    
    def clean(self):
        """Clears all caches of all registered projects"""

        Console.info("Cleaning session...")
        Console.indent()

        for project in self.__projects:
            project.clean()

        Console.outdent()


    def close(self):
        """Closes the session and stores cache to the harddrive."""

        Console.debug("Closing session...")
        Console.indent()

        for project in self.__projects:
            project.close()
        
        self.__projects = None

        Console.outdent()
    
    
    def pause(self):
        """
        Pauses the session. This release cache files etc. and makes 
        it possible to call other jasy processes on the same projects.
        """
        
        Console.info("Pausing session...")

        for project in self.__projects:
            project.pause()


    def resume(self):
        """Resumes the session after it has been paused."""

        Console.info("Resuming session...")

        for project in self.__projects:
            project.resume()
            
    
    def getClassByName(self, className):
        """
        Queries all currently registered projects for the given class and returns the class item.
        Returns None when no matching class item was found.

        :param className: Any valid classname from any of the projects.
        :type className: str
        """

        for project in self.__projects:
            classes = project.getClasses()
            if className in classes:
                return classes[className]

        return None


    
    
    
    #
    # Project Managment
    #
        
    def addProject(self, project):
        """
        Adds the given project to the list of known projects. Projects should be added in order of
        their priority. This adds the field configuration of each project to the session fields.
        Fields must not conflict between different projects (same name).
        
        :param project: Instance of Project to append to the list
        :type project: object
        """
        
        result = jasy.core.Project.getProjectDependencies(project, "external", self.__updateRepositories)
        for project in result:
            
            # Append to session list
            self.__projects.append(project)

            # Import library methods
            libraryPath = os.path.join(project.getPath(), "jasylibrary.py")
            if os.path.exists(libraryPath):
                self.loadLibrary(project.getName(), libraryPath, doc="Library of project %s" % project.getName())

            # Import project defined fields which might be configured using "activateField()"
            fields = project.getFields()
            for name in fields:
                entry = fields[name]

                if name in self.__fields:
                    raise UserError("Field '%s' was already defined!" % (name))

                if "check" in entry:
                    check = entry["check"]
                    if check in ["Boolean", "String", "Number"] or type(check) == list:
                        pass
                    else:
                        raise UserError("Unsupported check: '%s' for field '%s'" % (check, name))
                    
                self.__fields[name] = entry



    def loadLibrary(self, objectName, fileName, encoding="utf-8", doc=None):
        """
        Creates a new object inside the user API (jasyscript.py) with the given name 
        containing all @share'd functions and fields loaded from the given file.
        """

        if objectName in self.__scriptEnvironment:
            raise UserError("Could not import library %s as the object name %s is already used." % (fileName, objectName))

        # Create internal class object for storing shared methods
        class Shared(object): pass
        exportedModule = Shared()
        exportedModule.__doc__ = doc or "Imported from %s" % os.path.relpath(fileName, os.getcwd())
        counter = 0

        # Method for being used as a decorator to share methods to the outside
        def share(func):
            nonlocal counter
            setattr(exportedModule, func.__name__, func)
            counter += 1

            return func

        # Execute given file. Using clean new global environment
        # but add additional decorator for allowing to define shared methods
        code = open(fileName, "r", encoding=encoding).read()
        exec(compile(code, os.path.abspath(fileName), "exec"), {"share" : share})

        # Export destination name as global    
        Console.debug("Importing %s shared methods under %s...", counter, objectName)
        self.__scriptEnvironment[objectName] = exportedModule

        return counter
        
        
    def getProjects(self):
        """
        Returns all currently registered projects. 
        Injects locale project when current permutation has configured a locale.
        """

        project = self.getCurrentLocaleProject()
        if project:
            return self.__projects + [project]

        return self.__projects
        
        
    def getProjectByName(self, name):
        """Returns a project by its name"""
        
        for project in self.__projects:
            if project.getName() == name:
                return project
                
        return None
        
        
    def getRelativePath(self, project):
        """Returns the relative path of any project to the main project"""
        
        mainPath = self.__projects[0].getPath()
        projectPath = project.getPath()
        
        return os.path.relpath(projectPath, mainPath)
        
        
    def getMain(self):
        """
        Returns the main project which is the first project added to the
        session and the one with the highest priority.
        """

        if self.__projects:
            return self.__projects[0]
        else:
            return None



    #
    # Support for fields
    # Fields allow to inject data from the build into the running application
    #
    
    def setLocales(self, locales, default=None):
        """
        Store locales as a special built-in field with optional default value
        """

        self.__fields["locale"] = {
            "values" : locales,
            "default" : default or locales[0],
            "detect" : "core.detect.Locale"
        }


    def setDefaultLocale(self, locale):
        """
        Sets the default locale
        """

        if not "locale" in self.__fields:
            raise UserError("Define locales first!")

        self.__fields["locale"]["default"] = locale


    def setField(self, name, value):
        """
        Statically configure the value of the given field.
        
        This field is just injected into Permutation data and used for permutations, but as
        it only holds a single value all alternatives paths are removed/ignored.
        """
        
        if not name in self.__fields:
            raise Exception("Unsupported field (not defined by any project): %s" % name)

        entry = self.__fields[name]
        
        # Replace current value with single value
        entry["values"] = [value]
        
        # Additonally set the default
        entry["default"] = value

        # Delete detection if configured by the project
        if "detect" in entry:
            del entry["detect"]


    def permutateField(self, name, values=None, detect=None, default=None):
        """
        Adds the given key/value pair to the session for permutation usage.
        
        It supports an optional test. A test is required as soon as there is
        more than one value available. The detection method and values are typically 
        already defined by the project declaring the key/value pair.
        """
        
        if not name in self.__fields:
            raise Exception("Unsupported field (not defined by any project): %s" % name)

        entry = self.__fields[name]
            
        if values:
            if type(values) != list:
                values = [values]

            entry["values"] = values

            # Verifying values from build script with value definition in project manifests
            if "check" in entry:
                check = entry["check"]
                for value in values:
                    if check == "Boolean":
                        if type(value) == bool:
                            continue
                    elif check == "String":
                        if type(value) == str:
                            continue
                    elif check == "Number":
                        if type(value) in (int, float):
                            continue
                    else:
                        if value in check:
                            continue

                    raise Exception("Unsupported value %s for %s" % (value, name))
                    
            if default is not None:
                entry["default"] = default
                    
        elif "check" in entry and entry["check"] == "Boolean":
            entry["values"] = [True, False]
            
        elif "check" in entry and type(entry["check"]) == list:
            entry["values"] = entry["check"]
            
        elif "default" in entry:
            entry["values"] = [entry["default"]]
            
        else:
            raise Exception("Could not permutate field: %s! Requires value list for non-boolean fields which have no defaults." % name)

        # Store class which is responsible for detection (overrides data from project)
        if detect:
            if not self.getClass(detect):
                raise Exception("Could not permutate field: %s! Unknown detect class %s." % detect)
                
            entry["detect"] = detect
        
        
    def getFieldDetectionClasses(self):
        """
        Returns all JavaScript classes relevant by current field setups to detect all 
        relevant values for the given fields.
        """

        result = set()

        fields = self.__fields
        for name in fields:
            value = fields[name]
            if "detect" in value:
                result.add(value["detect"])

        return result


    def exportFields(self):
        """
        Converts data from values to a compact data structure for being used to 
        compute a checksum in JavaScript.

        Export structures:
        1. [ name, 1, test, [value1, ...] ]
        2. [ name, 2, value ]
        3. [ name, 3, test, default? ]
        """

        export = []
        for key in sorted(self.__fields):
            source = self.__fields[key]
            
            content = []
            content.append("'%s'" % key)
            
            # We have available values to permutate for
            if "values" in source:
                values = source["values"]
                if "detect" in source and len(values) > 1:
                    # EXPORT STRUCT 1
                    content.append("1")
                    content.append(source["detect"])

                    if "default" in source:
                        # Make sure that default value is first in
                        values = values[:]
                        values.remove(source["default"])
                        values.insert(0, source["default"])
                    
                    content.append(json.dumps(values))
            
                else:
                    # EXPORT STRUCT 2
                    content.append("2")
                    content.append(json.dumps(values[0]))

            # Has no relevance for permutation, just insert the test
            else:
                if "detect" in source:
                    # EXPORT STRUCT 3
                    content.append("3")

                    # Add detection class
                    content.append(source["detect"])
                    
                    # Add default value if available
                    if "default" in source:
                        content.append(json.dumps(source["default"]))
                
                else:
                    # Has no detection and no permutation. Ignore it completely
                    continue
                
            export.append("[%s]" % ", ".join(content))
            
        if export:
            return "[%s]" % ", ".join(export)

        return None
    
    
    
    
    #
    # Translation Support
    #
    
    def getAvailableTranslations(self):
        """ 
        Returns a set of all available translations 
        
        This is the sum of all projects so even if only one 
        project supports "fr_FR" then it will be included here.
        """
        
        supported = set()
        for project in self.__projects:
            supported.update(project.getTranslations().keys())
            
        return supported
    
    
    def __generateTranslationBundle(self):
        """ 
        Returns a translation object for the given language containing 
        all relevant translation files for the current project set. 
        """

        language = self.getCurrentPermutation().get("locale")
        if language is None:
            return None

        if language in self.__translationBundles:
            return self.__translationBundles[language]

        Console.info("Creating translation bundle: %s", language)
        Console.indent()

        # Initialize new Translation object with no project assigned
        # This object is used to merge all seperate translation instances later on.
        combined = jasy.item.Translation.TranslationItem(None, id=language)
        relevantLanguages = self.__expandLanguage(language)

        # Loop structure is build to prefer finer language matching over project priority
        for currentLanguage in reversed(relevantLanguages):
            for project in self.__projects:
                for translation in project.getTranslations().values():
                    if translation.getLanguage() == currentLanguage:
                        Console.debug("Adding %s entries from %s @ %s...", len(translation.getTable()), currentLanguage, project.getName())
                        combined += translation

        Console.debug("Combined number of translations: %s", len(combined.getTable()))
        Console.outdent()

        self.__translationBundles[language] = combined
        return combined


    def __expandLanguage(self, language):
        """Expands the given language into a list of languages being used in priority order (highest first)"""

        # Priority Chain: 
        # de_DE => de => C (default language) => code

        all = [language]
        if "_" in language:
            all.append(language[:language.index("_")])
        all.append("C")

        return all



    #
    # State Handling / Looping
    #

    def __generatePermutations(self):
        """
        Combines all values to a set of permutations.
        These define all possible combinations of the configured settings
        """

        fields = self.__fields
        values = { key:fields[key]["values"] for key in fields if "values" in fields[key] }

        # Thanks to eumiro via http://stackoverflow.com/questions/3873654/combinations-from-dictionary-with-list-values-using-python
        names = sorted(values)
        combinations = [dict(zip(names, prod)) for prod in itertools.product(*(values[name] for name in names))]
        permutations = [jasy.core.Permutation.getPermutation(combi) for combi in combinations]

        return permutations


    def permutate(self):
        """ Generator method for permutations for improving output capabilities """
        
        Console.info("Processing permutations...")
        Console.indent()
        
        permutations = self.__generatePermutations()
        length = len(permutations)
        
        for pos, current in enumerate(permutations):
            Console.info("Permutation %s/%s:" % (pos+1, length))
            Console.indent()

            self.__currentPermutation = current
            self.__currentTranslationBundle = self.__generateTranslationBundle()
            
            yield current
            Console.outdent()

        Console.outdent()

        self.__currentPermutation = None
        self.__currentTranslationBundle = None


    def getCurrentPermutation(self):
        """Returns current permutation object (useful during looping through permutations via permutate())."""

        return self.__currentPermutation


    def resetCurrentPermutation(self):
        """Resets the current permutation object."""

        self.__currentPermutation = None


    def setStaticPermutation(self, **argv):
        """
        Sets current permutation to a static permutation which contains all values hardly wired to 
        static values using setField() or given via additional named parameters.
        """

        combi = {}

        for name in self.__fields:
            entry = self.__fields[name]
            if not "detect" in entry:
                combi[name] = entry["default"]

        for name in argv:
            combi[name] = argv[name]

        if not combi:
            self.__currentPermutation = None
            return None

        permutation = jasy.core.Permutation.getPermutation(combi)
        self.__currentPermutation = permutation

        return permutation


    def getCurrentTranslationBundle(self):
        """Returns the current translation bundle (useful during looping through permutations via permutate())."""
        
        return self.__currentTranslationBundle


    def getCurrentLocale(self):
        """Returns the current locale as defined in current permutation"""

        permutation = self.getCurrentPermutation()
        if permutation:
            locale = permutation.get("locale")
            if locale:
                return locale

        return None


    def getCurrentLocaleProject(self, update=False):
        """
        Returns a locale project for the currently configured locale. 
        Returns None if locale is not set to a valid value.
        """

        locale = self.getCurrentLocale()
        if not locale:
            return None

        path = os.path.abspath(os.path.join(".jasy", "locale", locale))
        if not os.path.exists(path) or update:
            jasy.core.Locale.LocaleParser(locale).export(path)

        return jasy.core.Project.getProjectFromPath(path)


    def setCurrentPrefix(self, path):
        """Interface for Task class to configure the current prefix to use"""

        if path is None:
            self.__currentPrefix = None
            Console.debug("Resetting prefix to working directory")
        else:
            self.__currentPrefix = os.path.normpath(os.path.abspath(os.path.expanduser(path)))
            Console.debug("Setting prefix to: %s" % self.__currentPrefix)
        

    def getCurrentPrefix(self):
        """
        Returns the current prefix which should be used to generate/copy new files 
        in the current task. This somewhat sandboxes each task automatically to mostly
        only create files in a task specific folder.
        """

        return self.__currentPrefix


    def expandFileName(self, fileName):
        """
        Replaces placeholders inside the given filename and returns the result. 
        The placeholders are based on the current state of the session.

        These are the currently supported placeholders:

        - $prefix: Current prefix of task
        - $permutation: SHA1 checksum of current permutation
        - $locale: Name of current locale e.g. de_DE
        """

        if self.__currentPrefix:
            fileName = fileName.replace("$prefix", self.__currentPrefix)

        if self.__currentPermutation:
            fileName = fileName.replace("$permutation", self.__currentPermutation.getChecksum())

            locale = self.__currentPermutation.get("locale")
            if locale:
                fileName = fileName.replace("$locale", locale)

        return fileName


