#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import re, json, os, fnmatch
from os.path import basename, dirname, relpath, normpath

import jasy.core.File

from jasy.core.Project import Project
from jasy.env.State import getPermutation, prependPrefix
from jasy.item.Asset import Asset
from jasy.core.Error import JasyError
from jasy.core.Util import sha1File, getKey
from jasy.core.Logging import *

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
    
    def __init__(self, session):
        # Store session reference (one asset manager per session)
        self.__session = session

        # Stores manager contextual asset information (like relative paths)
        self.__data = {}
        
        # Registry for profiles aka asset groups
        self.__profiles = []
        
        # Initialize storage pool
        self.__assets = None

        # Loop though all projects and merge assets
        assets = self.__assets = {}
        for project in self.__session.getProjects():
            assets.update(project.assets)
        
        self.__processSprites()
        self.__processAnimations()
        
        info("Activated %s assets", len(assets))


    def __processSprites(self):
        """Processes jasysprite.json files to merge sprite data into asset registry"""
        
        assets = self.__assets
        configs = [fileId for fileId in assets if assets[fileId].isImageSpriteConfig()]
        
        if configs:
            info("Processing %s image sprite configs...", len(configs))
        
        sprites = []
        indent()
        for fileId in configs:
            debug("Processing %s...", fileId)
            
            asset = assets[fileId]
            spriteBase = dirname(fileId)
                
            try:
                spriteConfig = asset.getParsedObject();
            except ValueError as err:
                raise JasyError("Could not parse jasysprite.json at %s: %s" % (fileId, err))
                
            indent()
            for spriteImage in spriteConfig:
                spriteImageId = "%s/%s" % (spriteBase, spriteImage)
                
                singleRelPaths = spriteConfig[spriteImage]
                debug("Image %s combines %s images", spriteImageId, len(singleRelPaths))

                for singleRelPath in singleRelPaths:
                    singleId = "%s/%s" % (spriteBase, singleRelPath)
                    singleData = singleRelPaths[singleRelPath]

                    if singleId in assets:
                        singleAsset = assets[singleId]
                    else:
                        info("Creating new asset: %s", singleId)
                        singleAsset = Asset(None)
                        assets[singleId] = singleAsset
                        
                    if not spriteImageId in sprites:
                        spriteImageIndex = len(sprites) 
                        sprites.append(spriteImageId)
                    else:
                        spriteImageIndex = sprites.index(spriteImageId)
                        
                    singleAsset.addImageSpriteData(spriteImageIndex, singleData["left"], singleData["top"])
                    
                    if "width" in singleData and "height" in singleData:
                        singleAsset.addImageDimensionData(singleData["width"], singleData["height"])
                    
                    # Verify that sprite sheet is up-to-date
                    if "checksum" in singleData:
                        fileChecksum = singleAsset.getChecksum()
                        storedChecksum = singleData["checksum"]
                        
                        debug("Checksum Compare: %s <=> %s", fileChecksum[0:6], storedChecksum[0:6])
                        
                        if storedChecksum != fileChecksum:
                            raise JasyError("Sprite Sheet is not up-to-date. Checksum of %s differs.", singleId)
        
            outdent()
            debug("Deleting sprite config from assets: %s", fileId)
            del assets[fileId]
            
        outdent()
        self.__sprites = sprites
        
        
        
    def __processAnimations(self):
        """Processes jasyanimation.json files to merge animation data into asset registry"""
        
        assets = self.__assets
        configs = [fileId for fileId in assets if assets[fileId].isImageAnimationConfig()]
        
        if configs:
            info("Processing %s image animation configs...", len(configs))
        
        indent()
        for fileId in configs:
            debug("Processing %s...", fileId)
        
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
                    
                    animationAsset.addImageAnimationData(columns, rows, frames)
                    
                    if frames is None:
                        frames = rows * columns
                    
                elif "layout" in data:
                    layout = data["layout"]
                    animationAsset.addImageAnimationData(None, None, layout=layout)
                    frames = len(layout)
                    
                else:
                    raise JasyError("Invalid image frame data for: %s" % imageId)

                debug("  - Animation %s has %s frames", imageId, frames)

            debug("  - Deleting animation config from assets: %s", fileId)
            del assets[fileId]
            
        outdent()
        
    
    
    def addProfile(self, name, root=None, config=None, items=None):
        """
        - root: root uri for assets with the given profile
        """
        
        profiles = self.__profiles
        for entry in profiles:
            if entry["name"] == name:
                raise JasyError("Asset profile %s was already defined!" % name)
        
        profile = {
            "name" : name
        }
        
        if root:
            if not root.endswith("/"):
                root += "/"
                
            profile["root"] = root
        
        if config is not None:
            profile.update(config)

        unique = len(profiles)
        profiles.append(profile)
        
        if items:
            for fileId in items:
                items[fileId]["p"] = unique
            
            self.addRuntimeData(items)
        
        return unique
    
    
    def addSourceProfile(self, urlPrefix="", override=False):

        # First create a new profile with optional (CDN-) URL prefix
        profileId = self.addProfile("source", urlPrefix)

        # Then export all relative paths to main project and add this to the runtime data
        main = self.__session.getMain()
        assets = self.__assets
        data = self.__data

        for fileId in assets:
            if not fileId in data:
                data[fileId] = {}
                
            if override or not "p" in data[fileId]:
                data[fileId]["p"] = profileId
                data[fileId]["u"] = main.toRelativeUrl(assets[fileId].getPath())



    def addBuildProfile(self, urlPrefix="asset", override=False):
        
        # First create a new profile with optional (CDN-) URL prefix
        profileId = self.addProfile("build", urlPrefix)

        # Then export all relative paths to main project and add this to the runtime data
        main = self.__session.getMain()
        assets = self.__assets
        data = self.__data

        for fileId in assets:
            if not fileId in data:
                data[fileId] = {}
                
            if override or not "p" in data[fileId]:
                data[fileId]["p"] = profileId

    
    def addRuntimeData(self, runtime):
        assets = self.__assets
        data = self.__data
        
        for fileId in runtime:
            if not fileId in assets:
                debug("Unknown asset: %s" % fileId)
                continue
        
            if not fileId in data:
                data[fileId] = {}
                
            data[fileId].update(runtime[fileId])
    
    
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
            debug("Adding %s..." % fileId)
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
        debug("Compiled asset matcher: %s" % matcher)
        
        return re.compile(matcher)
        
        
        
    def deploy(self, classes, assetFolder="asset"):
        """Deploys all asset files to the destination asset folder"""

        assets = self.__assets
        projects = self.__session.getProjects()

        copyAssetFolder = prependPrefix(assetFolder)
        filterExpr = self.__compileFilterExpr(classes)
        
        info("Deploying assets...")
        
        counter = 0
        length = len(assets)
        
        for fileId in assets:
            if not filterExpr.match(fileId):
                length -= 1
                continue

            srcFile = assets[fileId].getPath()
            dstFile = os.path.join(copyAssetFolder, fileId.replace("/", os.sep))
            
            if jasy.core.File.syncfile(srcFile, dstFile):
                counter += 1
        
        info("Updated %s/%s files" % (counter, length))
        


    def export(self, classes=None):
        """Exports asset data for the source version using assets from their original paths."""
        
        # Processing assets
        assets = self.__assets
        data = self.__data
        
        result = {}
        filterExpr = self.__compileFilterExpr(classes) if classes else None
        for fileId in assets:
            if filterExpr and not filterExpr.match(fileId):
                continue
            
            entry = {}
            
            asset = assets[fileId]
            entry["t"] = asset.getType(short=True)

            assetData = asset.exportData()
            if assetData:
                entry["d"] = assetData
            
            if fileId in data:
                entry.update(data[fileId])
                
            result[fileId] = entry
        
        # Ignore empty result
        if not result:
            return None

        info("Exported %s assets", len(result))

        return {
            "assets" : self.__structurize(result),
            "profiles" : self.__profiles,
            "sprites" : self.__sprites
        }
        

