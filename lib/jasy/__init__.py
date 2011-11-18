#
# Jasy - Web Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import sys, logging, os
from optparse import OptionParser

# Import environment for JasyScript developers
from jasy.core.Error import *
from jasy.core.Task import *
from jasy.core.Session import *
from jasy.core.Project import *

from jasy.asset.Asset import * 

from jasy.js.Resolver import *
from jasy.js.Sorter import *

from jasy.js.output.Combiner import *
from jasy.js.output.Optimization import *
from jasy.js.output.Formatting import *

from jasy.util.File import *

# Current version. Used by setuptools
VERSION = "0.4"

# Export only main routine
__all__ = ["main", "VERSION"]



def main():
    """
    Main routine of Jasy. This method is called by the "jasy" script.
    """

    try:
        __main()

    except JasyError as error:
        sys.stderr.write("!!! %s\n" % error)
        sys.exit(1)

    except KeyboardInterrupt:
        sys.stderr.write("Build interrupted!\n")
        sys.exit(2)

    sys.exit(0)



def __main():
    """
    Internal main routine. Parses command line arguments, configures logging and execute all given tasks in order
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
    
    logging.info("Jasy %s" % VERSION)

    if options.file:
        scriptname = options.file
    else:
        scriptname = "jasyscript.py"
        
    if not os.path.isfile(scriptname):
        raise JasyError("Cannot not found any Jasy script with task definitions (%s)!" % scriptname)

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
        
