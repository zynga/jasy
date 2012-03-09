#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os, logging, copy, hashlib, zlib

from pygments import highlight
from pygments.lexers import JavascriptLexer
from pygments.formatters import HtmlFormatter

import jasy.js.parse.Parser as Parser
import jasy.js.parse.ScopeScanner as ScopeScanner

import jasy.js.clean.DeadCode
import jasy.js.clean.Unused
import jasy.js.clean.Permutate

import jasy.js.output.Optimization

from jasy.core.Permutation import getPermutation
from jasy.js.api.Data import ApiData
from jasy.js.MetaData import MetaData
from jasy.js.output.Compressor import Compressor

from jasy.js.util import *

from jasy.i18n.Translation import hasText


aliases = {}

defaultOptimization = jasy.js.output.Optimization.Optimization("declarations", "blocks", "variables", "privates")
defaultPermutation = getPermutation({"debug":False})


__all__ = ["Class", "Error"]


def collectPermutationKeys(node, keys=None):
    
    if keys is None:
        keys = set()
    
    # Always the first parameter
    # Supported calls: core.Env.isSet(key, expected?), core.Env.getValue(key), core.Env.select(key, map)
    calls = ("core.Env.isSet", "core.Env.getValue", "core.Env.select")
    if node.type == "dot" and node.parent.type == "call" and assembleDot(node) in calls:
        keys.add(node.parent[1][0].value)

    # Process children
    for child in reversed(node):
        if child != None:
            collectPermutationKeys(child, keys)
            
    return keys


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
            self.__name = self.__id
        else:
            self.__root = os.path.dirname(path)
            self.__package = ""
            self.__cache = Cache(self.__root)
            self.__id = os.path.filename(path)
            self.__name = self.__id
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
        tree = Parser.parse(self.getText(), self.__name)

        # Apply permutation
        if permutation:
            jasy.js.clean.Permutate.patch(tree, permutation)

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


    def getDependencies(self, permutation=None, classes=None, warnings=True):
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
            if name != self.__name and name in classes:
                result.add(classes[name])
            elif warnings:
                logging.warn("Missing class (required): %s in %s", name, self.__name)

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
                    
        # Manually excluded names/classes
        for name in meta.optionals:
            if name != self.__name and name in classes:
                result.remove(classes[name])
            elif warnings:
                logging.warn("Missing class (optional): %s in %s", name, self.__name)
        
        return result
        
        
    def getScopeData(self, permutation=None):
        """
        Returns the top level scope object which contains information about the
        global variable and package usage/influence.
        """
        
        permutation = self.filterPermutation(permutation)
        
        field = "scope[%s]-%s" % (self.__id, permutation)
        scope = self.__cache.read(field, self.__mtime)
        if scope is None:
            scope = self.getTree(permutation).scope
            self.__cache.store(field, scope, self.__mtime)
        
        return scope
        
        
    def getApi(self):
        field = "api[%s]" % self.__id
        apidata = self.__cache.read(field, self.__mtime)
        if apidata is None:
            apidata = ApiData(self.__name)
            
            apidata.scanTree(self.getTree(cleanup=False))
            
            metaData = self.getMetaData()
            apidata.addAssets(metaData.assets)
            for require in metaData.requires:
                apidata.addUses(require)
            for optional in metaData.optionals:
                apidata.removeUses(optional)
                
            apidata.addSize(self.getSize())
            apidata.addPermutations(self.getPermutationKeys())
            
            self.__cache.store(field, apidata, self.__mtime)

        return apidata

    def getHighlightedCode(self):
        field = "highlighted[%s]" % self.__id
        source = self.__cache.read(field, self.__mtime)
        if source is None:
            lexer = JavascriptLexer(tabsize=2)
            formatter = HtmlFormatter(full=True,style="autumn",linenos="table",lineanchors="line")
            source = highlight(self.getText(), lexer, formatter)
            self.__cache.store(field, source, self.__mtime)

        return source

    def getMetaData(self, permutation=None):
        permutation = self.filterPermutation(permutation)
        
        field = "meta[%s]-%s" % (self.__id, permutation)
        meta = self.__cache.read(field, self.__mtime)
        if meta is None:
            meta = MetaData(self.getTree(permutation))
            self.__cache.store(field, meta, self.__mtime)
            
        return meta
        
        
    def getPermutationKeys(self):
        field = "permutations[%s]" % (self.__id)
        keys = self.__cache.read(field, self.__mtime)
        if keys is None:
            keys = collectPermutationKeys(self.getTree())
            self.__cache.store(field, keys, self.__mtime)
        
        return keys


    def usesTranslation(self):
        field = "translation[%s]" % (self.__id)
        result = self.__cache.read(field, self.__mtime)
        if result is None:
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
                
            compressed = Compressor(format).compress(tree)
            self.__cache.store(field, compressed, self.__mtime)
            
        return compressed
            
            
    def getSize(self):
        field = "size[%s]" % self.__id
        size = self.__cache.read(field, self.__mtime)
        
        if size is None:
            compressed = self.getCompressed()
            optimized = self.getCompressed(permutation=defaultPermutation, optimization=defaultOptimization)
            zipped = zlib.compress(optimized.encode("utf-8"))
            
            size = {
                "compressed" : len(compressed),
                "optimized" : len(optimized),
                "zipped" : len(zipped)
            }
            
            self.__cache.store(field, size, self.__mtime)
            
        return size
        
        
        
