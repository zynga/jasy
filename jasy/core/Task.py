import types
import logging

from jasy.core.Error import *
from jasy.core.Env import *

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
        # Fallback to task name (e.g. "build" task => "build" folder)
        if "prefix" in merged:
            setPrefix(merged["prefix"])
            del merged["prefix"]
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

    