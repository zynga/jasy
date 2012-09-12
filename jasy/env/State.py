#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os.path
from jasy.core.Logging import *





# ===========================================================================
#   Project Library Handling
# ===========================================================================

def loadLibrary(objectName, fileName, encoding="utf-8"):
    """
    Creates a new global object (inside global state) with the given name 
    containing all @share'd functions and fields loaded from the given file.
    """

    # Create internal class object for storing shared methods
    class Shared(object): pass
    exportedModule = Shared()
    counter = 0

    # Method for being used as a decorator to share methods to the outside
    def share(func):
        nonlocal counter
        setattr(exportedModule, func.__name__, func)
        counter += 1

        return func

    # Execute given file. Using clean new global environment
    # but add additional decorator for allowing to define shared methods
    code = open(fileName, "r", encoding=encoding).read()
    exec(compile(code, os.path.abspath(fileName), "exec"), {"share" : share})

    # Export destination name as global    
    debug("Importing %s shared methods under %s...", counter, objectName)
    globals()[objectName] = exportedModule

    return counter
    


# ===========================================================================
#   Start Session
# ===========================================================================

# Globally available session object
import jasy.env.Session as Session
session = Session.Session()

