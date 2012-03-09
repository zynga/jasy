#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os, shutil


def makeDir(dirname):
    """
    Creates missing hierarchy levels for given directory
    """
    
    if dirname == "":
        return
        
    if not os.path.exists(dirname):
        os.makedirs(dirname)



def copyDir(src, dst):
    """
    Copies a directory to a destination directory. Merges the existing directory structure with the folder to copy.
    """
    
    srcLength = len(src)
    counter = 0
    
    for rootFolder, dirs, files in os.walk(src):
        
        # figure out where we're going
        destFolder = dst + rootFolder[srcLength:]

        # loop through all files in the directory
        for fileName in files:

            # compute current (old) & new file locations
            srcFile = os.path.join(rootFolder, fileName)
            dstFile = os.path.join(destFolder, fileName)
            
            if updateFile(srcFile, dstFile):
                counter += 1
    
    return counter



def copyFile(src, dst):
    """
    Copy src file to dst file. Both should be filenames, not directories.
    """
    
    if not os.path.isfile(src):
        raise Exception("No such file: %s" % src)

    # First test for existance of destination directory
    makeDir(os.path.dirname(dst))
    
    # Finally copy file to directory
    try:
        shutil.copy2(src, dst)
    except IOError as ex:
        logging.error("Could not write file %s: %s" % (dst, ex))
        
    return True



def updateFile(src, dst):
    """
    Same as copyFile() but only do copying when source file is newer than target file
    """
    
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
        
    return copyFile(src, dst)



def writeFile(dst, content):
    # First test for existance of destination directory
    makeDir(os.path.dirname(dst))
    
    # Open file handle and write
    handle = open(dst, mode="w", encoding="utf-8")
    handle.write(content)
    handle.close()
