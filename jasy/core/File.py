#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import shutil, os, json, yaml
from jasy.core.Error import JasyError

def cp(src, dst):
    """Copies a file"""
    return shutil.copy2(src, dst)

def cpdir(src, dst):
    """Copies a directory"""
    return shutil.copytree(src, dst)

def exists(name):
    """Returns whether the given file or folder exists"""
    return os.path.exists(name)

def mkdir(name):
    """Creates directory (works recursively)"""

    if os.path.isdir(name):
        return
    elif os.path.exists(name):
        raise JasyError("Error creating directory %s - File exists!" % name)

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

def write(dst, content):
    """Writes the content to the destination file name"""
    
    # First test for existance of destination directory
    mkdir(os.path.dirname(dst))
    
    # Open file handle and write
    handle = open(dst, mode="w", encoding="utf-8")
    handle.write(content)
    handle.close()

