#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

from jasy.core.Profiler import *
import logging

class Loader():
    def __init__(self, classList):
        self.__classList = classList

        
    def generate(self, bootCode):
        logging.info("Generating loader...")
        
        result = "$LAB.setGlobalDefaults({AlwaysPreserveOrder:true});"
        result += '$LAB.script([%s])' % ",".join(['"%s"' % classObj.path for classObj in self.__classList])
                
        if bootCode:
            result += ".wait(function(){%s})" % bootCode
        
        return result

