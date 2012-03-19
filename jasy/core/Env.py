#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging, os

# Print out some info
import jasy
logging.info("Jasy %s" % jasy.__version__)
logging.debug("Jasy Path: %s" % os.path.dirname(os.path.abspath(jasy.__file__)))

def startSection(title):
    logging.info("")
    logging.info(">>> %s" % title.upper())
    logging.info("-------------------------------------------------------------------------------")

# Global permutation handling
__permutation = None

def getPermutation():
    global __permutation
    return __permutation

def setPermutation(use):
    global __permutation
    __permutation = use
    
    
# Destination folder
__dist = None

def setDist(path):
    global __dist

    if path is None:
        __dist = None
        logging.info("Resetting dist folder")
    else:
        __dist = os.path.normpath(os.path.abspath(os.path.expanduser(path)))
        logging.info("Setting up dist folder: %s" % __dist)
    
def getDist():
    global __dist
    return __dist
    
def prependDist(path):
    global __dist
    
    if __dist and not os.path.isabs(path):
        return os.path.join(__dist, path)
    else:
        return path

# Global session object
from jasy.core.Session import Session
session = Session()

# Task API for user scripts
from jasy.core.Task import *
from jasy.asset.Asset import * 

# Resolving/Sorting classes
from jasy.js.Resolver import Resolver
from jasy.js.Sorter import Sorter

# API Writer
from jasy.js.api.Writer import ApiWriter

# Output options
from jasy.js.output.Optimization import Optimization
from jasy.js.output.Formatting import Formatting

formatting = Formatting()
optimization = Optimization("variables", "declarations", "blocks", "privates")

# Import file operation goodies
from jasy.util.File import *

# Import combiner script for merging/write js output
from jasy.js.output.Combiner import *

