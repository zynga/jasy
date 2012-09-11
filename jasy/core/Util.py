#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import re, os, hashlib

from jasy.core.Logging import *


def sha1File(f, block_size=2**20):
    sha1 = hashlib.sha1()
    while True:
        data = f.read(block_size)
        if not data:
            break
        sha1.update(data)

    return sha1.hexdigest()
    
    

def getKey(data, key, default=None):
    if key in data:
        return data[key]
    else:
        return default


REGEXP_DASHES = re.compile(r"\-+([\S]+)?")

def camelize(str):
    """
    Returns a camelized version of the incoming string: foo-bar-baz => fooBarBaz
    """

    def __camelizeHelper(match):
        result = match.group(1)
        return result[0].upper() + result[1:].lower()
    
    return REGEXP_DASHES.sub(__camelizeHelper, str)


def getFirstSubFolder(start):

    for root, dirs, files in os.walk(start):
        for directory in dirs:
            if not directory.startswith("."):
                return directory

    return None



fieldPattern = re.compile(r"\$\${([_a-z][_a-z0-9\.]*)}", re.IGNORECASE | re.VERBOSE)


def massFilePatcher(path, data):
    
    # Convert method with access to local data
    def convertPlaceholder(mo):
        field = mo.group(1)
        value = data.get(field)

        # Verify that None means missing
        if value is None and not data.has(field):
            raise ValueError('No value for placeholder "%s"' % field)
    
        # Requires value being a string
        return str(value)
        
    # Patching files recursively
    info("Patching files...")
    indent()
    for dirPath, dirNames, fileNames in os.walk(path):
        relpath = os.path.relpath(dirPath, path)

        # Filter dotted directories like .git, .bzr, .hg, .svn, etc.
        for dirname in dirNames:
            if dirname.startswith("."):
                dirNames.remove(dirname)
        
        for fileName in fileNames:
            filePath = os.path.join(dirPath, fileName)
            fileRel = os.path.normpath(os.path.join(relpath, fileName))
            
            debug("Processing: %s..." % fileRel)

            fileHandle = open(filePath, "r", encoding="utf-8", errors="surrogateescape")
            fileContent = []
            
            # Parse file line by line to detect binary files early and omit
            # fully loading them into memory
            try:
                isBinary = False

                for line in fileHandle:
                    if '\0' in line:
                        isBinary = True
                        break 
                    else:
                        fileContent.append(line)
        
                if isBinary:
                    debug("Ignoring binary file: %s", fileRel)
                    continue

            except UnicodeDecodeError as ex:
                warn("Can't process file: %s: %s", fileRel, ex)
                continue

            fileContent = "".join(fileContent)

            # Update content with available data
            try:
                resultContent = fieldPattern.sub(convertPlaceholder, fileContent)
            except ValueError as ex:
                warn("Unable to process file %s: %s!", fileRel, ex)
                continue

            # Only write file if there where any changes applied
            if resultContent != fileContent:
                info("Updating: %s...", colorize(fileRel, "bold"))
                
                fileHandle = open(filePath, "w", encoding="utf-8", errors="surrogateescape")
                fileHandle.write(resultContent)
                fileHandle.close()
                
    outdent()
