#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os, json, yaml
import jasy.core.Error


def findConfig(fileName):
    """
    Returns the name of a config file based on the given base file name (without extension).
    Returns either a filename which endswith .json, .yaml or None
    """

    fileExt = os.path.splitext(fileName)[1]

    # Auto discovery
    if not fileExt:
        for tryExt in (".json", ".yaml"):
            if os.path.exists(fileName + tryExt):
                return fileName + tryExt

        return None  

    if os.path.exists(fileName) and fileExt in (".json", ".yaml"):
        return fileName  
    else:
        return None


def loadConfig(fileName, encoding="utf-8"):
    """
    Loads the given configuration file (filename without extension) and 
    returns the parsed object structure 
    """

    configName = findConfig(fileName)
    if configName is None:
        raise UserError("Unsupported config file: %s" % fileName)

    fileHandle = open(configName, mode="r", encoding=encoding)    

    fileExt = os.path.splitext(configName)[1]
    if fileExt == ".json":
        return json.load(fileHandle)

    elif fileExt == ".yaml":
        return yaml.load(fileHandle)


def writeConfig(data, fileName, indent=2, encoding="utf-8"):
    """
    Writes the given data structure to the given file name. Based on the given extension
    a different file format is choosen. Currently use either .yaml or .json.
    """

    fileHandle = open(fileName, mode="w", encoding=encoding)

    fileExt = os.path.splitext(fileName)[1]
    if fileExt == ".json":
        json.dump(data, fileHandle, indent=indent, ensure_ascii=False)
    
    elif fileExt == ".yaml":
        yaml.dump(data, fileHandle, default_flow_style=False, indent=indent, allow_unicode=True)

    else:
        raise jasy.core.Error.UserError("Unsupported config type: %s" % fileExt)

