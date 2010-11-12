#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

from datetime import datetime
from js.core.Profiler import *
import logging, zlib

__all__ = ["Combiner","size"]

def size(content, encoding="utf-8"):
    """ Returns a user friendly formatted string about the size of the given content. """
    
    normalSize = len(content)
    zippedSize = len(zlib.compress(content.encode(encoding)))
    
    return "Size: {:.2f}KB ({:.2f}KB zipped => {:.2%})".format(normalSize/1024, zippedSize/1024, zippedSize/normalSize)
    

class Combiner():
    """ Combines the code of a list of classes into one string """
    
    def __init__(self, permutation=None, optimization=None):
        self.__permutation = permutation
        self.__optimization = optimization
    
    
    def combine(self, classList, addHeaders=True, computeSize=True):
        result = []
        
        pstart()
        logging.info("Combining classes...")
        
        for classObj in classList:
            content = classObj.getText()
            
            if addHeaders:
                result.append("")
                result.append("// %s" % classObj.getName())
                result.append("// - Modified: %s" % datetime.fromtimestamp(classObj.getModificationTime()).isoformat())

                if computeSize:
                    result.append("// - %s" % size(content))
            
            result.append(content)
            
        result = "\n".join(result)

        if computeSize:
            logging.info(size(result))
        
        pstop()
        return result
    
    
    def compress(self, classList, format=None, addHeaders=True, computeSize=True):
        result = []
        permutation = self.__permutation
        optimization = self.__optimization
        
        pstart()
        logging.info("Compressing classes...")
        
        for classObj in classList:
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

