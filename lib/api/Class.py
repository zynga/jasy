#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import os
from js.Dependencies import collect
from js.Parser import parse
from js.Compressor import compress

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
        self.__compressedKey = "compressed[%s]" % self.path

    def getName(self):
        return self.name
        
    def getModificationTime(self):
        return self.__mtime

    def getText(self):
        return open(self.path, "utf-8").read()

    def getTree(self):
        tree = self.__cache.read(self.__treeKey, self.__mtime)
        if tree == None:
            tree = parse(self.getText(), self.path)
            self.__cache.store(self.__treeKey, tree, self.__mtime)
            
        return tree

    def getDependencies(self):
        deps = self.__cache.read(self.__depKey, self.__mtime)
        if deps == None:
            deps, breaks = collect(self.getTree(), self.getName())
            self.__cache.store(self.__depKey, deps, self.__mtime)
            self.__cache.store(self.__breakKey, breaks, self.__mtime)
        
        return deps
            
    def getBreakDependencies(self):
        breaks = self.__cache.read(self.__breakKey, self.__mtime)
        if breaks == None:
            self.getDependencies()
            breaks = self.__cache.read(self.__breakKey, self.__mtime)
            
        return breaks
        
    def getCompressed(self):
        compressed = self.__cache.read(self.__compressedKey, self.__mtime)
        if compressed == None:
            tree = self.getTree()
            compressed = compress(tree)
            self.__cache.store(self.__compressedKey, compressed, self.__mtime)
            
        return compressed
            
    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name
        
        