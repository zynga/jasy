#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import sys, types, shutil, os

from jasy.core.Logging import *
from jasy.core.Error import JasyError
from jasy.core.Config import writeConfig, loadConfig, removeConfig
from jasy.core.Util import getKey

__all__ = [ "Config" ]

class FileIO:
    """
    Small utility class for simple file operations etc.
    """

    def cp(self, src, dst):
        """Copies a file"""
        return shutil.copy2(src, dst)

    def cpdir(self, src, dst):
        """Copies a directory"""
        return shutil.copytree(src, dst)

    def mkdir(self, name):
        """Creates directory (works recursively)"""
        return os.makedirs(name)

    def mv(self, src, dst):
        """Moves files or directories"""
        return shutil.move(src, dst)

    def rm(self, name):
        """Removes the given file"""
        return os.remove(name)

    def rmdir(self, name):
        """Removes a directory (works recursively)"""
        return shutil.rmtree(name)



class Config:
    """
    Wrapper around JSON/YAML with easy to use import tools for using question files,
    command line arguments, etc.
    """

    def __init__(self, fileName):
        """
        Initialized configuration object with destination file name.
        """

        self.__config = {}
        self.__fileName = fileName


    def inject(self, **argv):
        """
        Injects a list of arguments into the configuration file
        """

        for key in argv:
            self.set(key, argv[key])


    def read(self, fileName, force=False):
        """
        Reads the given configuration file with questions and deletes the file afterwards.
        """

        data = loadConfig(fileName)
        for entry in data:
            question = entry["question"]
            name = entry["name"]

            accept = getKey(entry, "accept", None)
            required = getKey(entry, "required", True)
            default = getKey(entry, "default", None)
            force = getKey(entry, "force", False)

            self.ask(question, name, accept=accept, required=required, default=default, force=force)

        removeConfig(fileName)


    def execute(self, fileName):
        """
        Executes the given script for configuration proposes and deletes the file afterwards.
        """

        env = {
            "config" : self,
            "io" : FileIO()
        }

        try:
            fileHandle = open(fileName, "r", encoding="utf-8")
            exec(fileHandle.read(), globals(), env)

            fileHandle.close()
            os.remove("jasycreate.py")

        except Exception as err:
            raise JasyError("Could not execute custom configuration script: %s!" % err)


    def matchesType(self, value, expected):
        """
        Returns boolean for whether the given value matches the given type.
        Supports all basic JSON supported value types:
        primitive, integer/int, float, number/num, string/str, boolean/bool, dict/map, array/list, ...
        """

        result = type(value)
        expected = expected.lower()

        if result is int:
            return expected in ("integer", "number", "int", "num", "primitive")
        elif result is float:
            return expected in ("float", "number", "num", "primitive")
        elif result is str:
            return expected in ("string", "str", "primitive")
        elif result is bool:
            return expexted in ("boolean", "bool", "primitive")
        elif result is dict:
            return expected in ("dict", "map")
        elif result is list:
            return expected in ("array", "list")

        return False
        

    def has(self, name):

        if not "." in name:
            return name in self.__config

        splits = name.split(".")
        current = self.__config

        for split in splits:
            if split in current:
                current = current[split]
            else:
                return False

        return True


    def get(self, name):
        """
        Returns the value of the given field or None when field is not set 
        """

        if not "." in name:
            return getKey(self.__config, name)

        splits = name.split(".")
        current = self.__config

        for split in splits[:-1]:
            if split in current:
                current = current[split]
            else:
                return None

        return getKey(current, splits[-1])        


    def ask(self, question, name, accept=None, required=True, default=None, force=False, parse=True):
        """
        Asks the user for value for the given configuration field

        - question (str): Question to ask the user
        - name (str): Name of field to store value in
        - accept (str): Any of the supported types to validate for (see matchesType)
        - required (bool): Whether the field is required
        - default (any): Default value whenever user has given no value
        """

        while True:
            msg = "- %s?" % question
            if accept is not None:
                msg += colorize(" [%s]" % accept, "grey")
            if default is not None:
                msg += colorize(" (%s)" % default, "magenta")
            msg += ": "

            sys.stdout.write(msg)

            # Do not ask user for solved items
            if not force and self.has(name):
                print("%s (pre-filled)" % colorize(self.get(name), "cyan"))
                return

            # Read user input, but ignore any leading/trailing white space
            value = input().strip()

            # Fallback to default if no value is given and field is not required
            if not required and value == "":
                value = default

            # Try setting the current value
            if self.set(name, value, accept=accept, parse=parse):
                break



    def set(self, fieldName, value, accept=None, parse=True):
        """
        Saves the given value under the given field
        """

        # Incomplete value => Invalid
        if value == "" or value is None:
            return False

        # Parse value for easy type checks
        if parse:
            try:
                parsedValue = eval(value)
            except:
                pass
            else:
                value = parsedValue

                # Convert tuples/sets into JSON compatible array
                if type(value) in (tuple, set):
                    value = list(value)

        # Check for given type
        if accept is not None and not self.matchesType(value, accept):
            print(colorize("  - Invalid value: %s" % str(value), "red"))
            return False

        if "." in fieldName:
            splits = fieldName.split(".")
            current = self.__config
            for split in splits[:-1]:
                if not split in current:
                    current[split] = {}

                current = current[split]

            current[splits[-1]] = value

        else:
            self.__config[fieldName] = value

        return True


    def write(self, indent=2, encoding="utf-8"):
        """
        Uses config writer to write the configuration file to the application
        """

        writeConfig(self.__config, self.__fileName, indent=indent, encoding=encoding)
