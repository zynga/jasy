#
# Jasy - JavaScript Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

from jasy.Error import *
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

VERSION = "0.3"

__all__ = ["main", "VERSION"]

import sys, logging, os
from optparse import OptionParser


def run():
    """
    Main routine which should be called on startup
    """

    #
    # Parse options
    #

    parser = OptionParser()
    parser.add_option("-q", "--quiet", action="store_false", dest="verbose", help="don't print status messages to stdout")
    parser.add_option("-v", "--verbose", action="store_true", dest="verbose", help="print more detailed status messages to stdout")
    parser.add_option("-l", "--log", dest="logfile", help="Write debug messages to given logfile")
    parser.add_option("-f", "--file", dest="file", help="Use the given jasy script")

    (options, args) = parser.parse_args()


    #
    # Configure logging
    # 

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


    #
    # Find and execute build script
    #
    
    if options.file:
        scriptname = options.file
    else:
        scriptname = "jasyscript.py"
        
    if not os.path.isfile(scriptname):
        raise JasyError("Did not found '%s'!" % scriptname)

    buildfile = open(scriptname, "r")
    retval = exec(buildfile.read(), globals())



    #
    # Execute tasks
    #
    
    # filter out jasyscript reference, useful when doing ./jasyscript.py from the command line
    if args and "jasyscript.py" in args[0]:
        args.pop(0)

    # list all tasks when none is given
    if not args:
        logging.error("No tasks to execute. Please choose from: ")
        printTasks()
        sys.exit(1)

    # all arguments are processed as a list of task to execute in order
    for name in args:
        executeTask(name)
        
        

def main():
    """
    Main routine of Jasy
    """
    
    try:
        run()

    except JasyError as error:
        sys.stderr.write("!!! %s\n" % error)
        sys.exit(1)
        
    except KeyboardInterrupt:
        sys.stderr.write("Build interrupted!\n")
        sys.exit(2)
        
    sys.exit(0)