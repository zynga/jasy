#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

class Localization:
    def __init__(self, locale):
        self.__locale = locale
        

    def patch(self, node):
        self.__recurser(node)
    
    
    
    def __recurser(self, node):
        # TODO
    
        for child in node:
            if child != None:
                self.__recurser(child)
    
