#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import hashlib, os

import jasy.vcs.Git as Git

import jasy.core.Console as Console
from jasy.core.Util import executeCommand

__enableUpdates = True

def enableUpdates(enabled):
    """Switches access for updating repository."""
    global __enableUpdates
    __enableUpdates = enabled


def isUrl(url):
    """Figures out whether the given string is a valid Git repository URL"""
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


def getTargetFolder(url, version=None, kind=None):
    """
    Generates name of the target folder for the given repository containing name, version and identifier

    :param url: URL to the repository
    :type url: string
    """
    if kind == "git" or Git.isRepositoryUrl(url):

        version = Git.expandVersion(version)

        folder = url[url.rindex("/")+1:]
        if folder.endswith(".git"):
            folder = folder[:-4]

        identifier = "%s@%s" % (url, version)
        version = version[version.rindex("/")+1:]

    hash = hashlib.sha1(identifier.encode("utf-8")).hexdigest()
    return "%s-%s-%s" % (folder, version, hash)


def update(url, version=None, path=None, update=True):
    """Clones the given repository URL (optionally with overriding/update features)"""

    revision = None

    if Git.isUrl(url):
        version = Git.expandVersion(version)
        revision = Git.update(url, version, path, update)

    return revision


def clean(path=None):
    """Cleans git repository from untracked files."""

    old = os.getcwd()

    if path:
        os.chdir(path)

    if os.path.exists(".git"):
        Git.cleanRepository()

    os.chdir(old)


def distclean(path=None):
    """Cleans git repository from untracked files. Ignores the files listed in ".gitignore"."""

    old = os.getcwd()

    if path:
        os.chdir(path)

    if os.path.exists(".git"):
        Git.distcleanRepository()

    os.chdir(old)


