#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import os
import logging
import copy

from js.Dependencies import collect
from js.parser.Parser import parse
from js.Compressor import compress
from js.optimizer.ValuePatch import patch
from js.optimizer.DeadCode import optimize

uniqueId = 0

class JsClass():
    def __init__(self, path, rel, project):
        global uniqueId
        
        self.path = path
        self.rel = rel
        self.project = project
        self.name = os.path.splitext(self.rel)[0].replace("/", ".")
        self.id = uniqueId
        
        uniqueId += 1

        self.__cache = self.project.cache
        self.__mtime = os.stat(path).st_mtime


    def getName(self):
        return self.name
        
    def getModificationTime(self):
        return self.__mtime

    def getText(self):
        return open(self.path, mode="r", encoding="utf-8").read()
        
        


    def getTree(self, permutation=None):
        field = "tree[%s]-%s" % (self.rel, permutation)
        tree = self.__cache.read(field, self.__mtime)
        if tree == None:
            # generate the tree, cache it and return it
            if not permutation:
                logging.debug("%s: Generating tree..." % self.name)
                tree = parse(self.getText(), self.path)
                
            # otherwise: read unmodified tree, copy it, modify it, cache it, return it
            else:
                tree = copy.copy(self.getTree())
                
                #logging.info("%s: Optimizing tree..." % self.name)
                
                patched = patch(tree, permutation)
                optimized = optimize(tree)
                
                logging.info("%s: Applied Permutation: %s + %s" % (self.name, patched, optimized))
                
            self.__cache.store(field, tree, self.__mtime)
            
        return tree

    def getDependencies(self, permutation=None):
        field = "deps[%s]-%s" % (self.rel, permutation)
        deps = self.__cache.read(field, self.__mtime)
        if deps == None:
            logging.debug("%s: Collecting dependencies..." % self.name)
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
            logging.debug("%s: Compressing tree..." % self.name)
            tree = self.getTree(permutation)
            compressed = compress(tree)
            self.__cache.store(field, compressed, self.__mtime)
            
        return compressed
            
    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name
        
        