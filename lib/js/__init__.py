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

from js.Util import compareToKey


def getProjectFiles(projects):
    knownClasses = {}
    knownResources = {}
    knownTranslations = {}

    for folder in projects:
        info = jsproject(folder)

        knownClasses.update(info[0])
        knownResources.update(info[1])
        knownTranslations.update(info[2])
        
    print()  
    print("Project Index Complete")
    print("Indexed: %s classes, %s resources, %s translations" % (len(knownClasses), len(knownResources), len(knownTranslations)))

    return knownClasses, knownResources, knownTranslations



treeCache = {}

def getTree(filePath):
    try:
        tree = treeCache[filePath]
    except KeyError:
        fileContent = open(filePath).read()
        tree = jsparse(fileContent, filePath)
        treeCache[filePath] = tree
        
    return tree


depsCache = {}

def getDeps(filePath):
    try:
        deps = depsCache[filePath]
    except KeyError:
        tree = getTree(filePath)
        deps = jsdeps(tree)
        depsCache[filePath] = deps
        
    return deps


def resolveDependencies(className, classes, result=None):
    if result == None:
        result = set()
        
    # Debug
    print("  - Add: %s" % className)
        
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
    
    
def sortClasses(requiredClasses, knownClasses):
    def classComparator(classNameA, classNameB):
        depGlobals, depClassNames = getDeps(knownClasses[classNameA])
        if classNameB in depClassNames:
            return 1
        depGlobals, depClassNames = getDeps(knownClasses[classNameB])
        if classNameA in depClassNames:
            return -1
        return 0    
        
    return sorted(requiredClasses, key=compareToKey(classComparator))
    
    
