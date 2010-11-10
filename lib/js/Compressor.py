#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

from datetime import datetime
from js.core.Profiler import *
import logging

class Compressor():
    def __init__(self, classList, permutation, optimization):
        self.__classList = classList
        self.__permutation = permutation
        self.__optimization = optimization
        
    def compress(self, addHeaders=True, format=True):
        result = []
        permutation = self.__permutation
        optimization = self.__optimization
        
        pstart()
        logging.info("Compressing classes...")
        result.append("// Permutation: %s" % permutation)
        result.append("// Optimization: %s" % optimization)
        
        for classObj in self.__classList:
            if classObj == "WAIT":
                continue
            
            compressed = classObj.getCompressed(permutation, optimization, format=format)
            logging.debug("Adding %s: %s bytes", classObj, len(compressed))
            
            if addHeaders:
                result.append("")
                result.append("// %s" % classObj.getName())
                result.append("//   - Size: %s bytes" % len(compressed))
                result.append("//   - Modified: %s" % datetime.fromtimestamp(classObj.getModificationTime()).isoformat())
            
            result.append(compressed)
            
        result = "\n".join(result)
        
        pstop()
        return result

