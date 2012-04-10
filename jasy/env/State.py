#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging, os


# ---------------------------------------------
# Global logging addons
# ---------------------------------------------

def startSection(title):
    logging.info("")
    logging.info(">>> %s" % title.upper())
    logging.info("-------------------------------------------------------------------------------")


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
        logging.info("Resetting prefix to working directory")
    else:
        __prefix = os.path.normpath(os.path.abspath(os.path.expanduser(path)))
        logging.info("Setting prefix to: %s" % __prefix)
    
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

from jasy.core.Session import Session
session = Session()


# ---------------------------------------------
# Global output configuration
# ---------------------------------------------

from jasy.js.output.Optimization import Optimization
from jasy.js.output.Formatting import Formatting

formatting = Formatting()
optimization = Optimization("variables", "declarations", "blocks", "privates")

