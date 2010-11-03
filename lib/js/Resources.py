#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import logging, re
from js.core.Profiler import *


class Resources:
    def __init__(self, session, classes):
        self.__session = session
        self.__classes = classes
        
    
    def index(self):
        try:
            return self.__resources
        
        except AttributeError:
            pstart()
            
            assets = set()
            for classObj in self.__classes:
                assets.update(classObj.getMeta().assets)

            logging.info("Found %s assets directives" % len(assets))
            expr = re.compile("^%s$" % "|".join(["(%s)" % asset.replace("*", ".*") for asset in assets]))

            result = set()
            for project in self.__session.getProjects():
                for resource in project.getResources():
                    if expr.match(resource):
                        result.add(resource)
                    
            logging.info("Classes use %s resources" % len(result))
            self.__resource = result
            pstop()
            return result
        
    
    def fullpaths(self):
        # map namespace to full resource path
        namespaces = dict((project.namespace, project.resourcePath) for project in self.__session.getProjects())

        # regular expression matching all namespaces
        ns = re.compile("^(%s)(/.+)$" % '|'.join([project.namespace for project in self.__session.getProjects()]))
        
        index = self.index()
        result = {}
        for resource in index:
            match = ns.match(resource)
            if match:
                result[resource] = "%s%s" % (namespaces[match.group(1)], match.group(2))
            else:
                logging.error("No namespace match for: %s" % resource)
        
        
        print(result)
        
        
    