#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging
from jasy.parser.Node import Node

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
                table = self.__table

                # Verify param types
                if params[0].type != "string":
                    logging.warn("Expecting translation string to be type string: %s at line %s" % (params[0].type, params[0].line))
                    
                if (funcName == "trn" or funcName == "trc") and params[1].type != "string":
                    logging.warn("Expecting translation string to be type string: %s at line %s" % (params[1].type, params[1].line))
                    
                
                # Transform content
                
                # Signature tr(msg, arg1, arg2, ...)
                if funcName == "tr":
                    key = params[0].value
                    if key in table:
                        params[0].value = table[key]
                        
                    if len(params) == 1:
                        # Replace the whole call with the string
                        node.parent.replace(node, params[0])
                        
                    else:
                        # TODO: Optimize template
                        pass
                        
                        
                # Signature trn(msg, msg2, int, arg1, arg2, ...)
                elif funcName == "trn":
                    key = params[0].value
                    if key in table:
                        params[0].value = table[key]

                    if len(params) == 3:
                        # Replace the whole call with: int < 2 ? singularMessage : pluralMessage
                        
                        hook = Node(node.tokenizer, "hook")
                        hook.parenthesized = True
                        condition = Node(node.tokenizer, "lt")
                        condition.append(params[2])
                        number = Node(node.tokenizer, "number")
                        number.value = 2
                        condition.append(number)
                        
                        hook.append(condition, "condition")
                        hook.append(params[1], "elsePart")
                        hook.append(params[0], "thenPart")
                        
                        node.parent.replace(node, hook)
                        


                # Signature trc(hint, msg, arg1, arg2, ...)
                elif funcName == "trc":
                    pass


                    
                    
    
    
        for child in node:
            if child != None:
                self.__recurser(child)
                
                
                

        
       