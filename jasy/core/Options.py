#
# Jasy - Web Tooling Framework
# Copyright 2012 Zynga Inc.
#

import sys
import jasy.core.Console as Console

class Options:
    """
    More flexible alternative to the standard python option parser module
    which solves the requirements to have arbirary tasks and custom parameters for each task.
    """
    
    __slots__ = ["__tasks", "__options", "__defaults", "__types", "__shortcuts", "__help"]
    
    def __init__(self):

        self.__tasks = []
        self.__options = {}
        
        self.__help = {}
        self.__defaults = {}
        self.__types = {}
        self.__shortcuts = {}


    def parse(self, args):
        
        current = {
            "task" : None, 
            "params": {}
        }

        inTaskMode = False

        index = 0
        length = len(args)
        
        while index < length:

            name = args[index]
            if name.startswith("--"):
                name = name[2:]
            
                if "=" in name:
                    pos = name.find("=")
                    value = name[pos+1:]
                    name = name[0:pos]
                    
                    if not inTaskMode and self.__types[name] is bool:
                        raise Exception("Invalid argument: %s. Boolean flag!" % name)
                    
                elif (not name in self.__types or not self.__types[name] is bool) and (index+1) < length and not args[index+1].startswith("-"):
                    index += 1
                    value = args[index]

                elif inTaskMode:
                    raise Exception("Invalid argument: %s. In task mode every arguments needs to have a value!" % name)
                    
                else:
                    value = True
                    
                current["params"][name] = value
            
            elif name.startswith("-"):
                if inTaskMode:
                    raise Exception("Invalid argument: %s. Flags are not supported for tasks!" % name)
                
                name = name[1:]
                for partname in name:
                    current["params"][partname] = True
            
            else:
                if current:
                    self.__tasks.append(current)

                current = {}
                current["task"] = name
                current["params"] = {}
                
                inTaskMode = True
                
            index += 1

        if current:
            self.__tasks.append(current)
        
        if self.__tasks and self.__tasks[0]["task"] is None:
            self.__options = self.__tasks.pop(0)["params"]
            
        for name in list(self.__options):
            if name in self.__shortcuts:
                self.__options[self.__shortcuts[name]] = self.__options[name]
                del self.__options[name]
            elif len(name) == 1:
                raise Exception("Invalid argument: %s" % name)
            
            
    def printOptions(self, indent=16):

        for name in sorted(self.__defaults):
            col = len(name)
            msg = "  --%s" % name
            
            for shortcut in self.__shortcuts:
                if self.__shortcuts[shortcut] == name:
                    col += len(" [-%s]" % shortcut)
                    msg += Console.colorize(" [-%s]" % shortcut, "grey")
                    
            if name in self.__help:
                msg += ": "
                diff = indent - col
                if diff > 0:
                    msg += " " * diff
                    
                msg += Console.colorize(self.__help[name], "magenta")
            
            print(msg)
        

    def add(self, name, accept=bool, value=None, short=None, help=""):
        
        self.__defaults[name] = value

        if accept is not None:
            self.__types[name] = accept
        if short is not None:
            self.__shortcuts[short] = name
        if help:
            self.__help[name] = help

    def __str__(self):
        return str(self.__tasks)
        
    def __getattr__(self, name):
        if name in self.__options:
            return self.__options[name]
        elif name in self.__defaults:
            return self.__defaults[name]
        else:
            raise Exception("Unknown option: %s!" % name)
    
    def getTasks(self):
        return self.__tasks


        