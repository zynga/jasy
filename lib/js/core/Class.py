#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import os, logging, copy, hashlib

from js.core.DeadCode import cleanup
from js.core.MetaData import MetaData
from js.parser.Parser import parse
from js.process.Compressor import compress
from js.process.Variables import scan

aliases = {}

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
        field = "tree[%s]-%s" % (self.rel, permutation)
        tree = self.__cache.read(field, self.__mtime)
        if tree is not None:
            return tree
            
        # Parse tree
        tree = parse(self.getText(), self.rel)

        # Apply permutation
        if permutation:
            permutation.patch(tree)
            cleanup(tree)

        # Index variables
        scan(tree)
        
        self.__cache.store(field, tree, self.__mtime, True)
        return tree


    def getDependencies(self, permutation=None, classes=None):
        """ 
        Returns a set of dependencies seen through the given list of known 
        classes (ignoring all unknown items in original set) 
        """
        
        meta = self.getMeta(permutation)
        stats = self.getStats(permutation)
        result = set()
        
        # Manually defined names/classes
        for name in meta.requires:
            if name != self.name and name in classes:
                result.add(classes[name])
        
        # Globally modified names (mostly relevant when working without namespaces)
        for name in stats.shared:
            if name != self.name and name in classes:
                result.add(classes[name])
        
        # Real filtering
        for package in stats.packages:
            if package in aliases and package in classes:
                result.add(classes[package])
            
            else:
                orig = package
                while True:
                    if package == self.name:
                        break
                
                    elif package in classes:
                        aliases[orig] = package
                        result.add(classes[package])
                        break
                
                    else:
                        pos = package.rfind(".")
                        if pos == -1:
                            break
                        
                        package = package[0:pos]
        
        return result        
        
        
    def getStats(self, permutation=None):
        field = "stats[%s]-%s" % (self.rel, permutation)
        stats = self.__cache.read(field, self.__mtime)
        if stats == None:
            stats = self.getTree(permutation).stats
            self.__cache.store(field, stats, self.__mtime)
        
        return stats
        
        
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
        
        