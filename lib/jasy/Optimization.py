#
# Jasy - Web Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import jasy.optimizer.CryptPrivates as CryptPrivates
import jasy.optimizer.BlockReducer as BlockReducer
import jasy.optimizer.LocalVariables as LocalVariables
import jasy.optimizer.CombineDeclarations as CombineDeclarations


__all__ = ["Error", "Optimization"]


class Error(Exception):
    """
    Error object which is raised whenever an optimization could not be applied correctly.
    """
    
    def __init__(self, msg):
        self.__msg = msg
    
    def __str__(self):
        return "Error during optimization! %s" % (self.__msg)



class Optimization:
    """
    Configures an optimization object which can be used to compress classes afterwards.
    """
    
    def __init__(self, *args):
        self.__optimizations = set()
        
        for identifier in args:
            self.enable(identifier)
        
    def enable(self, identifier):
        self.__optimizations.add(identifier)
        
    def disable(self, identifier):
        self.__optimizations.remove(identifier)
        
    def apply(self, tree):
        enabled = self.__optimizations
        
        if "declarations" in enabled:
            try:
                CombineDeclarations.optimize(tree)
            except CombineDeclarations.Error as err:
                raise Error(err)

        if "blocks" in enabled:
            try:
                BlockReducer.optimize(tree)
            except BlockReducer.Error as err:
                raise Error(err)

        if "variables" in enabled:
            try:
                LocalVariables.optimize(tree)
            except LocalVariables.Error as err:
                raise Error(err)

        if "privates" in enabled:
            try:
                CryptPrivates.optimize(tree)
            except CryptPrivates.Error as err:
                raise Error(err)

    def getKey(self):
        return "+".join(sorted(self.__optimizations))
        
        
    # Map Python built-ins
    __repr__ = getKey
    __str__ = getKey        