#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import hashlib

import jasy.vcs.Git as Git

from jasy.core.Logging import *
from jasy.core.Util import executeCommand

__enableUpdates = True

def enableRepositoryUpdates(enabled):
    global __enableUpdates
    __enableUpdates = enabled


def isRepository(url):
    return Git.isRepositoryUrl(url)


def getRepositoryType(url):
    if Git.isRepositoryUrl(url):
        return "git"
    else:
        return None


def getRepositoryFolder(url, version=None, kind=None):

    if kind == "git" or Git.isRepositoryUrl(url):

        version = Git.expandVersion(version)

        folder = url[url.rindex("/")+1:]
        if folder.endswith(".git"):
            folder = folder[:-4]

        identifier = "%s@%s" % (url, version)
        version = version[version.rindex("/")+1:]

    hash = hashlib.sha1(identifier.encode("utf-8")).hexdigest()
    return "%s-%s-%s" % (folder, version, hash)


def updateRepository(url, version=None, path=None, update=True):

    revision = None

    if Git.isRepositoryUrl(url):
        version = Git.expandVersion(version)
        revision = Git.updateRepository(url, version, path, update)

    return revision






