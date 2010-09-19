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
        if not tree:
            tree = parse(self.getText(), self.path)
            self.cache.store(self.__treeKey, tree)
            
        return tree

    def getDependencies(self):
        try:
            return self.dependencies
        except AttributeError:
            try:
                dependencies, breaks = collect(self.getTree(), self.getName())
            except Exception as ex:
                raise Exception("Could not collect dependencies of %s: %s" % (self.name, ex))
                
            self.dependencies = dependencies
            self.breaks = breaks
            return dependencies
            
    def getBreakDependencies(self):
        try:
            return self.breaks
        except AttributeError:
            self.getDependencies()
            return self.breaks
            
    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name
        
        