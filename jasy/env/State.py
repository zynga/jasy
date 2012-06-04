#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os, sys
from jasy.core.Logging import *


# ---------------------------------------------
# Global permutation handling
# ---------------------------------------------

__permutation = None

def getPermutation():
    global __permutation
    return __permutation

def setPermutation(use):
    global __permutation
    __permutation = use


# ---------------------------------------------
# Global prefix handling
# ---------------------------------------------

__prefix = None

def setPrefix(path):
    global __prefix

    if path is None:
        __prefix = None
        debug("Resetting prefix to working directory")
    else:
        __prefix = os.path.normpath(os.path.abspath(os.path.expanduser(path)))
        debug("Setting prefix to: %s" % __prefix)
    
def getPrefix():
    global __prefix
    return __prefix
    
def prependPrefix(path):
    global __prefix
    
    if __prefix and not os.path.isabs(path):
        return os.path.join(__prefix, path)
    else:
        return path


# ---------------------------------------------
# Global session object
# ---------------------------------------------

from jasy.env.Session import Session
from jasy.core.Project import getProjectByName

session = Session()


# ---------------------------------------------
# Global asset manager
# ---------------------------------------------

from jasy.asset.Manager import AssetManager

assetManager = AssetManager()

# Remove class after using them
del AssetManager


# ---------------------------------------------
# Global output configuration
# ---------------------------------------------

from jasy.js.output.Optimization import Optimization
from jasy.js.output.Formatting import Formatting

jsFormatting = Formatting()
jsOptimization = Optimization("variables", "declarations", "blocks", "privates")

# Remove classes after using them
del Formatting
del Optimization

