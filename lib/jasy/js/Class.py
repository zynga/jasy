#
# Jasy - Web Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import os, logging, copy, hashlib

import jasy.js.parse.Parser as Parser
import jasy.js.parse.ScopeScanner as ScopeScanner

import jasy.js.clean.DeadCode
import jasy.js.clean.Unused

import jasy.js.output.Optimization

from jasy.js.MetaData import MetaData
from jasy.js.Permutation import getKeys
from jasy.i18n.Translation import hasText
from jasy.js.output.Compressor import compress


aliases = {}

__all__ = ["Class", "Error"]

class Error(Exception):
    def __init__(self, inst, msg):
        self.__msg = msg
        self.__inst = inst
        
    def __str__(self):
        return "Error processing class %s: %s" % (self.__inst, self.__msg)


class Class():
    def __init__(self, path, project=None):
        self.__path = path
        self.__mtime = os.stat(path).st_mtime
        
        if project:
            self.__project = project
            self.__root = project.getClassPath()
            self.__package = project.getPackage()
            self.__cache = project.getCache()
            self.__localPath = os.path.relpath(path, project.getClassPath())
            self.__id = self.__localPath[:-3]
        else:
            self.__root = os.path.dirname(path)
            self.__package = ""
            self.__cache = Cache(self.__root)
            self.__id = os.path.filename(path)
            self.__localPath = path
        
        # This is by far slower and not the default but helps in specific project structures
        if project is None or project.isFuzzy():
            self.__name = self.getMetaData().name
            if self.__name is None:
                raise Exception("Could not figure out fuzzy class name of: %s" % path)
        else:
            self.__name = self.__id.replace(os.sep, ".")
            if self.__package:
                self.__name = self.__package + "." + self.__name
                
    
    def getProject(self):
        """Returns the project which the class belongs to"""
        return self.__project

    def getId(self):
        """Returns a unique identify of the class. Typically as it is stored inside the project."""
        return self.__id

    def getName(self):
        """Returns the class name of the class based on the file name (default) or on the meta data (fuzzy)."""
        return self.__name
        
    # Map Python built-ins
    __repr__ = getName
    __str__ = getName
        
    def getPath(self):
        """Returns the exact position of the class file in the file system."""
        return self.__path
        
    def getLocalPath(self):
        """Returns the relative path inside the project (or the full path when no project is given)."""
        return self.__localPath
        
    def getModificationTime(self):
        """Returns last modification time of the class"""
        return self.__mtime

    def getText(self):
        """Reads the file (as UTF-8) and returns the text"""
        return open(self.__path, mode="r", encoding="utf-8").read()


    def getTree(self, permutation=None, cleanup=True):
        """
        Returns the tree (of nodes from the parser) of the class. This parses the class,
        creates the tree, applies and optional permutation, scans for variables usage 
        and puts the tree into the cache before returning it. The cache works with the
        permutation, so every permutated tree is cached separately.
        """
        
        permutation = self.filterPermutation(permutation)
        
        field = "tree[%s]-%s-%s" % (self.__id, permutation, cleanup)
        tree = self.__cache.read(field, self.__mtime)
        if tree is not None:
            return tree
            
        # Parse tree
        tree = Parser.parse(self.getText(), self.__id)

        # Apply permutation
        if permutation:
            permutation.patch(tree)

        # Remove dead code
        if cleanup:
            jasy.js.clean.DeadCode.cleanup(tree)

        # Scan for variable usage
        ScopeScanner.scan(tree)
        
        # Remove unused variables/functions
        if cleanup:
            jasy.js.clean.Unused.cleanup(tree)
        
        self.__cache.store(field, tree, self.__mtime, True)
        return tree


    def getDependencies(self, permutation=None, classes=None):
        """ 
        Returns a set of dependencies seen through the given list of known 
        classes (ignoring all unknown items in original set). This method
        makes use of the meta data (see core/MetaData.py) and the variable data 
        (see parse/ScopeData.py).
        """
        
        permutation = self.filterPermutation(permutation)
        
        meta = self.getMetaData(permutation)
        scope = self.getScopeData(permutation)
        
        result = set()
        
        # Manually defined names/classes
        for name in meta.requires:
            if name != self.__id and name in classes:
                result.add(classes[name])
        
        # Globally modified names (mostly relevant when working without namespaces)
        for name in scope.shared:
            if name != self.__id and name in classes:
                result.add(classes[name])
        
        # Add classes from detected package access
        for package in scope.packages:
            if package in aliases:
                className = aliases[package]
                if className in classes:
                    result.add(classes[className])
                    continue
            
            orig = package
            while True:
                if package == self.__id:
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
        
        
    def getScopeData(self, permutation=None):
        """
        Returns the top level scope object which contains information about the
        global variable and package usage/influence.
        """
        
        permutation = self.filterPermutation(permutation)
        
        field = "scope[%s]-%s" % (self.__id, permutation)
        scope = self.__cache.read(field, self.__mtime)
        if scope == None:
            scope = self.getTree(permutation).scope
            self.__cache.store(field, scope, self.__mtime)
        
        return scope
        
        
    def getMetaData(self, permutation=None):
        permutation = self.filterPermutation(permutation)
        
        field = "meta[%s]-%s" % (self.__id, permutation)
        meta = self.__cache.read(field, self.__mtime)
        if meta == None:
            meta = MetaData(self.getTree(permutation))
            self.__cache.store(field, meta, self.__mtime)
            
        return meta
        
        
    def getPermutationKeys(self):
        field = "permutations[%s]" % (self.__id)
        result = self.__cache.read(field, self.__mtime)
        if result is None:
            result = getKeys(self.getTree())
            self.__cache.store(field, result, self.__mtime)
        
        return result


    def usesTranslation(self):
        field = "translation[%s]" % (self.__id)
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
        
        field = "compressed[%s]-%s-%s-%s-%s" % (self.__id, permutation, translation, optimization, format)
        field = hashlib.md5(field.encode("utf-8")).hexdigest()
        
        compressed = self.__cache.read(field, self.__mtime)
        if compressed == None:
            tree = self.getTree(permutation)
            
            if translation or optimization:
                tree = copy.deepcopy(tree)
            
                if translation:
                    translation.patch(tree)

                if optimization:
                    try:
                        optimization.apply(tree)
                    except jasy.js.output.Optimization.Error as error:
                        raise Error(self, "Could not compress class! %s" % error)
                
            compressed = compress(tree, format)
            self.__cache.store(field, compressed, self.__mtime)
            
        return compressed
            
            
        