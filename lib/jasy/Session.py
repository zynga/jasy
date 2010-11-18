#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging, itertools, time, atexit
from jasy.core.Permutation import Permutation
from jasy.core.Translation import Translation


class Session():
    def __init__(self):
        atexit.register(self.close)
        
        self.projects = []
        self.variants = {}
        self.variants["locale"] = set()
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



    def run(self):
        print("Running...")
        build()
        pass



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



            
    def addVariant(self, name, values):
        if type(values) != list:
            values = [values]
            
        self.variants[name] = set(values)
        
    def clearVariants(self):
        self.variants = dict()
                
                
                
                
    def getLocalization(self, translation):
        return None
                
                
    defaultLocale = "C"
    
    
    
    def getAvailableTranslations(self):
        supported = set()
        for project in self.projects:
            supported.update(project.getTranslations().keys())
            
        return supported
    
    
                
    def getTranslations(self, selected=None):
        # Priority: PROJECT1-FULL => PROJECT2-FULL => PROJECT1-LANG => PROJECT2-LANG => PROJECT1-DEFAULT => PROJECT2-DEFAULT => IMPLEMENTATION-FALLBACK
        # Example: PROJECT1-DE_DE => PROJECT2-DE_DE => PROJECT1-DE => PROJECT2-DE => PROJECT1-C => PROJECT2-C => CODE
        
        # Find locales which can actually be used
        supported = self.getSupportedTranslations()
        logging.info("Available translations: %s", supported)
            
            
        if selected:
            logging.info("Selected locales: %s", selected)
            
            use = set()
            for locale in selected:
                if locale == self.defaultLocale:
                    use.add(self.defaultLocale)
                elif locale in supported:
                    use.add(locale)
                elif "_" in locale:
                    lang = locale[:locale.index("_")]
                    if lang in supported:
                        use.add(locale)
                    else:
                        logging.error("Unsupported locale: %s", locale)

        else:
            use = supported
            
        logging.info("Use locales: %s", use)


        # Map translation files
        files = {}
        for locale in use:
            files[locale] = []
            
            for project in reversed(self.projects):
                translations = project.getTranslations()
                if locale in translations:
                    files[locale].append(translations[locale])

        for locale in use:
            if "_" in locale:
                lang = locale[:locale.index("_")]
                for project in reversed(self.projects):
                    translations = project.getTranslations()

                    if lang in translations:
                        files[locale].append(translations[lang])

        for locale in use:
            for project in reversed(self.projects):
                translations = project.getTranslations()
                if self.defaultLocale in translations:
                    files[locale].append(translations[self.defaultLocale])
                    

        return [ Translation(locale, files=files[locale]) for locale in files ]

