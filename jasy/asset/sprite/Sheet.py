#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import sys

sys.path.insert(0, ".")
sys.path.insert(1, "PIL")
import Image, ImageDraw

class SpriteSheet():

    def __init__(self, packer, blocks):

        self.packer = packer
        self.width = packer.root.w
        self.height = packer.root.h
        self.blocks = blocks

        self.area = self.width * self.height
        self.usedArea = sum([s.w * s.h for s in blocks])
        self.used = (100 / self.area) * self.usedArea


    def __len__(self):
        return len(self.blocks)


    def toJSON(self, projectId=''):
        
        data = {}

        for block in self.blocks:

            info = block.toJSON()
            
            data[block.image.relPath] = info

            for d in block.duplicates:
                data[d.relPath] = info

        return data


    def toImage(self, filename, showUnused=False):

        img = Image.new('RGBA', (self.width, self.height))
        draw = ImageDraw.Draw(img)

        #draw.rectangle((0, 0, self.width, self.height), fill=(255, 255, 0, 255))

        # Load images and pack them in
        for block in self.blocks:
            res = Image.open(block.image.src)

            img.paste(res, (block.fit.x, block.fit.y))
            del res

        # Debug output coloring unused blocks in pink
        # TODO we can just as well fill the whole image
        if showUnused:

            count = len(self.packer.getUnused())
            for i, block in enumerate(self.packer.getUnused()):
                x, y, w, h = block.x, block.y, block.w, block.h
                draw.rectangle((x, y, x + w, y + h ), fill=(255, 0, int(255 / count * i), 255))

        img.save(filename)

