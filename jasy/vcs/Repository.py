#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import hashlib, os

import jasy.core.Console as Console
import jasy.core.Util as Util
import jasy.vcs.Git as Git


def isUrl(url):
    """
    Figures out whether the given string is a valid Git repository URL

    :param url: URL to the repository
    :type url: string
    """
    return Git.isUrl(url)


def getType(url):
    """
    Returns repository type of the given URL

    :param url: URL to the repository
    :type url: string
    """
    if Git.isUrl(url):
        return "git"
    else:
        return None


def getTargetFolder(url, version=None):
    """
    Returns the target folder name based on the URL and version using SHA1 checksums

    :param url: URL to the repository
    :type url: string
    :param version: Version to use
    :type url: string
    """
    
    if Git.isUrl(url):

        version = Git.expandVersion(version)

        folder = url[url.rindex("/")+1:]
        if folder.endswith(".git"):
            folder = folder[:-4]

        identifier = "%s@%s" % (url, version)
        version = version[version.rindex("/")+1:]

    hash = hashlib.sha1(identifier.encode("utf-8")).hexdigest()
    return "%s-%s-%s" % (folder, version, hash)


def update(url, version=None, path=None, update=True):
    """
    Clones the given repository URL (optionally with overriding/update features)

    :param url: URL to the repository
    :type url: string
    :param version: Version to clone
    :type url: string
    :param version: Destination path
    :type url: string
    :param version: Eneable/disable update functionality
    :type url: string
    """

    revision = None

    if Git.isUrl(url):
        version = Git.expandVersion(version)
        revision = Git.update(url, version, path, update)

    return revision


def clean(path=None):
    """
    Cleans repository from untracked files.

    :param url: Path to the local repository
    :type url: string
    """

    old = os.getcwd()

    Console.info("Cleaning repository (clean)...")
    Console.indent()

    if path:
        os.chdir(path)

    if os.path.exists(".git"):
        Git.cleanRepository()

    os.chdir(old)
    Console.outdent()


def distclean(path=None):
    """
    Cleans repository from untracked and ignored files. This method
    is pretty agressive in a way that it deletes all non repository managed
    files e.g. external folder, uncommitted changes, unstaged files, etc.

    :param url: Path to the local repository
    :type url: string
    """

    old = os.getcwd()

    Console.info("Cleaning repository (distclean)...")
    Console.indent()

    if path:
        os.chdir(path)

    if os.path.exists(".git"):
        Git.distcleanRepository()

    os.chdir(old)
    Console.outdent()

