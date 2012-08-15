#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import shutil, os, jasy
from string import Template

from jasy.env.Task import task
from jasy.core.Logging import *
from jasy.env.State import session
from jasy.core.Error import JasyError


def printBasicInfo():
    print("Jasy is powerful web tooling framework inspired by SCons")
    print("Copyright (c) 2011-2012 Zynga Inc. %s" % colorize("http://zynga.com/", "underline"))
    print("Visit %s for details." % colorize("https://github.com/zynga/jasy", "underline"))
    print()

def getFirstSubFolder(start):
    for root, dirs, files in os.walk(start):
        for directory in dirs:
            if not directory.startswith("."):
                return directory

    return None


@task("Print outs the Jasy about page")
def about():
    header("About")

    printBasicInfo()

    info("Command: %s", jasy.env.Task.getCommand())
    info("Version: %s", jasy.__version__)


@task("Troubleshooting the Jasy environment")
def doctor():
    header("Doctor")


@task("Shows this help screen")
def help():
    header("Help")

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


@task("Creates a new project")
def create(name="myproject", origin=None, skeleton=None, **argv):
    header("Create project")

    if origin is None:
        originProject = session.getMain()
        if originProject is None:
            raise JasyError("No projects registered!")
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
    info('Skeleton: %s', skeletonPath)
    info('Destination: %s', destinationPath)
    outdent()

    # Copying files to destination
    info("Copying files...")
    shutil.copytree(skeletonPath, destinationPath)

    # Build data for template substitution
    data = argv
    data["name"] = name
    data["origin"] = originProject.getName()
    data["skeleton"] = os.path.basename(skeletonPath)
    data["jasy"] = "Jasy %s" % jasy.__version__
    
    # Patching files recursively
    info("Patching files...")
    indent()
    for dirpath, dirnames, filenames in os.walk(destinationPath):
        relpath = os.path.relpath(dirpath, destinationPath)
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            debug("Processing %s..." % filepath)

            filehandle = open(filepath, "r")
            filecontent = filehandle.read()

            # Check for binary aka has no null bytes
            if '\0' in filecontent:
                info("Ignore binary file: %s")
                continue
            
            filehandle.close()

            # Initialize template and produce result
            filetemplate = Template(filecontent)
            resultcontent = filetemplate.substitute(**data)

            if resultcontent != filecontent:
                info("Updating %s...", os.path.normpath(os.path.join(relpath, filename)))
                
                filehandle = open(filepath, "w")
                filehandle.write(resultcontent)
                filehandle.close()
                
    outdent()

    info('Your application "%s" was created successfully!', name)

