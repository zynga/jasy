#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging, itertools, time, atexit
from jasy.core.Permutation import Permutation
from jasy.core.Translation import Translation
from jasy.Project import Project
from jasy.core.Info import *
from jasy.core.Profiler import *
from jasy.core.LocaleData import storeLocale


class Session():
    def __init__(self):
        atexit.register(self.close)
        
        self.__projects = []
        self.__variants = {}
        self.__locales = {}
        self.__timestamp = time.time()
    
    
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
            if locale in self.__locales:
                dynadd.append(self.__locales[locale])
        
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
    
    def addValue(self, name, values):
        if type(values) != list:
            values = [values]
            
        self.__variants[name] = set(values)
        
    def clearValues(self):
        self.__variants = {}
    
    
    def getPermutations(self):
        """
        Combines all variants and locales to a set of permutations.
        These define all possible combinations of the configured settings
        """

        logging.info("Computing permutations...")
        variants = self.__variants
        
        # Patch in locales
        variants["locale"] = self.__locales

        # Thanks to eumiro via http://stackoverflow.com/questions/3873654/combinations-from-dictionary-with-list-values-using-python
        names = sorted(variants)
        combinations = [dict(zip(names, prod)) for prod in itertools.product(*(variants[name] for name in names))]
        permutations = [Permutation(combi) for combi in combinations]

        return permutations



    #
    # Locale Configuration
    #
            
    def addLocale(self, locale):
        storeLocale(locale)
        self.__locales[locale] = Project(localeProject(locale))

    def clearLocales(self):
        self.__locales = {}

    def getLocales(self):
        return self.__locales
    
    
    
    #
    # Translation Support
    #
    
    defaultLocale = "C"
    
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
        
        # Prio: de_DE => de => C => Code
        check = [locale]
        if "_" in locale:
            check.append(locale[:locale.index("_")])
        check.append(self.defaultLocale)
        
        files = []
        for entry in check:
            for project in self.__projects:
                translations = project.getTranslations()
                if entry in translations:
                    files.append(translations[entry])
        
        return Translation(locale, files)

