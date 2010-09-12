#
# JavaScript Tools - Main
# Copyright 2010 Sebastian Werner
#

import js.Parser
import js.Dependencies
import js.Compressor

import js.optimizer.CombineDeclarations
import js.optimizer.LocalVariables
import js.optimizer.Variants

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
        
        manifestPath = os.path.join(path, "manifest.cfg")
        if not os.path.exists(manifestPath):
            raise Exception("Invalid manifest configuration: %s" % manifestPath)
        
        parser = SafeConfigParser()
        parser.read(manifestPath)

        namespace = parser.get("main", "namespace")
        print("Project: %s" % namespace)
        
        
    def setSession(self, session):
        self.session = session
        
    def getSession(self):
        return self.session


    def getClassByName(self, className):
        try:
            return self.getClasses()[className]
        except KeyError:
            return None            


    def getClasses(self):
        try:
            return self.classes
            
        except AttributeError:
            classPath = os.path.join(self.path, "source", "class")
            classes = {}
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

                    classObj = JsClass(filePath, relPath, self.session)
                    className = classObj.getName()

                    classes[className] = classObj
                
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
            tree = Parser.parse(self.getText(), self.path)
            self.tree = tree
            return tree

    def getDependencies(self):
        try:
            return self.dependencies
        except AttributeError:
            try:
                dependencies, breaks = Dependencies.collect(self.getTree(), self.getName())
            except Exception as ex:
                raise Exception("Could not collect dependencies of %s: %s" % (self.name, ex))
                
            self.dependencies = dependencies
            self.breaks = breaks
            return dependencies
            
    def getBreakDependencies(self):
        try:
            return self.breaks
        except AttributeError:
            self.getDependencies()
            return self.breaks
            
    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name



class BreakDependency(Exception):
    def __init__(self, message, broken=None):
        Exception.__init__(self, message)
        
        self.broken = broken
        



def sort_by_value(d):
    """ Returns the keys of dictionary d sorted by their values """
    items=d.items()
    backitems=[ [v[1],v[0]] for v in items]
    backitems.sort()
    return [ backitems[i][1] for i in range(0,len(backitems))]


class JsResolver():
    debug = False
    
    def __init__(self, session):
        self.required = []
        self.session = session
        
        
    def addClassName(self, className):
        """Adds a class to the initial dependencies"""
        projects = self.session.getProjects()
        for project in projects:
            classObj = project.getClassByName(className)
            if classObj:
                break

        if not classObj:
            raise Exception("Unknown Class: %s" % className)
            
        self.required.append(classObj)
        

    def getClassList(self):
        """Returns the class list (with dependencies), sorted by their required load order"""
        projects = self.session.getProjects()
        available = {}
        for project in projects:
            available.update(project.getClasses())

        result = {}
        for requiredClass in self.required:
            print("Require: %s" % requiredClass)
            self.__resolveDependencies(requiredClass, available, result)
            
        print("List contains %i classes" % len(result))
        return self.__sortClasses(result)
            
            
    def __resolveDependencies(self, classObj, available, result):
        # Add current
        className = classObj.getName()
        result[className] = classObj

        # Process dependencies
        dependencies = classObj.getDependencies()
        for depClassName in dependencies:
            if not depClassName in available:
                continue

            elif depClassName == className or depClassName in result:
                continue

            elif not depClassName in result:
                depClassObj = available[depClassName]
                self.__resolveDependencies(depClassObj, available, result)

        return result


    def __sortClasses(self, classes):
        """Sorts classes by their dependecies"""
        print("Computing full class dependencies...")
        fullDeps = {}
        for className in classes:
            self.__fullDeps(className, classes, [], fullDeps)
            
        # create another dictionary which just contain the number of dependency as values
        # the idea is basically that no class can depend on another class which has the
        # identical number of full dependencies. So sorting by them is quite safe as
        # long as the user defines enough breaks to break-up circular dependencies.
        fullDepsNo = {}
        for className in fullDeps:
            fullDepsNo[className] = len(fullDeps[className])
        
        print("Sorting class list...")
        fullDepsSorted = sort_by_value(fullDepsNo)
        result = []
        for className in fullDepsSorted:
            result.append(className)
            
        return result
            
            
            
    def __fullDeps(self, className, classes, stack, cache):
        """Compute all (recursive) depdencies of the given class"""
        if className in cache:
            return cache[className]

        result = set()
        
        if className in stack:
            stack.append(className)
            print("Warn: Circular dependency: %s" % " => ".join(stack[stack.index(className):]))
            return result
        
        stack.append(className)
        
        classObj = classes[className]
        classDeps = classObj.getDependencies()
        classBreaks = classObj.getBreakDependencies()
                
        for depName in classDeps:
            # 1. Ignore unknown stuff
            # 2. Ignore breaks in class order logic
            #    Normally low-prio dependencies are added quite early, but these
            #    recursive dependencies are always a problem - at least when one
            #    uses instances of classes during load time.
            if depName in classes and not depName in classBreaks:
                result.add(depName)
                result.update(self.__fullDeps(depName, classes, list(stack), cache))

        cache[className] = result
        return result



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

