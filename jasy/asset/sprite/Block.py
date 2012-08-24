#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

class Block():

    def __init__(self, w, h, image, rotated=False):
        self.w = w
        self.h = h
        self.fit = None
        self.image = image
        self.duplicates = []
        self.area = w * h
        self.rotated = rotated

    def toJSON(self):
        if self.fit:
            return {
                "left": self.fit.x,
                "top": self.fit.y,
                "width": self.image.width,
                "height": self.image.height,
                "rotation": -90 if self.rotated else 0
            }

        else:
            return  {
                "left": 0,
                "top": 0,
                "width": self.w,
                "height": self.h,
                "rotation": 0
            }

