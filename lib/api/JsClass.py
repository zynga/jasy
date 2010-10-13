#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import os, logging, copy, binascii, string

from js.Dependencies import collect
from js.parser.Parser import parse
from js.Compressor import compress

# Permutation support
from js.optimizer.ValuePatch import patch
from js.optimizer.DeadCode import optimize

# Post optimizations
import js.optimizer.CombineDeclarations as CombineDeclarations
import js.optimizer.LocalVariables as LocalVariables
import js.optimizer.CryptPrivates as CryptPrivates

allIds = {}


class JsClass():
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

    def getTree(self, permutation=None):
        field = "tree[%s]-%s" % (self.rel, permutation)
        tree = self.__cache.read(field, self.__mtime)
        if tree == None:
            # generate the tree, cache it and return it
            if not permutation:
                logging.debug("%s: Generating tree...", self.name)
                tree = parse(self.getText(), self.rel)
                
            # otherwise: read unmodified tree, copy it, modify it, cache it, return it
            else:
                tree = copy.deepcopy(self.getTree())
                patched = patch(tree, permutation)
                optimized = optimize(tree)
                
                if patched or optimized:
                    # TODO: Do not store if none has happened
                    pass
                
            self.__cache.store(field, tree, self.__mtime)
            
        return tree

    def getDependencies(self, permutation=None):
        field = "deps[%s]-%s" % (self.rel, permutation)
        deps = self.__cache.read(field, self.__mtime)
        if deps == None:
            logging.debug("%s: Collecting dependencies...", self.name)
            deps, breaks = collect(self.getTree(permutation), self.getName())
            self.__cache.store(field, deps, self.__mtime)
            
            field = "breaks[%s]-%s" % (self.rel, permutation)
            self.__cache.store(field, breaks, self.__mtime)
        
        return deps
            
    def getBreakDependencies(self, permutation=None):
        field = "breaks[%s]-%s" % (self.rel, permutation)
        breaks = self.__cache.read(field, self.__mtime)
        if breaks == None:
            self.getDependencies(permutation)
            breaks = self.__cache.read(field, self.__mtime)
            
        return breaks
        
    def getCompressed(self, permutation=None):
        field = "compressed[%s]-%s" % (self.rel, permutation)
        compressed = self.__cache.read(field, self.__mtime)
        if compressed == None:
            logging.debug("%s: Compressing tree...", self.name)
            tree = self.getTree(permutation)
            
            # post-optimization
            CryptPrivates.optimize(tree, self.id)
            
            
            # finally compressing
            compressed = compress(tree)
            self.__cache.store(field, compressed, self.__mtime)
            
        return compressed
            
    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name
        
        