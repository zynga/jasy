#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging

class Translation:
    def __init__(self, locale, table):
        self.__locale = locale
        self.__table = table
        

    def patch(self, node):
        self.__recurser(node)
    
    
    
    __methods = ("tr", "trc", "trn")
    __params = {
      "tr" : ["text"],
      "trn" : ["textSingular", "textPlural"],
      "trc" : ["textHint", "text"]
    }
    
    
    def __recurser(self, node):
        if node.type == "call":
            funcName = None
            
            if node[0].type == "identifier":
                funcName = node[0].value
            elif node[0].type == "dot" and node[0][1].type == "identifier":
                funcName = node[0][1].value
            
            if funcName in self.__methods:
                params = node[1]
                
                if funcName == "tr":
                    self.__translate(params[0])
                    
                elif funcName == "trn":
                    self.__translate(params[0])
                    self.__translate(params[1])

                elif funcName == "trc":
                    self.__translate(params[1])


                # TODO
                if len(params) > len(self.__params[funcName]):
                    print("Dynamic params!!")
                    
                    
    
    
        for child in node:
            if child != None:
                self.__recurser(child)
        
        
        
        
        
        
    def __translate(self, param):
        if param.type != "string":
            logging.warn("Expecting translation string to be type string: %s at line %s" % (param.type, param.line))
        elif param.value in self.__table:
            param.value = self.__table[param.value]        