#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging, os, random

__all__ = ["Combiner"]


class Combiner():
    """ Combines the code/path of a list of classes into one string """
    
    def __init__(self, classList):
        self.__classList = classList
        
    
    def getCombinedCode(self):
        """ Combines the unmodified content of the stored class list """

        return "".join([classObj.getText() for classObj in self.__classList])
    
    
    def getCompressedCode(self, permutation=None, translation=None, optimization=None, format=None):
        """ Combines the compressed result of the stored class list """

        return "".join([classObj.getCompressed(permutation, translation, optimization, format) for classObj in self.__classList])


    def getLoaderCode(self, bootCode, relativeRoot, session, nocache=True):
        logging.info("Generating loader...")

        files = []
        for classObj in self.__classList:
            project = classObj.getProject()

            fromMainProjectRoot = os.path.join(session.getRelativePath(project), project.getClassPath(True), classObj.getLocalPath())
            fromWebFolder = os.path.relpath(fromMainProjectRoot, relativeRoot)

            # Inject random number to trick browser caching
            if noCache:
                fromWebFolder = "%s?r=%s" % (fromWebFolder, random.random())
            
            files.append('"%s"' % fromWebFolder)

        loader = ",".join(files)
        boot = "function(){%s}" % bootCode if bootCode else "null"
        result = 'jasy.io.Script.load([%s], %s)' % (loader, boot)

        return result