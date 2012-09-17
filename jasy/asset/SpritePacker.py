#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

from jasy.asset.ImageInfo import ImgInfo
from jasy.asset.sprite.Block import Block
from jasy.asset.sprite.BlockPacker import BlockPacker
from jasy.asset.sprite.File import SpriteFile
from jasy.asset.sprite.Sheet import SpriteSheet
from jasy.core.Config import writeConfig

import jasy.core.Console as Console

import os, json, itertools, math


class PackerScore():

    def __init__(self, sheets, external):
        
        self.sheets = sheets
        self.external = external

        # TODO choose quadratic over non??
        self.sizes = ['%dx%dpx' % (s.width, s.height) for s in sheets]
        self.indexSize = sum([s.width / 128 + s.height / 128 for s in sheets])

        # the total area used
        self.area = int(sum([s.area for s in sheets]) * 0.0001)
        self.exArea = sum([s.area for s in external]) * 0.0001
        self.usedArea = int(sum([s.usedArea for s in sheets]) * 0.0001)
        self.count = len(sheets) 

        # we only factor in left out images
        # if their size is less than 50% of the total spritesheet size we have right now
        # everything else is included as it would blow up the sheet way too much
        self.excount = len([i for i in external if i.w * i.h * 0.0001 < self.area * 0.5]) + 1

        # Calculate in efficiency
        self.efficency = (100 / self.area) * self.usedArea
        self.value = self.efficency / (self.area * (self.excount * self.excount)) / (self.count ** self.count)

    def data(self):
        return (self.sheets, self.external)

    def __lt__(self, other):

        # Merge index sizes! if less images

        # Only go with bigger index size (n^2 more space taken) if we're score at least
        # 10% better
        if self.value > other.value * 1.1:
            return True

        # Otherwise sort against the index size
        elif self.value >= other.value:

            if self.indexSize < other.indexSize:
                return True

            elif self.indexSize == other.indexSize and self.sheets[0].width > other.sheets[0].width:
                return True

            else:
                return False

        else:
            if other.area == 1 and self.area > 1:
                return True

            return False

    def __gt__(self, other):
        return not self < other

    def __repr__(self):
        return '<PackerScore %d sheets #%d (%s) Area: %d Used: %d (%2.f%%) External: %d Count: %d Value: %2.5f>' % (self.count, self.indexSize, ', '.join(self.sizes), self.area, self.usedArea, self.efficency, self.excount - 1, self.count ** self.count, self.value)



