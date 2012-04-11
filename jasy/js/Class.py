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

from jasy.core.Item import Item
from jasy.core.Permutation import getPermutation
from jasy.js.api.Data import ApiData
from jasy.js.MetaData import MetaData
from jasy.js.output.Compressor import Compressor

from jasy.js.util import *

from jasy.i18n.Translation import hasText


aliases = {}

defaultOptimization = jasy.js.output.Optimization.Optimization("declarations", "blocks", "variables")
defaultPermutation = getPermutation({"debug" : False})


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


class ClassError(Exception):
    def __init__(self, inst, msg):
        self.__msg = msg
        self.__inst = inst
        
    def __str__(self):
        return "Error processing class %s: %s" % (self.__inst, self.__msg)


class Class(Item):
    
    kind = "class"
    
    def getTree(self, permutation=None, cleanup=True):
        """
        Returns the tree (of nodes from the parser) of the class. This parses the class,
        creates the tree, applies and optional permutation, scans for variables usage 
        and puts the tree into the cache before returning it. The cache works with the
        permutation, so every permutated tree is cached separately.
        """
        
        permutation = self.filterPermutation(permutation)
        
        field = "tree[%s]-%s-%s" % (self.id, permutation, cleanup)
        tree = self.project.getCache().read(field, self.getModificationTime())
        if tree is not None:
            return tree
            
        # Parse tree
        tree = Parser.parse(self.getText(), self.id)

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
        
        self.project.getCache().store(field, tree, self.getModificationTime(), True)
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
            if name != self.id and name in classes and classes[name].kind == "class":
                result.add(classes[name])
            elif warnings:
                logging.warn("Missing class (required): %s in %s", name, self.id)

        # Globally modified names (mostly relevant when working without namespaces)
        for name in scope.shared:
            if name != self.id and name in classes and classes[name].kind == "class":
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
                if package == self.id:
                    break
            
                elif package in classes and classes[package].kind == "class":
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
            if name != self.id and name in classes and classes[name].kind == "class":
                result.remove(classes[name])
            elif warnings:
                logging.warn("Missing class (optional): %s in %s", name, self.id)
        
        return result
        
        
    def getScopeData(self, permutation=None):
        """
        Returns the top level scope object which contains information about the
        global variable and package usage/influence.
        """
        
        permutation = self.filterPermutation(permutation)
        
        field = "scope[%s]-%s" % (self.id, permutation)
        scope = self.project.getCache().read(field, self.getModificationTime())
        if scope is None:
            scope = self.getTree(permutation).scope
            self.project.getCache().store(field, scope, self.getModificationTime())
        
        return scope
        
        
    def getApi(self):
        field = "api[%s]" % self.id
        apidata = self.project.getCache().read(field, self.getModificationTime())
        if apidata is None:
            apidata = ApiData(self.id)
            
            apidata.scanTree(self.getTree(cleanup=False))
            
            metaData = self.getMetaData()
            apidata.addAssets(metaData.assets)
            for require in metaData.requires:
                apidata.addUses(require)
            for optional in metaData.optionals:
                apidata.removeUses(optional)
                
            apidata.addSize(self.getSize())
            apidata.addPermutations(self.getPermutationKeys())
            
            self.project.getCache().store(field, apidata, self.getModificationTime())

        return apidata


    def getHighlightedCode(self):
        field = "highlighted[%s]" % self.id
        source = self.project.getCache().read(field, self.getModificationTime())
        if source is None:
            lexer = JavascriptLexer(tabsize=2)
            formatter = HtmlFormatter(full=True,style="autumn",linenos="table",lineanchors="line")
            source = highlight(self.getText(), lexer, formatter)
            self.project.getCache().store(field, source, self.getModificationTime())

        return source


    def getMetaData(self, permutation=None):
        permutation = self.filterPermutation(permutation)
        
        field = "meta[%s]-%s" % (self.id, permutation)
        meta = self.project.getCache().read(field, self.getModificationTime())
        if meta is None:
            meta = MetaData(self.getTree(permutation))
            self.project.getCache().store(field, meta, self.getModificationTime())
            
        return meta
        
        
    def getPermutationKeys(self):
        field = "permutations[%s]" % (self.id)
        keys = self.project.getCache().read(field, self.getModificationTime())
        if keys is None:
            keys = collectPermutationKeys(self.getTree())
            self.project.getCache().store(field, keys, self.getModificationTime())
        
        return keys


    def usesTranslation(self):
        field = "translation[%s]" % (self.id)
        result = self.project.getCache().read(field, self.getModificationTime())
        if result is None:
            result = hasText(self.getTree())
            self.project.getCache().store(field, result, self.getModificationTime())
        
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
        
        
    def getCompressed(self, permutation=None, translation=None, optimization=None, formatting=None):
        permutation = self.filterPermutation(permutation)
        translation = self.filterTranslation(translation)
        
        field = "compressed[%s]-%s-%s-%s-%s" % (self.id, permutation, translation, optimization, formatting)
        field = hashlib.md5(field.encode("utf-8")).hexdigest()
        
        compressed = self.project.getCache().read(field, self.getModificationTime())
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
                        raise ClassError(self, "Could not compress class! %s" % error)
                
            compressed = Compressor(formatting).compress(tree)
            self.project.getCache().store(field, compressed, self.getModificationTime())
            
        return compressed
            
            
    def getSize(self):
        field = "size[%s]" % self.id
        size = self.project.getCache().read(field, self.getModificationTime())
        
        if size is None:
            compressed = self.getCompressed()
            optimized = self.getCompressed(permutation=defaultPermutation, optimization=defaultOptimization)
            zipped = zlib.compress(optimized.encode("utf-8"))
            
            size = {
                "compressed" : len(compressed),
                "optimized" : len(optimized),
                "zipped" : len(zipped)
            }
            
            self.project.getCache().store(field, size, self.getModificationTime())
            
        return size
        
        
