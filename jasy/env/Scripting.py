import sys, types, shutil, os

from jasy.core.Logging import *
from jasy.core.Error import JasyError
from jasy.core.Config import writeConfig, loadConfig, removeConfig
from jasy.core.Util import getKey

__config = {}

def read(fileName):
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

        ask(question, name, accept, required, default)

    removeConfig(fileName)


def execute(fileName):
    """
    Executes the given script for configuration proposes and deletes the file afterwards.

    Offers a nice little API:

    Configuration:
    - ask(question, field): Asks the user for a value of the given field
    - set(field, value): Sets the value of the given field

    File Handling:
    - copy(src, dst): Copies a file
    - copydir(src, dst): Copies a directory
    - mkdir(name): Creates directory (works recursively)
    - move(src, dst): Moves files or directories
    - rmdir(name): Removes a directory (works recursively)
    - remove(name): Removes the given file 
    """

    env = {
        "ask" : ask,
        "set" : set,

        "copy" : shutil.copy2,
        "copydir" : shutil.copytree,
        "mkdir" : os.makedirs,
        "move" : shutil.move,
        "rmdir" : shutil.rmtree,
        "remove" : os.remove
    }

    try:
        fileHandle = open(fileName, "r", encoding="utf-8")
        exec(fileHandle.read(), globals(), env)

        fileHandle.close()
        os.remove("jasycreate.py")

    except Exception as err:
        raise JasyError("Could not execute custom configuration script: %s!" % err)



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
    

def ask(question, name, accept=None, required=True, default=None):
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
        value = input().strip()

        if not required and value == "":
            value = default
            break

        if value == "" or value is None:
            continue

        # Parse value for easy type checks
        try:
            parsedValue = eval(value)
        except:
            pass
        else:
            value = parsedValue

            # Convert tuples/sets into JSON compatible array
            if type(value) in (tuple, set):
                value = list(value)

        if accept is None:
            break

        if matchesType(value, accept):
            break

        print(colorize("  - Invalid value: %s" % str(value), "red"))

    # Safe current value
    set(name, value)


def set(fieldName, value):
    """Saves the given value under the given field"""


    if "." in fieldName:
        splits = fieldName.split(".")
        current = __config
        for split in splits[:-1]:
            if not split in current:
                current[split] = {}

            current = current[split]

        current[splits[-1]] = value

    else:
        __config[fieldName] = value


def write(filename, indent=2, encoding="utf-8"):
    """Uses config writer to write the configuration file to the application"""

    writeConfig(__config, filename, indent=indent, encoding=encoding)
