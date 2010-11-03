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

            projects = self.__session.getProjects()
            result = set()
            for project in projects:
                for resource in project.getResources():
                    if expr.match(resource):
                        result.add(resource)
                    
            logging.info("Classes use %s resources" % len(result))
            self.__resource = result
            pstop()
            return result
        
    
    