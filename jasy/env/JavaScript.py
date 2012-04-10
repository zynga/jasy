#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging, os, random

from jasy.core.Error import JasyError
from jasy.core.Permutation import Permutation
from jasy.env.File import writeFile

from jasy.js.Class import ClassError
from jasy.js.Resolver import Resolver
from jasy.js.Sorter import Sorter

from jasy.env.State import session, setPermutation, startSection, getPermutation, optimization, formatting


__all__ = ["storeKernel", "storeCombined", "storeCompressed", "storeLoader"]


def storeKernel(fileName, assets=None, translations=None, debug=False):
    """
    Writes a so-called kernel script to the given location. This script contains
    data about possible permutations based on current session values. It optionally
    might include asset data (useful when boot phase requires some assets) and 
    localization data (if only one locale is built).
    
    Optimization of the script is auto-enabled when no other information is given.
    
    This method returns the classes which are included by the script so you can 
    exclude it from the real other generated output files.
    """
    
    startSection("Storing kernel...")
    
    # This exports all field values from the session
    fields = session.exportFields()
    
    # This permutation injects data in the core classes and configures debugging as given by parameter
    #
    # - fields => core.Env
    # - assets => core.Asset
    # - translations => core.Locale
    setPermutation(Permutation({
        "debug" : debug,
        "fields" : fields,
        "assets" : assets,
        "translations" : translations
    }))
    
    # Build resolver
    # We need the permutation here because the field configuration might rely on detection classes
    resolver = Resolver()
    
    # Include classes for value injection
    if fields is not None:
        resolver.addClassName("core.Env")
    
    if assets is not None:
        resolver.addClassName("core.io.Asset")
        
    if translations is not None:
        resolver.addClassName("core.locale.Translate")

    # Include IO classes
    resolver.addClassName("core.io.Queue")
    
    # Sort resulting class list
    classes = Sorter(resolver).getSortedClasses()
    storeCompressed(fileName, classes)
    
    setPermutation(None)
    
    return classes



def storeCombined(fileName, classes, bootCode=None):
    """
    Combines the unmodified content of the stored class list
    """

    try:
        result = "".join([classObj.getText() for classObj in classes])
        if bootCode:
            result += bootCode
        
    except ClassError as error:
        raise JasyError("Error during class combining! %s" % error)

    writeFile(fileName, result)



def storeCompressed(fileName, classes, bootCode="", translation=None):
    """
    Combines the compressed result of the stored class list
    
    - fileName: Filename to write to
    - classes: Classes to include in the compressed file in correct order
    - bootCode: Code to execute once all the classes are loaded
    - permutation: Permutation to apply to the classes before compression (for alternative code variants) (See Permutation.py)
    - translation: Translation to apply to the classes before compression (inlining of translation)
    """
    
    logging.info("Compressing %s classes...", len(classes))

    try:
        result = "".join([classObj.getCompressed(getPermutation(), translation, optimization, formatting) for classObj in classes])
        if bootCode:
            result += bootCode
        
    except ClassError as error:
        raise JasyError("Error during class compression! %s" % error)
        
    writeFile(fileName, result)



def storeLoader(fileName, classes, bootCode="", urlPrefix=""):
    """
    Generates a source loader which is basically a file which loads the original JavaScript files.
    This is super useful during development of a project as it supports pretty fast workflows
    where most often a simple reload in the browser is enough to get the newest sources.
    
    - fileName: Filename to write to
    - classes: Classes to include in the compressed file in correct order
    - bootCode: Code to run after all defined classes have been loaded.
    - prefixUrl: Useful when the project files are stored on another domain (CDN). Puts the given URL prefix in front of all URLs to load.
    """
    
    logging.info("Building source loader (%s classes)...", len(classes))

    main = session.getMain()
    files = []
    for classObj in classes:
        # Support for multi path classes (e.g. in manual mode)
        path = classObj.getPath()
        if type(path) is list:
            for split in path:
                files.append(main.toRelativeUrl(split, urlPrefix))
        else:
            files.append(main.toRelativeUrl(path, urlPrefix))
    
    loader = '"%s"' % '","'.join(files)
    boot = "function(){%s}" % bootCode if bootCode else "null"
    result = 'core.io.Queue.load([%s], %s, null, true)' % (loader, boot)

    writeFile(fileName, result)


