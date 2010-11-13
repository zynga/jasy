#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging
import itertools
import time
import atexit
from jasy.core.Permutation import Permutation

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




    def addLocale(self, id):
        self.variants["locale"].add(id)
            
    def addVariant(self, name, values):
        if type(values) != list:
            values = [values]
            
        self.variants[name] = set(values)
        
    def clearLocales(self):
        self.variants["locale"] = set()
        
    def clearVariants(self):
        for key in self.variants.keys():
            if key != "locale":
                del self.variants[key]
        
    