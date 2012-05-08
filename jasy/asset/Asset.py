#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

from jasy.asset.ImageInfo import ImgInfo
from jasy.core.Item import Item
from os.path import basename
import logging

imageExtensions = (".png", ".jpeg", ".jpg", ".gif")
audioExtensions = (".mp3", ".ogg", ".m4a", ".aac")
videoExtensions = (".avi", ".mpeg", ".mpg", ".m4v", ".mkv")

class Asset(Item):
    
    kind = "asset"

    __imageSpriteData = []
    __imageFrameData = []
    __imageDimensionData = []
    
    def isSpriteConfig(self):
        return basename(self.id) == "jasysprite.json"

    def isImage(self):
        return self.id.lower().endswith(imageExtensions)
    
    def isAudio(self):
        return self.id.lower().endswith(audioExtensions)

    def isVideo(self):
        return self.id.lower().endswith(videoExtensions)
        
    
    def getDimensions(self):
        info = ImgInfo(self.getPath()).getInfo()
        if info is None:
            raise Exception("Invalid image: %s" % fileId)
            
        return [info[0], info[1]]
        
        
    def addSpriteData(self, id, left, top):
        logging.debug("  - Registering sprite location for %s: %s@%sx%s", self.id, id, left, top)
        self.__imageSpriteData = [id, left, top]
        
    
    def addFrameData(self, columns, rows, number=None, frames=None):
        if frames:
            self.__imageFrameData = frames
        elif number:
            self.__imageFrameData = [columns, rows, number]
        else:
            self.__imageFrameData = [columns, rows]
    
    
    def addDimensions(self, width, height):
        logging.debug("  - Adding dimension data for %s: %sx%s", self.id, width, height)
        self.__imageDimensionData = [width, height]
    
    
    def export(self):
        if self.isImage():
            result = self.__imageDimensionData or self.getDimensions()

            if self.__imageSpriteData:
                result += self.__imageSpriteData
                
            if self.__imageFrameData:
                result += self.__imageFrameData
            
            return result
            
        # audio length, video codec, etc.?
        
        else:
            return None