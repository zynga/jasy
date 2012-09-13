#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os

import jasy.core.Console as Console
import jasy.core.File as File
import jasy.core.Json as Json

from jasy.core.Permutation import Permutation
from jasy.item.Class import ClassError
from jasy.js.Resolver import Resolver
from jasy.js.Sorter import Sorter
from jasy.js.parse.Parser import parse
from jasy.js.output.Compressor import Compressor
from jasy import UserError


compressor = Compressor()
packCache = {}


def packCode(code):
    """Packs the given code by passing it to the compression engine"""
    
    if code in packCache:
       return packCache[code]
    
    packed = compressor.compress(parse(code))
    packCache[code] = packed
    
    return packed



class Output:

    def __init__(self, session, compress=True):

        self.__session = session
        self.__compress = compress



    def storeKernel(fileName, debug=False, optimization=None, formatting=None):
        """
        Writes a so-called kernel script to the given location. This script contains
        data about possible permutations based on current session values. It optionally
        might include asset data (useful when boot phase requires some assets) and 
        localization data (if only one locale is built).
        
        Optimization of the script is auto-enabled when no other information is given.
        
        This method returns the classes which are included by the script so you can 
        exclude it from the real other generated output files.
        """
        
        Console.header("Storing kernel")
        
        # This exports all field values from the session
        fields = self.__session.exportFields()
        
        # This permutation injects data in the core classes and configures debugging as given by parameter
        self.__session.setCurrentPermutation(Permutation({
            "debug" : debug,
            "fields" : fields
        }))
        
        # Build resolver
        # We need the permutation here because the field configuration might rely on detection classes
        resolver = Resolver()
        resolver.addClassName("core.Env")
        resolver.addClassName("core.io.Queue")
        resolver.addClassName("jasy.Asset")
        resolver.addClassName("jasy.Translate")
        
        # Sort resulting class list
        classes = resolver.getSortedClasses()
        storeCompressed(classes, fileName, optimization=optimization, formatting=formatting)
        
        self.__session.setCurrentPermutation(None)
        
        return classes


    def storeCompressed(classes, fileName, bootCode=None, optimization=None, formatting=None):
        """
        Combines the compressed result of the stored class list
        
        - classes: List of sorted classes to compress
        - fileName: Filename to write result to
        - bootCode: Code to execute once all the classes are loaded
        """
        
        Console.info("Merging compressed output of %s classes...", len(classes))
        Console.indent()
        result = []
        
        try:
            for classObj in classes:
                result.append(classObj.getCompressed(self.__session.getCurrentPermutation(), self.__session.getCurrentTranslation(), optimization, formatting))
                
        except ClassError as error:
            raise UserError("Error during class compression! %s" % error)

        Console.outdent()

        assetCode = self.__session.getAssetManager().export(classes, compress=True)
        if assetCode:
            result.append(packCode(assetCode))

        if bootCode:
            result.append(packCode("(function(){%s})();" % bootCode))

        File.write(self.__session.prependCurrentPrefix(fileName), "".join(result))


    def storeLoader(classes, fileName, bootCode="", urlPrefix=""):
        """
        Generates a source loader which is basically a file which loads the original JavaScript files.
        This is super useful during development of a project as it supports pretty fast workflows
        where most often a simple reload in the browser is enough to get the newest sources.
        
        - classes: List of sorted classes to compress
        - fileName: Filename to write result to
        - bootCode: Code to execute once all classes have been loaded
        - urlPrefix: Prepends the given URL prefix to all class URLs to load
        """
        
        Console.info("Generating loader for %s classes...", len(classes))
        Console.indent()
        
        main = self.__session.getMain()
        files = []
        for classObj in classes:
            path = classObj.getPath()

            # Support for multi path classes 
            # (typically in projects with custom layout/structure e.g. 3rd party)
            if type(path) is list:
                for singleFileName in path:
                    files.append(main.toRelativeUrl(singleFileName, urlPrefix))
            
            else:
                files.append(main.toRelativeUrl(path, urlPrefix))
        
        loader = '"%s"' % '","'.join(files)
        result = []
        Console.outdent()
        
        assetCode = self.__session.getAssetManager().export(classes, compress=True)
        if assetCode:
            result.append(packCode(assetCode))

        translationBundle = self.__session.getCurrentTranslation()
        if translationBundle:
            translationData = translationBundle.export(classes)
            if translationData:
                translationCode = 'jasy.Translate.addData(%s);' % translationData
                result.append(packCode(translationCode))        

        wrappedBootCode = "function(){%s}" % bootCode if bootCode else "null"
        loaderCode = 'core.io.Queue.load([%s], %s, null, true);' % (loader, wrappedBootCode)
        result.append(packCode(loaderCode))

        File.write(self.__session.prependCurrentPrefix(fileName), "".join(result))


