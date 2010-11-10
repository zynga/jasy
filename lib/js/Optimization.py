#
# JavaScript Tools - Optimization Manager
# Copyright 2010 Sebastian Werner
#

import js.optimizer.DeadCode as DeadCode
import js.optimizer.CryptPrivates as CryptPrivates
import js.optimizer.BlockReducer as BlockReducer
import js.optimizer.LocalVariables as LocalVariables
import js.optimizer.CombineDeclarations as CombineDeclarations

class Optimization:
    def __init__(self, enable):
        self.__optimizations = set()
        
        for identifier in enable:
            self.enable(identifier)
        
        
    def enable(self, identifier):
        self.__optimizations.add(identifier)
        
    def disable(self, identifier):
        self.__optimizations.remove(identifier)
        
    def apply(self, tree):
        enabled = self.__optimizations
        
        if "deadcode" in enabled:
            DeadCode.optimize(tree)
            
        if "privates" in enabled:
            CryptPrivates.optimize(tree)
        
        if "blocks" in enabled:
            BlockReducer.optimize(tree)

        if "variables" in enabled:
            LocalVariables.optimize(tree)
            
        if "declarations" in enabled:
            CombineDeclarations.optimize(tree)     
            
    def getKey(self):
        return "+".join(sorted(self.__optimizations))
        
    # Map Python built-ins
    __repr__ = getKey
    __str__ = getKey        