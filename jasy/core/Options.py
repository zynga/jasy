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
                        
                        if not inTaskMode and self.types[name] is bool:
                            raise Exception("Invalid argument: %s. Boolean flag!" % name)
                        
                    elif (not name in self.types or not self.types[name] is bool) and (index+1) < length and not args[index+1].startswith("-"):
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
                        self.tasks.append(current)

                    current = {}
                    current["task"] = name
                    current["params"] = {}
                    
                    inTaskMode = True
                    
                index += 1

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
            raise
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

        