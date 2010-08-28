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
        
        parser = SafeConfigParser()
        parser.read(os.path.join(path, "manifest.cfg"))

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
            dependencies = Dependencies.collect(self.getTree())
            self.dependencies = dependencies
            return dependencies
        
    def __str__(self):
        return self.name

    def __repr__(self):
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
        available = {}
        for project in projects:
            available.update(project.getClasses())

        result = {}
        for requiredClass in self.required:
            print("Require: %s" % requiredClass)
            self.__resolveDependencies(requiredClass, available, result)
            
        print("List contains %i classes" % len(result))
        print("Sorting...")

        sortedResult = self.__sortClasses(result)
        print(sortedResult)
            
            
    def __resolveDependencies(self, classObj, available, result=None):
        if result == None:
            result = {}

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
        result = []
        
        def recurser(classObj, stack):
            prefix = "  " * len(stack)

            className = classObj.getName()
            if className in stack:
                stackPos = stack.index(className)
                stack.append(className)
                print("%sStack: %s" % (prefix, "=>".join(stack[stackPos:])))
                raise Exception("Recursion detected!")
                
            
            stack.append(className)

            print("%sDeps: %s" % (prefix, className))
            dependencies = classObj.getDependencies()
            for dependentName in dependencies:
                try:
                    dependentObj = classes[dependentName]
                except KeyError:
                    continue
                    
                if dependentObj is classObj:
                    continue
                    
                if dependentObj in result:
                    continue
                    
                print("%sRecurse: %s" % (prefix, dependentName))
                recurser(dependentObj, list(stack))
                
            if not classObj in result:
                print("%sAdd: %s" % (prefix, className))
                result.append(classObj)
        
        for className in classes:
            stack = []
            classObj = classes[className]
            if not classObj in result:
                print("Start with: %s" % className)
                recurser(classObj, stack)
                print("Done with: %s" % className)
            
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

