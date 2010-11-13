#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging, re, json, os
from jasy.core.Profiler import *
from jasy.core.ImageInfo import ImgInfo
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
            result = {}
            for pos, project in enumerate(self.__session.getProjects()):
                for resource in project.getResources():
                    result[resource] = pos

            self.__merged = result
            return result
        
    
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
                
            # Compile regular expressions which is used to filter resource later on
            expr = re.compile("^%s$" % "|".join(["(%s)" % asset.replace("*", ".*") for asset in assets]))
            
            # Filter assets by regular expression
            result = {}
            merged = self.getMerged()
            for resource in merged:
                if expr.match(resource):
                    result[resource] = merged[resource]
            
            logging.info("Selected classes make use of %s resources" % len(result))
            self.__filtered = result
            pstop()
            return result
            
            
    def getInfo(self, enableSprites=True, enableInlining=True):
        filtered = self.getFiltered()
        projects = self.__session.getProjects()
        
        # Collecting roots
        roots = []
        for projectId, project in enumerate(projects):
            roots.append(project.resourcePath)

        # Processing resources...
        files = {}
        sprites = {}
        logging.info("Detecting image sizes...")
        pstart()
        for resource in filtered:
            projectId = filtered[resource]
            project = projects[projectId]
            
            fullPath = "%s/%s" % (project.resourcePath, resource)
            
            basename = os.path.basename(resource)
            dirname = os.path.dirname(resource)
            extension = os.path.splitext(basename)[1]
            
            if basename == "sprites.json":
                sprites[dirname] = json.load(open(fullPath))
                pass
                
            elif extension == ".meta":
                # qooxdoo style sprite meta info
                continue
                
            else:
                if not dirname in files:
                    files[dirname] = {}

                img = ImgInfo(fullPath)
                imgInfo = img.getInfo()
                if imgInfo != None:
                    files[dirname][basename] = (projectId,) + imgInfo
                
                else:
                    files[dirname][basename] = projectId
        
        pstop()
                    
        # Merge in sprite data and create additional data for sprites
        spritesResult = {}
        logging.info("Collecting sprite data...")
        pstart()
        
        for spriteDir in sprites:
            spriteFiles = sprites[spriteDir]
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

                if spriteDir in spritesResult:
                    spritesResult[spriteDir].append(spriteEntry)
                else:
                    spritesResult[spriteDir] = [spriteEntry]
                    
                # Add sprite data to single image data
                # Format: projectId(int), width(int), height(int), spriteIndex(int), offsetX(int)|offsetY(int), offsetY(int)?
                spriteIndex = len(spritesResult[spriteDir]) - 1
                for spriteItem in spriteItems:
                    spriteOffset = spriteItems[spriteItem]
                    
                    spriteInfo = (spriteIndex,)
                    if hasXOffsets:
                        spriteInfo += (spriteOffset[0],)
                    if hasYOffsets:
                        spriteInfo += (spriteOffset[1],)

                    files[spriteDir][spriteItem] += spriteInfo

        pstop()

        return {
            "roots" : roots,
            "sprites" : spritesResult,
            "files" : files
        }
        
        
    def exportInfo(self, root=None, to="$$resources"):
        info = self.getInfo()
        
        if root != None:
            for entry in info.roots:
                print("Modify root: " + entry)
        
        
        code = json.dumps(info, separators=(',',':'))
        logging.info(size(code))
        
        return "(function(){this.%s=%s})();\n" % (to, code)
        
        
        
    def publishFiles(self, root):
        info = self.getInfo()
        
        logging.info("Publishing files to %s..." % root)
        
        
        
        
        