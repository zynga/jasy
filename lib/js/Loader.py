#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

from js.core.Profiler import *
import logging

class Loader():
    def __init__(self, classList):
        self.__classList = classList

        
    def generate(self, fileName=None):
        result = ["$LAB"]
        
        pstart()
        logging.info("Generating loader...")
        
        for classObj in self.__classList:
            if classObj == "WAIT":
                result.append("wait()")
                
            else:
                result.append('script("%s")' % classObj.path)
                
        result.append("wait(function(){alert('loaded')})")
            
        result = "\n.".join(result)
        pstop()
        
        if fileName:
            output = open(fileName, mode="w", encoding="utf-8")
            output.write(result)
            output.close()
            
        else:
            return result

