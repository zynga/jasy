#
# JavaScript Tools - Project Manifest Handling
# Copyright 2010 Sebastian Werner
#

import os
from ConfigParser import SafeConfigParser

def manifest(folder):
    parser = SafeConfigParser()
    parser.read(os.path.join(folder, "manifest.cfg"))

    title = parser.get("main", "title")
    profile = parser.get("main", "profile")
    namespace = parser.get("main", "namespace")
    
    
    
    globals()["__" + profile](title, folder, namespace)
    

    return dict(parser.items("main"))
    
    

def __qooxdoo(title, folder, namespace):
    print "Project: %s (%s)" % (title, namespace)
    print "Folder: %s" % folder
    
    classPath = os.path.join(folder, "source", "class", namespace)
    resourcePath = os.path.join(folder, "source", "resource", namespace)
    # TODO: Any chance to move translation into namespace as well?
    translationPath = os.path.join(folder, "source", "translation") 
    
    
    print "Class Modification: %s" % os.path.getmtime(classPath)
    print "Resource Modification:os.path.splitext %s" % os.path.getmtime(resourcePath)
    print "Translation Modification: %s" % os.path.getmtime(translationPath)


    classPathLen = len(classPath) + 1
    for dirPath, dirNames, fileNames in os.walk(classPath):
        for dirName in dirNames:
            if dirName in [".svn",".git",".hg"]:
                dirNames.remove(dirName)
        
        for fileName in fileNames:
            if "_" in fileName:
                continue
            
            filePath = os.path.join(dirPath, fileName)
            relPath = filePath[classPathLen:]
            className = os.path.splitext(relPath)[0].replace("/", ".")
            
            print className
    