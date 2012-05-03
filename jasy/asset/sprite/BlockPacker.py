#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

from jasy.asset.sprite.BlockNode import BlockNode

class BlockPacker():
    
    def __init__(self, w = 0, h = 0):

        self.nodes = []
        self.autogrow = False
        if w > 0 and h > 0:
            self.root = BlockNode(self, 0, 0, w, h)

        else:
            self.autogrow = True
            self.root = None

    def getUnused(self):
        return [b for b in self.nodes if not b.used]
        
    def fit(self, blocks):

        length = len(blocks)
        w = blocks[0].w if length > 0 else 0
        h = blocks[0].h if length > 0 else 0

        if self.autogrow:
            self.root = BlockNode(self, 0, 0, w, h)

        for block in blocks:
            
            node = self.findNode(self.root, block.w, block.h)
            if node:
                block.fit = self.splitNode(node, block.w, block.h)

            elif self.autogrow:
                block.fit = self.growNode(block.w, block.h)
        
    def findNode(self, root, w, h):

        if (root.used):
            return self.findNode(root.right, w, h) or self.findNode(root.down, w, h)

        elif w <= root.w and h <= root.h:
            return root

        else:
            return None

    def splitNode(self, node, w, h):
        node.used = True
        node.down = BlockNode(self, node.x, node.y + h, node.w, node.h - h)
        node.right = BlockNode(self, node.x + w, node.y, node.w - w, h)
        return node


    def growNode(self, w, h):
        
        canGrowDown  = w <= self.root.w
        canGrowRight = h <= self.root.h

        shouldGrowRight = canGrowRight and self.root.h >= self.root.w + w
        shouldGrowDown  = canGrowDown  and self.root.w >= self.root.h + h

        if shouldGrowRight:
            return self.growRight(w, h)

        elif shouldGrowDown:
            return self.growDown(w, h)

        elif canGrowRight:
            return self.growRight(w, h)

        elif canGrowDown:
            return self.growDown(w, h)

        else:
            return None
    

    def growRight(self, w, h):
        root = Node(self, 0, 0, self.root.w + w, self.root.h)
        root.used = True
        root.down = self.root
        root.right = BlockNode(self, self.root.w, 0, w, self.root.h)
        
        self.root = root

        node = self.findNode(self.root, w, h)

        if node:
            return self.splitNode(node, w, h)

        else:
            return None


    def growDown(self, w, h):
        root = BlockNode(self, 0, 0, self.root.w, self.root.h + h)
        root.used = True
        root.down = BlockNode(self, 0, self.root.h, self.root.w, h)
        root.right = self.root
        
        self.root = root

        node = self.findNode(self.root, w, h)

        if node:
            return self.splitNode(node, w, h)

        else:
            return None

