#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import shutil, os, json, yaml

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

