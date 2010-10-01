#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

class JsCompiler():
    def __init__(self, session, classList):
        self.session = session
        self.classList = classList
        
    def compile(self):
        result = []
        
        for classObj in self.classList:
            compressed = classObj.getCompressed()
            result.append(compressed)
            
        return "\n".join(result)

