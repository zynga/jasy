#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os

import jasy.core.Console as Console

from jasy.core.Permutation import getPermutation
from jasy.item.Class import ClassError
from jasy.js.Resolver import Resolver
from jasy.js.Sorter import Sorter
from jasy.js.parse.Parser import parse
from jasy.js.output.Compressor import Compressor
from jasy import UserError

from jasy.js.output.Optimization import Optimization
from jasy.js.output.Formatting import Formatting

from jasy.core.FileManager import FileManager

compressor = Compressor()
packCache = {}


def packCode(code):
    """Packs the given code by passing it to the compression engine"""
    
    if code in packCache:
       return packCache[code]
    
    packed = compressor.compress(parse(code))
    packCache[code] = packed
    
    return packed



class OutputManager:

    def __init__(self, session, assetManager=None, compressionLevel=1, formattingLevel=0):

        Console.info("Initializing OutputManager...")
        Console.indent()
        Console.info("Formatting Level: %s", formattingLevel)
        Console.info("Compression Level: %s", compressionLevel)

        self.__session = session

        self.__assetManager = assetManager
        self.__fileManager = FileManager(session)

        self.__scriptOptimization = Optimization()
        
        self.__compressGeneratedCode = False

        self.__kernelClasses = []

        if compressionLevel > 0:
            self.__scriptOptimization.enable("variables")
            self.__scriptOptimization.enable("declarations")
            
            self.__compressGeneratedCode = True

        if compressionLevel > 1:
            self.__scriptOptimization.enable("blocks")
            self.__scriptOptimization.enable("privates")

        self.__scriptFormatting = Formatting()

        if formattingLevel > 0:
            self.__scriptFormatting.enable("semicolon")
            self.__scriptFormatting.enable("comma")

        Console.outdent()


    def deployAssets(self, classes, assetFolder=None):
        """
        Deploys assets for the given classes and all their dependencies

        :param classes: List of classes to deploy assets for
        :type classes: list
        :param assetFolder: Destination folder of assets (defaults to $prefix/asset)
        :type assetFolder: string
        """

        Console.info("Deploying assets...")
        Console.indent()

        resolver = Resolver(self.__session)

        for className in classes:
            resolver.addClassName(className)

        self.__assetManager.deploy(resolver.getIncludedClasses(), assetFolder=assetFolder)

        Console.outdent()


    def storeKernel(self, fileName, classes=None, debug=False):
        """
        Writes a so-called kernel script to the given location. This script contains
        data about possible permutations based on current session values. It optionally
        might include asset data (useful when boot phase requires some assets) and 
        localization data (if only one locale is built).
        
        Optimization of the script is auto-enabled when no other information is given.
        
        This method returns the classes which are included by the script so you can 
        exclude it from the real other generated output files.
        """
        
        Console.info("Storing kernel...")
        Console.indent()
        
        # Use a new permutation based on debug settings and statically configured fields
        self.__session.setStaticPermutation(debug=debug)

        # Build resolver
        # We need the permutation here because the field configuration might rely on detection classes
        resolver = Resolver(self.__session)

        detectionClasses = self.__session.getFieldDetectionClasses()
        for className in detectionClasses:
            resolver.addClassName(className)

        # Jasy client side classes to hold data
        resolver.addClassName("jasy.Env")
        resolver.addClassName("jasy.Asset")
        resolver.addClassName("jasy.Translate")

        # Allow kernel level mass loading of scripts (required for source, useful for build)
        resolver.addClassName("core.io.Script")
        resolver.addClassName("core.io.Queue")

        if classes:
            for className in classes:
                resolver.addClassName(className)

        # Generate boot code 
        bootCode = "jasy.Env.setFields(%s);" % self.__session.exportFields()

        if self.__compressGeneratedCode:
            bootCode = packCode(bootCode)

        # Sort resulting class list
        sortedClasses = resolver.getSortedClasses()
        self.storeCompressed(sortedClasses, fileName, bootCode)
        
        # Remember classes for filtering in storeLoader/storeCompressed
        self.__kernelClasses = set(sortedClasses)

        # Reset static permutation
        self.__session.resetCurrentPermutation()

        Console.outdent()


    def storeCompressed(self, classes, fileName, bootCode=None):
        """
        Combines the compressed result of the stored class list
        
        :param classes: List of sorted classes to compress
        :type classes: list
        :param fileName: Filename to write result to
        :type fileName: string
        :param bootCode: Code to execute once all the classes are loaded
        :type bootCode: string
        """

        if self.__kernelClasses:
            filtered = [ classObj for classObj in classes if not classObj in self.__kernelClasses ]
        else:
            filtered = classes

        Console.info("Compressing %s classes...", len(filtered))
        Console.indent()
        result = []

        if self.__assetManager:
            assetData = self.__assetManager.export(filtered)
            if assetData:
                assetCode = "jasy.Asset.addData(%s);" % assetData
                if self.__compressGeneratedCode:
                    result.append(packCode(assetCode))
                else:
                    result.append(assetCode)

        permutation = self.__session.getCurrentPermutation()

        try:
            for classObj in filtered:
                result.append(classObj.getCompressed(permutation, 
                    self.__session.getCurrentTranslationBundle(), self.__scriptOptimization, self.__scriptFormatting))
                
        except ClassError as error:
            raise UserError("Error during class compression! %s" % error)

        Console.outdent()

        if bootCode:
            bootCode = "(function(){%s})();" % bootCode

            if self.__compressGeneratedCode:
                result.append(packCode(bootCode))
            else:
                result.append(bootCode)

        if self.__compressGeneratedCode:
            compressedCode = "".join(result)
        else:
            compressedCode = "\n\n".join(result)

        self.__fileManager.writeFile(fileName, compressedCode)


    def storeLoader(self, classes, fileName, bootCode="", urlPrefix=""):
        """
        Generates a source loader which is basically a file which loads the original JavaScript files.
        This is super useful during development of a project as it supports pretty fast workflows
        where most often a simple reload in the browser is enough to get the newest sources.
        
        :param classes: List of sorted classes to compress
        :type classes: list
        :param fileName: Filename to write result to
        :type fileName: string
        :param bootCode: Code to execute once all classes have been loaded
        :type bootCode: string
        :param urlPrefix: Prepends the given URL prefix to all class URLs to load
        :type urlPrefix: string
        """
        
        if self.__kernelClasses:
            filtered = [ classObj for classObj in classes if not classObj in self.__kernelClasses ]
        else:
            filtered = classes

        Console.info("Generating loader for %s classes...", len(classes))
        Console.indent()
        
        main = self.__session.getMain()
        files = []
        for classObj in filtered:
            path = classObj.getPath()

            # Support for multi path classes 
            # (typically in projects with custom layout/structure e.g. 3rd party)
            if type(path) is list:
                for singleFileName in path:
                    files.append(main.toRelativeUrl(singleFileName, urlPrefix))
            
            else:
                files.append(main.toRelativeUrl(path, urlPrefix))
        
        result = []
        Console.outdent()
        
        if self.__assetManager:
            assetData = self.__assetManager.export(filtered)
            if assetData:
                assetCode = "jasy.Asset.addData(%s);" % assetData
                if self.__compressGeneratedCode:
                    result.append(packCode(assetCode))
                else:
                    result.append(assetCode)

        translationBundle = self.__session.getCurrentTranslationBundle()
        if translationBundle:
            translationData = translationBundle.export(filtered)
            if translationData:
                translationCode = 'jasy.Translate.addData(%s);' % translationData
                if self.__compressGeneratedCode:
                    result.append(packCode(translationCode))        
                else:
                    result.append(translationCode)

        if self.__compressGeneratedCode:
            loaderList = '"%s"' % '","'.join(files)
        else:
            loaderList = '"%s"' % '",\n"'.join(files)

        wrappedBootCode = "function(){ %s }" % bootCode if bootCode else "null"
        loaderCode = 'core.io.Queue.load([%s], %s, null, true);' % (loaderList, wrappedBootCode)

        if self.__compressGeneratedCode:
            result.append(packCode(loaderCode))
        else:
            result.append(loaderCode)

        if self.__compressGeneratedCode:
            loaderCode = "".join(result)
        else:
            loaderCode = "\n\n".join(result)

        self.__fileManager.writeFile(fileName, loaderCode)

