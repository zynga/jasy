#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

from jasy.asset.ImageInfo import ImgInfo
from jasy.core.Item import Item

imageExtensions = (".png", ".jpeg", ".jpg", ".gif")
audioExtensions = (".mp3", ".ogg", ".m4a", ".aac")
videoExtensions = (".avi", ".mpeg", ".mpg", ".m4v", ".mkv")

class Asset(Item):
    
    kind = "asset"

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
        
    
    def export(self):
        if self.isImage():
            return self.getDimensions()
            
        # audio length, video codec, etc.?
        
        else:
            return None