#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

from jasy.core.Profiler import *
import logging

__all__ = ["Combiner"]


class Combiner():
    """ Combines the code of a list of classes into one string """
    
    def combine(self, classList):
        """ Combines the unmodified content of the given class list """

        logging.info("Combining classes...")

        pstart()
        result = "".join([classObj.getText() for classObj in classList])
        pstop()

        return result
    
    
    def compress(self, classList, permutation=None, translation=None, optimization=None, formatting=None):
        """ Combines the compressed result of the given class list """
        
        logging.info("Compressing classes...")

        pstart()
        result = "".join([classObj.getCompressed(permutation, translation, optimization, formatting) for classObj in classList])
        pstop()

        return result

