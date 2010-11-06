#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

from js.core.Profiler import *
import logging

class Loader():
    def __init__(self, classList):
        self.__classList = classList

        
    def generate(self, bootCode):
        config = "$LAB.setGlobalDefaults({AlwaysPreserveOrder:true});\n"
        
        result = ["$LAB"]
        
        pstart()
        logging.info("Generating loader...")
        
        scripts = []
        for classObj in self.__classList:
            if classObj == "WAIT":
                result.append('script(["%s"])' % '","'.join(scripts))
                scripts = []
                
            else:
                scripts.append(classObj.path)
                
        # Append remaining scripts
        result.append('script(["%s"])' % '","'.join(scripts))
                
        if bootCode:
            result.append("wait(function(){%s})" % bootCode)
            
        result = "%s%s" % (config, "\n.".join(result))
        pstop()
        
        return result

