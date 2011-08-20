#
# Jasy - JavaScript Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

from jasy.Session import *
from jasy.Project import *
from jasy.Resolver import *
from jasy.Sorter import *
from jasy.Combiner import *
from jasy.Assets import * 
from jasy.Optimization import *
from jasy.Format import *
from jasy.File import *
from jasy.Task import *

VERSION = 1.0

__all__ = ["main", "VERSION"]

import sys, logging
from optparse import OptionParser


def run():
    """ Main routine which should be called on startup """

    parser = OptionParser()
    parser.add_option("-q", "--quiet", action="store_false", dest="verbose", help="don't print status messages to stdout")
    parser.add_option("-v", "--verbose", action="store_true", dest="verbose", help="print more detailed status messages to stdout")
    parser.add_option("-l", "--log", dest="logfile", help="Write debug messages to given logfile")
    parser.add_option("-f", "--file", dest="buildscript", help="Use the given build script")

    (options, args) = parser.parse_args()

    if options.logfile:
        logging.basicConfig(filename=options.logfile, level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s")
        logging.getLogger().setLevel(logging.DEBUG)
    elif not logging.root.handlers:
        if options.verbose is True:
            logging.getLogger().setLevel(logging.DEBUG)
        elif options.verbose is False:
            logging.getLogger().setLevel(logging.WARN)
        else:
            logging.getLogger().setLevel(logging.INFO)
    
    # Define a Handler which writes INFO messages or higher to the sys.stderr
    console = logging.StreamHandler()

    if options.verbose is True:
        console.setLevel(logging.DEBUG)
    elif options.verbose is False:
        console.setLevel(logging.WARN)
    else:
        console.setLevel(logging.INFO)
        
    console.setFormatter(logging.Formatter('>>> %(message)s', '%H:%M:%S'))
    logging.getLogger().addHandler(console)

    for name, value in vars(options).items():
        setattr(env, name, value)

    for name in args:
        env.executeTask(name)
        
        

def main():
    # Check up front for a Python version we do not support.
    if sys.version_info.major < 3:
        msg = "Jasy version %s does not run under Python version %s.\n"
        sys.stderr.write(msg % (VERSION, sys.version.split()[0]))
        sys.exit(1)

    exitStatus = 0

    try:
        run()
        
    except SystemExit as s:
        if s:
            exit_status = s
    except KeyboardInterrupt:
        print("Build interrupted!")
        sys.exit(2)
    #except:
    #    print("Unknown error!")
    #    sys.exit(2)

    sys.exit(exitStatus)