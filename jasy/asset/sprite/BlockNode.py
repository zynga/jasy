#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

class BlockNode():
    
    def __init__(self, parent, x, y, w, h):

        parent.nodes.append(self)
        self.x = x
        self.y = y
        self.w = w
        self.h = h
        self.down = None
        self.right = None
        self.used = False

