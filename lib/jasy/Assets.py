#
# Jasy - JavaScript Tooling Framework
# Copyright 2010-2011 Sebastian Werner
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
        self.__projects = session.getProjects()
        self.__classes = classes
        self.__permutation = permutation
        
        self.__collectAssets()
        self.__collectFiles()
        self.__collectImages()
        self.__collectSprites()


    def __collectAssets(self):
        """
        Priority merge of all assets and filter them by the required ones based 
        on the current class selection.
        """
        
        merged = {}
        for project in self.__projects:
            assets = project.getAssets()
            for name in assets:
                merged[name] = { 
                    "project" : project,
                    "path" : assets[name]
                }

        # Merge asset hints from all classes and remove duplicates
        hints = set()
        for classObj in self.__classes:
            hints.update(classObj.getMeta(self.__permutation).assets)
        
        # Compile filter expressions
        matcher = "^%s$" % "|".join(["(%s)" % fnmatch.translate(hint) for hint in hints])
        logging.debug("Matching assets using: %s" % matcher)
        expr = re.compile(matcher)
        
        # Filter merged assets
        self.__assets = { 
            name: merged[name] for name in merged if expr.match(name) 
        }
        
        logging.info("Selected classes make use of %s assets" % len(self.__assets))        



    def __collectFiles(self):
        """
        Stores __files as { dirName : { assetName : projectObj }}
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
            
        self.__files = files
        
        
    def __collectImages(self):
        """
        Stores __images as { dirName : { assetName : [projectObj, imageWidth, imageHeight] }}
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

        self.__images = images


    def __collectSprites(self):
        """
        Returns { dirName : [[ assetName, projectObj, imageWidth, imageHeight, hasOffsetX, hasOffsetY ], [...]]}
        Deletes sprites from __images
        Modifies images to contain sprite data:
        [projectObj, imageWidth, imageHeight] => [projectObj, imageWidth, imageHeight, spriteIndex, offsetA, offsetB]
        Whether an image is part of a sprite can easily checked via the fourth item in the array (spriteIndex)
        SpriteIndex is the position of the sprite data in the directory-local sprite array (see above)
        """
        
        images = self.__images
        assets = self.__assets
        sprites = {}

        for name in assets:
            # white list matching
            if basename(name) != "sprites.json":
                continue
                
            # Load sprite data from JSON file
            project = assets[name]
            path = os.path.join(project.getAssetPath(), name)
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
                
        self.__sprites = sprites


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


    def __exportHelper(self, roots):
        """
        Exports the internal data into a JSON structure
        """
        
        projects = self.__projects
        
        class ProjectEncoder(json.JSONEncoder):
            __projectIds = { 
                project: pos for pos, project in enumerate(filter(lambda project: project.getAssetPath() != None, projects)) 
            }

            def default(self, obj):
                if isinstance(obj, Project):
                    return self.__projectIds[obj]
                    
                return json.JSONEncoder.default(self, obj)

        code = json.dumps({
            "files" : self.__files,
            "images" : self.__images,
            "sprites" : self.__sprites,
            "roots" : roots
        }, separators=(',',':'), cls=ProjectEncoder)
        
        return "this.$$assets=%s;\n" % code        



    def publishFiles(self, dest):
        """
        Publishes the selected files to the given root directory. This merges files from different projects 
        to one folder. Ideal for preparing the final deployment.
        """

        assets = self.__assets
        projects = self.__projects

        logging.info("Publishing files...")
        pstart()
        
        counter = 0
        for name in assets:
            srcFile = assets[name]["path"]
            dstFile = os.path.join(dest, name.replace("/", os.sep))
            
            if updatefile(srcFile, dstFile):
                counter += 1
        
        logging.info("Updated %s/%s files" % (counter, len(assets)))
        pstop()
        
        
        
    def exportMerged(self, folder):
        projects = self.__projects
        roots = []
        for project in projects:
            roots.append("%s/%s" % (folder, project.getName()))
            
        return self.__exportHelper(roots)
        
        
        
    def exportOriginal(self, relativeRoot):
        """ 
        Exports asset data for the source version using assets from their original paths
        """
        
        projects = self.__projects
        webPath = os.path.join(self.__session.getMainProject().getPath(), relativeRoot)
        roots = []
        for project in projects:
            roots.append(os.path.relpath(project.getAssetPath(), webPath).replace(os.sep, '/'))

        return self.__exportHelper(roots)

        