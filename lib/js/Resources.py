#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import logging

class Resources:
    def __init__(self, session, classes):
        self.__session = session
        self.__classes = classes
        
    
    def index(self):
        projects = self.__session.getProjects()
        
        for project in projects:
            project.getResources()
        
    