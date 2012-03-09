#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging, re, json, os, fnmatch
from os.path import basename, dirname

from jasy.util.Profiler import *
from jasy.asset.ImageInfo import ImgInfo
from jasy.util.File import *
from jasy.core.Project import Project

__all__ = ["Asset"]


class Asset:
    """
    Manages assets aka images, styles and other files required for a web application.
    
    Supports filtering assets based on a given class list (with optional permutation) to
    only include and copy assets which are needed by the current implementation. This is 
    especially useful when only parts of dependend projects are actually used.
    
    Merges assets with the same name from different projects. But normally each project
    creates it's own sandbox namespace so this has not often any effect at all.
    
    Supports images and automatically detect their size and image format. Both informations
    are added to the exported data later on.
    
    Supports images sprites when it finds a 'sprites.json' in any folder.
    """
    
    def __init__(self, session, classes, permutation=None):
        self.__session = session
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
        for project in self.__session.getProjects():
            assets = project.getAssets()
            for name in assets:
                merged[name] = { 
                    "project" : project,
                    "path" : assets[name]
                }

        # Merge asset hints from all classes and remove duplicates
        hints = set()
        for classObj in self.__classes:
            hints.update(classObj.getMetaData(self.__permutation).assets)
        
        # Compile filter expressions
        matcher = "^%s$" % "|".join(["(%s)" % fnmatch.translate(hint) for hint in hints])
        logging.debug("Matching assets using: %s" % matcher)
        expr = re.compile(matcher)
        
        # Filter merged assets
        self.__assets = { 
            name: merged[name] for name in merged if expr.match(name) 
        }
        
        logging.debug("Selected classes make use of %s assets" % len(self.__assets))        



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
        
        projects = self.__session.getProjects()
        
        class ProjectEncoder(json.JSONEncoder):
            __projectIds = { 
                project: pos for pos, project in enumerate(filter(lambda project: project.getAssetPath() != None, projects)) 
            }

            def default(self, obj):
                if isinstance(obj, Project):
                    return self.__projectIds[obj]
                    
                return json.JSONEncoder.default(self, obj)

        return json.dumps({
            "files" : self.__files,
            "images" : self.__images,
            "sprites" : self.__sprites,
            "roots" : roots
        }, separators=(',',':'), cls=ProjectEncoder)



    def exportBuild(self, buildFolder="build", assetFolder="asset", urlPrefix=""):
        """
        Publishes the selected files to the given 'buildFolder/assetFolder'. This merges files from 
        different projects to this one folder. This is ideal for preparing the final deployment.
        
        Parameters:
        - buildFolder: Where the HTML root is based on the project's root
        - assetFolder: Where the assets should copied to inside the build folder (relative to the build folder).
        - urlPrefix: A URL which should be mapped to the project's root folder
        """

        assets = self.__assets
        projects = self.__session.getProjects()

        logging.info("Publishing files...")
        pstart()
        
        counter = 0
        for name in assets:
            srcFile = assets[name]["path"]
            dstFile = os.path.join(buildFolder, assetFolder, name.replace("/", os.sep))
            
            if updateFile(srcFile, dstFile):
                counter += 1
        
        logging.info("Updated %s/%s files" % (counter, len(assets)))
        pstop()
        
        roots = []
        for project in projects:
            projectPackage = project.getPackage()
            assetBasePath = os.path.join(assetFolder, projectPackage) if projectPackage else assetFolder
            
            if urlPrefix:
                roots.append("%s%s" % (urlPrefix, os.path.join(buildFolder, assetBasePath).replace(os.sep, "/")))
            else:
                roots.append(assetBasePath.replace(os.sep, "/"))

        return self.__exportHelper(roots)        
        
        

    def exportSource(self, urlBase="source", urlPrefix=""):
        """ 
        Exports asset data for the source version using assets from their original paths.
        
        Parameters:
        - urlBase: Where the HTML root is based on the project's root.
        - urlPrefix: Useful when a CDN should be used. Maps the project's root to a URL.
            As URLs are always absolute it makes sense to reset 'urlBase' to an empty
            string so that the URLs do not contain useless ".." parent directory segments.
        """
        
        projects = self.__session.getProjects()
        webPath = os.path.join(self.__session.getMainProject().getPath(), urlBase)
        roots = []
        for project in projects:
            roots.append(urlPrefix + os.path.relpath(project.getAssetPath(), webPath).replace(os.sep, '/'))

        return self.__exportHelper(roots)

        