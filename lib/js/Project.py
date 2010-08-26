#
# JavaScript Tools - Project Manifest Handling
# Copyright 2010 Sebastian Werner
#

import os
from ConfigParser import SafeConfigParser


def project(folder):
    parser = SafeConfigParser()
    parser.read(os.path.join(folder, "manifest.cfg"))

    title = parser.get("main", "title")
    profile = parser.get("main", "profile")
    namespace = parser.get("main", "namespace")
    
    print "Project: %s (%s)" % (title, namespace)
    classes, resources, translations = globals()["__" + profile](folder, namespace)
    print "  - %s classes, %s resources, %s translations" % (len(classes), len(resources), len(translations))

    return classes, resources, translations
    
    

def __qooxdoo(folder, namespace):
    classPath = os.path.join(folder, "source", "class")
    resourcePath = os.path.join(folder, "source", "resource")
    translationPath = os.path.join(folder, "source", "translation") 
    
    # print "Class Modification: %s" % os.path.getmtime(classPath)
    # print "Resource Modification: %s" % os.path.getmtime(resourcePath)
    # print "Translation Modification: %s" % os.path.getmtime(translationPath)

    dirFilter = [".svn",".git",".hg"]

    # List classes
    classes = {}
    classPathLen = len(classPath) + 1
    for dirPath, dirNames, fileNames in os.walk(classPath):
        for dirName in dirNames:
            if dirName in dirFilter:
                dirNames.remove(dirName)
        
        for fileName in fileNames:
            if fileName[0] == "." or "_" in fileName or not fileName.endswith(".js"):
                continue
                
            filePath = os.path.join(dirPath, fileName)
            relPath = filePath[classPathLen:]
            className = os.path.splitext(relPath)[0].replace("/", ".")
            
            classes[className] = filePath
            
            
    # List resources
    resources = {}
    resourcePathLen = len(resourcePath) + 1
    for dirPath, dirNames, fileNames in os.walk(resourcePath):
        for dirName in dirNames:
            if dirName in dirFilter:
                dirNames.remove(dirName)
        
        for fileName in fileNames:    
            if fileName[0] == ".":
                continue
            
            filePath = os.path.join(dirPath, fileName)
            relPath = filePath[resourcePathLen:]            

            resources[relPath] = filePath
            

    # List translations    
    translations = {}
    for dirPath, dirNames, fileNames in os.walk(translationPath):
        for dirName in dirNames:
            if dirName in dirFilter:
                dirNames.remove(dirName)
        
        for fileName in fileNames:    
            if fileName[0] == "." or not fileName.endswith(".po"):
                continue
                
            translations[os.path.splitext(fileName)[0]] = os.path.join(dirPath, fileName)
            


    return classes, resources, translations