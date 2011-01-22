#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging, itertools, time, atexit, json
from jasy.core.Permutation import Permutation
from jasy.core.Translation import Translation
from jasy.Project import Project
from jasy.core.Info import *
from jasy.core.File import *
from jasy.core.Profiler import *
from jasy.core.LocaleData import storeLocale
from jasy.Resolver import Resolver
from jasy.Optimization import Optimization
from jasy.Combiner import Combiner
from jasy.Sorter import Sorter


def toJSON(obj, sort_keys=False):
    return json.dumps(obj, separators=(',',':'), ensure_ascii=False, sort_keys=sort_keys)
    

class Session():
    def __init__(self):
        atexit.register(self.close)

        self.__timestamp = time.time()
        self.__projects = []
        self.__localeProjects = {}
        self.__values = {}
    
    
    #
    # Project Managment
    #
        
    def addProject(self, project):
        self.__projects.append(project)
        self.__values.update(project.getValues())
        
        
    def removeProject(self, project):
        self.__projects.remove(project)
        
    def getProjects(self, permutation=None):
        # Dynamically add the locale matching CLDR project to the list
        dynadd = []
        if permutation:
            locale = permutation.get("jasy.locale")
            if locale != "default":
                if not locale in self.__localeProjects:
                    localePath = localeProject(locale)
                    if not os.path.exists(localePath):
                        storeLocale(locale)
                
                    self.__localeProjects[locale] = Project(localePath)
            
                dynadd.append(self.__localeProjects[locale])
        
        return self.__projects + dynadd
    
    
    #
    # Core
    #
        
    def clearCache(self):
        for project in self.__projects:
            project.clearCache()

    def close(self):
        logging.info("Closing session...")
        for project in self.__projects:
            project.close()
    
    
    #
    # Permutation Support
    #
    
    def addValue(self, name, values, test=None):
        if type(values) != list:
            values = [values]
            
        if not name in self.__values:
            raise Exception("Unsupported key: %s" % name)
            
        entry = self.__values[name]
            
        if "check" in entry:
            check = entry["check"]
            for value in values:
                if check == "Boolean" and type(value) == bool:
                    pass
                elif check == "String" and type(value) == str:
                    pass
                elif check == "Number" and type(value) in (int, float):
                    pass
                elif type(check) == list and value in check:
                    pass
                else:
                    raise Exception("Unsupported value %s for %s" % (name, value))
        
        entry["values"] = values

        if test:
            entry["test"] = test
        
        
    def getPermutations(self):
        """
        Combines all values to a set of permutations.
        These define all possible combinations of the configured settings
        """
        
        values = {}
        for key in self.__values:
            entry = self.__values[key]
            if "values" in entry:
                values[key] = entry["values"]
            elif "default" in entry:
                values[key] = [entry["default"]]

        # Thanks to eumiro via http://stackoverflow.com/questions/3873654/combinations-from-dictionary-with-list-values-using-python
        names = sorted(values)
        combinations = [dict(zip(names, prod)) for prod in itertools.product(*(values[name] for name in names))]
        permutations = [Permutation(combi) for combi in combinations]

        return permutations


    def __permutationsToExpr(self):
        #
        # Export structure:
        # [ [ name, [value1, ...], test? ], ...]
        #
        
        export = []
        for key in sorted(self.__values):
            source = self.__values[key]
            
            content = []
            content.append("'%s'" % key)
            
            if "values" in source:
                if "test" in source and len(source["values"]) > 1:
                    content.append(toJSON(source["values"]))
                    content.append(source["test"])
            
                else:
                    content.append(toJSON(source["values"][0]))

            elif "default" in source:
                content.append("%s" % toJSON(source["default"]))
                
            else:
                continue
                
            export.append("[%s]" % ",".join(content))
            
        return "[%s]" % ",".join(export)
    
    
    def writeLoader(self, fileName):
        permutation = Permutation({
          "jasy.values" : self.__permutationsToExpr()
        })
        
        resolver = Resolver(self.getProjects(), permutation)
        resolver.addClassName("jasy.Permutation")

        optimization = Optimization(["unused", "privates", "variables", "declarations", "blocks"])
        combinedCode = Combiner(permutation, None, optimization).compress(Sorter(resolver, permutation).getSortedClasses())
        writefile(fileName, combinedCode)
        
        return resolver.getIncludedClasses()
        
        
    
    
    
    #
    # Translation Support
    #
    
    def getAvailableTranslations(self):
        """ 
        Returns a set of all available translations 
        
        This is the sum of all projects so even if only one 
        project supports fr_FR then it will be included here.
        """
        
        supported = set()
        for project in self.__projects:
            supported.update(project.getTranslations().keys())
            
        return supported
    
    
    def getTranslation(self, locale):
        """ 
        Returns a translation object for the given locale containing 
        all relevant translation files for the current project set. 
        """
        
        # Prio: de_DE => de => C (default locale) => Code
        check = [locale]
        if "_" in locale:
            check.append(locale[:locale.index("_")])
        check.append("C")
        
        files = []
        for entry in check:
            for project in self.__projects:
                translations = project.getTranslations()
                if entry in translations:
                    files.append(translations[entry])
        
        return Translation(locale, files)

