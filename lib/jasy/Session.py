#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging, itertools, time, atexit
from jasy.core.Permutation import Permutation
from jasy.core.Translation import Translation
from jasy.core.Localization import Localization


class Session():
    def __init__(self):
        atexit.register(self.close)
        
        self.projects = []
        self.variants = {}
        self.locales = set()
        self.timestamp = time.time()
        
    def addProject(self, project):
        self.projects.append(project)
        project.setSession(self)
        
    def getProjects(self):
        return self.projects
        
    def clearCache(self):
        for project in self.projects:
            project.clearCache()

    def close(self):
        logging.info("Closing session...")
        for project in self.projects:
            project.close()





    def getPermutations(self):
        """
        Combines all variants and locales to a set of permutations.
        These define all possible combinations of the configured settings
        """
        
        # Thanks to eumiro via http://stackoverflow.com/questions/3873654/combinations-from-dictionary-with-list-values-using-python
        variants = self.variants
        
        names = sorted(variants)
        combinations = [dict(zip(names, prod)) for prod in itertools.product(*(variants[name] for name in names))]
        permutations = [Permutation(combi) for combi in combinations]
        
        return permutations




    def addLocale(self, locale):
        self.locales.add(locale)

    def clearLocales(self):
        self.locales = set()
        
    def getLocales(self):
        return self.locales



            
    def addVariant(self, name, values):
        if type(values) != list:
            values = [values]
            
        self.variants[name] = set(values)
        
    def clearVariants(self):
        self.variants = {}
                
                
                
                
    def getLocalization(self, translation):
        return None
                
                
    defaultLocale = "C"
    
    
    
    def getAvailableTranslations(self):
        supported = set()
        for project in self.projects:
            supported.update(project.getTranslations().keys())
            
        return supported
    
    
    def getTranslation(self, locale):
        # Prio: de_DE => de => C => Code
        check = [locale]
        if "_" in locale:
            check.append(locale[:locale.index("_")])
        check.append(self.defaultLocale)
        
        files = []
        for entry in check:
            for project in self.projects:
                translations = project.getTranslations()
                if entry in translations:
                    files.append(translations[entry])
        
        return Translation(locale, files)
        
        
    def getLocalization(self, locale):
        return Localization(locale)
