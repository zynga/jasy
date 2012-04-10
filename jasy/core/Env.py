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
    
    
# Global prefix handling
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
        
# Global session object
from jasy.core.Session import Session
session = Session()


# Local task managment
__tasks__ = {}

def addTask(task):
    logging.debug("Registering task: %s" % task.name)
    __tasks__[task.name] = task
    
def executeTask(name, **kwargs):
    if name in __tasks__:
        startSection("Executing task %s..." % name)
        try:
            __tasks__[name](**kwargs)
        except:
            logging.error("Could not finish task %s successfully!" % name)
            raise
    else:
        raise JasyError("No such task: %s" % name)
        
def printTasks():
    for name in __tasks__:
        obj = __tasks__[name]
        if obj.desc:
            logging.info("- %s: %s" % (name, obj.desc))
        else:
            logging.info("- %s" % name)


# Jasy reference for executing remote tasks
__jasyCommand = None

def setJasyCommand(cmd):
    global __jasyCommand
    __jasyCommand = cmd


# Remote run support
def runTask(project, task, **kwargs):
    
    startSection("Running %s of project %s..." % (task, project))
    
    import subprocess
    from jasy.core.Project import getProjectByName

    # Pauses this session to allow sub process fully accessing the same projects
    session.pause()
    
    # Build parameter list from optional arguments
    params = ["--%s=%s" % (key, kwargs[key]) for key in kwargs]
    if not "prefix" in kwargs:
        params.append("--prefix=%s" % __prefix)

    # Full list of args to pass to subprocess
    args = [__jasyCommand, task] + params

    # Change into sub folder and execute jasy task
    oldPath = os.getcwd()
    remote = getProjectByName(project)
    if remote is None:
        raise JasyError("Unknown project %s" % project)
        
    os.chdir(remote.getPath())
    returnValue = subprocess.call(args)
    os.chdir(oldPath)

    # Resumes this session after sub process was finished
    session.resume()

    # Error handling
    if returnValue != 0:
        raise JasyError("Executing of sub task %s from project %s failed" % (task, project))


# Task API for user scripts
from jasy.core.Task import task
from jasy.asset.Manager import AssetManager

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
from jasy.core.File import *

# Import combiner script for merging/write js output
from jasy.js.output.Combiner import *

