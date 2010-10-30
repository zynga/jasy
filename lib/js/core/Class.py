#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import os, logging, copy, binascii, string

from js.core.MetaData import MetaData
from js.core.Dependencies import Dependencies
from js.parser.Parser import parse
from js.process.Compressor import compress
from js.process.Variables import scan

# Permutation support
from js.optimizer.ValuePatch import patch
from js.optimizer.DeadCode import optimize

# Post optimization
import js.optimizer.CryptPrivates as CryptPrivates
import js.optimizer.BlockReducer as BlockReducer
import js.optimizer.LocalVariables as LocalVariables
import js.optimizer.CombineDeclarations as CombineDeclarations

allIds = {}

__all__ = ["Class"]

class Class():
    def __init__(self, path, rel, project):
        self.__project = project
        self.__cache = project.cache
        self.__mtime = os.stat(path).st_mtime

        self.path = path
        self.rel = os.path.splitext(rel)[0]
        self.name = self.rel.replace("/", ".")
        self.id = self.getId()


    def __baseEncode(self, num, alphabet=string.ascii_letters+string.digits):
        if (num == 0):
            return alphabet[0]
        arr = []
        base = len(alphabet)
        while num:
            rem = num % base
            num = num // base
            arr.append(alphabet[rem])
        arr.reverse()
        return "".join(arr)


    def getName(self):
        return self.name
        
    def getModificationTime(self):
        return self.__mtime

    def getText(self):
        return open(self.path, mode="r", encoding="utf-8").read()
        
    def getId(self):
        field = "id[%s]" % self.rel
        classId = self.__cache.read(field)
        if classId == None:
            numericId = binascii.crc32(self.rel.encode("utf-8"))
            classId = self.__baseEncode(numericId)
            
            self.__cache.store(field, classId, self.__mtime)
            
        if classId in allIds:
            logging.error("Oops: Conflict in class IDs between: %s <=> %s" % (allIds[classId], self.rel))
            
        allIds[classId] = self.rel
        return classId

    def getTree(self, permutation=None, optimization=None):
        field = "tree[%s]-%s+%s" % (self.rel, permutation, optimization)
        tree = self.__cache.read(field, self.__mtime)
        
        if tree != None:
            return tree
            
        if permutation or optimization:
            tree = self.getTree()
            tree = copy.deepcopy(tree)
            
        else:
            tree = parse(self.getText(), self.rel)
            scan(tree)

        if permutation:
            patch(tree, permutation)
            optimize(tree)
            
            # re-scan tree
            scan(tree)
            
        if optimization:
            if "privates" in optimization:
                CryptPrivates.optimize(tree, self.id)
            
            if "blocks" in optimization:
                BlockReducer.optimize(tree)

            if "variables" in optimization:
                LocalVariables.optimize(tree)
                
            if "declarations" in optimization:
                CombineDeclarations.optimize(tree)
                
        self.__cache.store(field, tree, self.__mtime, True)
            
        return tree

    def getDependencies(self, permutation=None):
        field = "deps[%s]-%s" % (self.rel, permutation)
        deps = self.__cache.read(field, self.__mtime)
        if deps == None:
            deps = Dependencies(self, self.getTree(permutation))
            self.__cache.store(field, deps, self.__mtime)
        
        return deps
            
    def getMeta(self, permutation=None):
        field = "meta[%s]-%s" % (self.rel, permutation)
        meta = self.__cache.read(field, self.__mtime)
        if meta == None:
            meta = MetaData(self, self.getTree(permutation))
            self.__cache.store(field, meta, self.__mtime)
            
        return meta
        
    def getCompressed(self, permutation=None, optimization=None):
        field = "compressed[%s]-%s" % (self.rel, permutation)
        compressed = self.__cache.read(field, self.__mtime)
        if compressed == None:
            tree = self.getTree(permutation, optimization)
            compressed = compress(tree)
            self.__cache.store(field, compressed, self.__mtime)
            
        return compressed
            
    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name
        
        