#
# Jasy - Web Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

# Current version. Used by setuptools
__version__ = "0.5-alpha1"

# Export only main routine
__all__ = ["main", "__version__"]

import sys, logging, os
from optparse import OptionParser



#
# Parse options
#

parser = OptionParser()
parser.add_option("-q", "--quiet", action="store_false", dest="verbose", help="don't print status messages to stdout")
parser.add_option("-v", "--verbose", action="store_true", dest="verbose", help="print more detailed status messages to stdout")
parser.add_option("-l", "--log", dest="logfile", help="Write debug messages to given logfile")
parser.add_option("-f", "--file", dest="file", help="Use the given jasy script")
parser.add_option("-V", "--version", action="store_true", dest="showVersion", help="Use the given jasy script")

(options, args) = parser.parse_args()



#
# Configure logging
# 

# Configure log level for root logger first (enable debug level when either logfile or console verbosity is activated)
loglevel = logging.INFO
if options.logfile or options.verbose is True:
    loglevel = logging.DEBUG

# Basic configuration of console logging
logging.basicConfig(level=loglevel, format="%(message)s")

# Configure console handler to correct level
if options.verbose is True:
    logging.getLogger().handlers[0].setLevel(logging.DEBUG)
elif options.verbose is False:
    logging.getLogger().handlers[0].setLevel(logging.WARN)
else:
    logging.getLogger().handlers[0].setLevel(logging.INFO)

# Enable writing to logfile with debug level
if options.logfile:
    logfileHandler = logging.FileHandler(options.logfile)
    logfileHandler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s %(message)s'))
    logfileHandler.setLevel(logging.DEBUG)
    logging.getLogger().addHandler(logfileHandler) 

logging.info("Jasy %s" % __version__)



#
# Import environment for JasyScript developers
#

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





def main():
    """
    Main routine of Jasy. This method is called by the "jasy" script.
    """

    try:
        #
        # Find and execute build script
        #

        if options.showVersion:
            return

        if options.file:
            scriptname = options.file
        else:
            scriptname = "jasyscript.py"

        if not os.path.isfile(scriptname):
            raise JasyError("Cannot find any Jasy script with task definitions (%s)!" % scriptname)

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
            

    except JasyError as error:
        sys.stderr.write("%s\n" % error)
        sys.exit(1)

    except KeyboardInterrupt:
        sys.stderr.write("Build interrupted!\n")
        sys.exit(2)

    sys.exit(0)

