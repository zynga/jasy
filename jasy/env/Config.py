#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import sys, shutil, os

from jasy.core.Logging import *
from jasy.core.Error import JasyError
from jasy.core.Config import writeConfig, loadConfig, findConfig
from jasy.core.Util import getKey
import jasy.core.File as File

__all__ = [ "Config" ]

def matchesType(value, expected):
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


class Config:
    """
    Wrapper around JSON/YAML with easy to use import tools for using question files,
    command line arguments, etc.
    """

    def __init__(self):
        """
        Initialized configuration object with destination file name.
        """

        self.__data = {}


    def injectValues(self, **argv):
        """
        Injects a list of arguments into the configuration file
        """

        for key in argv:
            self.set(key, argv[key])


    def loadValues(self, fileName, optional=False, encoding="utf-8"):
        """
        Imports the values of the given file
        Returns True when the file was found and processed.
        """

        configFile = findConfig(fileName)
        if configFile is None:
            if optional:
                return False
            else:
                raise JasyError("Could not find configuration file: %s" % configFile)

        data = loadConfig(configFile, encoding=encoding)
        for key in data:
            self.set(key, data[key])

        return True


    def readQuestions(self, fileName, force=False, autoDelete=True, optional=False, encoding="utf-8"):
        """
        Reads the given configuration file with questions and deletes the file afterwards (by default).
        Returns True when the file was found and processed.
        """

        configFile = findConfig(fileName)
        if configFile is None:
            if optional:
                return False
            else:
                raise JasyError("Could not find configuration file: %s" % configFile)

        data = loadConfig(configFile, encoding=encoding)
        for entry in data:
            question = entry["question"]
            name = entry["name"]

            accept = getKey(entry, "accept", None)
            required = getKey(entry, "required", True)
            default = getKey(entry, "default", None)
            force = getKey(entry, "force", False)

            self.ask(question, name, accept=accept, required=required, default=default, force=force)

        if autoDelete:
            File.rm(configFile)

        return True


    def executeScript(self, fileName, autoDelete=True, optional=False, encoding="utf-8"):
        """
        Executes the given script for configuration proposes and deletes the file afterwards (by default).
        Returns True when the file was found and processed.
        """

        if not os.path.exists(fileName):
            if optional:
                return False
            else:
                raise JasyError("Could not find configuration script: %s" % configFile)

        env = {
            "config" : self,
            "file" : File
        }

        code = open(fileName, "r", encoding=encoding).read()
        exec(compile(code, os.path.abspath(fileName), "exec"), globals(), env)

        if autoDelete:
            File.rm("jasycreate.py")

        return True


    def has(self, name):
        """
        Returns whether there is a value for the given field name.
        """

        if not "." in name:
            return name in self.__data

        splits = name.split(".")
        current = self.__data

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
            return getKey(self.__data, name)

        splits = name.split(".")
        current = self.__data

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

            if default is None:
                msg += colorize(" (%s)" % name, "magenta")
            else:
                msg += colorize(" (%s=%s)" % (name, default), "magenta")

            msg += ": "

            sys.stdout.write(msg)

            # Do not ask user for solved items
            if not force and self.has(name):
                print("%s %s" % (self.get(name), colorize("(pre-filled)", "cyan")))
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
        if accept is not None and not matchesType(value, accept):
            print(colorize("  - Invalid value: %s" % str(value), "red"))
            return False

        if "." in fieldName:
            splits = fieldName.split(".")
            current = self.__data
            for split in splits[:-1]:
                if not split in current:
                    current[split] = {}

                current = current[split]

            current[splits[-1]] = value

        else:
            self.__data[fieldName] = value

        return True


    def write(self, fileName, indent=2, encoding="utf-8"):
        """
        Uses config writer to write the configuration file to the application
        """

        writeConfig(self.__data, fileName, indent=indent, encoding=encoding)
