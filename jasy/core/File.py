#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

"""
A module consisting of some often used file system actions in easy to use unix tradition.
"""

import shutil, os, hashlib
from jasy import UserError

def cp(src, dst):
    """Copies a file"""

    # First test for existance of destination directory
    mkdir(os.path.dirname(dst))

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
        raise UserError("Error creating directory %s - File exists!" % name)

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

def syncfile(src, dst):
    """Same as cp() but only do copying when source file is newer than target file"""
    
    if not os.path.isfile(src):
        raise Exception("No such file: %s" % src)
    
    try:
        dst_mtime = os.path.getmtime(dst)
        src_mtime = os.path.getmtime(src)
        
        # Only accecpt equal modification time as equal as copyFile()
        # syncs over the mtime from the source.
        if src_mtime == dst_mtime:
            return False
        
    except OSError:
        # destination file does not exist, so mtime check fails
        pass
        
    return cp(src, dst)

def sha1(fileOrPath, block_size=2**20):
    """Returns a SHA 1 checksum (as hex digest) of the given file (handle)"""

    if type(fileOrPath) is str:
        fileOrPath = open(fileOrPath, "rb")

    sha1res = hashlib.sha1()
    while True:
        data = fileOrPath.read(block_size)
        if not data:
            break
        sha1res.update(data)

    return sha1res.hexdigest()

