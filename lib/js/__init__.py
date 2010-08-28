#
# JavaScript Tools - Main
# Copyright 2010 Sebastian Werner
#

from js.Project import project
from js.Parser import parse
from js.Dependencies import deps
from js.Compressor import compress

from js.optimizer import CombineDeclarations
from js.optimizer import LocalVariables
from js.optimizer import Variants

from js.Util import compareToKey


def getProjectFiles(projects):
    knownClasses = {}
    knownResources = {}
    knownTranslations = {}

    for folder in projects:
        info = project(folder)

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
        tree = parse(fileContent, filePath)
        treeCache[filePath] = tree
        
    return tree


depsCache = {}

def getDeps(filePath):
    try:
        dependencies = depsCache[filePath]
    except KeyError:
        tree = getTree(filePath)
        dependencies = deps(tree)
        depsCache[filePath] = dependencies
        
    return dependencies


def resolveDependencies(className, classes, requiredClasses=None):
    if requiredClasses == None:
        requiredClasses = set()
        
    # Debug
    print("  - Add: %s" % className)
        
    # Append current
    requiredClasses.add(className)

    # Compute dependencies
    dependencies = getDeps(classes[className])
    
    # Process dependencies
    for entry in dependencies:
        if entry == className or entry in requiredClasses:
            continue

        elif not entry in classes:
            #print("  - Unknown: %s" % depClassName)
            continue

        elif not entry in requiredClasses:
            resolveDependencies(entry, classes, requiredClasses)
            
    return requiredClasses
    
    
def sortClasses(requiredClasses, knownClasses):
    def classComparator(classNameA, classNameB):
        dependencies = getDeps(knownClasses[classNameA])
        if classNameB in dependencies:
            return 1
        dependencies = getDeps(knownClasses[classNameB])
        if classNameA in dependencies:
            return -1
        return 0    
        
    return sorted(requiredClasses, key=compareToKey(classComparator))
    
    
