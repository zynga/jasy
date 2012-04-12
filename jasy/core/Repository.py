#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import subprocess, os, logging, hashlib, shutil, re, tempfile, sys
from urllib.parse import urlparse

__all__ = ["cloneGit", "isGitRepositoryUrl"]

__nullDevice = open(os.devnull, 'w')
__gitAccountUrl = re.compile("([a-zA-Z0-9-_]+)@([a-zA-Z0-9-_\.]+):([a-zA-Z0-9/_-]+\.git)")
__gitHash = re.compile(r"^[a-f0-9]{40}$")
__versionNumber = re.compile(r"^v?([0-9\.]+)(-?(a|b|rc|alpha|beta)([0-9]+)?)?\+?$")


def getDistFolder(repo, rev):
    """Returns the destination folder name of the given repository/revision combination."""
    
    baseFolder = repo[repo.rindex("/")+1:]
    if baseFolder.endswith(".git"):
        baseFolder = baseFolder[:-4]
    
    uniqueKey = "%s@%s" % (repo, rev)
    hashedKey = hashlib.sha1(uniqueKey.encode("utf-8")).hexdigest()
    
    return "%s-%s" % (baseFolder, hashedKey)



def executeCommand(args, msg):
    """Executes the given process and outputs message when errors happen."""

    # Using shell on Windows to resolve binaries like "git"
    returnValue = subprocess.call(args, stdout=__nullDevice, shell=sys.platform == "win32")
    if returnValue != 0:
        logging.error("Error during executing shell command!")
        logging.error(msg)
        return False
        
    return True



def cloneGit(repo, rev=None, override=False, prefix=None, update=True):
    """Clones the given repository URL into a folder in prefix (optionally with overriding/update features)"""

    if rev is None:
        rev = "master"
        
    # Expand revision
    if rev.startswith("refs/"):
        pass
    elif re.compile(r"^[a-f0-9]{40}$").match(rev):
        # See also: http://git.661346.n2.nabble.com/Fetch-by-SHA-missing-td5604552.html
        raise Exception("Can't fetch non tags/branches: %s@%s!" % (repo, rev))
    elif __versionNumber.match(rev) is not None:
        rev = "refs/tags/" + rev
    else:
        rev = "refs/heads/" + rev
        
    dist = getDistFolder(repo, rev)
    if prefix:
        dist = os.path.join(prefix, dist)
        
    old = os.getcwd()
    
    logging.debug("- Using folder: %s", dist)
    if os.path.exists(dist):
        
        if override:
            logging.debug("- Cleaning up...")
            shutil.rmtree(dist)
        else:
            if update and (rev == "master" or "refs/heads/" in rev):
                logging.info("Updating clone %s@%s", repo, rev)
                os.chdir(dist)
                executeCommand(["git", "fetch", "-q", "--depth", "1", "origin", rev], "Could not fetch updated revision!")
                executeCommand(["git", "reset", "-q", "--hard", "FETCH_HEAD"], "Could not update checkout!")
                os.chdir(old)
                
            else:
                logging.debug("- Clone is already available")

            return dist

    logging.info("Cloning %s@%s", repo, rev)
    os.makedirs(dist)
    os.chdir(dist)
    if executeCommand(["git", "init", "."], "Could not initialize GIT repository!"):
        if executeCommand(["git", "remote", "add", "origin", repo], "Could not register remote repository!"):
            logging.debug("- Fetching revision...")
            if executeCommand(["git", "fetch", "-q", "--depth", "1", "origin", rev], "Could not fetch revision!"):
                executeCommand(["git", "reset", "-q", "--hard", "FETCH_HEAD"], "Could not update checkout!")

    os.chdir(old)
    return dist


def isGitRepositoryUrl(url):
    """Figures out whether the given string is a valid Git repository URL"""

    # Detects these urls correctly
    # foo => False
    # ../bar => False
    # https://faz.net?x=1 => False
    # git@github.com:zynga/apibrowser.git => True
    # https://github.com/zynga/core => True
    # https://wpbasti@github.com/zynga/apibrowser.git => True
    # git://github.com/zynga/core.git => True
    # git://gitorious.org/qt/qtdeclarative.git => True
    # https://git.gitorious.org/qt/qtdeclarative.git => True
    
    if not url.endswith(".git"):
        return False
        
    parsed = urlparse(url)
    if parsed.scheme in ("git", "https"):
        return not parsed.params and not parsed.query and not parsed.fragment
    elif not parsed.scheme and parsed.path == url and __gitAccountUrl.match(url) != None:
        return True
        
    return False
    
