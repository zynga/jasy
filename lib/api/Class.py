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
        self.cache = self.session.cache
        self.name = os.path.splitext(self.rel)[0].replace("/", ".")

        self.__treeKey = "tree[%s]" % self.path
        self.__depKey = "deps[%s]" % self.path
        self.__breakKey = "breaks[%s]" % self.path
        

    def getName(self):
        return self.name

    def getText(self):
        return open(self.path).read()

    def getTree(self):
        tree = self.cache.read(self.__treeKey)
        if tree == None:
            tree = parse(self.getText(), self.path)
            self.cache.store(self.__treeKey, tree)
            
        return tree

    def getDependencies(self):
        deps = self.cache.read(self.__depKey)
        if deps == None:
            deps, breaks = collect(self.getTree(), self.getName())
            self.cache.store(self.__depKey, deps)
            self.cache.store(self.__breakKey, breaks)
        
        return deps
            
    def getBreakDependencies(self):
        breaks = self.cache.read(self.__breakKey)
        if breaks == None:
            self.getDependencies()
            breaks = self.cache.read(self.__breakKey)
            
        return breaks
            
    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name
        
        