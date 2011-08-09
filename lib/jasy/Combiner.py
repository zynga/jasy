#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging, os

__all__ = ["Combiner"]


class Combiner():
    """ Combines the code/path of a list of classes into one string """
    
    def __init__(self, classList):
        self.__classList = classList
        
    
    def getCombinedCode(self):
        """ Combines the unmodified content of the stored class list """

        return "".join([classObj.getText() for classObj in self.__classList])
    
    
    def getCompressedCode(self, permutation=None, translation=None, optimization=None, format=None):
        """ Combines the compressed result of the stored class list """

        return "".join([classObj.getCompressed(permutation, translation, optimization, format) for classObj in self.__classList])


    def getLoaderCode(self, bootCode, toRoot):
        logging.info("Generating loader...")

        boot = "function(){%s}" % bootCode if bootCode else "null"
        result = 'jasy.io.Script.load([%s], %s)' % (",".join(['"%s"' % os.path.join(toRoot, classObj.getLocalPath()) for classObj in self.__classList]), boot)

        return result