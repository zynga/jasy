#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

class JsCompiler():
    def __init__(self, session, classList):
        self.session = session
        self.classList = classList
        
    def compile(self, fileName=None):
        result = []
        
        for classObj in self.classList:
            compressed = classObj.getCompressed()
            result.append(compressed)
            
        result = "\n".join(result)
        if fileName:
            output = open(fileName, mode="w", encoding="utf-8")
            output.write(result)
            output.close()
            
        else:
            return result

