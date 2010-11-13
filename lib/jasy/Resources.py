#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

import logging, re, json, os, fnmatch
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
            expr = re.compile("^%s$" % "|".join(["(%s)" % fnmatch.translate(asset) for asset in assets]))
            
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
            filtered = self.getFiltered()
            projects = self.__session.getProjects()
        
            # Collecting roots
            roots = []
            for projectId, project in enumerate(projects):
                roots.append(project.resourcePath)

            # Processing resources...
            files = {}
            sprites_data = {}
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
                    sprites_data[dirname] = fullPath
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

            self.__info = {
                "roots" : roots,
                "files" : files,
                "sprites" : sprites
            }
            
            return self.__info
        
        
    def exportInfo(self, root=None, to="$$resources"):
        """ 
        Exports the info from getInfo() into a JavaScript function
        call. This creates a global variable with the default name
        $$resources which contains all resource information.
        """
        info = self.getInfo()
        
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
        
        
        
        
        