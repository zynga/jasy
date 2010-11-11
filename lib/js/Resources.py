#
# JavaScript Tools
# Copyright 2010 Sebastian Werner
#

import logging, re, json, os, struct
from js.core.Profiler import *

__all__ = ["Resources"]


class ImgFile(object):
    def __init__(self, filename):
        try:
            self.fp = open(filename, "rb")
        except IOError as err:
            logging.error("Could not open file: %s" % filename)
            raise err

    def verify(self):
        raise NotImplementedError("%s: %s" % (self.__class__, "verify()"))

    def type(self):
        raise NotImplementedError("%s: %s" % (self.__class__, "type()"))

    def size(self):
        raise NotImplementedError("%s: %s" % (self.__class__, "size()"))

    def close(self):
        self.fp.close()

    def __del__(self):
        self.close()


# http://www.w3.org/Graphics/GIF/spec-gif89a.txt
class GifFile(ImgFile):
    def verify(self):
        self.fp.seek(0)
        header = self.fp.read(6)
        signature = struct.unpack("3s3s", header[:6])
        isGif = signature[0] == b"GIF" and signature[1] in [b"87a", b"89a"]
        return isGif

    def type(self):
        return "gif"

    def size(self):
        self.fp.seek(0)
        header = self.fp.read(6+6)
        (width, height) = struct.unpack("<HH", header[6:10])
        return width, height


# http://www.libmng.com/pub/png/spec/1.2/png-1.2-pdg.html#Structure
class PngFile(ImgFile):
    def __init__(self, filename):
        ImgFile.__init__(self, filename)

    def type(self):
        return "png"

    def verify(self):
        self.fp.seek(0)
        header = self.fp.read(8)
        signature = struct.pack("8B", 137, 80, 78, 71, 13, 10, 26, 10)
        isPng = header[:8] == signature
        return isPng

    def size(self):
        self.fp.seek(0)
        header = self.fp.read(8+4+4+13+4)
        ihdr = struct.unpack("!I4s", header[8:16])
        data = struct.unpack("!II5B", header[16:29])
        (width, height, bitDepth, colorType, compressionMethod, filterMethod, interleaceMethod) = data
        return (width, height)


# http://www.obrador.com/essentialjpeg/HeaderInfo.htm
class JpegFile(ImgFile):
    def verify(self):
        self.fp.seek(0)
        signature = struct.unpack("!H", self.fp.read(2))
        isJpeg = signature[0] == 0xFFD8
        return isJpeg

    def type(self):
        return "jpeg"

    def size(self):
        self.fp.seek(2)
        
        # find FFC0 marker
        cont = self.fp.read()

        # try Baseline DCT Start-of-frame marker (SOF0) (http://en.wikipedia.org/wiki/Jpeg)
        pos  = cont.find(b"\xFF\xC0")
        if pos < 0:
            # try Progressive DCT Start-of-frame marker (SOF2)
            pos  = cont.find(b"\xFF\xC2")
        if pos < 0:  # no SOF found - give up
            return None
        pos += 4 # skip marker and length
        
        # extract values from SOF payload
        try:
            (precision, height, width) = struct.unpack("!BHH", cont[pos:pos+5])
        except struct.error:
            return None
        return (width, height)


class ImgInfo(object):
    def __init__(self, filename):
        self.__filename = filename

    classes = [PngFile, GifFile, JpegFile]

    def getSize(self):
        """
        Returns the image sizes of png, gif and jpeg files as
        (width, height) tuple
        """
        
        filename = self.__filename
        classes = self.classes

        for cls in classes:
            img = cls(filename)
            if img.verify():
                size = img.size()
                if size is not None:
                    img.close()
                    return size
            img.close()

        return None
    
    def getInfo(self):
        ''' Returns (width, height, "type") of the image'''
        filename = self.__filename
        classes = self.classes
        
        for cls in classes:
            img = cls(filename)
            if img.verify():
                return img.size()

        return None


