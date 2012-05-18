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
from jasy.core.Error import JasyError
from jasy.core.Util import sha1File, getKey

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
    
    def __init__(self):
        # Registry for profiles aka asset groups
        self.__profiles = {}
        
        # Initialize storage pool
        assets = self.__assets = {}
        
        # Loop though all projects and merge assets
        for project in session.getProjects():
            assets.update(project.assets)
        
        self.__processSprites()
        self.__processAnimations()
        
        logging.debug("Initialized %s assets" % len(assets))


    def __processSprites(self):
        """Processes jasysprite.json files to merge sprite data into asset registry"""
        
        assets = self.__assets
        configs = [fileId for fileId in assets if assets[fileId].isImageSpriteConfig()]
        logging.info("Processing %s image sprite configs...", len(configs))
        
        for fileId in configs:
            logging.info("- Processing %s...", fileId)
            
            asset = assets[fileId]
            spriteBase = dirname(fileId)
                
            try:
                spriteConfig = json.loads(asset.getText())
            except ValueError as err:
                raise JasyError("Could not parse jasysprite.json at %s: %s" % (fileId, err))
                
            for spriteImage in spriteConfig:
                spriteImageId = "%s/%s" % (spriteBase, spriteImage)
                
                singleRelPaths = spriteConfig[spriteImage]
                logging.debug("  - Image %s combines %s images", spriteImageId, len(singleRelPaths))

                for singleRelPath in singleRelPaths:
                    singleId = "%s/%s" % (spriteBase, singleRelPath)
                    singleData = singleRelPaths[singleRelPath]

                    if singleId in assets:
                        singleAsset = assets[singleId]
                    else:
                        logging.info("Creating new asset: %s", singleId)
                        singleAsset = Asset(None)
                        assets[singleId] = singleAsset
                        
                    singleAsset.addSpriteData(spriteImageId, singleData["left"], singleData["top"])
                    
                    if "width" in singleData and "height" in singleData:
                        singleAsset.addDimensionData(singleData["width"], singleData["height"])
                    
                    # Verify that sprite sheet is up-to-date
                    if "checksum" in singleData:
                        fileChecksum = singleAsset.getChecksum()
                        storedChecksum = singleData["checksum"]
                        
                        logging.info("Checksum Compare: %s <=> %s", fileChecksum[0:6], storedChecksum[0:6])
                        
                        if storedChecksum != fileChecksum:
                            raise JasyError("Sprite Sheet is not up-to-date. Checksum of %s differs.", singleId)
        
            logging.debug("  - Deleting sprite config from assets: %s", fileId)
            del assets[fileId]
        
        
        
    def __processAnimations(self):
        """Processes jasyanimation.json files to merge animation data into asset registry"""
        
        assets = self.__assets
        configs = [fileId for fileId in assets if assets[fileId].isImageAnimationConfig()]
        logging.info("Processing %s image animation configs...", len(configs))
        
        for fileId in configs:
            logging.info("- Processing %s...", fileId)
        
            asset = assets[fileId]
            base = dirname(fileId)
                
            try:
                config = json.loads(asset.getText())
            except ValueError as err:
                raise JasyError("Could not parse jasyanimation.json at %s: %s" % (fileId, err))
            
            for relPath in config:
                imageId = "%s/%s" % (base, relPath)
                data = config[relPath]
                
                if not imageId in assets:
                    raise JasyError("Unknown asset %s in %s" % (imageId, fileId))
                
                animationAsset = assets[imageId]
                
                if "rows" in data or "columns" in data:
                    rows = getKey(data, "rows", 1)
                    columns = getKey(data, "columns", 1)
                    frames = getKey(data, "frames")
                    
                    animationAsset.addAnimationData(columns, rows, frames)
                    
                    if frames is None:
                        frames = rows * columns
                    
                elif "layout" in data:
                    layout = data["layout"]
                    animationAsset.addAnimationData(None, None, layout=layout)
                    frames = len(layout)
                    
                else:
                    raise JasyError("Invalid image frame data for: %s" % imageId)

                logging.debug("  - Animation %s has %s frames", imageId, frames)

            logging.debug("  - Deleting animation config from assets: %s", fileId)
            del assets[fileId]
        
    
    
    def addProfile(self, name, root, separator="/"):
        """
        - root: root uri for assets with the given profile
        - separator: replacement symbol for seperating directories in the asset ID
        """
        
        profiles = self.__profiles
        if name in profiles:
            raise JasyError("Asset profile %s was already defined!")
        
        profiles[name] = {
            "id" : len(profiles),
            "root" : root,
            "separator" : separator
        }
    
    
    def addData(self, data):
        assets = self.__assets
        for fileId in data:
            if not fileId in assets:
                logging.debug("Unknown asset: %s" % fileId)
                continue
                
            assets[fileId].update(data[fileId])
    
    
    def __structurize(self, data):
        """
        This method structurizes the incoming data into a cascaded structure representing the
        file system location (aka file IDs) as a tree. It further extracts the extensions and
        merges files with the same name (but different extensions) into the same entry. This is
        especially useful for alternative formats like audio files, videos and fonts. It only
        respects the data of the first entry! So it is not a good idea to have different files
        with different content stored with the same name e.g. content.css and content.png.
        """
        
        root = {}
        
        # Easier to debug and understand when sorted
        for fileId in sorted(data):
            current = root
            splits = fileId.split("/")
            
            # Extract the last item aka the filename itself
            basename = splits.pop()
            
            # Find the current node to store info on
            for split in splits:
                if not split in current:
                    current[split] = {}
                elif type(current[split]) != dict:
                    raise JasyError("Invalid asset structure. Folder names must not be identical to any filename without extension: \"%s\" in %s" % (split, fileId))
                    
                current = current[split]
            
            # Create entry
            logging.debug("Adding %s..." % fileId)
            current[basename] = data[fileId]
        
        return root
    
    
    
    def __compileFilterExpr(self, classes):
        """Returns the regular expression object to use for filtering"""
        
        # Merge asset hints from all classes and remove duplicates
        hints = set()
        for classObj in classes:
            hints.update(classObj.getMetaData(getPermutation()).assets)
        
        # Compile filter expressions
        matcher = "^%s$" % "|".join(["(%s)" % fnmatch.translate(hint) for hint in hints])
        logging.debug("Matching assets using: %s" % matcher)
        
        return re.compile(matcher)
        
        
        
    def deployBuild(self, classes, assetFolder="asset"):
        """Deploys all asset files to the destination asset folder"""

        assets = self.__assets
        projects = session.getProjects()

        copyAssetFolder = prependPrefix(assetFolder)
        filterExpr = self.__compileFilterExpr(classes)
        
        counter = 0
        length = len(assets)
        
        for fileId in assets:
            if not filterExpr.match(fileId):
                length -= 1
                continue
            
            srcFile = assets[fileId].getPath()
            dstFile = os.path.join(copyAssetFolder, fileId.replace("/", os.sep))
            
            if updateFile(srcFile, dstFile):
                counter += 1
        
        logging.info("Updated %s/%s files" % (counter, length))



    def exportBuild(self, classes, assetFolder="asset", urlPrefix=""):
        """
        Publishes the selected files to the destination folder. This merges files from 
        different projects to this one folder. This is ideal for preparing the final deployment.
        
        - assetFolder: Name of local asset folder
        - urlPrefix: A URL which should be mapped to the project's root folder
        """

        filterExpr = self.__compileFilterExpr(classes) if classes else None

        assets = self.__assets
        result = {}
        
        # Processing assets
        for fileId in assets:
            if filterExpr and not filterExpr.match(fileId):
                continue
            
            asset = assets[fileId]
            exported = asset.export()
            
            if exported is None:
                # short value to allow simple lookup checks in JS
                result[fileId] = 1
            else:
                result[fileId] = exported
        
        # Figuring out root
        root = urlPrefix
        if root and root[-1] != "/":
            root += "/"
        root += assetFolder
        if root and root[-1] != "/":
            root += "/"
            
        # Ignore empty result
        if not result:
            return None
            
        # Structurize
        try:
            structured = self.__structurize(result)
        except Exception:
            logging.error("Could not export build data of assets")
            raise
            
        # Exporting data
        export = toJson({
            "assets" : structured,
            "deployed" : True,
            "root" : root
        })
        
        return export



    def exportSource(self, classes, urlPrefix=""):
        """ 
        Exports asset data for the source version using assets from their original paths.
        
        - classes: Classes for filter assets according to
        - urlPrefix: Useful when a CDN should be used. Maps the project's root to a URL.
        """
        
        main = session.getMain()
        assets = self.__assets
        result = {}
        filterExpr = self.__compileFilterExpr(classes) if classes else None
        
        # Processing assets
        for fileId in assets:
            if filterExpr and not filterExpr.match(fileId):
                continue
            
            asset = assets[fileId]
            path = main.toRelativeUrl(asset.getPath())
            exported = asset.export()

            if exported is None:
                result[fileId] = [path]
            else:
                result[fileId] = exported + [path]
        
        # Figuring out global root
        root = urlPrefix
        if root and root[-1] != "/":
            root += "/"

        # Ignore empty result
        if not result:
            return None

        # Structurize
        try:
            structured = self.__structurize(result)
        except Exception:
            logging.error("Could not export build data of assets")
            raise
            
        # Exporting data
        export = toJson({
            "assets" : structured,
            "deployed" : False,
            "root": root
        })

        return export

