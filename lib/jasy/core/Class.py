#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import os, logging, copy, hashlib

from jasy.core.DeadCode import cleanup
from jasy.core.MetaData import MetaData
from jasy.core.Permutation import getKeys
from jasy.core.Translation import hasText
from jasy.parser.Parser import parse
from jasy.process.Compressor import compress
from jasy.process.Variables import scan

aliases = {}

__all__ = ["Class"]

class Class():
    def __init__(self, path, project):
        self.__cache = project.getCache()
        self.__fullpath = os.path.join(project.getClassPath(), path)
        self.__mtime = os.stat(self.__fullpath).st_mtime
        
        self.path = path
        self.name = os.path.splitext(path.replace(os.sep, "."))[0]
        
    def setName(self, name):
        self.name = name        

    def getName(self):
        return self.name
        
    def getModificationTime(self):
        return self.__mtime

    def getText(self):
        return open(self.__fullpath, mode="r", encoding="utf-8").read()


    def getTree(self, permutation=None):
        permutation = self.filterPermutation(permutation)
        
        field = "tree[%s]-%s" % (self.path, permutation)
        tree = self.__cache.read(field, self.__mtime)
        if tree is not None:
            return tree
            
        # Parse tree
        tree = parse(self.getText(), self.path)

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
        
        permutation = self.filterPermutation(permutation)
        
        meta = self.getMeta(permutation)
        stats = self.getStats(permutation)
        result = set()
        
        # Manually defined names/classes
        for name in meta.requires:
            if name != self.path and name in classes:
                result.add(classes[name])
        
        # Globally modified names (mostly relevant when working without namespaces)
        for name in stats.shared:
            if name != self.path and name in classes:
                result.add(classes[name])
        
        # Add classes from detected package access
        for package in stats.packages:
            if package in aliases:
                className = aliases[package]
                if className in classes:
                    result.add(classes[className])
                    continue
            
            orig = package
            while True:
                if package == self.path:
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
        permutation = self.filterPermutation(permutation)
        
        field = "stats[%s]-%s" % (self.path, permutation)
        stats = self.__cache.read(field, self.__mtime)
        if stats == None:
            stats = self.getTree(permutation).stats
            self.__cache.store(field, stats, self.__mtime)
        
        return stats
        
        
    def getMeta(self, permutation=None):
        permutation = self.filterPermutation(permutation)
        
        field = "meta[%s]-%s" % (self.path, permutation)
        meta = self.__cache.read(field, self.__mtime)
        if meta == None:
            meta = MetaData(self.getTree(permutation))
            self.__cache.store(field, meta, self.__mtime)
            
        return meta
        
        
    def getPermutationKeys(self):
        field = "permutations[%s]" % (self.path)
        result = self.__cache.read(field, self.__mtime)
        if result is None:
            result = getKeys(self.getTree())
            self.__cache.store(field, result, self.__mtime)
        
        return result


    def usesTranslation(self):
        field = "translation[%s]" % (self.path)
        result = self.__cache.read(field, self.__mtime)
        if result == None:
            result = hasText(self.getTree())
            self.__cache.store(field, result, self.__mtime)
        
        return result
        
        
    def filterPermutation(self, permutation):
        if permutation:
            keys = self.getPermutationKeys()
            if keys:
                return permutation.filter(keys)

        return None
        
        
    def filterTranslation(self, translation):
        if translation and self.usesTranslation():
            return translation
            
        return None
        
        
    def getCompressed(self, permutation=None, translation=None, optimization=None, format=None):
        permutation = self.filterPermutation(permutation)
        translation = self.filterTranslation(translation)
        
        field = "compressed[%s]-%s-%s-%s-%s" % (self.path, permutation, translation, optimization, format)
        field = hashlib.md5(field.encode("utf-8")).hexdigest()
        
        compressed = self.__cache.read(field, self.__mtime)
        if compressed == None:
            tree = self.getTree(permutation)
            
            if translation or optimization:
                tree = copy.deepcopy(tree)
            
                if translation:
                    translation.patch(tree)

                if optimization:
                    optimization.apply(tree)
                
            compressed = compress(tree, format)
            self.__cache.store(field, compressed, self.__mtime)
            
        return compressed
            
            
    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name
        
        