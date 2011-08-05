#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging

import jasy.optimizer.CryptPrivates as CryptPrivates
import jasy.optimizer.BlockReducer as BlockReducer
import jasy.optimizer.LocalVariables as LocalVariables
import jasy.optimizer.CombineDeclarations as CombineDeclarations
import jasy.optimizer.UnusedCleaner as UnusedCleaner


class Optimization:
    def __init__(self, enable):
        self.__optimizations = set()
        
        for identifier in enable:
            self.enable(identifier)
        
        
    def enable(self, identifier):
        self.__optimizations.add(identifier)
        
    def disable(self, identifier):
        self.__optimizations.remove(identifier)
        
    def apply(self, tree, stats):
        enabled = self.__optimizations
        logging.debug("Apply: %s" % self)
        
        if "unused" in enabled:
            UnusedCleaner.optimize(tree)

        if "declarations" in enabled:
            CombineDeclarations.optimize(tree)

        if "blocks" in enabled:
            BlockReducer.optimize(tree)

        if "variables" in enabled:
            LocalVariables.optimize(tree, stats)

        if "privates" in enabled:
            CryptPrivates.optimize(tree)

            
            
    def getKey(self):
        return "+".join(sorted(self.__optimizations))
        
    # Map Python built-ins
    __repr__ = getKey
    __str__ = getKey        