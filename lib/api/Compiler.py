#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

from js.Compressor import compress

class JsCompiler():
    def __init__(self, session, classList):
        self.session = session
        self.classList = classList
        
    def compile(self):
        result = []
        
        for classObj in self.classList:
            print("Compile: %s" % classObj)
            tree = classObj.getTree()
            compressed = compress(tree)
            result.append(compressed)
            
        return "\n".join(result)

