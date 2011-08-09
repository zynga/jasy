#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

from jasy.core.Profiler import *
import logging, os

__all__ = ["Combiner"]


class Combiner():
    """ Combines the code/path of a list of classes into one string """
    
    def __init__(self, classList, relPath="./"):
        self.__classList = classList
        self.__relPath = relPath
        
    
    def combine(self):
        """ Combines the unmodified content of the stored class list """

        logging.info("Combining classes...")
        pstart()
        result = "".join([classObj.getText() for classObj in self.__classList])
        pstop()

        return result
    
    
    def compress(self, permutation=None, translation=None, optimization=None, format=None):
        """ Combines the compressed result of the stored class list """
        
        #logging.info("Compressing classes...")
        #pstart()
        result = "".join([classObj.getCompressed(permutation, translation, optimization, format) for classObj in self.__classList])
        #pstop()

        return result


    def loader(self, bootCode):
        logging.info("Generating loader...")

        relPath = self.__relPath

        boot = "function(){%s}" % bootCode if bootCode else "null"
        result = 'jasy.io.Script.load([%s], %s)' % (",".join(['"%s"' % os.path.join(relPath, classObj.getPath()) for classObj in self.__classList]), boot)

        return result