#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import hashlib, os

import jasy.vcs.Git as Git

import jasy.core.Console as Console
import jasy.core.Util as Util

__enableUpdates = True

def enableUpdates(enabled):
    global __enableUpdates
    __enableUpdates = enabled


def isUrl(url):
    return Git.isUrl(url)


def getType(url):
    if Git.isUrl(url):
        return "git"
    else:
        return None


def getTargetFolder(url, version=None, kind=None):

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

    revision = None

    if Git.isUrl(url):
        version = Git.expandVersion(version)
        revision = Git.update(url, version, path, update)

    return revision


def clean(path=None):
    
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

    old = os.getcwd()

    Console.info("Cleaning repository (distclean)...")
    Console.indent()

    if path:
        os.chdir(path)

    if os.path.exists(".git"):
        Git.distcleanRepository()

    os.chdir(old)
    Console.outdent()

