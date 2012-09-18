#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

"""Global environment which is used by jasyscript.py files"""

# Session
from jasy.env.State import session

# Modules
import jasy.core.Console as Console
import jasy.env.Task as Task
import jasy.vcs.Repository as Repository

# Classes
from jasy.core.OutputManager import OutputManager
from jasy.core.FileManager import FileManager
from jasy.asset.Manager import AssetManager
from jasy.asset.SpritePacker import SpritePacker
from jasy.js.Resolver import Resolver
from jasy.js.api.Writer import ApiWriter
from jasy.http.Server import Server

# Commands (be careful with these, prefer modules and classes)
from jasy.env.Task import task

# Create config object
import jasy.core.Config as Config
config = Config.Config()
config.__doc__ = "Auto initialized config object based on project's jasyscript.yaml/json"
config.loadValues("jasyscript", optional=True)


@task
def about():
    """Print outs the Jasy about page"""

    import jasy

    jasy.info()

    from jasy.env.Task import getCommand

    Console.info("Command: %s", getCommand())
    Console.info("Version: %s", jasy.__version__)


@task
def help():
    """Shows this help screen"""

    import jasy

    jasy.info()

    print(Console.colorize(Console.colorize("Usage", "underline"), "bold"))
    print("  $ jasy [<options...>] <task1> [<args...>] [<task2> [<args...>]]")

    print()
    print(Console.colorize(Console.colorize("Global Options", "underline"), "bold"))
    Task.getOptions().printOptions()

    print()
    print(Console.colorize(Console.colorize("Available Tasks", "underline"), "bold"))
    Task.printTasks()

    print()


@task
def doctor():
    """Checks Jasy environment and prints offers support for installing missing packages"""

    # This is a placeholder task to show up in the jasy task list
    # The handling itself is directly implemented in "bin/jasy"
    pass


@task
def create(name="myproject", origin=None, originVersion=None, skeleton=None, destination=None, **argv):
    """Creates a new project based on a local or remote skeleton"""

    import jasy.core.Create as Create
    return Create.create(name, origin, originVersion, skeleton, destination, session, **argv)


@task
def showapi():
    """Shows the official API available in jasyscript.py"""

    from jasy.core.Inspect import generateApi
    Console.info(generateApi(__api__))


