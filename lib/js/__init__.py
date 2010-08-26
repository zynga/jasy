#
# JavaScript Tools - Main
# Copyright 2010 Sebastian Werner
#

from js.Parser import parse
from js.Compressor import compress
from js.optimizer import CombineDeclarations
from js.optimizer import LocalVariables
from js.optimizer import Variants
from js.Dependencies import deps as jsdeps


def read(filename):
    return open(filename).read()

def jstree(source, filename=None):
    return parse(source, filename)
    
def jsdeps2(tree):
    (toplevel, namespaced) = deps(tree)    


    
    
