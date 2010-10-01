#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import os
from js.Dependencies import collect
from js.Parser import parse

class JsClass():
    def __init__(self, path, rel, session):
        self.path = path
        self.rel = rel
        self.session = session
        self.name = os.path.splitext(self.rel)[0].replace("/", ".")

        self.__cache = self.session.cache
        self.__mtime = os.stat(path).st_mtime

        self.__treeKey = "tree[%s]" % self.path
        self.__depKey = "deps[%s]" % self.path
        self.__breakKey = "breaks[%s]" % self.path

    def getName(self):
        return self.name

    def getText(self):
        return open(self.path).read()

    def getTree(self):
        tree = self.__cache.read(self.__treeKey, self.__mtime)
        if tree == None:
            tree = parse(self.getText(), self.path)
            self.__cache.store(self.__treeKey, tree)
            
        return tree

    def getDependencies(self):
        deps = self.__cache.read(self.__depKey, self.__mtime)
        if deps == None:
            deps, breaks = collect(self.getTree(), self.getName())
            self.__cache.store(self.__depKey, deps)
            self.__cache.store(self.__breakKey, breaks)
        
        return deps
            
    def getBreakDependencies(self):
        breaks = self.__cache.read(self.__breakKey)
        if breaks == None:
            self.getDependencies()
            breaks = self.__cache.read(self.__breakKey)
            
        return breaks
            
    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name
        
        