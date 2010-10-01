#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import logging
from api.Cache import Cache

class JsSession():
    def __init__(self):
        self.projects = []
        self.cache = Cache()
        
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
        
    def close(self):
        logging.debug("Syncing cache...")
        self.cache.close()
        