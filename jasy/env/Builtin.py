#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import jasy.core.Create

from jasy.core.Logging import *
from jasy.env.Task import task


@task
def about():
    """Print outs the Jasy about page"""

    header("About")
    jasy.info()

    info("Command: %s", jasy.env.Task.getCommand())
    info("Version: %s", jasy.__version__)


@task
def help():
    """Shows this help screen"""

    header("Help")
    jasy.info()

    print(colorize(colorize("Usage", "underline"), "bold"))
    print("  $ jasy [<options...>] <task1> [<args...>] [<task2> [<args...>]]")

    print()
    print(colorize(colorize("Global Options", "underline"), "bold"))
    jasy.env.Task.getOptions().printOptions()

    print()
    print(colorize(colorize("Available Tasks", "underline"), "bold"))
    jasy.env.Task.printTasks()

    print()


@task
def doctor():
    """Verification and tests for Jasy environment"""

    # This is a placeholder task to show up in the jasy task list
    # The handling itself is directly implemented in "bin/jasy"
    pass


@task
def create(name="myproject", origin=None, originVersion=None, skeleton=None, destination=None, **argv):
    """Creates a new project"""

    return jasy.core.Create.create(name, origin, originVersion, skeleton, destination, **argv)