class SpritePacker():
    """Packs single images into sprite images automatically"""


    def __init__(self, base, types = ('png'), width=1024, height=1024):

        self.base = base
        self.files = []
        self.types = types
        self.dataFormat = 'yaml';
    
    def clear(self):
        """
        Removes all generated sprite files found in the base directory
        """

        Console.info("Cleaning sprite files...")
        Console.indent()
        
        for dirPath, dirNames, fileNames in os.walk(self.base):
            for fileName in fileNames:
                if fileName.startswith("jasysprite"):
                    filePath = os.path.join(dirPath, fileName)
                    Console.debug("Removing file: %s", filePath)
                    os.remove(filePath)
        
        Console.outdent()

    def addDir(self, directory, recursive=False):
        """Adds all images within a directory to the sprite packer."""
        
        path = os.path.join(self.base, directory)
        if not os.path.exists(path):
            return

        if recursive:
            dirs = os.walk(path)

        else:
            dirs = [(os.path.join(self.base, directory), os.listdir(path), [])]

        # Iteratre over all directories
        for dirPath, dirNames, fileNames in dirs:

            Console.debug('Scanning directory for images: %s' % dirPath)

            # go through all dirs
            for dirName in dirNames:

                # Filter dotted directories like .git, .bzr, .hg, .svn, etc.
                if dirName.startswith("."):
                    dirNames.remove(dirName)
                    
            relDirPath = os.path.relpath(dirPath, path)

            # Add all the files within the dir
            for fileName in fileNames:
                
                if fileName[0] == "." or fileName.split('.')[-1] not in self.types or fileName.startswith('jasysprite'):
                    continue
                    
                relPath = os.path.normpath(os.path.join(relDirPath, fileName)).replace(os.sep, "/")
                fullPath = os.path.join(dirPath, fileName)
                
                self.addFile(relPath, fullPath)


    def addFile(self, relPath, fullPath):
        """Adds the specific file to the sprite packer."""

        fileType = relPath.split('.')[-1]
        if fileType not in self.types:
            raise Exception('Unsupported image format: %s' % fileType)
        
        # Load image and grab required information
        img = ImgInfo(fullPath)
        w, h = img.getSize()
        checksum = img.getChecksum()
        del img

        # TODO crop transparent "borders"
        # TODO allow for rotation

        self.files.append(SpriteFile(w, h, relPath, fullPath, checksum))

        Console.debug('- Found image "%s" (%dx%dpx)' % (relPath, w, h))


    def packBest(self, autorotate=False):
        """Pack blocks into a sprite sheet by trying multiple settings."""

        sheets, extraBlocks = [], []
        score = 0

        best = {
            'score': 0,
            'area': 10000000000000000000,
            'count': 10000000000000,
            'eff': 0
        }
        
        # Sort Functions
        def sortHeight(block):
            return (block.w, block.h, block.image.checksum)

        def sortWidth(block):
            return (block.h, block.w, block.image.checksum)

        def sortArea(block):
            return (block.w * block.h, block.w, block.h, block.image.checksum)

        sorts = [sortHeight, sortWidth, sortArea]
        rotationDiff = [(0, 0), (1.4, 0), (0, 1.4), (1.4, 1.4)] # rotate by 90 degrees if either b / a > value

        # Determine minimum size for spritesheet generation
        # by averaging the widths and heights of all images
        # while taking the ones in the sorted middile higher into account
        # then the ones at the outer edges of the spectirum


        l = len(self.files)
        mw = [(l - abs(i - l / 2)) / l * v for i, v in enumerate(sorted([i.width for i in self.files]))]
        mh = [(l - abs(i - l / 2)) / l * v for i, v in enumerate(sorted([i.height for i in self.files]))]

        minWidth = max(128, math.pow(2, math.ceil(math.log(sum(mw) / l, 2))))
        minHeight = max(128, math.pow(2, math.ceil(math.log(sum(mh) / l, 2))))

        #baseArea = sum([(l - abs(i - l / 2)) / l * v for i, v in enumerate(sorted([i.width * i.height for i in self.files]))])


        # try to skip senseless generation of way to small sprites
        baseArea = sum([minWidth * minHeight for i in self.files])
        while baseArea / (minWidth * minHeight) >= 20: # bascially an estimate of the number of sheets needed
            minWidth *= 2
            minHeight *= 2

        Console.debug('- Minimal size is %dx%dpx' % (minWidth, minHeight))

        sizes = list(itertools.product([w for w in [128, 256, 512, 1024, 2048] if w >= minWidth],
                                       [h for h in [128, 256, 512, 1024, 2048] if h >= minHeight]))

        if autorotate:
            methods = list(itertools.product(sorts, sizes, rotationDiff))

        else:
            methods = list(itertools.product(sorts, sizes, [(0, 0)]))

        Console.debug('Packing sprite sheet variants...')
        Console.indent()

        scores = []
        for sort, size, rotation in methods:

            # pack with current settings
            sh, ex, _ = self.pack(size[0], size[1], sort, silent=True, rotate=rotation)

            if len(sh):
                score = PackerScore(sh, ex)

                # Determine score, highest wins
                scores.append(score)

            else:
                Console.debug('No sprite sheets generated, no image fit into the sheet')

        Console.outdent()
        scores.sort()

        Console.debug('Generated the following sheets:')
        for i in scores:
            Console.debug('- ' + str(i))

        sheets, external = scores[0].data()
        
        if external:
            for block in external:
                Console.info('Ignored file %s (%dx%dpx)' % (block.image.relPath, block.w, block.h))
        
        return sheets, len(scores)


    def pack(self, width=1024, height=1024, sort=None, silent=False, rotate=(0, 0)):
        """Packs all sprites within the pack into sheets of the given size."""
        
        Console.debug('Packing %d images...' % len(self.files))

        allBlocks = []
        duplicateCount = 0
        checkBlocks = {}

        for f in self.files:
            f.block = None

            if not f.checksum in checkBlocks:
                
                # check for rotation
                ow = f.width
                oh = f.height

                rot = False

                if rotate[0] != 0:
                    if ow / oh > rotate[0]:
                        rot = True

                elif rotate[1] != 0:
                    if oh / ow > rotate[1]:
                        rot = True
                
                w, h = (oh, ow) if rot else (ow, oh)

                checkBlocks[f.checksum] = f.block = Block(w, h, f, rot)
                allBlocks.append(f.block)

            else:
                src = checkBlocks[f.checksum]
                Console.debug('  - Detected duplicate of "%s" (using "%s" as reference)' % (f.relPath, src.image.relPath))

                src.duplicates.append(f)
                duplicateCount += 1

            f.block = checkBlocks[f.checksum]

        Console.debug('Found %d unique blocks (mapping %d duplicates)' % (len(allBlocks), duplicateCount))

        # Sort Functions
        def sortHeight(img):
            return (img.w, img.h)

        def sortWidth(img):
            return (img.w, img.h)

        def sortArea(img):
            return (img.w * img.h, img.w, img.h)


        # Filter out blocks which are too big
        blocks = []
        extraBlocks = []
        for b in allBlocks:

            if b.w > width or b.h > height:
                extraBlocks.append(b)

            else:
                blocks.append(b)

        sheets = []

        fitted = 0
        while len(blocks):

            Console.debug('Sorting %d blocks...' % len(blocks))
            Console.indent()

            sortedSprites = sorted(blocks, key=sort if sort is not None else sortHeight)
            sortedSprites.reverse()

            # Pack stuff
            packer = BlockPacker(width, height)
            packer.fit(sortedSprites)
            
            # Filter fit vs non-fit blocks
            blocks = [s for s in sortedSprites if not s.fit]
            fitBlocks = [s for s in sortedSprites if s.fit]

            fitted += len(fitBlocks)

            # Create a new sprite sheet with the given blocks
            if len(fitBlocks) > 1:
                sheet = SpriteSheet(packer, fitBlocks)
                sheets.append(sheet)

                Console.debug('Created new sprite sheet (%dx%dpx, %d%% used)' % (sheet.width, sheet.height, sheet.used))

            else:
                Console.debug('Only one image fit into sheet, ignoring.')
                extraBlocks.append(fitBlocks[0])
                
            Console.outdent()

        Console.debug('Packed %d images into %d sheets. %d images were found to be too big and did not fit.' % (fitted, len(sheets), len(extraBlocks)))

        return (sheets, extraBlocks, 0)

    # extension can be set to 'yaml' or 'json'
    def setDataFormat(self, format='yaml'):
        """Sets format (json or yaml) for metadata output"""
        self.dataFormat = format;


    def generate(self, path='', autorotate=False, debug=False):
        """Generate sheets/variants"""
        
        Console.info('Generating sprite sheet variants...')
        Console.indent()
        
        sheets, count = self.packBest(autorotate)

        # Write PNG files
        data = {}
        for pos, sheet in enumerate(sheets):

            Console.info('Writing image (%dx%dpx) with %d images' % (sheet.width, sheet.height, len(sheet)))
            name = 'jasysprite_%d.png' % pos

            # Export
            sheet.write(os.path.join(self.base, path, name), debug)
            data[name] = sheet.export()
            
        Console.outdent()

        # Generate JSON/YAML
        Console.info('Exporting data...')
        script = os.path.join(self.base, path, 'jasysprite.%s' % self.dataFormat)
        writeConfig(data, script)



    def packDir(self, path='', recursive=True, autorotate=False, debug=False):
        """Pack images inside a dir into sprite sheets"""

        Console.info('Packing sprites in: %s' % os.path.join(self.base, path))
        Console.indent()
        
        self.files = []
        self.addDir(path, recursive=recursive)
        Console.info('Found %d images' % len(self.files))

        if len(self.files) > 0:
            self.generate(path, autorotate, debug)
            
        Console.outdent()


