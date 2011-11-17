#
# Jasy - Web Tooling Framework
# Copyright 2010-2011 Sebastian Werner
#

import logging, os, random

from jasy.js.Class import Error as ClassError
from jasy.core.Error import JasyError


__all__ = ["Combiner"]


class Combiner():
    """ 
    Combines a given class list into different result types. 
    """
    
    def __init__(self, classList):
        self.__classList = classList
        
    
    def combineCode(self):
        """
        Combines the unmodified content of the stored class list
        """

        return "".join([classObj.getText() for classObj in self.__classList])



    def compressCode(self, permutation=None, translation=None, optimization=None, formatting=None):
        """
        Combines the compressed result of the stored class list
        
        Parameters:
        - permutation: Permutation to apply to the classes before compression (for alternative code variants) (See Permutation.py)
        - translation: Translation to apply to the classes before compression (inlining of translation)
        - optimization: Optimization to apply before compression (variable shortening, ...) (See Optimization.py)
        - formatting: Formatting to use during compression (See Formatting.py)
        """

        try:
            return "".join([classObj.getCompressed(permutation, translation, optimization, formatting) for classObj in self.__classList])
        except ClassError as error:
            raise JasyError("Error during class compression! %s" % error)



    def sourceLoader(self, session, bootCode="", relativeRoot="source", prefixUrl=""):
        """
        Generates a source loader which is basically a file which loads the original JavaScript files.
        This is super useful during development of a project as it supports pretty fast workflows
        where most often a simple reload in the browser is enough to get the newest sources.
        
        Parameters:
        - session: Session object, required to figure out relative project paths to each other.
        - bootCode: Code to run after all defined classes have been loaded.
        - relativeRoot: Path from the project's root to the HTML file which is loaded in the browser. 
            This is required to figure out relative paths to the JS files.
        - prefixUrl: Useful when the project files are stored on another domain (CDN). Puts the given 
            URL prefix in front of all URLs to load. Typically relativeRoot is an empty string in this case.
        """

        files = []
        for classObj in self.__classList:
            project = classObj.getProject()

            # This is the location of the class relative to the project which is generated right now
            fromMainProjectRoot = os.path.join(session.getRelativePath(project), project.getClassPath(True), classObj.getLocalPath())
            
            # This is the location from the root, given by the user, where the HTML file is stored.
            # In typical Jasy projects this is "source" e.g. the file is named "source/index.html".
            fromWebFolder = os.path.relpath(fromMainProjectRoot, relativeRoot).replace(os.sep, '/')

            # Now add this file to our list of files to load
            files.append('"%s"' % fromWebFolder)

        loader = ",".join(files)
        boot = "function(){%s}" % bootCode if bootCode else ""
        result = 'core.io.Queue.load([%s], %s, null, true)' % (loader, boot)

        return result

