#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging, itertools, time, atexit, json, os

from jasy.i18n.Translation import Translation
from jasy.i18n.LocaleData import *

from jasy.core.Project import Project, getProjectFromPath, getProjectDependencies
from jasy.core.Permutation import Permutation

from jasy.core.Error import JasyError
from jasy.env.State import setPermutation, startSection


__all__ = ["Session"]


def toJSON(obj, sort_keys=False):
    return json.dumps(obj, separators=(',',':'), ensure_ascii=False, sort_keys=sort_keys)
    
    

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
        
        if os.path.exists("jasyproject.json"):
            startSection("Initializing projects...")
            
            try:
                self.addProject(getProjectFromPath("."))
            except JasyError as jasyerr:
                raise JasyError("Could not initialize session! %s" % jasyerr)
    
    
    def clean(self):
        """Clears all caches of known projects"""

        for project in self.__projects:
            project.clean()


    def close(self):
        """Closes the session and stores cache to the harddrive."""

        logging.debug("Closing session...")
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
        logging.info("Adding %s projects..." % len(result))
        
        for project in result:
            
            # Append to list
            relpath = os.path.relpath(project.getPath(), os.getcwd())
            logging.info("- Project %s (%s)", project.getName(), relpath)
            self.__projects.append(project)
            
            # Import project defined fields which might be configured using "activateField()"
            fields = project.getFields()
            for name in fields:
                entry = fields[name]

                if name in self.__fields:
                    raise Exception("Field '%s' was already defined!" % (name))

                if "check" in entry:
                    check = entry["check"]
                    if check in ["Boolean", "String", "Number"] or type(check) == list:
                        pass
                    else:
                        raise Exception("Unsupported check: '%s' for field '%s'" % (check, name))
                    
                if "detect" in entry:
                    detect = entry["detect"]
                    if not self.getClassByName(detect):
                        raise Exception("Field '%s' uses unknown detection class %s." % (name, detect))
                
                self.__fields[name] = entry
        
        
    def getProjects(self):
        """Returns all currently known projects."""
        return self.__projects
        
        
    def getRelativePath(self, project):
        """Returns the relative path of any project to the main project"""
        
        mainPath = self.__projects[-1].getPath()
        projectPath = project.getPath()
        
        return os.path.relpath(projectPath, mainPath)
        
        
    def getMain(self):
        return self.__projects[-1]
    
    
    
    
    #
    # Support for fields
    # Fields allow to inject data from the build into the running application
    #
    
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
        
        permutations = self.getPermutations()
        length = len(permutations)
        
        for pos, current in enumerate(permutations):
            startSection("Permutation %s/%s" % (pos+1, length))
            setPermutation(current)
            yield current


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
                    
                    content.append(toJSON(values))
            
                else:
                    # EXPORT STRUCT 2
                    content.append("2")
                    content.append(toJSON(values[0]))

            # Has no relevance for permutation, just insert the test
            else:
                if "detect" in source:
                    # EXPORT STRUCT 3
                    content.append("3")

                    # Add detection class
                    content.append(source["detect"])
                    
                    # Add default value if available
                    if "default" in source:
                        content.append(toJSON(source["default"]))
                
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
        project supports fr_FR then it will be included here.
        """
        
        supported = set()
        for project in self.__projects:
            supported.update(project.getTranslations().keys())
            
        return supported
    
    
    def getTranslation(self, locale):
        """ 
        Returns a translation object for the given locale containing 
        all relevant translation files for the current project set. 
        """
        
        # Prio: de_DE => de => C (default locale) => Code
        check = [locale]
        if "_" in locale:
            check.append(locale[:locale.index("_")])
        check.append("C")
        
        files = []
        for entry in check:
            for project in self.__projects:
                translations = project.getTranslations()
                if translations and entry in translations:
                    files.append(translations[entry])
        
        return Translation(locale, files)
        
        
        
