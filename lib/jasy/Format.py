#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

from datetime import datetime
import zlib

__all__ = ["Format"]

class Format:
    def __init__(self):
        return



    def old(self):
        result.append("")
        result.append("// %s" % classObj.getName())
        result.append("// - Modified: %s" % datetime.fromtimestamp(classObj.getModificationTime()).isoformat())

        if computeSize:
            result.append("// - %s" % size(compressed))



    def size(self, content, encoding="utf-8"):
        """ Returns a user friendly formatted string about the size of the given content. """

        normalSize = len(content)
        zippedSize = len(zlib.compress(content.encode(encoding)))

        return "Size: {:.2f}KB ({:.2f}KB zipped => {:.2%})".format(normalSize/1024, zippedSize/1024, zippedSize/normalSize)

