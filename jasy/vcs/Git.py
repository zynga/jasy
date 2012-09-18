#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os.path, re, urllib.parse, shutil

from jasy.core.Util import executeCommand
import jasy.core.Console as Console


__versionNumber = re.compile(r"^v?([0-9\.]+)(-?(a|b|rc|alpha|beta)([0-9]+)?)?\+?$")
__branchParser = re.compile("^ref:.*/([a-zA-Z0-9_-]+)$")
__gitAccountUrl = re.compile("([a-zA-Z0-9-_]+)@([a-zA-Z0-9-_\.]+):([a-zA-Z0-9/_-]+\.git)")
__gitHash = re.compile(r"^[a-f0-9]{40}$")


def update(url, version, path, update=True):
    """Clones the given repository URL (optionally with overriding/update features)"""

    old = os.getcwd()
    
    if os.path.exists(path) and os.path.exists(os.path.join(path, ".git")):
        
        if not os.path.exists(os.path.join(path, ".git", "HEAD")):
            Console.error("Invalid git clone. Cleaning up...")
            shutil.rmtree(path)

        else:
            os.chdir(path)
            revision = executeCommand(["git", "rev-parse", "HEAD"], "Could not detect current revision")
            
            if update and (version == "master" or "refs/heads/" in version):
                if update:
                    Console.info("Updating %s", Console.colorize("%s @ " % url, "bold") + Console.colorize(version, "magenta"))
                    
                    try:
                        executeCommand(["git", "fetch", "-q", "--depth", "1", "origin", version], "Could not fetch updated revision!")
                        executeCommand(["git", "reset", "-q", "--hard", "FETCH_HEAD"], "Could not update checkout!")
                        newRevision = executeCommand(["git", "rev-parse", "HEAD"], "Could not detect current revision")
                        
                        if revision != newRevision:
                            Console.indent()
                            Console.info("Updated from %s to %s", revision[:10], newRevision[:10])
                            revision = newRevision
                            Console.outdent()
                        
                    except Exception:
                        Console.error("Error during git transaction! Could not update clone.")
                        Console.error("Please verify that the host is reachable or disable automatic branch updates.")
                        
                        os.chdir(old)
                        return
                        
                    except KeyboardInterrupt:
                        print()
                        Console.error("Git transaction was aborted by user!")
                        
                        os.chdir(old)
                        return                            
                    
                else:
                    Console.debug("Updates disabled")
                
            else:
                Console.debug("Using existing clone")

            os.chdir(old)
            return revision

    Console.info("Cloning %s", Console.colorize("%s @ " % url, "bold") + Console.colorize(version, "magenta"))

    os.makedirs(path)
    os.chdir(path)
    
    try:
        executeCommand(["git", "init", "."], "Could not initialize GIT repository!")
        executeCommand(["git", "remote", "add", "origin", url], "Could not register remote repository!")
        executeCommand(["git", "fetch", "-q", "--depth", "1", "origin", version], "Could not fetch revision!")
        executeCommand(["git", "reset", "-q", "--hard", "FETCH_HEAD"], "Could not update checkout!")
        revision = executeCommand(["git", "rev-parse", "HEAD"], "Could not detect current revision")
        
    except Exception:
        Console.error("Error during git transaction! Intitial clone required for continuing!")
        Console.error("Please verify that the host is reachable.")

        Console.error("Cleaning up...")
        os.chdir(old)
        shutil.rmtree(path)

        return
        
    except KeyboardInterrupt:
        print()
        Console.error("Git transaction was aborted by user!")
        
        Console.error("Cleaning up...")
        os.chdir(old)
        shutil.rmtree(path)
        
        return
    
    os.chdir(old)
    return revision



def getBranch(path=None):
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



def isUrl(url):
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
        
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme in ("git", "https"):
        return not parsed.params and not parsed.query and not parsed.fragment
    elif not parsed.scheme and parsed.path == url and __gitAccountUrl.match(url) != None:
        return True
        
    return False
    
    
    
def expandVersion(version=None):
    if version is None:
        version = "master"
    
    version = str(version)

    if version.startswith("refs/"):
        pass
    elif re.compile(r"^[a-f0-9]{40}$").match(version):
        # See also: http://git.661346.n2.nabble.com/Fetch-by-SHA-missing-td5604552.html
        raise Exception("Can't fetch non tags/branches: %s@%s!" % (url, version))
    elif __versionNumber.match(version) is not None:
        version = "refs/tags/" + version
    else:
        version = "refs/heads/" + version
        
    return version


def cleanRepository():
    """Cleans git repository from untracked files."""
    return executeCommand(["git", "clean", "-d", "-f"], "Could not clean GIT repository!")

def distcleanRepository():
    """Cleans git repository from untracked files. Ignores the files listed in ".gitignore"."""
    return executeCommand(["git", "clean", "-d", "-f", "-x"], "Could not distclean GIT repository!")

