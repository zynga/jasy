#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

from datetime import datetime
import logging

class JsCompiler():
    def __init__(self, session, classList):
        self.session = session
        self.classList = classList
        
        self.addHeaders = True
        
    def compile(self, fileName=None):
        result = []
        
        logging.info("Compiling %s classes..." % len(self.classList))
        
        for classObj in self.classList:
            compressed = classObj.getCompressed()
            logging.debug("Adding %s: %s bytes", classObj, len(compressed))
            
            if self.addHeaders:
                result.append("")
                result.append("// %s" % classObj.getName())
                result.append("//   - size: %s bytes" % len(compressed))
                result.append("//   - modified: %s" % datetime.fromtimestamp(classObj.getModificationTime()).isoformat())
                result.append("//   - dependencies: \n//       %s" % "\n//       ".join(sorted(classObj.getDependencies())))
            
            result.append(compressed)
            
        result = "\n".join(result)
        if fileName:
            output = open(fileName, mode="w", encoding="utf-8")
            output.write(result)
            output.close()
            
        else:
            return result

