#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import types, os, sys, inspect, subprocess

from jasy.env.State import setPrefix, session, getPrefix
from jasy.core.Error import JasyError
from jasy.core.Logging import *


__all__ = ["task", "executeTask", "runTask", "printTasks", "setCommand", "setOptions", "getOptions"]


class Task:

    __slots__ = ["func", "name", "curry", "availableArgs", "hasFlexArgs", "__doc__"]

    
    def __init__(self, func, **curry):
        """Creates a task bound to the given function and currying in static parameters"""

        self.func = func
        self.name = func.__name__

        # The are curried in arguments which are being merged with 
        # dynamic command line arguments on each execution
        self.curry = curry

        # Extract doc from function and attach it to the task
        self.__doc__ = inspect.getdoc(func)

        # Analyse arguments for help screen
        result = inspect.getfullargspec(func)        
        self.availableArgs = result.args
        self.hasFlexArgs = result.varkw is not None

        # Register task globally
        addTask(self)
        

    def __call__(self, **kwargs):
        
        merged = {}
        merged.update(self.curry)
        merged.update(kwargs)


        #
        # SUPPORT SOME DEFAULT FEATURES CONTROLLED BY TASK PARAMETERS
        #
        
        # Allow overriding of prefix via task or cmdline parameter.
        # By default use name of the task (no prefix for cleanup tasks)
        if "prefix" in merged:
            setPrefix(merged["prefix"])
        elif "clean" in self.name:
            setPrefix(None)
        else:
            setPrefix(self.name)
        

        #
        # EXECUTE ATTACHED FUNCTION
        #

        # Execute internal function
        return self.func(**merged)


    def __repr__(self):
        return "Task: " + self.__name__




def task(*args, **kwargs):
    """ Specifies that this function is a task. """
    
    if len(args) == 1:

        func = args[0]

        if isinstance(func, Task):
            return func

        elif isinstance(func, types.FunctionType):
            return Task(func)

        # Compat to old Jasy 0.7.x task declaration
        elif type(func) is str:
            return task(**kwargs)

        else:
            raise JasyError("Invalid task")
    
    else:

        def wrapper(func):
            return Task(func, **kwargs)
            
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
        if obj.__doc__:
            space = (indent - len(name)) * " "
            print("    %s: %s%s" % (formattedName, space, colorize(obj.__doc__, "magenta")))
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

    remote = session.getProjectByName(project)
    if remote is not None:
        remotePath = remote.getPath()
        remoteName = remote.getName()
    elif os.path.isdir(project):
        remotePath = project
        remoteName = os.path.basename(project)
    else:
        raise JasyError("Unknown project or invalid path: %s" % project)

    info("Running %s of project %s...", colorize(task, "bold"), colorize(remoteName, "bold"))

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
    os.chdir(remotePath)
    returnValue = subprocess.call(args, shell=sys.platform == "win32")
    os.chdir(oldPath)

    # Resumes this session after sub process was finished
    session.resume()

    # Error handling
    if returnValue != 0:
        raise JasyError("Executing of sub task %s from project %s failed" % (task, project))



