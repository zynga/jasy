#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

"""
Tasks are basically functions with some managment code allow them to run in jasyscript.py
"""

import types, os, sys, inspect, subprocess

import jasy.core.Console as Console

from jasy.env.State import session
import jasy.core.Util as Util
from jasy import UserError

__all__ = ["task", "executeTask", "runTask", "printTasks", "setCommand", "setOptions", "getOptions"]

class Task:

    __slots__ = ["func", "name", "curry", "availableArgs", "hasFlexArgs", "__doc__", "__name__"]

    
    def __init__(self, func, **curry):
        """Creates a task bound to the given function and currying in static parameters"""

        self.func = func
        self.name = func.__name__

        self.__name__ = "Task: %s" % func.__name__

        # Circular reference to connect both, function and task
        func.task = self

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
            session.setCurrentPrefix(merged["prefix"])
            del merged["prefix"]
        elif "clean" in self.name:
            session.setCurrentPrefix(None)
        else:
            session.setCurrentPrefix(self.name)
        

        #
        # EXECUTE ATTACHED FUNCTION
        #

        Console.header(self.__name__)

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
            raise UserError("Invalid task")
    
    else:

        def wrapper(func):
            return Task(func, **kwargs)
            
        return wrapper



# Local task managment
__taskRegistry = {}

def addTask(task):
    """Registers the given task with its name"""
    
    if task.name in __taskRegistry:
        Console.debug("Overriding task: %s" % task.name)
    else:
        Console.debug("Registering task: %s" % task.name)
        
    __taskRegistry[task.name] = task

def executeTask(taskname, **kwargs):
    """Executes the given task by name with any optional named arguments"""

    if taskname in __taskRegistry:
        try:
            camelCaseArgs = { Util.camelize(key) : kwargs[key] for key in kwargs }
            __taskRegistry[taskname](**camelCaseArgs)
        except UserError as err:
            raise
        except:
            Console.error("Unexpected error! Could not finish task %s successfully!" % taskname)
            raise
    else:
        raise UserError("No such task: %s" % taskname)

def printTasks(indent=16):
    """Prints out a list of all avaible tasks and their descriptions"""
    
    for name in sorted(__taskRegistry):
        obj = __taskRegistry[name]

        formattedName = name
        if obj.__doc__:
            space = (indent - len(name)) * " "
            print("    %s: %s%s" % (formattedName, space, Console.colorize(obj.__doc__, "magenta")))
        else:
            print("    %s" % formattedName)

        if obj.availableArgs or obj.hasFlexArgs:
            text = ""
            if obj.availableArgs:
                text += Util.hyphenate("--%s <var>" % " <var> --".join(obj.availableArgs))

            if obj.hasFlexArgs:
                if text:
                    text += " ..."
                else:
                    text += "--<name> <var>"

            print("      %s" % (Console.colorize(text, "grey")))


# Jasy reference for executing remote tasks
__command = None
__options = None

def setCommand(cmd):
    """Sets the jasy command which should be used to execute tasks with runTask()"""

    global __command
    __command = cmd

def getCommand():
    """Returns the "jasy" command which is currently executed."""

    global __command
    return __command

def setOptions(options):
    """Sets currently configured command line options. Mainly used for printing help screens."""

    global __options
    __options = options

def getOptions():
    """Returns the options as passed to the jasy command. Useful for printing all command line arguments."""

    global __options
    return __options

def runTask(project, task, **kwargs):
    """
    Executes the given task of the given projects. 
    
    This happens inside a new sandboxed session during which the 
    current session is paused/resumed automatically.
    """

    remote = session.getProjectByName(project)
    if remote is not None:
        remotePath = remote.getPath()
        remoteName = remote.getName()
    elif os.path.isdir(project):
        remotePath = project
        remoteName = os.path.basename(project)
    else:
        raise UserError("Unknown project or invalid path: %s" % project)

    Console.info("Running %s of project %s...", Console.colorize(task, "bold"), Console.colorize(remoteName, "bold"))

    # Pauses this session to allow sub process fully accessing the same projects
    session.pause()

    # Build parameter list from optional arguments
    params = ["--%s=%s" % (key, kwargs[key]) for key in kwargs]
    if not "prefix" in kwargs:
        params.append("--prefix=%s" % session.getCurrentPrefix())

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
        raise UserError("Executing of sub task %s from project %s failed" % (task, project))



