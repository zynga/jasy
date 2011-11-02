#
# Jasy - JavaScript Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import os, sys

def root():
    """ Returns the root path of Jasy """
    return os.path.relpath(os.path.normpath(os.path.join(os.path.dirname(__file__), os.pardir, os.pardir, os.pardir, os.pardir)))
    
def cldrData(what):
    return os.path.join(root(), "external", "cldr", what)
        