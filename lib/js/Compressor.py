#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

from datetime import datetime
from js.core.Profiler import *
import logging, zlib

__all__ = ["Compressor","size"]

def size(content, encoding="utf-8"):
    normalSize = len(content)
    zippedSize = len(zlib.compress(content.encode(encoding)))
    
    return "Size: {:.2f}KB ({:.2f}KB zipped => {:.2%})".format(normalSize/1024, zippedSize/1024, zippedSize/normalSize)
    

class Compressor():
    def __init__(self, classList, permutation, optimization):
        self.__classList = classList
        self.__permutation = permutation
        self.__optimization = optimization
        
        
    def compress(self, addHeaders=True, format=True, computeSize=True):
        result = []
        permutation = self.__permutation
        optimization = self.__optimization
        
        pstart()
        logging.info("Compressing classes...")
        
        for classObj in self.__classList:
            compressed = classObj.getCompressed(permutation, optimization, format=format)
            
            if addHeaders:
                result.append("")
                result.append("// %s" % classObj.getName())
                result.append("// - Modified: %s" % datetime.fromtimestamp(classObj.getModificationTime()).isoformat())

                if computeSize:
                    result.append("// - %s" % size(compressed))
            
            result.append(compressed)
            
        result = "\n".join(result)

        if computeSize:
            logging.info(size(result))
        
        pstop()
        return result

