#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import shutil, os, tempfile, re, jasy

from jasy.core.Logging import *
from jasy.env.Task import task, runTask
from jasy.env.State import session
from jasy.core.Error import JasyError
from jasy.core.Repository import isRepository, updateRepository
from jasy.core.Project import getProjectFromPath
from jasy.core.Util import getKey, getFirstSubFolder, massFilePatcher


validProjectName = re.compile(r"^[a-z][a-z0-9]*$")

def printBasicInfo():
    print("Jasy is powerful web tooling framework inspired by SCons")
    print("Copyright (c) 2010-2012 Zynga Inc. %s" % colorize("http://zynga.com/", "underline"))
    print("Visit %s for details." % colorize("https://github.com/zynga/jasy", "underline"))
    print()


@task
def about():
    """Print outs the Jasy about page"""

    header("About")

    printBasicInfo()

    info("Command: %s", jasy.env.Task.getCommand())
    info("Version: %s", jasy.__version__)


@task
def help():
    """Shows this help screen"""

    header("Showing Help")

    printBasicInfo()
    
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


@task
def doctor():
    """Troubleshooting the Jasy environment"""

    header("Troubleshooting Environment")


@task
def create(name="myproject", origin=None, skeleton=None, **argv):
    """Creates a new project"""

    header("Creating project %s" % name)

    if not validProjectName.match(name):
        raise JasyError("Invalid project name: %s" % name)


    #
    # Initial Checks
    #

    # Figuring out destination folder
    destinationPath = os.path.abspath(name)
    if os.path.exists(destinationPath):
        raise JasyError("Cannot create project in %s. File or folder exists!" % destinationPath)

    # Origin can be either:
    # 1) None, which means a skeleton from the current main project
    # 2) An repository URL
    # 3) A project name known inside the current session
    # 4) Relative or absolute folder path

    if origin is None:
        originProject = session.getMain()

        if originProject is None:
            raise JasyError("Auto discovery failed! No Jasy projects registered!")

        originPath = originProject.getPath()
        originName = originProject.getName()

    elif isRepository(origin):
        info("Using remote skeleton")

        tempDirectory = tempfile.TemporaryDirectory()
        originPath = os.path.join(tempDirectory.name, "clone")
        originUrl = origin
        originVersion = getKey(argv, "origin-version")

        indent()
        originRevision = updateRepository(originUrl, originVersion, originPath)
        outdent()

        if originRevision is None:
            raise JasyError("Could not clone origin repository!")

        debug("Cloned revision: %s" % originRevision)

        originProject = getProjectFromPath(originPath)
        originName = originProject.getName()

    else:
        originProject = session.getProjectByName(origin)
        if originProject is not None:
            originPath = originProject.getPath()
            originName = origin

        elif os.path.isdir(origin):
            originPath = origin
            originProject = getProjectFromPath(originPath)
            originName = originProject.getName()

        else:
            raise JasyError("Invalid value for origin: %s" % origin)

    # Figure out the skeleton root folder
    skeletonDir = os.path.join(originPath, originProject.getConfigValue("skeletonDir", "skeleton"))
    if not os.path.isdir(skeletonDir):
        raise JasyError('The project %s offers no skeletons!' % originName)

    # For convenience: Use first skeleton in skeleton folder if no other selection was applied
    if skeleton is None:
        skeleton = getFirstSubFolder(skeletonDir)

    # Finally we have the skeleton path (the root folder to copy for our app)
    skeletonPath = os.path.join(skeletonDir, skeleton)
    if not os.path.isdir(skeletonPath):
        raise JasyError('Skeleton %s does not exist in project "%s"' % (skeleton, originName))


    #
    # Actual Work
    #

    # Prechecks done
    info('Creating %s from %s %s...', colorize(name, "bold"), colorize(skeleton + " @", "bold"), colorize(originName, "magenta"))
    debug('Skeleton: %s', colorize(skeletonPath, "grey"))
    debug('Destination: %s', colorize(destinationPath, "grey"))

    # Copying files to destination
    info("Copying files...")
    shutil.copytree(skeletonPath, destinationPath)
    debug("Files were copied successfully.")

    # Build data for template substitution
    data = argv
    data["name"] = name
    data["origin"] = originName
    data["skeleton"] = os.path.basename(skeletonPath)
    data["jasy"] = "Jasy %s" % jasy.__version__

    # Do actual replacement of placeholders
    massFilePatcher(destinationPath, data)
    debug("Files were patched successfully.")

    # Execute help once to load/prepare all depend projects
    info("Pre-Initializing project...")
    runTask(destinationPath, "help")
    info('Your application %s was created and pre-initialized successfully!', colorize(name, "bold"))


