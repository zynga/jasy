#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

from jasy.core.Profiler import *
import logging, os

class Loader():
    def __init__(self, classList, relPath="./"):
        self.__classList = classList
        self.__relPath = relPath

        
    def generate(self, bootCode):
        logging.info("Generating loader...")
        
        relPath = self.__relPath
        
        if bootCode:
            boot = "function(){%s}" % bootCode
        else:
            boot = "null"

        result = 'jasy.Loader.loadScripts([%s], %s)' % (",".join(['"%s"' % os.path.join(relPath, classObj.path) for classObj in self.__classList]), boot)
        
        return result

