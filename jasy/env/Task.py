#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import types, os, sys
from jasy.env.State import setPrefix, session, getPrefix
from jasy.core.Error import JasyError
from jasy.core.Logging import *


__all__ = ["task", "executeTask", "runTask", "printTasks", "setCommand", "setOptions", "getOptions"]


class Task:
    __doc__ = ""
    __slots__ = ["__func", "name", "desc", "args", "__doc__"]

    
    def __init__(self, func, desc="", **kwargs):
        name = func.__name__
        self.__func = func
        
        self.name = name
        self.desc = desc
        self.args = kwargs
        
        addTask(self)
        

    def __call__(self, **kwargs):
        
        merged = {}
        merged.update(self.args)
        merged.update(kwargs)
        
        # Use prefix from arguments if available
        # Use no prefix for cleanup tasks
        # Fallback to task name (e.g. "build" task => "build" folder)
        if "prefix" in merged:
            setPrefix(merged["prefix"])
            del merged["prefix"]
        elif "clean" in self.name:
            setPrefix(None)
        else:
            setPrefix(self.name)
        
        # Execute internal function
        return self.__func(**merged)


    def __repr__(self):
        return "Task: " + self.__name__



def task(func, **kwargs):
    """ Specifies that this function is a task. """
    
    if isinstance(func, Task):
        return func

    elif isinstance(func, types.FunctionType):
        return Task(func)
    
    else:
        # Used for called task() (to pass in prefixes, descriptions, etc.)
        def wrapper(finalfunc):
            return Task(finalfunc, func, **kwargs)
            
        return wrapper



# Local task managment
__taskRegistry = {}

def addTask(task):
    """Registers the given task with its name"""
    
    if task.name in __taskRegistry:
        debug("Overriding task: %s" % task.name)
    else:
        debug("Registering task: %s" % task.name)
        
    __taskRegistry[task.name] = task

def executeTask(taskname, **kwargs):
    """Executes the given task by name with any optional named arguments"""
    
    if taskname in __taskRegistry:
        try:
            __taskRegistry[taskname](**kwargs)
        except JasyError as err:
            raise
        except:
            error("Unexpected error! Could not finish task %s successfully!" % taskname)
            raise
    else:
        raise JasyError("No such task: %s" % taskname)

def printTasks(indent=16):
    """Prints out a list of all avaible tasks and their descriptions"""
    
    for name in sorted(__taskRegistry):
        obj = __taskRegistry[name]
        
        formattedName = name
        if obj.desc:
            space = (indent - len(name)) * " "
            print("    %s: %s%s" % (formattedName, space, colorize(obj.desc, "magenta")))
        else:
            print("    %s" % formattedName)


# Jasy reference for executing remote tasks
__command = None
__options = None

def setCommand(cmd):
    global __command
    __command = cmd

def getCommand():
    global __command
    return __command

def setOptions(options):
    global __options
    __options = options

def getOptions():
    global __options
    return __options


# Remote run support
def runTask(project, task, **kwargs):

    header("Running %s of project %s..." % (task, project))

    import subprocess

    # Pauses this session to allow sub process fully accessing the same projects
    session.pause()

    # Build parameter list from optional arguments
    params = ["--%s=%s" % (key, kwargs[key]) for key in kwargs]
    if not "prefix" in kwargs:
        params.append("--prefix=%s" % getPrefix())

    # Full list of args to pass to subprocess
    args = [__command, task] + params

    # Change into sub folder and execute jasy task
    oldPath = os.getcwd()
    remote = session.getProjectByName(project)
    if remote is None:
        raise JasyError("Unknown project %s" % project)

    os.chdir(remote.getPath())
    returnValue = subprocess.call(args, shell=sys.platform == "win32")
    os.chdir(oldPath)

    # Resumes this session after sub process was finished
    session.resume()

    # Error handling
    if returnValue != 0:
        raise JasyError("Executing of sub task %s from project %s failed" % (task, project))



