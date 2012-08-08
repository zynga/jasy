#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os, atexit, sys
from jasy.core.Logging import debug, info, error, header

pidFile = "jasylock-%s.pid"
    
def lock(uniqueId):
    """Locks for the given unique ID. Results in sys.exit(1) if not possible aka locked already."""
    
    destFile = os.path.abspath(pidFile % uniqueId)
    
    if os.path.isfile(destFile):
        error("PID file %s already exists, exiting" % destFile)
        sys.exit(1)
    else:
        open(destFile, 'w').write(str(os.getpid()))
        
    def unlink():
        if os.path.isfile(destFile):
            os.unlink(destFile)
        
    atexit.register(unlink)


def release(uniqueId):
    """Releases the given unique ID."""
    
    destFile = os.path.abspath(pidFile % uniqueId)
    
    if os.path.isfile(destFile):
        os.unlink(destFile)

