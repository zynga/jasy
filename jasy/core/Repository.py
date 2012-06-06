#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import subprocess, os, hashlib, shutil, re, tempfile, sys
from urllib.parse import urlparse
from jasy.core.Logging import *

__all__ = ["cloneGit", "isGitRepositoryUrl", "getGitBranch", "enableRepositoryUpdates"]

__nullDevice = open(os.devnull, 'w')
__gitAccountUrl = re.compile("([a-zA-Z0-9-_]+)@([a-zA-Z0-9-_\.]+):([a-zA-Z0-9/_-]+\.git)")
__gitHash = re.compile(r"^[a-f0-9]{40}$")
__versionNumber = re.compile(r"^v?([0-9\.]+)(-?(a|b|rc|alpha|beta)([0-9]+)?)?\+?$")
__branchParser = re.compile("^ref:.*/([a-zA-Z0-9_-]+)$")
__enableUpdates = True


def enableRepositoryUpdates(enabled):
    global __enableUpdates
    __enableUpdates = enabled
    

def getGitBranch(path=None):
    """Returns the name of the git branch"""
    
    if path is None:
        path = os.getcwd()
    
    headfile = os.path.join(path, ".git/HEAD")
    if not os.path.exists(headfile):
        raise Exception("Invalid GIT project path: %s" % path)
        
    match = __branchParser.match(open(headfile).read())
    if match is not None:
        return match.group(1)
        
    return None



def getDistFolder(repo, rev):
    """Returns the destination folder name of the given repository/revision combination."""
    
    baseFolder = repo[repo.rindex("/")+1:]
    if baseFolder.endswith(".git"):
        baseFolder = baseFolder[:-4]
    
    uniqueKey = "%s@%s" % (repo, rev)
    hashedKey = hashlib.sha1(uniqueKey.encode("utf-8")).hexdigest()
    
    return "%s-%s-%s" % (baseFolder, rev[rev.rindex("/")+1:], hashedKey)



def executeCommand(args, msg):
    """Executes the given process and outputs message when errors happen."""

    debug("Executing command: %s", " ".join(args))
    indent()
    
    # Using shell on Windows to resolve binaries like "git"
    output = tempfile.TemporaryFile(mode="w+t")
    returnValue = subprocess.call(args, stdout=output, stderr=output, shell=sys.platform == "win32")
    if returnValue != 0:
        raise Exception("Error during executing shell command: %s" % msg)
        
    output.seek(0)
    result = output.read().strip("\n\r")
    output.close()
    
    for line in result.splitlines():
        debug(line)
    
    outdent()
    
    return result



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
    
    debug("Using folder: %s", dist)
    if os.path.exists(dist) and os.path.exists(os.path.join(dist, ".git")):
        
        if not os.path.exists(os.path.join(dist, ".git", "HEAD")):
            error("Invalid git project. Cleaning up...")
            shutil.rmtree(dist)
        elif override:
            debug("Cleaning up...")
            shutil.rmtree(dist)
        else:
            os.chdir(dist)
            revision = executeCommand(["git", "rev-parse", "HEAD"], "Could not detect current revision")
            
            if update and (rev == "master" or "refs/heads/" in rev):
                if __enableUpdates:
                    info("Updating clone %s@%s", repo, rev)
                    
                    try:
                        executeCommand(["git", "fetch", "-q", "--depth", "1", "origin", rev], "Could not fetch updated revision!")
                        executeCommand(["git", "reset", "-q", "--hard", "FETCH_HEAD"], "Could not update checkout!")
                        newRevision = executeCommand(["git", "rev-parse", "HEAD"], "Could not detect current revision")
                        
                        if revision != newRevision:
                            indent()
                            info("Updated from %s to %s", revision[:10], newRevision[:10])
                            revision = newRevision
                            outdent()
                        
                    except Exception:
                        error("Error during git transaction! Could not update clone.")
                        error("Please verify that the host is reachable or disable automatic branch updates.")
                        
                        os.chdir(old)
                        return
                        
                    except KeyboardInterrupt:
                        print()
                        error("Aborted by user!")
                        
                        os.chdir(old)
                        return                            
                    
                else:
                    debug("Updates disabled")
                
            else:
                debug("Clone is already available")

            os.chdir(old)
            return dist, revision

    info("Cloning %s@%s into %s", repo, rev, dist[:dist.rindex("-")])
    os.makedirs(dist)
    os.chdir(dist)
    
    try:
        executeCommand(["git", "init", "."], "Could not initialize GIT repository!")
        executeCommand(["git", "remote", "add", "origin", repo], "Could not register remote repository!")
        executeCommand(["git", "fetch", "-q", "--depth", "1", "origin", rev], "Could not fetch revision!")
        executeCommand(["git", "reset", "-q", "--hard", "FETCH_HEAD"], "Could not update checkout!")
        revision = executeCommand(["git", "rev-parse", "HEAD"], "Could not detect current revision")
        
    except Exception:
        error("Error during git transaction! Intitial clone required for continuing!")
        error("Please verify that the host is reachable.")

        error("Cleaning up...")
        os.chdir(old)
        shutil.rmtree(dist)

        return
        
    except KeyboardInterrupt:
        print()
        error("Aborted by user!")
        
        error("Cleaning up...")
        os.chdir(old)
        shutil.rmtree(dist)
        
        return
    
    os.chdir(old)
    return dist, revision


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
    