class Resources:
    def __init__(self, session, classes, permutation=None):
        self.__session = session
        self.__classes = classes
        self.__permutation = permutation
        
        
    def getMerged(self):
        """ 
        Returns the merged list of all resources and their origin.
        
        Resources might be overritten by projects listed later in the
        project chain.
        """
        
        try:
            return self.__merged
        
        except AttributeError:
            result = {}
            for pos, project in enumerate(self.__session.getProjects()):
                for resource in project.getResources():
                    result[resource] = pos

            self.__merged = result
            return result
        
    
    def getFiltered(self):
        """ 
        Returns a list of resources which is used by the classes
        given at creation time.
        """
        try:
            return self.__filtered
        
        except AttributeError:
            pstart()
            
            # Merge asset hints from all classes and remove duplicates
            assets = set()
            for classObj in self.__classes:
                assets.update(classObj.getMeta(self.__permutation).assets)

            # Compile regular expressions which is used to filter resource later on
            expr = re.compile("^%s$" % "|".join(["(%s)" % asset.replace("*", ".*") for asset in assets]))
            
            # Filter assets by regular expression
            result = {}
            merged = self.getMerged()
            for resource in merged:
                if expr.match(resource):
                    result[resource] = merged[resource]
            
            logging.info("Selected classes make use of %s resources" % len(result))
            self.__filtered = result
            pstop()
            return result
            
            
            
            
        
    def __findPos(self, coll, item):
        for pos, obj in enumerate(coll):
            if obj == item:
                return pos
                
        return -1
        
            
            
    def getInfo(self, enableSprites=True, enableInlining=True):
        filtered = self.getFiltered()
        projects = self.__session.getProjects()
        
        # Collecting roots
        roots = []
        for projectId, project in enumerate(projects):
            roots.append(project.resourcePath)

        # Processing resources...
        files = {}
        sprites = {}
        logging.info("Detecting image sizes...")
        for resource in filtered:
            projectId = filtered[resource]
            project = projects[projectId]
            
            fullPath = "%s/%s" % (project.resourcePath, resource)
            
            basename = os.path.basename(resource)
            dirname = os.path.dirname(resource)
            extension = os.path.splitext(basename)[1]
            
            if basename == "sprites.json":
                sprites[dirname] = json.load(open(fullPath))
                pass
                
            elif extension == ".meta":
                # qooxdoo style sprite meta info
                continue
                
            else:
                if not dirname in files:
                    files[dirname] = {}

                img = ImgInfo(fullPath)
                imgInfo = img.getInfo()
                if imgInfo != None:
                    files[dirname][basename] = (projectId,) + imgInfo
                
                else:
                    files[dirname][basename] = projectId
                    
                    
        # Merge in sprite data and create additional data for sprites
        spritesResult = {}
        
        for spriteDir in sprites:
            spriteFiles = sprites[spriteDir]
            for spriteFile in spriteFiles:
                # Ignore if sprite file is not included
                if not spriteFile in files[spriteDir]:
                    continue
                
                # Read and delete sprite data
                spriteData = files[spriteDir][spriteFile]
                del files[spriteDir][spriteFile]
                
                # Pre-check for offsets (e.g. just using x or y is more efficient to store)
                hasXOffsets = 0
                hasYOffsets = 0
                spriteItems = spriteFiles[spriteFile]
                for spriteItem in spriteItems:
                    spriteOffset = spriteItems[spriteItem]
                    if spriteOffset[0] > 0:
                        hasXOffsets = 1
                    if spriteOffset[1] > 0:
                        hasYOffsets = 1

                # Mark file as sprite file
                # Format: fileName(str), projectId(int), width(int), height(int), hasOffsetX(int), hasOffsetY(int)
                spriteEntry = (spriteFile,) + spriteData + (hasXOffsets, hasYOffsets)

                if spriteDir in spritesResult:
                    spritesResult[spriteDir].append(spriteEntry)
                else:
                    spritesResult[spriteDir] = [spriteEntry]
                    
                # Add sprite data to single image data
                # Format: projectId(int), width(int), height(int), spriteIndex(int), offsetX(int)|offsetY(int), offsetY(int)?
                spriteIndex = len(spritesResult[spriteDir]) - 1
                for spriteItem in spriteItems:
                    spriteOffset = spriteItems[spriteItem]
                    
                    spriteInfo = (spriteIndex,)
                    if hasXOffsets:
                        spriteInfo += (spriteOffset[0],)
                    if hasYOffsets:
                        spriteInfo += (spriteOffset[1],)

                    files[spriteDir][spriteItem] += spriteInfo

        return {
            "roots" : roots,
            "sprites" : spritesResult,
            "files" : files
        }
        
        
    def export(self, to="$$resources"):
        info = self.getInfo()
        code = json.dumps(info, separators=(',',':'))
        
        logging.info("Generated %sKB of resource info" % (len(code)/1024))
        
        return "(function(){this.%s=%s})();" % (to, code)
        
        