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

    __spriteData = []
    __dimensionData = []
    
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
        self.__spriteData = [id, left, top]
    
    
    def addDimensions(self, width, height):
        logging.debug("  - Adding dimension data for %s: %sx%s", self.id, width, height)
        self.__dimensionData = [width, height]
    
    
    def export(self):
        if self.isImage():
            dimensions = self.__dimensionData or self.getDimensions()
            if self.__spriteData:
                return dimensions + self.__spriteData
            else:
                return dimensions
            
        # audio length, video codec, etc.?
        
        else:
            return None