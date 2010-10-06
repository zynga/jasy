#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import logging
import itertools

class JsSession():
    def __init__(self):
        self.projects = []
        self.variants = {}
        self.variants["locales"] = set()
        
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
        return []
        
        
    def addLocale(self, id):
        self.variants["locales"].add(id)
            
    def addVariant(self, name, values):
        if type(values) != list:
            values = [values]
            
        self.variants[name] = set(values)
        
    