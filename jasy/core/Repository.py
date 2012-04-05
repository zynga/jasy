#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import subprocess, os, logging, hashlib, shutil, re
from urllib.parse import urlparse

__all__ = ["cloneGit"]


def getDistFolder(repo, rev):
    baseFolder = repo[repo.index("/")+1:]
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


def cloneGit(repo, rev="master", override=False):
    logging.info("Cloning: %s at %s", repo, rev)

    dist = getDistFolder(repo, rev)
    logging.info("- Using folder: %s", dist)

    if os.path.exists(dist):
        
        if override:
            logging.info("- Cleaning up...")
            shutil.rmtree(dist)
        else:
            logging.info("- Checkout is already available")
            return dist

    old = os.getcwd()
    
    logging.info("- Preparing repository...")
    os.mkdir(dist)
    os.chdir(dist)
    if executeCommand(["git", "init", "."], "Could not initialize GIT repository!"):
        if executeCommand(["git", "remote", "add", "origin", repo], "Could not register remote repository!"):
            logging.info("- Fetching revision: %s...", rev)
            if executeCommand(["git", "fetch", "--depth", "1", "origin", rev], "Could not fetch revision!"):
                if executeCommand(["git", "reset", "--hard", "FETCH_HEAD"], "Could not update checkout!"):
                    os.chdir(old)
                    return dist

    os.chdir(old)
    
    
def isUrlLinke(url):
    return
    
    
def isGitRepositoryUrl(url):

    tests = [
        "foo",
        "../bar",
        "https://faz.net?x=1",
        "git@github.com:zynga/apibrowser.git",
        "https://github.com/zynga/core",
        "https://wpbasti@github.com/zynga/apibrowser.git",
        "git://github.com/zynga/core.git",
        "git://gitorious.org/qt/qtdeclarative.git",
        "https://git.gitorious.org/qt/qtdeclarative.git"
    ]
    
    
    for entry in tests:
        print(">>> %s" % entry)
        parsed = urlparse(entry)
        print(parsed)

        if parsed.scheme in ("git", "https"):
            if not parsed.params and not parsed.query and not parsed.fragment:
                print("okay")
            else:
                print("malformed")
                
        elif not parsed.scheme and parsed.path == entry:
            
            re.compile("([a-zA-Z0-9-_]+)@()")
            
            
            
        print()
    
    
    return True