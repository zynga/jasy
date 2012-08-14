#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os, sys


# ===========================================================================
#   Global Permutation Handling
# ===========================================================================

__permutation = None

def getPermutation():
    global __permutation
    return __permutation

def setPermutation(use):
    global __permutation
    __permutation = use



# ===========================================================================
#   Global Prefix Handling
# ===========================================================================

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



# ===========================================================================
#   Session/Core
# ===========================================================================

from jasy.core.Logging import *
from jasy.core.Error import JasyError
from jasy.env.Session import Session

# Globally available session object
session = Session()



# ===========================================================================
#   Misc Utilities
# ===========================================================================

from jasy.core.Json import *
from jasy.env.Task import task, executeTask, runTask
from jasy.env.File import *



# ===========================================================================
#   Asset Managment
# ===========================================================================

from jasy.asset.Manager import AssetManager
from jasy.asset.SpritePacker import SpritePacker

assetManager = AssetManager()

# Remove class after using them
del AssetManager



# ===========================================================================
#   JavaScript Output
# ===========================================================================

from jasy.js.Resolver import Resolver
from jasy.js.api.Writer import ApiWriter

from jasy.js.output.Optimization import Optimization
from jasy.js.output.Formatting import Formatting

jsFormatting = Formatting()
jsOptimization = Optimization("variables", "declarations", "blocks", "privates")

# Unimport classes
del Formatting
del Optimization

# Handy utility methods to process class lists
from jasy.env.JavaScript import *



# ===========================================================================
#   Global Server
# ===========================================================================

from jasy.server.Web import serve
from jasy.server.Watcher import watch

