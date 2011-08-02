#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging, re, json, os, fnmatch
from os.path import basename, dirname
from jasy.core.Profiler import *
from jasy.core.ImageInfo import ImgInfo
from jasy.File import *
from jasy.Project import Project

__all__ = ["Assets"]


class Assets:
    def __init__(self, session, classes, permutation=None):
        self.__session = session
        self.__classes = classes
        self.__permutation = permutation
        
        
    def getMerged(self):
        """ 
        Returns the merged list of all assets and their origin.
        
        Assets might be overritten by projects listed later in the
        project chain.
        """
        
        try:
            return self.__merged
        
        except AttributeError:
            merged = {}
            for project in self.__session.getProjects():
                for asset in project.getAssets():
                    merged[asset] = project
                    
            self.__merged = merged
            return merged
    
    
    def getFiltered(self):
        """ 
        Returns a list of assets which is used by the classes
        given at creation time.
        """
        
        try:
            return self.__filtered
        
        except AttributeError:
            pstart()
            
            # Merge asset hints from all classes and remove duplicates
            assets = set()
            for classObj in self.__classes:
                assets.update(classObj.getMeta(self.__permutation).assets)
                
            # Compile filter expressions
            expr = re.compile("^%s$" % "|".join(["(%s)" % fnmatch.translate(asset) for asset in assets]))
            
            # Filter merged assets
            merged = self.getMerged()
            self.__filtered = { asset: merged[asset] for asset in merged if expr.match(asset) }

            logging.info("Selected classes make use of %s assets" % len(self.__filtered))
            pstop()
            
            return self.__filtered
            
            
    def getCategorized(self):
        try:
            return self.__info
        
        except AttributeError:
            # Pre cache (for time measurement reasons)
            filtered = self.getFiltered()
            
            logging.info("Categorizing assets...")
            pstart()
            
            roots = self.__collectRoots()
            files = self.__collectFiles()
            images = self.__collectImages()
            sprites = self.__collectSprites(images)
            
            self.__info = {
                "roots" : roots,
                "files" : files,
                "images" : images,
                "sprites" : sprites
            }
            
            pstop()
            
            return self.__info
            
            
    def __collectRoots(self):
        return [project.assetPath for project in self.__session.getProjects() if project.assetPath != None]
            
            
    def __collectFiles(self):
        """
        Returns { dirName : { assetName : projectObj }}
        """
                
        files = {}
        filtered = self.getFiltered()
        for asset in filtered:
            # black list matching
            if asset.endswith((".png", ".jpeg", ".jpg", ".gif", ".meta", "sprites.json")):
                continue
                
            resdir = dirname(asset)
            if not resdir in files:
                files[resdir] = {}
                
            files[resdir][basename(asset)] = filtered[asset]
            
        return files
        
        
    def __collectImages(self):
        """
        Returns { dirName : { assetName : [projectObj, imageWidth, imageHeight] }}
        """
        
        images = {}
        filtered = self.getFiltered()
        for asset in filtered:
            # white list matching
            if not asset.endswith((".png", ".jpeg", ".jpg", ".gif")):
                continue

            resdir = dirname(asset)
            if not resdir in images:
                images[resdir] = {}

            project = filtered[asset]
            path = os.path.join(project.assetPath, asset)
            info = ImgInfo(path).getInfo()
            if info is None:
                raise Exception("Invalid image: %s" % asset)
                
            images[resdir][basename(asset)] = [project, info[0], info[1]]

        return images


    def __collectSprites(self, images):
        """
        Returns { dirName : [[ assetName, projectObj, imageWidth, imageHeight, hasOffsetX, hasOffsetY ], [...]]}
        Deletes sprites from images
        Modifies images to contain sprite data:
        [projectObj, imageWidth, imageHeight] => [projectObj, imageWidth, imageHeight, spriteIndex, offsetA, offsetB]
        Whether an image is part of a sprite can easily checked via the fourth item in the array (spriteIndex)
        SpriteIndex is the position of the sprite data in the directory-local sprite array (see above)
        """
        
        sprites = {}
        filtered = self.getFiltered()
        for asset in filtered:
            # white list matching
            if basename(asset) != "sprites.json":
                continue
                
            # Load sprite data from JSON file
            project = filtered[asset]
            path = os.path.join(project.assetPath, asset)
            data = json.load(open(path))

            resdir = dirname(asset)
            pos = 0
            for combined in data:
                # Ignore if combined files which are not included
                if not combined in images[resdir]:
                    continue
            
                # Prepare data structure
                if not resdir in sprites:
                    sprites[resdir] = []

                # Store data
                hasOffsets = self.__detectOffsets(data[combined])
                entry = [combined] + images[resdir][combined] + list(hasOffsets)
                sprites[resdir].append(entry)
                
                # Delete sprite from images
                del images[resdir][combined]
                
                # Add sprite data to images
                self.__updateImages(data[combined], images[resdir], pos, hasOffsets)
                
                # Increment directory-local sprite identifier
                pos += 1
                
        return sprites


    def __detectOffsets(self, data):
        hasXOffsets = 0
        hasYOffsets = 0

        for spriteItem in data:
            spriteOffset = data[spriteItem]
            if spriteOffset[0] > 0:
                hasXOffsets = 1
            if spriteOffset[1] > 0:
                hasYOffsets = 1
                
        return hasXOffsets, hasYOffsets


    def __updateImages(self, singles, localimages, pos, hasOffsets):
        for filename in singles:
            # The is the image which is part of the sprite
            entry = localimages[filename]

            # Append new data
            entry.append(pos)
            if hasOffsets[0]:
                entry.append(singles[filename][0])
            if hasOffsets[1]:
                entry.append(singles[filename][1])


    def exportInfo(self, replaceRoots=None, prefixRoots=None, to="$$assets"):
        """ 
        Exports the info from getCategorized() into a JavaScript function
        call. This creates a global variable with the default name
        $$assets which contains all asset information.
        """

        info = self.getCategorized()
        if replaceRoots:
            info["roots"] = [replaceRoots for entry in info["roots"]]
        elif prefixRoots:
            info["roots"] = [prefixRoots + entry for entry in info["roots"]]

        session = self.__session
        class ProjectEncoder(json.JSONEncoder):
            projectIds = { project: pos for pos, project in enumerate(filter(lambda project: project.assetPath != None, session.getProjects())) }

            def default(self, obj):
                if isinstance(obj, Project):
                    return self.projectIds[obj]
                    
                return json.JSONEncoder.default(self, obj)
        
        code = json.dumps(info, separators=(',',':'), cls=ProjectEncoder)
        
        return "this.%s=%s;\n" % (to, code)
        
        
        
    def publishFiles(self, dst):
        """
        This method publishes the selected files to the given root
        directory. This merges files from different projects into one
        folder. Ideal for preparing a deployment.
        """

        filtered = self.getFiltered()

        logging.info("Publishing files...")
        pstart()
        
        counter = 0
        for asset in filtered:
            srcFile = os.path.join(filtered[asset].assetPath, asset)
            dstFile = os.path.join(dst, asset)
            
            if updatefile(srcFile, dstFile):
                counter += 1
        
        logging.info("Updated %s/%s files" % (counter, len(filtered)))
        pstop()
        
        
        
    def publishManifest(self, manifest, root, network=None, cache=None):
        # Extension for manifest files should be ".appcache"
        # http://html5.org/tools/web-apps-tracker?from=5811&to=5812
        
        filtered = self.getFiltered()
        
        logging.info("Generating manifest...")
        pstart()
        
        result = []
        
        result.append("CACHE MANIFEST")
        result.append("# This file is auto generated by Jasy")
        
        result.append("")
        result.append("CACHE:")
        result.extend([entry for entry in sorted(filtered)])

        if cache:
            result.extend(cache)
        
        if network:
            result.append("")
            result.append("NETWORK:")
            result.extend(network)
            
        writefile(manifest, "\n".join(result))
        pstop()
        