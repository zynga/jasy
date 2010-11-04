#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import logging, re, json, os
from js.core.Profiler import *


class Resources:
    def __init__(self, session, classes):
        self.__session = session
        self.__classes = classes
        
        
    def getMerged(self):
        """ 
        Returns the merged list of all resources and their origin.
        
        Resources might be overritten by projects listed later in the
        project chain.
        """
        
        try:
            return self.__collection
        
        except AttributeError:
            result = {}
            for project in self.__session.getProjects():
                for resource in project.getResources():
                    result[resource] = project

            self.__collection = result
            return result
        
    
    def getFiltered(self):
        """ 
        Returns a list of resources which is used by the classes
        given at creation time.
        """
        try:
            return self.__resources
        
        except AttributeError:
            pstart()
            
            # Merge asset hints from all classes and remove duplicates
            assets = set()
            for classObj in self.__classes:
                assets.update(classObj.getMeta().assets)

            # Filter assets by joined hints in classes
            expr = re.compile("^%s$" % "|".join(["(%s)" % asset.replace("*", ".*") for asset in assets]))
            result = list(filter(lambda x: expr.match(x), self.getMerged()))
            
            logging.info("Selected classes make use of %s resources" % len(result))
            self.__resource = result
            pstop()
            return result
        
    
    def getAliasMap(self):
        projects = self.__session.getProjects()

        # map namespace to full resource path
        namespaces = dict((project.namespace, project.resourcePath) for project in projects)

        # regular expression matching all namespaces
        ns = re.compile("^(%s)(/.+)$" % '|'.join([project.namespace for project in projects]))
        
        
        index = self.index()
        result = {}
        sep = os.path.sep
        for resource in index:
            
            resProject = None
            resWidth = None
            resHeight = None
            resFormat = None
            
            for project in projects:
                if os.path.isfile("%s%s%s" % (project.resourcePath, sep, resource)):
                    resProject = project
                    
            
                
            
            
            
            #if match:
            #    result[resource] = "%s%s" % (namespaces[match.group(1)], match.group(2))
            #else:
            #    logging.error("No namespace match for: %s" % resource)
        
        return result
        
        

    def getAliasMapAsJson(self):
        return json.dumps(self.getAliasMap())