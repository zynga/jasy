#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging, itertools, time, atexit, json
from jasy.core.Permutation import Permutation
from jasy.core.Translation import Translation
from jasy.Project import Project
from jasy.core.Info import *
from jasy.core.Profiler import *
from jasy.core.LocaleData import storeLocale


class Session():
    def __init__(self):
        atexit.register(self.close)

        self.__timestamp = time.time()
        self.__projects = []

        self.__values = {}
        self.__valueTests = {}

        self.__localeProjects = {}
    
    
    #
    # Project Managment
    #
        
    def addProject(self, project):
        self.__projects.append(project)
        
    def removeProject(self, project):
        self.__projects.remove(project)
        
    def getProjects(self, permutation=None):
        # Dynamically add the locale matching CLDR project to the list
        dynadd = []
        if permutation:
            locale = permutation.get("locale")
            if not locale in self.__localeProjects:
                self.__localeProjects[locale] = Project(localeProject(locale))
            
            dynadd.append(self.__localeProjects[locale])
        
        return self.__projects + dynadd
    
    
    #
    # Core
    #
        
    def clearCache(self):
        for project in self.__projects:
            project.clearCache()

    def close(self):
        logging.info("Closing session...")
        for project in self.__projects:
            project.close()
    
    
    #
    # Permutation Support
    #
    
    def addValue(self, name, values, test=None):
        if type(values) != list:
            values = [values]
            
        self.__values[name] = set(values)

        if test:
            self.__valueTests[name] = test
            
        
    def clearValues(self):
        self.__values = {}
        self.__valueTests = {}
    
    
    def getPermutations(self):
        """
        Combines all values to a set of permutations.
        These define all possible combinations of the configured settings
        """

        values = self.__values
        
        # Thanks to eumiro via http://stackoverflow.com/questions/3873654/combinations-from-dictionary-with-list-values-using-python
        names = sorted(values)
        combinations = [dict(zip(names, prod)) for prod in itertools.product(*(values[name] for name in names))]
        permutations = [Permutation(combi) for combi in combinations]

        return permutations
    
    
    def getPermutationCode(self):
        """
        Exports the current permutations to a JSON string
        """
        
        values = self.__values
        tests = self.__valueTests
        
        export = {}
        
        for name in values:
            export[name] = []
            export[name].append(list(values[name]))
            
            if name in tests:
                export[name].append(tests[name])
    
        return "(function(global){global.$$permutations=%s})(this);" % json.dumps(export, separators=(',',':'), ensure_ascii=False)
        
        
    def getPermutationDependencies(self):
        return set(self.__valueTests.values())

    
    
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
                if entry in translations:
                    files.append(translations[entry])
        
        return Translation(locale, files)

