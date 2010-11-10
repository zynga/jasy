#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import os, logging, copy, hashlib

from js.core.DeadCode import cleanup
from js.core.MetaData import MetaData
from js.core.Dependencies import Dependencies
from js.parser.Parser import parse
from js.process.Compressor import compress
from js.process.Variables import scan

allIds = {}
cacheTreesInMemory = True

__all__ = ["Class"]

class Class():
    def __init__(self, path, rel, project):
        self.__project = project
        self.__cache = project.cache
        self.__mtime = os.stat(path).st_mtime

        self.path = path
        self.rel = os.path.splitext(rel)[0]
        self.name = self.rel.replace("/", ".")

    def getName(self):
        return self.name
        
    def getModificationTime(self):
        return self.__mtime

    def getText(self):
        return open(self.path, mode="r", encoding="utf-8").read()

    def getTree(self, permutation=None):
        if cacheTreesInMemory:
            field = "tree[%s]-%s" % (self.rel, permutation)
            tree = self.__cache.read(field, self.__mtime)
            if tree is not None:
                return tree
            
        if permutation:
            tree = copy.deepcopy(self.getTree())
        else:
            tree = parse(self.getText(), self.rel)

        # Modify tree according to given permutation
        if permutation:
            permutation.patch(tree)
            cleanup(tree)

        # Index variables
        scan(tree)
            
        if cacheTreesInMemory:
            self.__cache.store(field, tree, self.__mtime, True)
            
        return tree

    def getDependencies(self, permutation=None):
        field = "deps[%s]-%s" % (self.rel, permutation)
        deps = self.__cache.read(field, self.__mtime)
        if deps == None:
            deps = Dependencies(self.getTree(permutation), self.getMeta(permutation), self.name)
            self.__cache.store(field, deps, self.__mtime)
        
        return deps
            
    def getMeta(self, permutation=None):
        field = "meta[%s]-%s" % (self.rel, permutation)
        meta = self.__cache.read(field, self.__mtime)
        if meta == None:
            meta = MetaData(self.getTree(permutation))
            self.__cache.store(field, meta, self.__mtime)
            
        return meta
        
    def getCompressed(self, permutation=None, optimization=None, format=True):
        field = "compressed[%s]-%s-%s-%s" % (self.rel, permutation, optimization, format)
        field = hashlib.md5(field.encode("utf-8")).hexdigest()
        
        compressed = self.__cache.read(field, self.__mtime)
        if compressed == None:
            print("Compressing: %s" % field)

            tree = self.getTree(permutation)
            
            if optimization:
                tree = copy.deepcopy(tree)
                optimization.apply(tree)
                
            compressed = compress(tree, format)
            self.__cache.store(field, compressed, self.__mtime)
            
        return compressed
            
    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name
        
        