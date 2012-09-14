#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import os.path

import jasy.asset.ImageInfo
import jasy.item.Abstract

from jasy.core.Util import getKey
from jasy.core.Config import loadConfig
import jasy.core.Console as Console

extensions = {
    ".png" : "image",
    ".jpeg" : "image",
    ".jpg" : "image",
    ".gif" : "image",
    
    ".mp3" : "audio",
    ".ogg" : "audio",
    ".m4a" : "audio",
    ".aac" : "audio",
    ".wav" : "audio",
    
    ".avi" : "video",
    ".mpeg" : "video",
    ".mpg" : "video",
    ".m4v" : "video",
    ".mkv" : "video",
    
    ".eot" : "font",
    ".woff" : "font",
    ".ttf" : "font",
    ".otf" : "font",
    ".pfa" : "font",
    ".pfb" : "font",
    ".afm" : "font",
    
    ".json" : "text",
    ".svg" : "text",
    ".txt" : "text",
    ".csv" : "text",
    ".html" : "text",
    ".js" : "text",
    ".css" : "text",
    ".htc" : "text",
    ".xml" : "text",
    ".tmpl" : "text",
    
    ".fla" : "binary",
    ".swf" : "binary",
    ".psd" : "binary",
    ".pdf" : "binary"
}


class AssetItem(jasy.item.Abstract.AbstractItem):
    
    kind = "asset"

    __imageSpriteData = []
    __imageAnimationData = []
    __imageDimensionData = []

    def __init__(self, project, id=None):
        # Call Item's init method first
        super().__init__(project, id)

        self.extension = os.path.splitext(self.id.lower())[1]
        self.type = getKey(extensions, self.extension, "other")
        self.shortType = self.type[0]
        

    def isImageSpriteConfig(self):
        return self.isText() and (os.path.basename(self.id) == "jasysprite.yaml" or os.path.basename(self.id) == "jasysprite.json")

    def isImageAnimationConfig(self):
        return self.isText() and (os.path.basename(self.id) == "jasyanimation.yaml" or os.path.basename(self.id) == "jasyanimation.json")

    def isText(self):
        return self.type == "text"

    def isImage(self):
        return self.type == "image"
    
    def isAudio(self):
        return self.type == "audio"

    def isVideo(self):
        return self.type == "video"
        
        
    def getType(self, short=False):
        if short:
            return self.shortType
        else:
            return self.type

    def getParsedObject(self):
        return loadConfig(self.getPath())

    
    def addImageSpriteData(self, id, left, top):
        Console.debug("Registering sprite location for %s: %s@%sx%s", self.id, id, left, top)
        self.__imageSpriteData = [id, left, top]
        
    
    def addImageAnimationData(self, columns, rows, frames=None, layout=None):
        if layout is not None:
            self.__imageAnimationData = layout
        elif frames is not None:
            self.__imageAnimationData = [columns, rows, frames]
        else:
            self.__imageAnimationData = [columns, rows]
    
    
    def addImageDimensionData(self, width, height):
        Console.debug("Adding dimension data for %s: %sx%s", self.id, width, height)
        self.__imageDimensionData = [width, height]
    
    
    def exportData(self):
        
        if self.isImage():
            if self.__imageDimensionData:
                image = self.__imageDimensionData[:]
            else:
                info = jasy.asset.ImageInfo.ImgInfo(self.getPath()).getInfo()
                if info is None:
                    raise Exception("Invalid image: %s" % fileId)

                image = [info[0], info[1]]

            if self.__imageSpriteData:
                image.append(self.__imageSpriteData)
            elif self.__imageAnimationData:
                # divider between sprite data and animation data
                image.append(0)
                
            if self.__imageAnimationData:
                image.append(self.__imageAnimationData)
                
            return image
            
        # TODO: audio length, video codec, etc.?
        
        return None


