import sys, types, json, shutil, yaml, os
from jasy.core.Logging import *


__config = {}


def matchesType(value, expected):
    """
    Returns boolean for whether the given value matches the given type.
    Supports all basic JSON supported value types:
    integer/int, float, number/num, string/str, boolean/bool, dict/map, array/list, ...
    """

    result = type(value)
    expected = expected.lower()

    if result is int:
        return expected in ("integer", "number", "int", "num", "primitive")
    elif result is float:
        return expected in ("float", "number", "num", "primitive")
    elif result is str:
        return expected in ("string", "str")
    elif result is bool:
        return expexted in ("boolean", "bool")
    elif result is dict:
        return expected in ("dict", "map")
    elif result is list:
        return expected in ("array", "list")

    return False
    

def ask(question, fieldName, acceptType=None, required=True, defaultValue=None):
    """
    Asks the user for value for the given configuration field

    - question (str): Question to ask the user
    - fieldName (str): Name of field to store value in
    - acceptType (str): Any of the supported types to validate for (see matchesType)
    - required (bool): Whether the field is required
    - defaultValue (any): Default value whenever user has given no value
    """

    while True:
        sys.stdout.write("- %s? %s: " % (question, colorize("[%s]" % acceptType, "grey")))
        fieldValue = input().strip()

        if not required and fieldValue == "":
            fieldValue = defaultValue
            break

        if fieldValue == "" or fieldValue is None:
            continue

        try:
            parsedValue = eval(fieldValue)
        except:
            pass
        else:
            fieldValue = parsedValue

        if acceptType is None:
            break

        if matchesType(fieldValue, acceptType):
            break

        print(colorize("  - Invalid value: %s" % fieldValue, "red"))


    # Safe current value
    __config[fieldName] = fieldValue


def save(fieldName, value):
    __config[fieldName] = value


def write(fileName="jasyscript.yaml", indent=2, encoding="utf-8"):
    fileExt = os.path.splitext(fileName)[1]
    fileHandle = open(fileName, mode="w", encoding="utf-8")

    if fileExt == ".json":
        json.dump(__config, fileHandle, indent=indent, ensure_ascii=False)
    elif fileExt == ".yaml":
        yaml.dump(__config, fileHandle, default_flow_style=False, indent=indent, allow_unicode=True)
    else:
        raise JasyError("Unsupported file type: %s" % fileExt)


