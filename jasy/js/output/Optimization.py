#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging

import jasy.js.optimize.CryptPrivates as CryptPrivates
import jasy.js.optimize.BlockReducer as BlockReducer
import jasy.js.optimize.LocalVariables as LocalVariables
import jasy.js.optimize.CombineDeclarations as CombineDeclarations
import jasy.js.optimize.ClosureWrapper as ClosureWrapper


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
    The optimization set is frozen after initialization which also generates the unique
    key based on the given optimizations.
    """
    
    __allowed = ("wrap", "declarations", "blocks", "variables", "privates")
    
    def __init__(self, *args):
        self.__optimizations = set()
        
        for identifier in args:
            if not identifier in self.__allowed:
                logging.warn("Unsupported optimization: %s", identifier)
                
            self.__optimizations.add(identifier)
            
        self.__key = "+".join(sorted(self.__optimizations))
        

    def has(self, key):
        """
        Whether the given optimization is enabled.
        """
        
        return key in self.__optimizations


    def apply(self, tree):
        """
        Applies the configured optimizations to the given node tree. Modifies the tree in-place
        to be sure to have a deep copy if you need the original one. It raises an error instance
        whenever any optimization could not be applied to the given tree.
        """
        
        enabled = self.__optimizations
        
        if "wrap" in enabled:
            try:
                ClosureWrapper.optimize(tree)
            except CryptPrivates.Error as err:
                raise Error(err)
            
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
        """
        Returns a unique key to identify this optimization set
        """
        
        return self.__key
        
        
    # Map Python built-ins
    __repr__ = getKey
    __str__ = getKey        