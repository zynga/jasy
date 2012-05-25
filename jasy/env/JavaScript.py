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


__all__ = ["storeKernel", "storeAssets", "storeCompressed", "storeLoader"]


def storeKernel(fileName, debug=False):
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
    setPermutation(Permutation({
        "debug" : debug,
        "fields" : fields
    }))
    
    # Build resolver
    # We need the permutation here because the field configuration might rely on detection classes
    resolver = Resolver()
    resolver.addClassName("core.Env")
    resolver.addClassName("core.io.Asset")
    resolver.addClassName("core.io.Queue")
    
    # Sort resulting class list
    storeCompressed(resolver, fileName)
    
    setPermutation(None)
    
    return resolver.getIncludedClasses()



def storeAssets(resolver, folder="asset"):
    """Deploys assets to the given folder"""

    startSection("Publishing assets...")
    session.getAssetManager().deploy(resolver.getIncludedClasses(), assetFolder=folder)



def storeCompressed(resolver, fileName, bootCode="", assets=None):
    """
    Combines the compressed result of the stored class list
    
    - fileName: Filename to write to
    - resolver: Resolver which contains all relevant classes
    - bootCode: Code to execute once all the classes are loaded
    """
    
    logging.info("Compressing %s classes...", len(resolver.getIncludedClasses()))
    classes = Sorter(resolver).getSortedClasses()
    result = []
    
    try:
        # FIXME
        translation = None 
        
        for classObj in classes:
            result.append(classObj.getCompressed(getPermutation(), translation, optimization, formatting))
            
    except ClassError as error:
        raise JasyError("Error during class compression! %s" % error)

    if assets is None:
        assets = session.getAssetManager().export(classes)

    if assets:
        result.append('core.io.Asset.addData(%s);' % assets)

    if bootCode:
        result.append(bootCode)
        
    writeFile(fileName, "\n".join(result))



def storeLoader(resolver, fileName, bootCode="", urlPrefix="", assets=None):
    """
    Generates a source loader which is basically a file which loads the original JavaScript files.
    This is super useful during development of a project as it supports pretty fast workflows
    where most often a simple reload in the browser is enough to get the newest sources.
    
    - fileName: Filename to write to
    - resolver: Resolver which contains all relevant classes
    - bootCode: Code to run after all defined classes have been loaded.
    - urlPrefix: Useful when the project files are stored on another domain (CDN). Puts the given URL prefix in front of all URLs to load.
    """
    
    logging.info("Building source loader (%s classes)...", len(resolver.getIncludedClasses()))
    classes = Sorter(resolver).getSortedClasses()
    
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
    result = []

    if assets is None:
        assets = session.getAssetManager().export(classes)
        
    if assets:
        result.append('core.io.Asset.addData(%s);' % assets)

    # FIXME
    #result.append('core.locale.Translations.addData(%s);' % translations.export())
    
    result.append('core.io.Queue.load([%s], %s, null, true);' % (loader, boot))

    writeFile(fileName, "\n".join(result))


