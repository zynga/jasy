#
# JavaScript Tools - Main
# Copyright 2010 Sebastian Werner
#

from js.Parser import parse
from js.Dependencies import deps
from js.Compressor import compress

from js.optimizer import CombineDeclarations
from js.optimizer import LocalVariables
from js.optimizer import Variants

from js.Util import compareToKey


__all__ = ["JsSession", "JsProject", "JsClass", "JsResolver", "JsCompiler"]

class JsSession():
    def __init__(self):
        self.projects = []
        pass
        
    def addProject(self, project):
        self.projects.append(project)
        project.setSession(self)
        
    def getProjects(self):
        return self.projects
        


        
import os
from configparser import SafeConfigParser
        
class JsProject():
    def __init__(self, path):
        self.path = path
        self.dirFilter = [".svn",".git",".hg"]
        
        parser = SafeConfigParser()
        parser.read(os.path.join(path, "manifest.cfg"))

        namespace = parser.get("main", "namespace")
        print("Project: %s" % namespace)
        
        
    def setSession(self, session):
        self.session = session
        
    def getSession(self):
        return self.session


    def getClassByName(self, className):
        for classObj in self.getClasses():
            if str(classObj) == className:
                return classObj
                
        return None            


    def getClasses(self):
        try:
            return self.classes
            
        except AttributeError:
            classPath = os.path.join(self.path, "source", "class")
            classes = []
            classPathLen = len(classPath) + 1
            for dirPath, dirNames, fileNames in os.walk(classPath):
                for dirName in dirNames:
                    if dirName in self.dirFilter:
                        dirNames.remove(dirName)

                for fileName in fileNames:
                    if fileName[0] == "." or "_" in fileName or not fileName.endswith(".js"):
                        continue

                    filePath = os.path.join(dirPath, fileName)
                    relPath = filePath[classPathLen:]

                    classes.append(JsClass(filePath, relPath, self.session))
                
            self.classes = classes
            return classes


    def getResources(self):
        resourcePath = os.path.join(path, "source", "resource")

        # List resources
        resources = {}
        resourcePathLen = len(resourcePath) + 1
        for dirPath, dirNames, fileNames in os.walk(resourcePath):
            for dirName in dirNames:
                if dirName in self.dirFilter:
                    dirNames.remove(dirName)

            for fileName in fileNames:    
                if fileName[0] == ".":
                    continue

                filePath = os.path.join(dirPath, fileName)
                relPath = filePath[resourcePathLen:]            

                resources[relPath] = filePath
                
        return resources


    def getTranslations(self):
        translationPath = os.path.join(path, "source", "translation")
        
        # List translations    
        translations = {}
        for dirPath, dirNames, fileNames in os.walk(translationPath):
            for dirName in dirNames:
                if dirName in self.dirFilter:
                    dirNames.remove(dirName)

            for fileName in fileNames:    
                if fileName[0] == "." or not fileName.endswith(".po"):
                    continue

                translations[os.path.splitext(fileName)[0]] = os.path.join(dirPath, fileName)
                
        return translations
        
        


class JsClass():
    def __init__(self, path, rel, session):
        self.path = path
        self.rel = rel
        self.session = session
        self.name = os.path.splitext(self.rel)[0].replace("/", ".")

    def getName(self):
        return self.name

    def getText(self):
        return open(self.path).read()

    def getTree(self):
        try:
            return self.tree
        except AttributeError:
            tree = parse(self.getText(), self.path)
            self.tree = tree
            return tree

    def getDependencies(self):
        try:
            return self.dependencies
        except AttributeError:
            dependencies = deps(self.getTree())
            self.dependencies = dependencies
            return dependencies
        
    def __str__(self):
        return self.name



class JsResolver():
    def __init__(self, session):
        self.required = []
        self.session = session
        
        
    def addClassName(self, className):
        projects = self.session.getProjects()
        for project in projects:
            classObj = project.getClassByName(className)
            if classObj:
                break

        if not classObj:
            raise Exception("Unknown Class: %s" % className)
            
        self.required.append(classObj)
        

    def getClassList(self):
        projects = self.session.getProjects()
        available = []
        
        for project in projects:
            available.extend(project.getClasses())
        
        for requiredClass in self.required:
            print("Require: %s" % requiredClass)
            print requiredClass.getDependencies()
            



class JsCompiler():
    def __init__(self, classList):
        self.classList = classList
        
    def compile(self):
        result = []
        
        for classObj in self.classList:
            tree = classObj.getTree()
            compressed = compress(tree)
            result.append(compressed)
            
        return "\n".join(result)
        
        
        



        




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
            print("%s requires %s" % (classNameA, classNameB))
            return 1
        dependencies = getDeps(knownClasses[classNameB])
        if classNameA in dependencies:
            print("%s requires %s" % (classNameB, classNameA))
            return -1
            
        print("None between: %s and %s" % (classNameA, classNameB))
        return 0    
        
    return sorted(requiredClasses, key=compareToKey(classComparator))
    
    
