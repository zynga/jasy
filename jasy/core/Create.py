#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import re, os.path, shutil, tempfile
import jasy

from jasy.core.Project import getProjectFromPath
from jasy.core.Util import getKey, getFirstSubFolder, massFilePatcher
from jasy.core.Config import Config
from jasy import UserError

import jasy.core.Console as Console
import jasy.vcs.Repository as Repository

__all__ = ["create"]


validProjectName = re.compile(r"^[a-z][a-z0-9]*$")

def create(name="myproject", origin=None, originVersion=None, skeleton=None, destination=None, session=None, **argv):
    Console.header("Creating project %s" % name)

    if not validProjectName.match(name):
        raise UserError("Invalid project name: %s (Use lowercase characters and numbers only for broadest compabibility)" % name)


    #
    # Initial Checks
    #

    # Figuring out destination folder
    if destination is None:
        destination = name

    destinationPath = os.path.abspath(os.path.expanduser(destination))
    if os.path.exists(destinationPath):
        raise UserError("Cannot create project %s in %s. File or folder exists!" % (name, destinationPath))

    # Origin can be either:
    # 1) None, which means a skeleton from the current main project
    # 2) An repository URL
    # 3) A project name known inside the current session
    # 4) Relative or absolute folder path

    originPath = None;
    originName = None;

    if origin is None:
        originProject = session and session.getMain()

        if originProject is None:
            raise UserError("Auto discovery failed! No Jasy projects registered!")

        originPath = originProject.getPath()
        originName = originProject.getName()
        originRevision = None

    elif Repository.isUrl(origin):
        Console.info("Using remote skeleton")

        tempDirectory = tempfile.TemporaryDirectory()
        originPath = os.path.join(tempDirectory.name, "clone")
        originUrl = origin

        Console.indent()
        originRevision = Repository.update(originUrl, originVersion, originPath)
        Console.outdent()

        if originRevision is None:
            raise UserError("Could not clone origin repository!")

        Console.debug("Cloned revision: %s" % originRevision)
        if os.path.isfile(os.path.join(originPath, "jasycreate.yaml")) or os.path.isfile(os.path.join(originPath, "jasycreate.json")) or os.path.isfile(os.path.join(originPath, "jasycreate.py")):
            originProject = None
        else:
            originProject = getProjectFromPath(originPath)
            originName = originProject.getName()

    else:
        originProject = session and session.getProjectByName(origin)
        originVersion = None
        originRevision = None

        if originProject is not None:
            originPath = originProject.getPath()
            originName = origin

        elif os.path.isdir(origin):
            originPath = origin
            if os.path.isfile(os.path.join(originPath, "jasycreate.yaml")) or os.path.isfile(os.path.join(originPath, "jasycreate.json")) or os.path.isfile(os.path.join(originPath, "jasycreate.py")):
                originProject = None
            else:
                originProject = getProjectFromPath(originPath)
                originName = originProject.getName()

        else:
            raise UserError("Invalid value for origin: %s" % origin)


    # Figure out the skeleton root folder
    if originProject is not None:
        skeletonDir = os.path.join(originPath, originProject.getConfigValue("skeletonDir", "skeleton"))
    else:
        skeletonDir = originPath
    if not os.path.isdir(skeletonDir):
        raise UserError('The project %s offers no skeletons!' % originName)

    # For convenience: Use first skeleton in skeleton folder if no other selection was applied
    if skeleton is None:
        if originProject is not None:
            skeleton = getFirstSubFolder(skeletonDir)
        else:
            skeleton = skeletonDir

    # Finally we have the skeleton path (the root folder to copy for our app)
    skeletonPath = os.path.join(skeletonDir, skeleton)
    if not os.path.isdir(skeletonPath):
        raise UserError('Skeleton %s does not exist in project "%s"' % (skeleton, originName))


    #
    # Actual Work
    #

    # Prechecks done
    if originName:
        Console.info('Creating %s from %s %s...', Console.colorize(name, "bold"), Console.colorize(skeleton + " @", "bold"), Console.colorize(originName, "magenta"))
    else:
        Console.info('Creating %s from %s...', Console.colorize(name, "bold"), Console.colorize(skeleton, "bold"))
    Console.debug('Skeleton: %s', Console.colorize(skeletonPath, "grey"))
    Console.debug('Destination: %s', Console.colorize(destinationPath, "grey"))

    # Copying files to destination
    Console.info("Copying files...")
    shutil.copytree(skeletonPath, destinationPath)
    Console.debug("Files were copied successfully.")

    # Close origin project
    if originProject:
        originProject.close()

    # Change to directory before continuing
    os.chdir(destinationPath)

    # Create configuration file from question configs and custom scripts
    Console.info("Starting configuration...")
    config = Config()

    config.set("name", name)
    config.set("jasy.version", jasy.__version__)
    if originName:
        config.set("origin.name", originName)
    config.set("origin.version", originVersion)
    config.set("origin.revision", originRevision)
    config.set("origin.skeleton", os.path.basename(skeletonPath))

    config.injectValues(**argv)
    if originProject is not None:
        config.readQuestions("jasycreate", optional=True)
        config.executeScript("jasycreate.py", optional=True)

    config.write("jasyscript.yaml")

    # Do actual replacement of placeholders
    massFilePatcher(destinationPath, config)
    Console.debug("Files were patched successfully.")

    # Done
    Console.info('Your application %s was created successfully!', Console.colorize(name, "bold"))

