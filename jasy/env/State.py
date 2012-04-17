#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging, os, sys


# ---------------------------------------------
# Colorized Output
# ---------------------------------------------

__colors = {
    'bold'      : ['\033[1m',  '\033[22m'],
    'italic'    : ['\033[3m',  '\033[23m'],
    'underline' : ['\033[4m',  '\033[24m'],
    'inverse'   : ['\033[7m',  '\033[27m'],

    'white'     : ['\033[37m', '\033[39m'],
    'grey'      : ['\033[90m', '\033[39m'],
    'black'     : ['\033[30m', '\033[39m'],

    'blue'      : ['\033[34m', '\033[39m'],
    'cyan'      : ['\033[36m', '\033[39m'],
    'green'     : ['\033[32m', '\033[39m'],
    'magenta'   : ['\033[35m', '\033[39m'],
    'red'       : ['\033[31m', '\033[39m'],
    'yellow'    : ['\033[33m', '\033[39m']
}

def colorize(text, color="red"):
    # Not supported on console on Windows
    if sys.platform == "win32":
        return text
        
    entry = __colors[color]
    return "%s%s%s" % (entry[0], text, entry[1])


# ---------------------------------------------
# Global logging addons
# ---------------------------------------------

def startSection(title):
    logging.info("")
    logging.info(colorize(colorize(">>> %s" % title.upper(), "blue"), "bold"))
    logging.info(colorize("-------------------------------------------------------------------------------", "blue"))


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

from jasy.env.Session import Session
from jasy.core.Project import getProjectByName

session = Session()


# ---------------------------------------------
# Global output configuration
# ---------------------------------------------

from jasy.js.output.Optimization import Optimization
from jasy.js.output.Formatting import Formatting

formatting = Formatting()
optimization = Optimization("variables", "declarations", "blocks", "privates")

# Remove modules after using them
del Formatting
del Optimization

