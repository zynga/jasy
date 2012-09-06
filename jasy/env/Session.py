#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import itertools, time, atexit, json, os

from jasy.item.Translation import Translation
from jasy.i18n.LocaleData import *

from jasy.core.Json import toJson
from jasy.core.Project import Project, getProjectFromPath, getProjectDependencies
from jasy.core.Permutation import Permutation
from jasy.core.Config import findConfig

from jasy.core.Error import JasyError
from jasy.env.State import getPermutation, setPermutation, setTranslation, header
from jasy.core.Json import toJson
from jasy.core.Logging import *

__all__ = ["Session"]


class Session():

    #
    # Core
    #

    def __init__(self):
        atexit.register(self.close)

        self.__timestamp = time.time()
        self.__projects = []
        self.__projectByName = {}
        self.__fields = {}
        
        if findConfig("jasyproject"):

            header("Initializing project")

            try:
                self.addProject(getProjectFromPath("."))
            except JasyError as err:
                outdent(True)
                error(err)
                raise JasyError("Critical: Could not initialize session!")
    
    
    def clean(self):
        """Clears all caches of known projects"""

        header("Cleaning session...")
        
        for project in self.__projects:
            project.clean()


    def close(self):
        """Closes the session and stores cache to the harddrive."""

        debug("Closing session...")
        for project in self.__projects:
            project.close()
        
        self.__projects = None
    
    
    def pause(self):
        """Pauses the session"""
        
        for project in self.__projects:
            project.pause()
    
    
    def resume(self):
        """Resumes the session"""

        for project in self.__projects:
            project.resume()
            
    
    def getClassByName(self, className):
        """Queries all currently known projects for the given class and returns the class object"""

        for project in self.__projects:
            classes = project.getClasses()
            if className in classes:
                return classes[className]
    
    
    
    
    #
    # Project Managment
    #
        
    def addProject(self, project):
        """
        Adds the given project to the list of known projects. Projects should be added in order of
        their priority. This adds the field configuration of each project to the session fields.
        Fields must not conflict between different projects (same name).
        
        Parameters:
        - project: Instance of Project to append to the list
        """
        
        result = getProjectDependencies(project)
        
        info("Initializing projects...")
        indent()
        
        for project in result:
            
            # Scan project
            project.scan()
            
            # Append to session list
            self.__projects.append(project)
            
            # Import project defined fields which might be configured using "activateField()"
            fields = project.getFields()
            for name in fields:
                entry = fields[name]

                if name in self.__fields:
                    raise JasyError("Field '%s' was already defined!" % (name))

                if "check" in entry:
                    check = entry["check"]
                    if check in ["Boolean", "String", "Number"] or type(check) == list:
                        pass
                    else:
                        raise JasyError("Unsupported check: '%s' for field '%s'" % (check, name))
                    
                if "detect" in entry:
                    detect = entry["detect"]
                    if not self.getClassByName(detect):
                        raise JasyError("Field '%s' uses unknown detection class %s." % (name, detect))
                
                self.__fields[name] = entry
                
        outdent()
        
        
    def getProjects(self):
        """
        Returns all currently known and active projects. 
        Injects locale project by current permutation value.
        """

        project = self.getLocaleProject()
        if project:
            return self.__projects + [project]

        return self.__projects
        
        
    def getProjectByName(self, name):
        """Returns a project as used by the session by its name"""
        
        for project in self.__projects:
            if project.getName() == name:
                return project
                
        return None
        
        
    def getRelativePath(self, project):
        """Returns the relative path of any project to the main project"""
        
        mainPath = self.__projects[-1].getPath()
        projectPath = project.getPath()
        
        return os.path.relpath(projectPath, mainPath)
        
        
    def getMain(self):
        if self.__projects:
            return self.__projects[-1]
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
            raise JasyError("Define locales first!")

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
        
        
    def getPermutations(self):
        """
        Combines all values to a set of permutations.
        These define all possible combinations of the configured settings
        """

        fields = self.__fields
        values = { key:fields[key]["values"] for key in fields if "values" in fields[key] }

        # Thanks to eumiro via http://stackoverflow.com/questions/3873654/combinations-from-dictionary-with-list-values-using-python
        names = sorted(values)
        combinations = [dict(zip(names, prod)) for prod in itertools.product(*(values[name] for name in names))]
        permutations = [Permutation(combi) for combi in combinations]

        return permutations


    def permutate(self):
        """ Generator method for permutations for improving output capabilities """
        
        header("Processing permutations...")
        
        permutations = self.getPermutations()
        length = len(permutations)
        
        for pos, current in enumerate(permutations):
            info(colorize("Permutation %s/%s:" % (pos+1, length), "bold"))
            indent()
            setPermutation(current)
            setTranslation(self.getTranslationBundle())
            yield current
            outdent()


    def exportFields(self):
        """
        Converts data from values to a compact data structure for being used to 
        compute a checksum in JavaScript.
        """
        
        #
        # Export structures:
        # 1. [ name, 1, test, [value1, ...] ]
        # 2. [ name, 2, value ]
        # 3. [ name, 3, test, default? ]
        #
        
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
                    
                    content.append(toJson(values))
            
                else:
                    # EXPORT STRUCT 2
                    content.append("2")
                    content.append(toJson(values[0]))

            # Has no relevance for permutation, just insert the test
            else:
                if "detect" in source:
                    # EXPORT STRUCT 3
                    content.append("3")

                    # Add detection class
                    content.append(source["detect"])
                    
                    # Add default value if available
                    if "default" in source:
                        content.append(toJson(source["default"]))
                
                else:
                    # Has no detection and no permutation. Ignore it completely
                    continue
                
            export.append("[%s]" % ",".join(content))
            
        if export:
            return "[%s]" % ",".join(export)
        else:
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
    
    
    def getTranslationBundle(self):
        """ 
        Returns a translation object for the given language containing 
        all relevant translation files for the current project set. 
        """

        language = getPermutation().get("locale")
        if language is None:
            return None

        info("Creating translation bundle: %s", language)
        indent()

        # Initialize new Translation object with no project assigned
        # This object is used to merge all seperate translation instances later on.
        combined = Translation(None, id=language)
        relevantLanguages = self.expandLanguage(language)

        # Loop structure is build to prefer finer language matching over project priority
        for currentLanguage in reversed(relevantLanguages):
            for project in self.__projects:
                for translation in project.getTranslations().values():
                    if translation.getLanguage() == currentLanguage:
                        info("Adding %s entries from %s @ %s...", len(translation.getTable()), currentLanguage, project.getName())
                        combined += translation

        debug("Combined number of translations: %s", len(combined.getTable()))
        outdent()

        return combined


    def expandLanguage(self, language):
        """Expands the given language into a list of languages being used in priority order (highest first)"""

        # Priority Chain: 
        # de_DE => de => C (default language) => code

        all = [language]
        if "_" in language:
            all.append(language[:language.index("_")])
        all.append("C")

        return all


    def generateLocale(self):

        permutation = getPermutation()
        if permutation:
            locale = permutation.get("locale")
            if locale:
                storeLocale(getLanguage(locale))
        
        storeLocale("de_DE")


    def getPermutatedLocale(self):
        """Returns the current locale as defined in current permutation"""

        permutation = getPermutation()
        if permutation:
            locale = permutation.get("locale")
            if locale:
                return locale

        return None
        

    def getLocaleProject(self, update=False):
        locale = self.getPermutatedLocale()
        if not locale:
            return None

        path = os.path.abspath(os.path.join(".jasy", "locale", locale))
        if not os.path.exists(path) or update:
            storeLocale(locale, path)

        return getProjectFromPath(path)





