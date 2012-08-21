#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import shutil, os, json

try:
    import yaml
except ImportError:
    yaml = None

def cp(src, dst):
    """Copies a file"""
    return shutil.copy2(src, dst)

def cpdir(src, dst):
    """Copies a directory"""
    return shutil.copytree(src, dst)

def mkdir(name):
    """Creates directory (works recursively)"""
    return os.makedirs(name)

def mv(src, dst):
    """Moves files or directories"""
    return shutil.move(src, dst)

def rm(name):
    """Removes the given file"""
    return os.remove(name)

def rmdir(name):
    """Removes a directory (works recursively)"""
    return shutil.rmtree(name)

def json2yaml(jsonFile, yamlFile, encoding="utf-8", indent=2):
    """Stores the given JSON file as a new YAML file"""
    yaml.dump(json.load(open(jsonFile, "r", encoding="utf-8")), open(yamlFile, "w", encoding="utf-8"), indent=indent, default_flow_style=False, allow_unicode=True)

def yamlToJson(yamlFile, jsonFile, encoding="utf-8", indent=2):
    """Stores the given YAML file as a new JSON file"""
    json.dump(yaml.load(open(yamlFile, "r", encoding="utf-8")), open(jsonFile, "w", encoding="utf-8"), indent=2, ensure_ascii=False)        

