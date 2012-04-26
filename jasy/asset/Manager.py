#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging, re, json, os, fnmatch
from os.path import basename, dirname, relpath, normpath

from jasy.env.File import *
from jasy.core.Project import Project
from jasy.env.State import session, getPermutation, prependPrefix
from jasy.asset.Asset import Asset

__all__ = ["AssetManager"]


class AssetEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Asset):
            return obj.export()
            
        return json.JSONEncoder.default(self, obj)
        


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
            projectAssets = project.assets
            for fileId in projectAssets:
                # Minor performance tweak: Using lookup instead of regexp during merge
                if fileId in assets or expr.match(fileId):
                    assets[fileId] = projectAssets[fileId]
                
        logging.debug("Selected classes make use of %s assets" % len(assets))
        
        
        
        
        
        # TODO: Support image sprites
        # TODO: Support CSS preprocessing
        
        
        
    def structure(self, data):
        root = {}
        
        for fileId in data:
            current = root
            splits = fileId.split("/")
            basename = splits.pop()
            
            for split in splits:
                if not split in current:
                    current[split] = {}
                    
                current = current[split]
            
            # Split into filename and extension
            filename, extension = os.path.splitext(basename)
            extension = extension[1:]
            
            if filename in current:
                if type(current[filename][0]) == list:
                    current[filename][0].append(extension)
                else:
                    current[filename][0] = [current[filename][0], extension]
            
            else:
                current[filename] = [extension] + data[fileId]
        
        return root
    
    
    
        
        
        
    def __compileFilterExpr(self):
        # Merge asset hints from all classes and remove duplicates
        hints = set()
        for classObj in self.__classes:
            hints.update(classObj.getMetaData(self.__permutation).assets)
        
        # Compile filter expressions
        matcher = "^%s$" % "|".join(["(%s)" % fnmatch.translate(hint) for hint in hints])
        logging.debug("Matching assets using: %s" % matcher)
        
        return re.compile(matcher)
        
        
        
    def deployBuild(self, assetFolder="asset"):

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



    def exportBuild(self, assetFolder="asset", urlPrefix=""):
        """
        Publishes the selected files to the destination folder. This merges files from 
        different projects to this one folder. This is ideal for preparing the final deployment.
        
        - assetFolder: Name of local asset folder
        - urlPrefix: A URL which should be mapped to the project's root folder
        """

        assets = self.__assets
        result = {}
        
        # Processing assets
        for fileId in assets:
            asset = assets[fileId]
            exported = asset.export()
            
            if exported is None:
                result[fileId] = []
            else:
                result[fileId] = [exported]
        
        # Figuring out root
        root = urlPrefix
        if root and root[-1] != "/":
            root += "/"
        root += assetFolder
        if root and root[-1] != "/":
            root += "/"
            
        # Exporting data
        export = toJson({
            "assets" : self.structure(result),
            "merged" : True,
            "root" : root
        })
        
        return export



    def exportSource(self, urlPrefix=""):
        """ 
        Exports asset data for the source version using assets from their original paths.
        - urlPrefix: Useful when a CDN should be used. Maps the project's root to a URL.
        """
        
        main = session.getMain()
        assets = self.__assets
        result = {}
        
        # Processing assets
        for fileId in assets:
            asset = assets[fileId]
            path = os.path.splitext(main.toRelativeUrl(asset.getPath()))[0]
            exported = asset.export()

            if exported is None:
                result[fileId] = [path]
            else:
                result[fileId] = [path, exported]
        
        # Figuring out global root
        root = urlPrefix
        if root and root[-1] != "/":
            root += "/"

        # Exporting data
        export = toJson({
            "assets" : self.structure(result),
            "merged" : False,
            "root": root
        })

        return export

