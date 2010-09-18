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



class JsCircularDependencyBreaker(Exception):
    def __init__(self, className):
        self.breakAt = className
        Exception.__init__(self, "Circular dependency to: %s" % className)



def sort_by_value(d):
    """ Returns the keys of dictionary d sorted by their values """
    items=d.items()
    backitems=[ [v[1],v[0]] for v in items]
    backitems.sort()
    return [ backitems[i][1] for i in range(0,len(backitems))]


class JsResolver():
    def __init__(self, session):
        # Required classes by the user
        self.required = []
        
        # Keep session reference
        self.session = session
        
        # Collecting all available classes
        self.classes = {}
        for project in session.getProjects():
            self.classes.update(project.getClasses())      

        # Included classes after dependency calculation
        self.included = []
        
        # Recursively resolved dependencies of every class
        self.recursiveDeps = {}
        
        # Circular dependencies detected during recursive collection
        self.circularDeps = {}

        # Sorted included classes
        self.sorted = []
        
        
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
        
        
        
        

    def getIncludedClasses(self):
        """ Returns the unsorted list of classes with resolved dependencies """

        if self.included:
            return self.included
        
        collection = {}
        for classObj in self.required:
            print("Require: %s" % classObj)
            self.__resolveDependencies(classObj, collection)
            
        self.included = list(collection.values())
        print("Included classes: %s" % len(self.included))      
        
        return self.included
        
            
    def __resolveDependencies(self, classObj, collection):
        # Add current
        className = classObj.getName()
        collection[className] = classObj

        # Process dependencies
        dependencies = self.__getDeps(classObj)
        for depClassName in dependencies:
            if not depClassName in self.classes:
                continue

            elif depClassName == className or depClassName in collection:
                continue

            elif not depClassName in collection:
                depClassObj = self.classes[depClassName]
                self.__resolveDependencies(depClassObj, collection)









    def getRecursiveDeps(self, classObj):
        """ Returns recursively resolved dependencies of given class """
        
        className = classObj.getName()
        if not className in self.recursiveDeps:
            print("Computing recursive deps of: %s" % className)
            result = self.__recursivelyCollect(className, [])
            #self.recursiveDeps[className] = result
                        

        
        return self.recursiveDeps[className]
            
            
    def __recursivelyCollect(self, className, stack):
        if className in stack:
            raise JsCircularDependencyBreaker(className)
            
        indent1 = "  " * len(stack)
        print("%sBegin: %s" % (indent1, className))
            
        stack.append(className)
        indent = "  " * len(stack)

        result = set()
        
        classObj = self.classes[className]
        classDeps = self.__getDeps(classObj)
        
        for depName in classDeps:
            if depName in self.recursiveDeps:
                print("%sFast-path: %s" % (indent, depName))
                if className in self.recursiveDeps[depName]:
                    print("%sIgnore dependency %s of %s because of being circular" % (indent, depName, className))
                else:
                    result.update(self.recursiveDeps[depName])
                    result.add(depName)
                
            else:
                try:
                    current = self.__recursivelyCollect(depName, list(stack))
                except JsCircularDependencyBreaker as circularError:
                    if circularError.breakAt == className:
                        # print("%sRaise matching: %s == %s because of %s" % (indent, circularError.breakAt, className, depName))
                        print("%sIgnoring %s (because of circular dependency)" % (indent, depName))
                        continue  
                    else:
                        # print("%sRaise bubble: %s != %s because of %s" % (indent, circularError.breakAt, className, depName))
                        raise circularError
                
                result.update(current)
                result.add(depName)
         
         
        self.recursiveDeps[className] = result
        print("%sSuccessful at %s: %s" % (indent1, className, result))
        return result      
            

        
        
    def __getDeps(self, classObj):
        result = []
        for key in classObj.getDependencies():
            if key in self.classes:
                result.append(key)
                
        return result
    
    

    def __addClassToSort(self, classObj, stack):
        if classObj in self.sorted:
            return
            
        stack.append(classObj)
        
        
        #deps = self.__getDeps(classObj)
        #print("Deps: %s" % deps)
        
        deps = self.getRecursiveDeps(classObj)
        print(deps)
        
        
        
        print("Add: %s" % classObj)
        self.sorted.append(classObj)
            
        
        


            

        
    
    def getSortedClasses(self):
        """ Returns the sorted class list """

        if self.sorted:
            return self.sorted


        for classObj in self.getIncludedClasses():
            self.__addClassToSort(classObj, [])




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

