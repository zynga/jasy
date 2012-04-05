#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import subprocess, os, logging, hashlib, shutil, re
from urllib.parse import urlparse

__all__ = ["cloneGit", "isGitRepositoryUrl"]


def getDistFolder(repo, rev):
    baseFolder = repo[repo.rindex("/")+1:]
    if baseFolder.endswith(".git"):
        baseFolder = baseFolder[:-4]
    
    uniqueKey = "%s@%s" % (repo, rev)
    hashedKey = hashlib.sha1(uniqueKey.encode("utf-8")).hexdigest()
    
    return "%s-%s" % (baseFolder, hashedKey)


nullDevice = open(os.devnull, 'w')

def executeCommand(args, msg):
    returnValue = subprocess.call(args, stdout=nullDevice, shell=False)
    if returnValue != 0:
        logging.error("Error during executing shell command!")
        logging.error(msg)
        return False
        
    return True


def cloneGit(repo, rev=None, override=False, prefix=None):
    if rev is None:
        rev = "master"

    logging.debug("Cloning: %s at %s", repo, rev)
    dist = getDistFolder(repo, rev)
    if prefix:
        dist = os.path.join(prefix, dist)
        
    logging.debug("- Using folder: %s", dist)
    if os.path.exists(dist):
        
        if override:
            logging.debug("- Cleaning up...")
            shutil.rmtree(dist)
        else:
            logging.debug("- Checkout is already available")
            return dist

    old = os.getcwd()
    
    logging.debug("- Fetching revision...")
    os.makedirs(dist)
    os.chdir(dist)
    if executeCommand(["git", "init", "."], "Could not initialize GIT repository!"):
        if executeCommand(["git", "remote", "add", "origin", repo], "Could not register remote repository!"):
            if executeCommand(["git", "fetch", "-q", "--depth", "1", "origin", rev], "Could not fetch revision!"):
                if executeCommand(["git", "reset", "-q", "--hard", "FETCH_HEAD"], "Could not update checkout!"):
                    os.chdir(old)
                    return dist

    os.chdir(old)
    

gitAccountUrl = re.compile("([a-zA-Z0-9-_]+)@([a-zA-Z0-9-_\.]+):([a-zA-Z0-9/_-]+\.git)")
    
    
def isGitRepositoryUrl(url):

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
    elif not parsed.scheme and parsed.path == url and gitAccountUrl.match(url) != None:
        return True
        
    return False
    
