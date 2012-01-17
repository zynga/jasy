#
# Jasy - Web Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

# Current version. Used by setuptools
__version__ = "0.5-alpha3"

# Export only main routine
__all__ = ["main", "__version__"]

from jasy.core.Error import *
from jasy.core.Task import *
from jasy.core.Session import *
from jasy.core.Project import *

from jasy.asset.Asset import * 

from jasy.js.Resolver import *
from jasy.js.Sorter import *

from jasy.js.api.Writer import *

from jasy.js.output.Combiner import *
from jasy.js.output.Optimization import *
from jasy.js.output.Formatting import *

from jasy.util.File import *


def main(options=None):
    """
    Main routine of Jasy. This method is called by the "jasy" script.
    """

    logging.info("Jasy %s" % __version__)

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

