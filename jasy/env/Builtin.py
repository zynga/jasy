#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import shutil, os, jasy
from jasy.env.Task import task
from jasy.core.Logging import *

def getFirstSubFolder(start):
    for root, dirs, files in os.walk(start):
        for directory in dirs:
            if not directory.startswith("."):
                return directory

    return None

@task("Print outs the Jasy about page")
def about():
    header("About")
    info("Command: %s", jasy.env.Task.getCommand())
    info("Version: %s", jasy.__version__)


@task("Utility for troubleshooting the Jasy environment")
def doctor():
    header("Doctor")


@task("Shows this help screen")
def help():
    header("Help")
    print("Jasy is powerful Python3 based Web Tooling Framework")
    print("Copyright (c) 2011-2012 Zynga Inc. %s" % colorize("http://zynga.com/", "underline"))
    print("Visit %s for details." % colorize("https://github.com/zynga/jasy", "underline"))

    print()
    print(colorize(colorize("Usage", "underline"), "bold"))
    import jasy.env.Task
    print("  $ jasy [<options...>] <task1> [<args...>] [<task2> [<args...>]]")

    print()
    print(colorize(colorize("Global Options", "underline"), "bold"))
    jasy.env.Task.getOptions().printOptions()

    print()
    print(colorize(colorize("Available Tasks", "underline"), "bold"))
    jasy.env.Task.printTasks()

    print()


@task("Initializes a new project")
def init(name="myproject", origin=None, skeleton=None):
    header("Initializing new project")

    if origin is None:
        originProject = session.getMain()
    else:
        originProject = session.getProjectByName(origin)
        if originProject is None:
            raise JasyError("Unknown project to start with: %s!" % origin)

    skeletonDir = originProject.getConfigValue("skeletonDir", "skeleton")
    if not os.path.isdir(skeletonDir):
        raise JasyError('The project "%s" offers no skeletons!' % originProject.getName())

    # For convenience: Use first skeleton in skeleton folder if no other selection was applied
    if skeleton is None:
        skeleton = getFirstSubFolder(skeletonDir)

    # Finally we have the skeleton path (the root folder to copy for our app)
    skeletonPath = os.path.join(originProject.getPath(), skeletonDir, skeleton)
    if not os.path.isdir(skeletonPath):
        raise JasyError('Skeleton "%s" does not exist in project "%s"' % (skeleton, origin))

    # Figuring out destination folder
    destinationPath = os.path.abspath(name)
    if os.path.exists(destinationPath):
        raise JasyError("Cannot create project in %s. File or folder exists!" % destinationPath)

    # Prechecks done
    info('Creating "%s" from %s@%s...', name, skeleton, originProject.getName())

    indent()
    info('Skeleton Folder: %s', skeletonPath)
    info('Destination Folder: %s', destinationPath)
    outdent()

    info("Copying folder...")
    shutil.copytree(skeletonPath, destinationPath)

    info("Patching files...")


    info("Your application %s was created successfully!", name)

