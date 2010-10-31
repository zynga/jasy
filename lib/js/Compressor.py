#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

from datetime import datetime
import logging

class Compressor():
    def __init__(self, classList, permutation, optimization):
        self.__classList = classList
        self.__permutation = permutation
        self.__optimization = optimization
        
        self.addHeaders = True
        
    def compress(self, fileName=None):
        result = []
        permutation = self.__permutation
        optimization = self.__optimization
        
        logging.info("Compressing classes...")
        result.append("// Permutation: %s (%s)" % (permutation, permutation.getHash()))
        result.append("// Optimization: %s" % optimization)
        
        for classObj in self.__classList:
            if classObj == "WAIT":
                continue
            
            compressed = classObj.getCompressed(permutation, optimization)
            logging.debug("Adding %s: %s bytes", classObj, len(compressed))
            
            if self.addHeaders:
                result.append("")
                result.append("// %s" % classObj.getName())
                result.append("//   - size: %s bytes" % len(compressed))
                result.append("//   - modified: %s" % datetime.fromtimestamp(classObj.getModificationTime()).isoformat())
                #result.append("//   - dependencies: \n//       %s" % "\n//       ".join(sorted(classObj.getDependencies())))
            
            result.append(compressed)
            
        result = "\n".join(result)
        if fileName:
            output = open(fileName, mode="w", encoding="utf-8")
            output.write(result)
            output.close()
            
        else:
            return result

