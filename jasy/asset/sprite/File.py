#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

class SpriteFile():

    def __init__(self, width, height, relPath, fullPath, checksum):

        self.width = width
        self.height = height
        self.relPath = relPath
        self.src = fullPath
        self.checksum = checksum
        self.block = None

    def __repr__(self):
        return '<SpriteFile %s > %s %dx%dpx>' % (self.relPath, self.src, self.width, self.height)
