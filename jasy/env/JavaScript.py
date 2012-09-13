#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os, random

from jasy import UserError

from jasy.core.Permutation import Permutation
import jasy.core.Console as Console

import jasy.core.File as File

from jasy.item.Class import ClassError
from jasy.js.Resolver import Resolver
from jasy.js.Sorter import Sorter

from jasy.env.State import session

import jasy.core.Json as Json

from jasy.js.parse.Parser import parse
from jasy.js.output.Compressor import Compressor


__all__ = ["storeKernel", "storeCompressed", "storeLoader"]


compressor = Compressor()
packCache = {}


def packCode(code):
    """Packs the given code by passing it to the compression engine"""
    
    if code in packCache:
       return packCache[code]
    
    packed = compressor.compress(parse(code))
    packCache[code] = packed
    
    return packed


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
    fields = session.exportFields()
    
    # This permutation injects data in the core classes and configures debugging as given by parameter
    session.setCurrentPermutation(Permutation({
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
    
    session.setCurrentPermutation(None)
    
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
            result.append(classObj.getCompressed(session.getCurrentPermutation(), session.getCurrentTranslation(), optimization, formatting))
            
    except ClassError as error:
        raise UserError("Error during class compression! %s" % error)

    Console.outdent()

    assetData = session.getAssetManager().export(classes)
    if assetData:
        assetCode = 'jasy.Asset.addData(%s);' % Json.toJson(assetData, compress=True)
        result.append(packCode(assetCode))

    if bootCode:
        wrappedBootCode = "(function(){%s})();" % bootCode
        result.append(packCode(wrappedBootCode))

    File.write(session.prependCurrentPrefix(fileName), "".join(result))


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
    
    main = session.getMain()
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
    
    assetData = session.getAssetManager().export(classes)
    if assetData:
        assetCode = 'jasy.Asset.addData(%s);' % Json.toJson(assetData, compress=True)
        result.append(packCode(assetCode))

    translationBundle = session.getCurrentTranslation()
    if translationBundle:
        translationData = translationBundle.export(classes)
        if translationData:
            translationCode = 'jasy.Translate.addData(%s);' % translationData
            result.append(packCode(translationCode))        

    wrappedBootCode = "function(){%s}" % bootCode if bootCode else "null"
    loaderCode = 'core.io.Queue.load([%s], %s, null, true);' % (loader, wrappedBootCode)
    result.append(packCode(loaderCode))

    File.write(session.prependCurrentPrefix(fileName), "".join(result))


