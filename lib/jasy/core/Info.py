#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import os, sys


def root():
    """ Returns the root path of Jasy """
    return os.path.relpath(os.path.normpath(os.path.join(os.path.dirname(__file__), os.pardir, os.pardir, os.pardir)))
    return os.path.normpath(os.path.join(os.path.dirname(__file__), os.pardir, os.pardir, os.pardir))
    
    
def cldrData(what):
    return os.path.join(root(), "data", "cldr", what)
    
def localeProject(locale):
    return os.path.join(root(), "data", "jslocale", locale)
    
def coreProject():
    return os.path.join(root(), "data", "jscore")
    
    