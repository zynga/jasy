#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import logging
import itertools
import hashlib
import time

class JsSession():
    def __init__(self):
        self.projects = []
        self.variants = {}
        self.variants["locale"] = set()
        self.timestamp = time.time()
        
        logging.basicConfig(filename="log.txt", level=logging.DEBUG, format="%(asctime)s - %(threadName)s - %(levelname)s - %(message)s")
        
        # define a Handler which writes INFO messages or higher to the sys.stderr
        console = logging.StreamHandler()
        console.setLevel(logging.INFO)
        # set a format which is simpler for console use
        formatter = logging.Formatter('>>> %(asctime)s %(message)s', '%H:%M:%S')
        
        # tell the handler to use this format
        console.setFormatter(formatter)
        # add the handler to the root logger
        logging.getLogger('').addHandler(console)        
        
    def addProject(self, project):
        self.projects.append(project)
        project.setSession(self)
        
    def getProjects(self):
        return self.projects
        
    def clearCache(self):
        for project in self.projects:
            project.clearCache()
        
    def close(self):
        for project in self.projects:
            project.close()
            
    def getPermutations(self):
        # Thanks to eumiro via http://stackoverflow.com/questions/3873654/combinations-from-dictionary-with-list-values-using-python
        variants = self.variants
        
        varNames = sorted(variants)
        combinations = [dict(zip(varNames, prod)) for prod in itertools.product(*(variants[varName] for varName in varNames))]
        
        return combinations
        
    def getPermutationKey(self, permutation, timed=True):
        result = []
        for key in sorted(permutation):
            result.append("%s:%s" % (key, permutation[key]))
        
        if timed:
            result.append("time:%s" % self.timestamp)
        
        return ";".join(result)
        
    def getPermutationHash(self, permutation, timed=True):
        key = self.getPermutationKey(permutation)
        return hashlib.md5(key.encode("utf-8")).hexdigest()
        
    def addLocale(self, id):
        self.variants["locale"].add(id)
            
    def addVariant(self, name, values):
        if type(values) != list:
            values = [values]
            
        self.variants[name] = set(values)
        
    