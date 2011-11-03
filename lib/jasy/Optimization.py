#
# Jasy - JavaScript Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import logging

import jasy.optimizer.CryptPrivates as CryptPrivates
import jasy.optimizer.BlockReducer as BlockReducer
import jasy.optimizer.LocalVariables as LocalVariables
import jasy.optimizer.CombineDeclarations as CombineDeclarations
import jasy.optimizer.UnusedCleaner as UnusedCleaner


class Optimization:
    def __init__(self, *args):
        self.__optimizations = set()
        
        for identifier in args:
            self.enable(identifier)
        
    def enable(self, identifier):
        self.__optimizations.add(identifier)
        
    def disable(self, identifier):
        self.__optimizations.remove(identifier)
        
    def apply(self, tree, stats):
        enabled = self.__optimizations
        
        if "unused" in enabled:
            UnusedCleaner.optimize(tree)

        if "declarations" in enabled:
            CombineDeclarations.optimize(tree)

        if "blocks" in enabled:
            BlockReducer.optimize(tree)

        if "variables" in enabled:
            LocalVariables.optimize(tree)

        if "privates" in enabled:
            CryptPrivates.optimize(tree)

    def getKey(self):
        return "+".join(sorted(self.__optimizations))
        
    # Map Python built-ins
    __repr__ = getKey
    __str__ = getKey        