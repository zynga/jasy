#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

from os.path import basename, splitext

from jasy.asset.ImageInfo import ImgInfo
from jasy.core.Item import Item
from jasy.core.Util import getKey
from jasy.core.Logging import debug

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


class Asset(Item):
    
    kind = "asset"

    __imageSpriteData = []
    __imageAnimationData = []
    __imageDimensionData = []

    def __init__(self, project, id=None):
        self.id = id
        self.extension = splitext(self.id.lower())[1]
        self.type = getKey(extensions, self.extension, "other")
        self.shortType = self.type[0]
        self.project = project
        

    def isImageSpriteConfig(self):
        return self.isText() and basename(self.id) == "jasysprite.json"

    def isImageAnimationConfig(self):
        return self.isText() and basename(self.id) == "jasyanimation.json"

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

    
    def addImageSpriteData(self, id, left, top):
        debug("Registering sprite location for %s: %s@%sx%s", self.id, id, left, top)
        self.__imageSpriteData = [id, left, top]
        
    
    def addImageAnimationData(self, columns, rows, frames=None, layout=None):
        if layout is not None:
            self.__imageAnimationData = layout
        elif frames is not None:
            self.__imageAnimationData = [columns, rows, frames]
        else:
            self.__imageAnimationData = [columns, rows]
    
    
    def addImageDimensionData(self, width, height):
        debug("Adding dimension data for %s: %sx%s", self.id, width, height)
        self.__imageDimensionData = [width, height]
    
    
    def exportData(self):
        
        if self.isImage():
            if self.__imageDimensionData:
                image = self.__imageDimensionData[:]
            else:
                info = ImgInfo(self.getPath()).getInfo()
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


