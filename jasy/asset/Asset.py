#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

from jasy.asset.ImageInfo import ImgInfo
from jasy.core.Item import Item
from jasy.core.Util import getKey
from os.path import basename, splitext
import logging

imageExtensions = (".png", ".jpeg", ".jpg", ".gif")
audioExtensions = (".mp3", ".ogg", ".m4a", ".aac")
videoExtensions = (".avi", ".mpeg", ".mpg", ".m4v", ".mkv")

extensions = {
    ".png" : "image",
    ".jpeg" : "image",
    ".jpg" : "image",
    ".gif" : "image",
    
    ".mp3" : "audio",
    ".ogg" : "audio",
    ".m4a" : "audio",
    ".aac" : "audio",
    
    ".avi" : "video",
    ".mpeg" : "video",
    ".mpg" : "video",
    ".m4v" : "video",
    ".mkv" : "video",
    
    ".json" : "data",
    ".js" : "data",
    ".txt" : "data",
    ".csv" : "data",
    ".tmpl" : "data"
}


class Asset(Item):
    
    kind = "asset"

    __imageSpriteData = []
    __imageAnimationData = []
    __imageDimensionData = []

    def __init__(self, project, id=None):
        self.id = id
        self.extension = splitext(self.id.lower())[1]
        self.type = getKey(extensions, self.extension)
        self.project = project
        self.data = {}

    def isImageSpriteConfig(self):
        return self.isData() and basename(self.id) == "jasysprite.json"

    def isImageAnimationConfig(self):
        return self.isData() and basename(self.id) == "jasyanimation.json"

    def isData(self):
        return self.type == "data"

    def isImage(self):
        return self.type == "image"
    
    def isAudio(self):
        return self.type == "audio"

    def isVideo(self):
        return self.type == "video"
        
    
    def getDimensions(self):
        if self.type == "image":
            info = ImgInfo(self.getPath()).getInfo()
            if info is None:
                raise Exception("Invalid image: %s" % fileId)
            
            return [info[0], info[1]]
        
        
    def addSpriteData(self, id, left, top):
        logging.debug("  - Registering sprite location for %s: %s@%sx%s", self.id, id, left, top)
        self.__imageSpriteData = [id, left, top]
        
    
    def addAnimationData(self, columns, rows, frames=None, layout=None):
        if layout is not None:
            self.__imageAnimationData = layout
        elif frames is not None:
            self.__imageAnimationData = [columns, rows, frames]
        else:
            self.__imageAnimationData = [columns, rows]
    
    
    def addDimensionData(self, width, height):
        logging.debug("  - Adding dimension data for %s: %sx%s", self.id, width, height)
        self.__imageDimensionData = [width, height]
    
    
    def addData(self, data):
        self.data.update(data)
    
    
    def export(self):

        if self.isImage():
            if self.__imageDimensionData:
                image = self.__imageDimensionData[:]
            else:
                image = self.getDimensions()

            if self.__imageSpriteData:
                image.append(self.__imageSpriteData)
            elif self.__imageAnimationData:
                # divider between sprite data and animation data
                image.append(0)
                
            if self.__imageAnimationData:
                image.append(self.__imageAnimationData)
                
            self.data["img"] = image
            
        # audio length, video codec, etc.?
        
        return self.data


