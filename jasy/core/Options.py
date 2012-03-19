#
# Jasy - Web Tooling Framework
# Copyright 2012 Zynga Inc.
#

import sys

class Options:
    
    __slots__ = ["tasks", "options", "defaults", "types", "shortcuts", "help"]
    
    def __init__(self, defaults={}):

        self.tasks = []
        self.options = {}
        
        self.help = {}
        self.defaults = {}
        self.types = {}
        self.shortcuts = {}


    def parse(self, args):
        
        current = {
            "task" : None, 
            "params": {}
        }

        inTaskMode = False

        try:

            for name in args:
                if name.startswith("--"):
                    name = name[2:]
                    value = True
                
                    if "=" in name:
                        pos = name.find("=")
                        value = name[pos+1:]
                        name = name[0:pos]
                    elif inTaskMode:
                        raise Exception("Invalid argument: %s. Assign values using equal sign e.g. param=value." % name)
                    
                    current["params"][name] = value
                
                elif name.startswith("-"):
                    if inTaskMode:
                        raise Exception("Invalid argument: %s. Flags are not supported for tasks!" % name)
                    
                    name = name[1:]
                    for partname in name:
                        current["params"][partname] = True
                
                else:
                    if current:
                        self.tasks.append(current)

                    current = {}
                    current["task"] = name
                    current["params"] = {}
                    
                    inTaskMode = True

            if current:
                self.tasks.append(current)
            
            if self.tasks and self.tasks[0]["task"] is None:
                self.options = self.tasks.pop(0)["params"]
                
            for name in list(self.options):
                if name in self.shortcuts:
                    self.options[self.shortcuts[name]] = self.options[name]
                    del self.options[name]
                elif len(name) == 1:
                    raise Exception("Invalid argument: %s" % name)
                    
        except Exception as error:
            sys.stderr.write("Error: %s\n" % error)
            sys.exit(1)
            

    def add(self, name, accept=bool, value=None, short=None, help=""):
        
        self.defaults[name] = value

        if accept is not None:
            self.types[name] = accept
        if short is not None:
            self.shortcuts[short] = name
        if help:
            self.help[name] = help

    def __str__(self):
        return str(self.tasks)
        
    def __getattr__(self, name):
        if name in self.options:
            return self.options[name]
        elif name in self.defaults:
            return self.defaults[name]
        else:
            raise Exception("Unknown option: %s!" % name)
    
    def getTasks(self):
        return self.tasks

        