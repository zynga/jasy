#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import types
from jasy.core.Env import setPrefix, addTask

__all__ = ["task"]

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

    