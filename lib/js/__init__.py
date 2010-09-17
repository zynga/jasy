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
        dependencies = classObj.getDependencies()
        for depClassName in dependencies:
            if not depClassName in self.classes:
                continue

            elif depClassName == className or depClassName in collection:
                continue

            elif not depClassName in collection:
                depClassObj = self.classes[depClassName]
                self.__resolveDependencies(depClassObj, collection)


    def getRecursiveDeps(self, className):
        """ Returns recursively resolved dependencies of given class """
        if not className in self.recursiveDeps:
            self.__recursiveDepsRecurser(className, [])
            
        return self.recursiveDeps[className]
            
            
    def __recursiveDepsRecurser(self, className, stack):
        """ Compute all (recursive) depdencies of the given class """
        if className in self.recursiveDeps:
            return self.recursiveDeps[className]

        result = set()
        
        if className in stack:
            through = stack[stack.index(className)+1]

            if not className in self.circularDeps:
                self.circularDeps[className] = set()

            if not through in self.circularDeps:
                self.circularDeps[through] = set()
                    
            if not through in self.circularDeps[className]:
                print("Circular dependency: %s <=> %s" % (className, through))
                self.circularDeps[className].add(through)

            # Store alternative way as well
            if not className in self.circularDeps[through]:
                self.circularDeps[through].add(className)
            
            # More informative debugging
            # stack.append(className)
            # print("Circular dependency: %s" % " => ".join(stack[stack.index(className):]) + " via " + stack[stack.index(className)+1])
            return result
        
        stack.append(className)
        
        classObj = self.classes[className]
        classDeps = classObj.getDependencies()
                
        for depName in classDeps:
            if depName == className:
                continue

            if not depName in self.classes:
                continue
                
            result.add(depName)
            result.update(self.__recursiveDepsRecurser(depName, list(stack)))

        self.recursiveDeps[className] = result
        return result
    
    

    def __addClassToSort(self, classObj, mode):
        if classObj in self.sorted:
            return
        
        print("__addClassToSort_1: %s (mode: %s)" % (classObj.getName(), mode))
        
        classDeps = classObj.getDependencies()
        sortedDeps = {}
    
        # Process dependencies and sort them by their recursive dependencies
        # Idea: Solving is easier when we are starting with the dependencies 
        # which itself have less dependencies.
        depCounts = {}
        for depName in classDeps:
            if not depName in self.classes:
                continue
                
            depObj = self.classes[depName]
            depCounts[depName] = len(self.getRecursiveDeps(depName))
            
        # Convert to sorted list
        sortedDeps = sort_by_value(depCounts)
        # print("Sorted Deps: %s: %s" % (classObj.getName(), sortedDeps))

        # Next step is to add every class to the sorted list as well
        for depName in sortedDeps:
            # Omit recursive dependencies, add them later
            if depName in self.circularDeps and classObj.getName() in self.circularDeps[depName]:
                continue

            self.__addClassToSort(self.classes[depName], "pre")
            
        print("__addClassToSort_2: %s (mode: %s)" % (classObj.getName(), mode))
            
            
        # Add current obj to list
        if not classObj in self.sorted:
            self.sorted.append(classObj)

        # Next step is to add every class to the sorted list which is part of a circular dependency
        # This way they get added as fast as possible (read: increased priority) to make the current
        # class runable
        for depName in sortedDeps:
            # Omit recursive dependencies, add them later
            #if depName in self.circularDeps and classObj.getName() in self.circularDeps[depName]:
            #    self.__addClassToSort(self.classes[depName], "post")
            pass
            
        print("__addClassToSort_3: %s (mode: %s)" % (classObj.getName(), mode))
            

        
    
    def getSortedClasses(self):
        """ Returns the sorted class list """

        if self.sorted:
            return self.sorted


        for classObj in self.getIncludedClasses():
            self.__addClassToSort(classObj, "init")




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

