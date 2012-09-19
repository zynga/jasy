#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import re, os, hashlib, tempfile, subprocess, sys

import jasy.core.Console as Console


def executeCommand(args, msg):
    """Executes the given process and outputs message when errors happen."""

    Console.debug("Executing command: %s", " ".join(args))
    Console.indent()
    
    # Using shell on Windows to resolve binaries like "git"
    output = tempfile.TemporaryFile(mode="w+t")
    returnValue = subprocess.call(args, stdout=output, stderr=output, shell=sys.platform == "win32")
        
    output.seek(0)
    result = output.read().strip("\n\r")
    output.close()

    if returnValue != 0:
        raise Exception("Error during executing shell command: %s (%s)" % (msg, result))
    
    for line in result.splitlines():
        Console.debug(line)
    
    Console.outdent()
    
    return result


def getKey(data, key, default=None):
    if key in data:
        return data[key]
    else:
        return default


__REGEXP_DASHES = re.compile(r"\-+([\S]+)?")
__REGEXP_HYPHENATE = re.compile(r"([A-Z])")

def __camelizeHelper(match):
    result = match.group(1)
    return result[0].upper() + result[1:].lower()

def __hyphenateHelper(match):
    return "-%s" % match.group(1).lower()
    
def camelize(str):
    """Returns a camelized version of the incoming string: foo-bar-baz => fooBarBaz"""
    return __REGEXP_DASHES.sub(__camelizeHelper, str)

def hyphenate(str):
    """Returns a hyphenated version of the incoming string: fooBarBaz => foo-bar-baz"""
    return __REGEXP_HYPHENATE.sub(__hyphenateHelper, str)    

