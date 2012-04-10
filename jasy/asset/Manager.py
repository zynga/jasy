#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging, re, json, os, fnmatch
from os.path import basename, dirname, relpath, normpath

from jasy.env.File import *
from jasy.core.Project import Project
from jasy.env.State import session, getPermutation, prependPrefix

__all__ = ["AssetManager"]


class AssetManager:
    """
    Manages assets aka images, styles and other files required for a web application.
    
    Supports filtering assets based on a given class list (with optional permutation) to
    only include and copy assets which are needed by the current implementation. This is 
    especially useful when only parts of dependend projects are actually used.
    
    Merges assets with the same name from different projects. But normally each project
    creates it's own sandbox namespace so this has not often any effect at all.
    
    Supports images and automatically detect their size and image format. Both informations
    are added to the exported data later on.
    """
    
    def __init__(self, classes):
        self.__classes = classes
        self.__permutation = getPermutation()
        
        # Initialize storage pool
        assets = self.__assets = {}
        
        # Returns the regular expression object to use for filtering
        expr = self.__compileFilterExpr()
        
        # Loop though all projects and merge/filter assets
        for project in session.getProjects():
            localAssets = project.assets
            for fileId in localAssets:
                # Minor performance tweak: Using lookup instead of regexp during merge
                if fileId in assets or expr.match(fileId):
                    assets[fileId] = localAssets[fileId]
                
        logging.debug("Selected classes make use of %s assets" % len(assets))
        
        # TODO: Support image sprites
        # TODO: Support CSS preprocessing
        
        
        
    def __compileFilterExpr(self):
        # Merge asset hints from all classes and remove duplicates
        hints = set()
        for classObj in self.__classes:
            hints.update(classObj.getMetaData(self.__permutation).assets)
        
        # Compile filter expressions
        matcher = "^%s$" % "|".join(["(%s)" % fnmatch.translate(hint) for hint in hints])
        logging.debug("Matching assets using: %s" % matcher)
        
        return re.compile(matcher)



    def exportBuild(self, assetFolder="asset", urlPrefix=""):
        """
        Publishes the selected files to the destination folder. This merges files from 
        different projects to this one folder. This is ideal for preparing the final deployment.
        
        - assetFolder: Where the assets should copied to inside the build folder (relative to the build folder).
        - urlPrefix: A URL which should be mapped to the project's root folder
        """

        assets = self.__assets
        projects = session.getProjects()

        logging.info("Publishing files...")
        
        copyAssetFolder = prependPrefix(assetFolder)
        
        counter = 0
        for fileId in assets:
            srcFile = assets[fileId].getPath()
            dstFile = os.path.join(copyAssetFolder, fileId.replace("/", os.sep))
            
            if updateFile(srcFile, dstFile):
                counter += 1
        
        logging.info("Updated %s/%s files" % (counter, len(assets)))
        
        result = {}
        for fileId in assets:
            asset = assets[fileId]
            
            dirname = os.path.dirname(fileId)
            basename = os.path.basename(fileId)
            
            if not dirname in result:
                result[dirname] = {}
            
            # Differentiate storage between images and other resources
            # Using '1' for being short and truish
            if asset.isImage():
                result[dirname][basename] = asset.getDimensions()
            else:
                result[dirname][basename] = 1
            
        if urlPrefix and not urlPrefix[-1] == "/":
            urlPrefix += "/"

        root = normpath(urlPrefix + assetFolder)

        if not root[-1] == "/":
            root += "/"
            
        return json.dumps({
            "root" : root,
            "dirs" : result
        })



    def exportSource(self, urlPrefix=""):
        """ 
        Exports asset data for the source version using assets from their original paths.
        
        - urlBase: Where the HTML root is based on the project's root.
        - urlPrefix: Useful when a CDN should be used. Maps the project's root to a URL.
            As URLs are always absolute it makes sense to reset 'urlBase' to an empty
            string so that the URLs do not contain useless ".." parent directory segments.
        """
        
        main = session.getMain()
        assets = self.__assets
        result = {}
        
        for fileId in assets:
            asset = assets[fileId]
            path = main.toRelativeUrl(asset.getPath(), prefix=urlPrefix)

            # Differentiate storage between images and other resources
            if asset.isImage():
                result[fileId] = [path] + asset.getDimensions()
            else:
                result[fileId] = path

        # Dump as JSON with relative paths
        return json.dumps({
            "files": result
        }, separators=(',',':'))
        
        
        