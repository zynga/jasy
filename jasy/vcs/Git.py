#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os.path, re, urllib.parse, shutil

from jasy.core.Util import executeCommand
import jasy.core.Console as Console


__versionNumber = re.compile(r"^v?([0-9\.]+)(-?(a|b|rc|alpha|beta)([0-9]+)?)?\+?$")

__gitAccountUrl = re.compile("([a-zA-Z0-9-_]+)@([a-zA-Z0-9-_\.]+):([a-zA-Z0-9/_-]+\.git)")
__gitHash = re.compile(r"^[a-f0-9]{40}$")
__gitSchemes = ('git', 'git+http', 'git+https', 'git+ssh', 'git+git', 'git+file')


def update(url, version, path, update=True, submodules=True):
    """Clones the given repository URL (optionally with overriding/update features)"""

    # Prepend git+ so that user knows that we identified the URL as git repository
    if not url.startswith("git+"):
        url = "git+%s" % url

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
                    Console.indent()
                    
                    try:
                        executeCommand(["git", "fetch", "-q", "--depth", "1", "origin", version], "Could not fetch updated revision!")
                        executeCommand(["git", "reset", "-q", "--hard", "FETCH_HEAD"], "Could not update checkout!")
                        newRevision = executeCommand(["git", "rev-parse", "HEAD"], "Could not detect current revision")
                        
                        if revision != newRevision:
                            Console.info("Updated from %s to %s", revision[:10], newRevision[:10])
                            revision = newRevision

                            if submodules and os.path.exists(".gitmodules"):
                                Console.info("Updating sub modules (this might take some time)...")
                                executeCommand("git submodule update --recursive", "Could not initialize sub modules")

                    except Exception:
                        Console.error("Error during git transaction! Could not update clone.")
                        Console.error("Please verify that the host is reachable or disable automatic branch updates.")
                        Console.outdent()

                        os.chdir(old)
                        return
                        
                    except KeyboardInterrupt:
                        print()
                        Console.error("Git transaction was aborted by user!")
                        Console.outdent()
                        
                        os.chdir(old)
                        return                            

                    Console.outdent()
                    
                else:
                    Console.debug("Updates disabled")
                
            else:
                Console.debug("Using existing clone")

            os.chdir(old)
            return revision

    Console.info("Cloning %s", Console.colorize("%s @ " % url, "bold") + Console.colorize(version, "magenta"))
    Console.indent()

    os.makedirs(path)
    os.chdir(path)
    
    try:
        # cut of "git+" prefix
        remoteurl = url[4:]

        executeCommand(["git", "init", "."], "Could not initialize GIT repository!")
        executeCommand(["git", "remote", "add", "origin", remoteurl], "Could not register remote repository!")
        executeCommand(["git", "fetch", "-q", "--depth", "1", "origin", version], "Could not fetch revision!")
        executeCommand(["git", "reset", "-q", "--hard", "FETCH_HEAD"], "Could not update checkout!")
        revision = executeCommand(["git", "rev-parse", "HEAD"], "Could not detect current revision")

        if submodules and os.path.exists(".gitmodules"):
            Console.info("Updating sub modules (this might take some time)...")
            executeCommand("git submodule update --init --recursive", "Could not initialize sub modules")
        
    except Exception:
        Console.error("Error during git transaction! Intitial clone required for continuing!")
        Console.error("Please verify that the host is reachable.")

        Console.error("Cleaning up...")
        os.chdir(old)
        shutil.rmtree(path)

        Console.outdent()
        return
        
    except KeyboardInterrupt:
        print()
        Console.error("Git transaction was aborted by user!")
        
        Console.error("Cleaning up...")
        os.chdir(old)
        shutil.rmtree(path)

        Console.outdent()
        return
    
    os.chdir(old)
    Console.outdent()

    return revision



def getBranch(path=None):
    """Returns the name of the git branch"""

    return executeCommand("git rev-parse --abbrev-ref HEAD", "Could not figure out git branch. Is there a valid Git repository?", path=path)



def isUrl(url):
    """Figures out whether the given string is a valid Git repository URL"""

    parsed = urllib.parse.urlparse(url)

    if not parsed.params and not parsed.query and not parsed.fragment:

        if parsed.scheme in __gitSchemes:
            return True
        elif parsed.scheme == "https" and parsed.path.endswith(".git"):
            return True
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

