#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

from jasy.asset.ImageInfo import ImgInfo
from jasy.core.Item import Item

imageExtensions = (".png", ".jpeg", ".jpg", ".gif")

class Asset(Item):
    
    kind = "asset"

    def isImage(self):
        return self.id.lower().endswith(imageExtensions)
        
    
    def getDimensions(self):
        info = ImgInfo(self.getPath()).getInfo()
        if info is None:
            raise Exception("Invalid image: %s" % fileId)
            
        return [info[0], info[1]]
        
    