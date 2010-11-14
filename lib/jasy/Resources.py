#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging, re, json, os, fnmatch
from os.path import basename, dirname
from jasy.core.Profiler import *
from jasy.core.ImageInfo import ImgInfo
from jasy.core.File import *
from jasy.Combiner import size

__all__ = ["Resources"]

class Resources:
    def __init__(self, session, classes, permutation=None):
        self.__session = session
        self.__classes = classes
        self.__permutation = permutation
        
        
    def getMerged(self):
        """ 
        Returns the merged list of all resources and their origin.
        
        Resources might be overritten by projects listed later in the
        project chain.
        """
        
        try:
            return self.__merged
        
        except AttributeError:
            merged = {}
            for project in self.__session.getProjects():
                for resource in project.getResources():
                    merged[resource] = project
                    
            self.__merged = merged
            return merged
    
    
    def getFiltered(self):
        """ 
        Returns a list of resources which is used by the classes
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
            self.__filtered = { resource: merged[resource] for resource in merged if expr.match(resource) }

            logging.info("Selected classes make use of %s resources" % len(self.__filtered))
            pstop()
            
            return self.__filtered
            
            
    def getInfo(self):
        """
        Returns a dictionary with the keys roots, files and sprites
        containing information about the resources which are relevant
        for the class set defined at creation of this class.
        
        "roots" is an array with the projects in the same order they 
        where added to the session
        
        "files" contains all non-sprite files which are defined using
        the @asset compiler hints. The format differs between images and
        other files. Images stores a tuple 
        (origin, widht, height, sprite, pos1, pos2). The last three values
        are only used when the image is part off an image sprite. For
        non-image files there is no tuple but just an integer refering to
        the origin (project index).
        
        "sprites" contains the data about image sprites. Each entry is
        build like [filename, origin, width, height, hasPosX, hasPosY]
        """
        
        try:
            return self.__info
        
        except AttributeError:
            # Pre cache (for time measurement reasons)
            filtered = self.getFiltered()
            
            logging.info("Sorting files...")
            pstart()
            
            roots = self.__collectRoots()
            files = self.__collectFiles()
            images = self.__collectImages()
            sprites = self.__collectSprites()

            self.__info = {
                "roots" : roots,
                "files" : files,
                "images" : images,
                "sprites" : sprites
            }
            
            pstop()
            
            return self.__info
            
            
    def __collectRoots(self):
        return [project.resourcePath for project in self.__session.getProjects()]
            
            
    def __collectFiles(self):
        """
        Returns { dirName : { resourceName : projectObj }}
        """
                
        files = {}
        filtered = self.getFiltered()
        for resource in filtered:
            # black list matching
            if resource.endswith((".png", ".jpeg", ".jpg", ".gif", ".meta", "sprites.json")):
                continue
                
            resdir = dirname(resource)
            if not resdir in files:
                files[resdir] = {}
                
            files[resdir][basename(resource)] = filtered[resource]
            
        return files
        
        
    def __collectImages(self):
        """
        Returns { dirName : { resourceName : [projectObj, imageWidth, imageHeight] }}
        """
        
        images = {}
        filtered = self.getFiltered()
        for resource in filtered:
            # white list matching
            if not resource.endswith((".png", ".jpeg", ".jpg", ".gif")):
                continue

            resdir = dirname(resource)
            if not resdir in images:
                images[resdir] = {}

            project = filtered[resource]
            info = ImgInfo(os.path.join(project.resourcePath, resource)).getInfo()
            if info is None:
                raise Exception("Invalid image: %s" % resource)
                
            images[resdir][basename(resource)] = (project,) + info

        return images


    def __collectSprites(self):
        sprites = {}
        logging.info("Collecting sprite data...")
        pstart()
    
        for spriteDir in sprites_data:
            # Reading from file
            spriteFiles = json.load(open(sprites_data[spriteDir]))
            for spriteFile in spriteFiles:
                # Ignore if sprite file is not included
                if not spriteFile in files[spriteDir]:
                    continue
            
                # Read and delete sprite data
                spriteData = files[spriteDir][spriteFile]
                del files[spriteDir][spriteFile]
            
                # Pre-check for offsets (e.g. just using x or y is more efficient to store)
                hasXOffsets = 0
                hasYOffsets = 0
                spriteItems = spriteFiles[spriteFile]
                for spriteItem in spriteItems:
                    spriteOffset = spriteItems[spriteItem]
                    if spriteOffset[0] > 0:
                        hasXOffsets = 1
                    if spriteOffset[1] > 0:
                        hasYOffsets = 1

                # Mark file as sprite file
                # Format: fileName(str), projectId(int), width(int), height(int), hasOffsetX(int), hasOffsetY(int)
                spriteEntry = (spriteFile,) + spriteData + (hasXOffsets, hasYOffsets)

                if spriteDir in sprites:
                    sprites[spriteDir].append(spriteEntry)
                else:
                    sprites[spriteDir] = [spriteEntry]
                
                # Add sprite data to single image data
                # Format: projectId(int), width(int), height(int), spriteIndex(int), offsetX(int)|offsetY(int), offsetY(int)?
                spriteIndex = len(sprites[spriteDir]) - 1
                for spriteItem in spriteItems:
                    spriteOffset = spriteItems[spriteItem]
                
                    spriteInfo = (spriteIndex,)
                    if hasXOffsets:
                        spriteInfo += (spriteOffset[0],)
                    if hasYOffsets:
                        spriteInfo += (spriteOffset[1],)

                    files[spriteDir][spriteItem] += spriteInfo

        pstop()        
        
        
        
        
    def exportInfo(self, root=None, relPath=None, to="$$resources"):
        """ 
        Exports the info from getInfo() into a JavaScript function
        call. This creates a global variable with the default name
        $$resources which contains all resource information.
        """
        info = self.getInfo(relPath)
        
        if root:
            info["roots"] = [root for entry in info["roots"]]
        
        code = json.dumps(info, separators=(',',':'))
        logging.info(size(code))
        
        return "(function(){this.%s=%s})();\n" % (to, code)
        
        
        
    def publishFiles(self, root):
        """
        This method publishes the selected files to the given root
        directory. This merges files from different projects into one
        folder. Ideal for preparing a deployment.
        """
        
        info = self.getInfo()
        
        roots = info["roots"]
        files = info["files"]
        sprites = info["sprites"]
        
        pstart()
        logging.info("Publishing resources to %s..." % root)
        
        # Files
        for dirname in files:
            for filename in files[dirname]:
                origin = files[dirname][filename]
                
                # Differ between images (tuple) and non images (int)
                if type(origin) == tuple:
                    origin = origin[0]

                source = os.path.join(roots[origin], dirname, filename)
                dist = os.path.join(root, dirname, filename)
                
                updatefile(source, dist)
        

        # Sprites
        for dirname in sprites:
            for entry in sprites[dirname]:
                filename = entry[0]
                origin = entry[1]
                
                source = os.path.join(roots[origin], dirname, filename)
                dist = os.path.join(root, dirname, filename)
                
                updatefile(source, dist)
        
        pstop()
        
        
        
    def publishManifest(self, manifest, root, network=None):
        result = []
        
        result.append("CACHE MANIFEST")
        result.append("# This file is auto generated by Jasy")
        
        filtered = self.getFiltered()
        result.extend([entry for entry in sorted(filtered)])
        
        
        if network:
            result.append("")
            result.append("NETWORK:")
            result.extend(network)
            
        return
            
        result.append("")
        result.append("CACHE:")
        info = self.getInfo()

        sprites = info["sprites"]
        for dirname in sprites:
            for entry in sprites[dirname]:
                result.append(os.path.join(root, dirname, entry[0]))

        result.append(" ")
        
        files = info["files"]
        for dirname in files:
            for filename in files[dirname]:
                result.append(os.path.join(root, dirname, filename))

        writefile(manifest, "\n".join(result))
        