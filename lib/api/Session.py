#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

from api.Cache import Cache

class JsSession():
    def __init__(self):
        self.projects = []
        self.cache = Cache()
        pass
        
    def addProject(self, project):
        self.projects.append(project)
        project.setSession(self)
        
    def getProjects(self):
        return self.projects
        
    def close(self):
        print("Syncing cache...")
        self.cache.close()
        