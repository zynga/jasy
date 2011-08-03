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

        
        # ---------------------------------------------------------------------------------
        # Building the merged list of all assets and their origin project.
        # ---------------------------------------------------------------------------------

        merged = {}
        for project in session.getProjects():
            assets = project.getAssets()
            for name in assets:
                merged[name] = { 
                    "project" : project,
                    "path" : assets[name]
                }


        # ---------------------------------------------------------------------------------
        # Filtering assets as used by current class collection (respecting permutation)
        # ---------------------------------------------------------------------------------
        
        # Merge asset hints from all classes and remove duplicates
        hints = set()
        for classObj in classes:
            hints.update(classObj.getMeta(permutation).assets)
        
        # Compile filter expressions
        expr = re.compile("^%s$" % "|".join(["(%s)" % fnmatch.translate(hint) for hint in hints]))
        
        # Filter merged assets
        self.__assets = { 
            name: merged[name] for name in merged if expr.match(name) 
        }
        
        logging.info("Selected classes make use of %s assets" % len(self.__assets))



        # ---------------------------------------------------------------------------------
        # Categorize assets
        # ---------------------------------------------------------------------------------
        
        roots = self.__collectRoots()
        files = self.__collectFiles()
        images = self.__collectImages()
        sprites = self.__collectSprites(images)
        
        self.__categories = {
            "roots" : roots,
            "files" : files,
            "images" : images,
            "sprites" : sprites
        }





    def __collectRoots(self):
        return [project.assetPath for project in self.__session.getProjects() if project.assetPath != None]
            
            
    def __collectFiles(self):
        """
        Returns { dirName : { assetName : projectObj }}
        """
                
        files = {}
        assets = self.__assets
        for name in assets:
            # black list matching
            if name.endswith((".png", ".jpeg", ".jpg", ".gif", ".meta", "sprites.json")):
                continue
                
            resdir = dirname(name)
            if not resdir in files:
                files[resdir] = {}
                
            files[resdir][basename(name)] = assets[name]["project"]
            
        return files
        
        
    def __collectImages(self):
        """
        Returns { dirName : { assetName : [projectObj, imageWidth, imageHeight] }}
        """
        
        images = {}
        assets = self.__assets
        for name in assets:
            # white list matching
            if not name.endswith((".png", ".jpeg", ".jpg", ".gif")):
                continue

            resdir = dirname(name)
            if not resdir in images:
                images[resdir] = {}

            entry = assets[name]
            info = ImgInfo(entry["path"]).getInfo()
            if info is None:
                raise Exception("Invalid image: %s" % name)
                
            images[resdir][basename(name)] = [entry["project"], info[0], info[1]]

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
        assets = self.__assets
        for name in assets:
            # white list matching
            if basename(name) != "sprites.json":
                continue
                
            # Load sprite data from JSON file
            project = assets[name]
            path = os.path.join(project.assetPath, name)
            data = json.load(open(path))

            resdir = dirname(name)
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
        Exports the asset info into a JavaScript function
        call. This creates a global variable with the default name
        $$assets which contains all asset information.
        """

        categories = self.__categories
        # FIXME: Overwriting cache!!!
        if replaceRoots:
            categories["roots"] = [replaceRoots for entry in categories["roots"]]
        elif prefixRoots:
            categories["roots"] = [prefixRoots + entry for entry in categories["roots"]]

        session = self.__session
        class ProjectEncoder(json.JSONEncoder):
            projectIds = { project: pos for pos, project in enumerate(filter(lambda project: project.assetPath != None, session.getProjects())) }

            def default(self, obj):
                if isinstance(obj, Project):
                    return self.projectIds[obj]
                    
                return json.JSONEncoder.default(self, obj)
        
        code = json.dumps(categories, separators=(',',':'), cls=ProjectEncoder)
        
        return "this.%s=%s;\n" % (to, code)
        
        
        
    def publishFiles(self, dst):
        """
        This method publishes the selected files to the given root
        directory. This merges files from different projects into one
        folder. Ideal for preparing a deployment.
        """

        assets = self.__assets

        logging.info("Publishing files...")
        pstart()
        
        counter = 0
        for name in assets:
            srcFile = assets[name]["path"]
            dstFile = os.path.join(dst, name.replace("/", os.sep))
            
            if updatefile(srcFile, dstFile):
                counter += 1
        
        logging.info("Updated %s/%s files" % (counter, len(assets)))
        pstop()
        
        
        
    def publishManifest(self, manifest, root, network=None, cache=None):
        # Extension for manifest files should be ".appcache"
        # http://html5.org/tools/web-apps-tracker?from=5811&to=5812
        
        assets = self.__assets
        
        logging.info("Generating manifest...")
        pstart()
        
        result = []
        
        result.append("CACHE MANIFEST")
        result.append("# This file is auto generated by Jasy")
        
        result.append("")
        result.append("CACHE:")
        result.extend(["%s/%s" % (root, entry) for entry in sorted(assets)])

        if cache:
            result.extend(cache)
        
        if network:
            result.append("")
            result.append("NETWORK:")
            result.extend(network)
            
        writefile(manifest, "\n".join(result))
        pstop()
        