#
# JavaScript Tools - Main
# Copyright 2010 Sebastian Werner
#

from js.Project import project as jsproject
from js.Parser import parse as jsparse
from js.Dependencies import deps as jsdeps
from js.Compressor import compress as jscompress

from js.optimizer import CombineDeclarations
from js.optimizer import LocalVariables
from js.optimizer import Variants


treeCache = {}

def getTree(filePath):
    tree = getattr(treeCache, filePath, None)
    if not tree:
        fileContent = open(filePath).read()
        tree = jsparse(fileContent, filePath)
        treeCache[filePath] = tree
        
    return tree


depsCache = {}

def getDeps(filePath):
    deps = getattr(depsCache, filePath, None)
    if not deps:
        tree = getTree(filePath)
        deps = jsdeps(tree)
        depsCache[filePath] = deps
        
    return deps


def resolveDependencies(className, classes, result=None):
    if result == None:
        result = set()
        
    # Debug
    print("Add: %s" % className)
        
    # Append current
    result.add(className)

    # Compute dependencies
    depGlobals, depClassNames = getDeps(classes[className])
    
    # Process dependencies
    for depClassName in depClassNames:
        if depClassName == className or depClassName in result:
            continue

        elif not depClassName in classes:
            #print("  - Unknown: %s" % depClassName)
            continue

        elif not depClassName in result:
            resolveDependencies(depClassName, classes, result)
    
    

