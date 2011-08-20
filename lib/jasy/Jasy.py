#
# Jasy - JavaScript Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

VERSION = 1.0

__all__ = ["main", "VERSION"]

import sys

def realMain():
    print("XXX")


def main():
    # Check up front for a Python version we do not support.
    if sys.version_info.major < 3:
        msg = "Jasy version %s does not run under Python version %s.\n"
        sys.stderr.write(msg % (VERSION, sys.version.split()[0]))
        sys.exit(1)

    exitStatus = 0

    try:
        realMain()
        
    except SystemExit as s:
        if s:
            exit_status = s
    except KeyboardInterrupt:
        print("Build interrupted!")
        sys.exit(2)
    except:
        print("Unknown error!")
        sys.exit(2)

    sys.exit(exitStatus)