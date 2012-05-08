#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os
from jasy.core.Error import JasyError
from jasy.core.Util import sha1File

class Item:
    
    id = None
    project = None
    kind = "item"

    __path = None
    __cache = None
    __mtime = None
    
    def __init__(self, project, id=None):
        self.id = id
        self.project = project

    def attach(self, path):
        self.__path = path
        
        try:
            if type(path) is list:
                mtime = 0
                for entry in path:
                    entryTime = os.stat(entry).st_mtime
                    if entryTime > mtime:
                        mtime = entryTime
                    
                self.__mtime = mtime
        
            else:
                self.__mtime = os.stat(path).st_mtime
            
        except OSError as oserr:
            raise JasyError("Invalid item path: %s" % path)
        
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
        return self.__path

    def getModificationTime(self):
        """Returns last modification time of the class"""
        return self.__mtime

    def getText(self, encoding="utf-8"):
        """Reads the file (as UTF-8) and returns the text"""
        
        if self.__path is None:
            return None
        
        if type(self.__path) == list:
            return "".join([open(filename, mode="r", encoding=encoding).read() for filename in self.__path])
        else:
            return open(self.__path, mode="r", encoding=encoding).read()
    
    def getChecksum(self, mode="rb"):
        """Returns the SHA1 checksum of the item"""
        
        return sha1File(open(self.getPath(), mode))
    

    # Map Python built-ins
    __repr__ = getId
    __str__ = getId

