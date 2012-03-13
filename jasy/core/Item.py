#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os

class Item:
    
    id = None
    project = None
    path = None
    kind = "item"

    __cache = None
    __mtime = None
    
    def __init__(self, project, id=None):
        self.id = id
        self.project = project

        #print("Initialized Item: %s" % self.id)


    def attach(self, path):
        self.path = path
        self.__mtime = os.stat(path).st_mtime
        
        return self
        
    def getId(self):
        """Returns a unique identify of the class. Typically as it is stored inside the project."""
        return self.id

    def setId(self, id):
        self.id = id
        return self

    def getProject(self):
        """Returns the project which the class belongs to"""
        return self.project

    def getPath(self):
        """Returns the exact position of the class file in the file system."""
        return self.path

    def getModificationTime(self):
        """Returns last modification time of the class"""
        return self.__mtime

    def getText(self):
        """Reads the file (as UTF-8) and returns the text"""
        return open(self.path, mode="r", encoding="utf-8").read()
    
    

    # Map Python built-ins
    __repr__ = getId
    __str__ = getId

    
