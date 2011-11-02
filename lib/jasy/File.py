#
# Jasy - JavaScript Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import os, shutil, filecmp, sys, stat

def makedir(dirname):
    """ Creates missing hierarchy levels for given directory """
    
    if dirname == "":
        return
        
    if not os.path.exists(dirname):
        os.makedirs(dirname)

    
def copyfile(src, dst):
    """ Copy src file to dst file. Both should be filenames, not directories. """
    
    if not os.path.isfile(src):
        raise Exception("No such file: %s" % src)

    # First test for existance of destination directory
    makedir(os.path.dirname(dst))
    
    # Finally copy file to directory
    try:
        shutil.copy2(src, dst)
    except IOError as ex:
        logging.error("Could not write file %s: %s" % (dst, ex))
        
    return True
    
    
def updatefile(src, dst):
    """ Same as copyfile() but only do copying when source file is newer than target file """
    
    if not os.path.isfile(src):
        raise Exception("No such file: %s" % src)
    
    try:
        dst_mtime = os.path.getmtime(dst)
        src_mtime = os.path.getmtime(src)
        
        # Only accecpt equal modification time as equal as copyfile()
        # syncs over the mtime from the source.
        if src_mtime == dst_mtime:
            return False
        
    except OSError:
        # destination file does not exist, so mtime check fails
        pass
        
    return copyfile(src, dst)


def writefile(dst, content):
    # First test for existance of destination directory
    makedir(os.path.dirname(dst))
    
    # Open file handle and write
    handle = open(dst, mode="w", encoding="utf-8")
    handle.write(content)
    handle.close()