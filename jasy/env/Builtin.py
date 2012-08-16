#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import shutil, os, re, tempfile, jasy

from jasy.env.Task import task
from jasy.core.Logging import *
from jasy.env.State import session
from jasy.core.Error import JasyError
from jasy.core.Repository import isRepository, updateRepository
from jasy.core.Project import getProjectFromPath


fieldPattern = re.compile(r"\$\${([_a-z][_a-z0-9]*)}", re.IGNORECASE | re.VERBOSE)


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
            raise JasyError("Auto discovery failed! No Jasy projects registered!")

        originPath = originProject.getPath()
        originName = originProject.getName()

    else:

        # Origin can be either:
        # 1) project name inside current project
        # 2) relative or absolute folder path
        # 3) repository URL

        if isRepository(origin):
            info("Using repository clone: %s", origin)

            tempDirectory = tempfile.TemporaryDirectory()
            originPath = tempDirectory.name
            originName = "repository"

            print("Using Temp directory: %s" % originPath)
            print("Cloning...")

            updateRepository(url, version, path)

            print("Done!")

        else:

            originProject = session.getProjectByName(origin)
            if originProject is not None:
                originPath = originProject.getPath()
                originName = origin

            elif os.path.isdir(origin):
                originPath = origin
                originProject = getProjectFromPath(originPath)
                originName = originProject.getName()


    skeletonDir = os.path.join(originPath, originProject.getConfigValue("skeletonDir", "skeleton"))
    if not os.path.isdir(skeletonDir):
        raise JasyError('The project "%s" offers no skeletons!' % originName)

    # For convenience: Use first skeleton in skeleton folder if no other selection was applied
    if skeleton is None:
        skeleton = getFirstSubFolder(skeletonDir)

    # Finally we have the skeleton path (the root folder to copy for our app)
    skeletonPath = os.path.join(originProject.getPath(), skeletonDir, skeleton)
    if not os.path.isdir(skeletonPath):
        raise JasyError('Skeleton "%s" does not exist in project "%s"' % (skeleton, originName))

    # Figuring out destination folder
    destinationPath = os.path.abspath(name)
    if os.path.exists(destinationPath):
        raise JasyError("Cannot create project in %s. File or folder exists!" % destinationPath)

    # Prechecks done
    info('Creating "%s" from %s@%s...', name, skeleton, originName)

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
    
    # Convert method with access to local data
    def convertPlaceholder(mo):
        field = mo.group(1)
        if field in data:
            return data[field]

        raise ValueError('No value for placeholder "%s"' % field)

    # Patching files recursively
    info("Patching files...")
    indent()
    for dirPath, dirNames, fileNames in os.walk(destinationPath):
        relpath = os.path.relpath(dirPath, destinationPath)

        # Filter dotted directories like .git, .bzr, .hg, .svn, etc.
        for dirname in dirNames:
            if dirname.startswith("."):
                dirNames.remove(dirname)
        
        for fileName in fileNames:
            filePath = os.path.join(dirPath, fileName)
            fileRel = os.path.normpath(os.path.join(relpath, fileName))
            
            debug("Processing: %s..." % fileRel)

            fileHandle = open(filePath, "r", encoding="utf-8", errors="surrogateescape")
            fileContent = []
            
            # Parse file line by line to detect binary files early and omit
            # fully loading them into memory
            try:
                isBinary = False

                for line in fileHandle:
                    if '\0' in line:
                        isBinary = True
                        break 
                    else:
                        fileContent.append(line)
        
                if isBinary:
                    debug("Ignoring binary file: %s", fileRel)
                    continue

            except UnicodeDecodeError as ex:
                warn("Can't process file: %s: %s", fileRel, ex)
                continue

            fileContent = "".join(fileContent)

            # Update content with available data
            try:
                resultContent = fieldPattern.sub(convertPlaceholder, fileContent)
            except ValueError as ex:
                warn("Unable to process file %s: %s!", fileRel, ex)
                continue

            # Only write file if there where any changes applied
            if resultContent != fileContent:
                info("Updating: %s...", fileRel)
                
                fileHandle = open(filePath, "w", encoding="utf-8", errors="surrogateescape")
                fileHandle.write(resultContent)
                fileHandle.close()
                
    outdent()

    info('Your application "%s" was created successfully!', name)

