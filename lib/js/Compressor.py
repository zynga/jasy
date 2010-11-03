#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

from datetime import datetime
from js.core.Profiler import *
import logging

class Compressor():
    def __init__(self, classList, permutation, optimization, boot):
        self.__classList = classList
        self.__permutation = permutation
        self.__optimization = optimization
        self.__boot = boot
        
        self.addHeaders = True
        
    def compress(self, fileName=None):
        result = []
        permutation = self.__permutation
        optimization = self.__optimization
        
        pstart()
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
                
                deps = classObj.getDependencies(permutation)

                result.append("//   - names:")
                names = deps.names()
                for name in sorted(names):
                    result.append("//       %s, %sx" % (name, names[name]))
                
                result.append("//   - packages:")
                packages = deps.packages()
                for package in sorted(packages):
                    result.append("//       %s, %sx" % (package, packages[package]))
            
            result.append(compressed)
            
        result = "\n".join(result)
        
        if self.__boot:
            result += self.__boot
        
        pstop()
        
        if fileName:
            output = open(fileName, mode="w", encoding="utf-8")
            output.write(result)
            output.close()
            
        else:
            return result

