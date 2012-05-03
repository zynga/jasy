#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

from jasy.asset.ImageInfo import ImgInfo
from jasy.asset.sprite.Block import Block

from jasy.asset.sprite.BlockPacker import BlockPacker
from jasy.asset.sprite.File import SpriteFile
from jasy.asset.sprite.Sheet import SpriteSheet

import os, json, itertools, logging

class SpritePacker():

    def __init__(self, base, types = ('png'), width=1024, height=1024):

        self.base = base
        self.files = []
        self.types = types
    
    def reset(self):
        self.files = []

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

            logging.debug('Scanning directory for images: %s' % dirPath)

            # go through all dirs
            for dirName in dirNames:

                # Filter dotted directories like .git, .bzr, .hg, .svn, etc.
                if dirName.startswith("."):
                    dirNames.remove(dirName)
                    
            relDirPath = os.path.relpath(dirPath, path)

            # Add all the files within the dir
            for fileName in fileNames:
                
                if fileName[0] == "." or fileName.split('.')[-1] not in self.types or fileName.startswith('sheet_'):
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

        self.files.append(SpriteFile(w, h, relPath, fullPath, checksum))

        logging.debug('- Found image "%s" (%dx%dpx)' % (relPath, w, h))


    def packBest(self, mode='area'):

        sheets, extraBlocks = [], []
        score = 0
        bestScore = 1000000000000
        
        # Sort Functions
        def sortHeight(img):
            return (img.w, img.h)

        def sortWidth(img):
            return (img.w, img.h)

        def sortArea(img):
            return (img.w * img.h, img.w, img.h)

        sorts = [sortHeight, sortWidth, sortArea]
        sizes = [(512, 256), (512, 512), (1024, 256), (1024, 512), (1024, 1024), 
                 (2048, 256), (2048, 512), (2048, 1024), (2048, 2048)]


        methods = list(itertools.product(sorts, sizes))

        logging.info('Packing SpriteSheet Variants...')
        for sort, size in methods:

            # Determine score, lowest score wins
            sh, ex = self.pack(size[0], size[1], sort, silent=True)

            if mode == 'area':
                score = sum([s.area for s in sh]) * len(sh) + sum([e.area for e in ex]) * len(ex)

            elif mode == 'count':
                score = (len(sh) + len(ex)) / size[0] * size[1]

            elif mode == 'usage':
                score = 100 - 100 / sum([s.area for s in sh]) * sum([s.usedArea for s in sh])

            else:
                raise Exception('Unknown score mode "%s" for sprite packing' % mode)


            # TODO calc in file number of score equals?
            if score < bestScore:
                sheets, extraBlocks = sh, ex
                bestScore = score
                logging.debug('- Best result %d sheets (%dx%dpx), %d unfitting (score %d)' % (len(sh), size[0], size[1], len(ex), score))

            else:
                logging.debug('- Trying (%dx%dpx) (score %d)' % (size[0], size[1], score))

        return (sheets, extraBlocks)


    def pack(self, width = 1024, height = 1024, sort=None, silent=False):
        """Packs all sprites within the pack into sheets of the given size."""
        
        logging.debug('Packing %d images...' % len(self.files))

        allBlocks = []
        duplicateCount = 0
        checkBlocks = {}

        for f in self.files:
            f.block = None

            if not f.checksum in checkBlocks:
                checkBlocks[f.checksum] = f.block = Block(f.width, f.height, f)
                allBlocks.append(f.block)

            else:
                src = checkBlocks[f.checksum]
                logging.debug('  - Detected duplicate of "%s" (using "%s" as reference)' % (f.relPath, src.image.relPath))

                src.duplicates.append(f)
                duplicateCount += 1

            f.block = checkBlocks[f.checksum]

        logging.debug('Found %d unique blocks (mapping %d duplicates)' % (len(allBlocks), duplicateCount))

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

            logging.debug('Sorting %d blocks...' % len(blocks))

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

                logging.debug('- Created new sprite sheet (%dx%dpx, %d%% used)' % (sheet.width, sheet.height, sheet.used))

            else:
                logging.debug('- Only one image fit into sheet, ignoring.')
                extraBlocks.append(fitBlocks[0])

        logging.debug('Packed %d images into %d sheets. %d images were found to be too big and did not fit.' % (fitted, len(sheets), len(extraBlocks)))

        return (sheets, extraBlocks)


    def generate(self, pattern='sheet_%d.png', best=False, size=(1024, 1024)):
        
        sheets, tooBig = self.packBest() if best else self.pack()
        logging.info('Generating %d sprite sheet(s):' % len(sheets))

        # Clean up
        i = 0
        while i < 100:

            name = pattern % i
            out = os.path.join(self.base, name)

            if os.path.exists(out):
                logging.debug('Removing old sprite sheet: %s' % out)
                os.unlink(out)

            i += 1


        # Write PNG files
        js = {}
        for i, sheet in enumerate(sheets):

            name = pattern % i
            out = os.path.join(self.base, name)

            logging.info('- Creating image for sheet (%dx%dpx) with %d image(s) > %s' % (sheet.width, sheet.height, len(sheet), out))
            sheet.toImage(out, False)

            js[name] = sheet.toJSON()

        # Add references to files which are too big

        if False:
            print('\n  Adding reference to images which didn\'t fit into the sheets...')
            for block in tooBig:
                print('  - "%s" (%dx%dpx)' % (block.image.relPath, block.w, block.h))
                js[block.image.relPath] = block.toJSON()


        # Generate json
        script = os.path.join(self.base, 'jasysprite.json')

        logging.info('- Generating json meta data > %s' % script)
        with open(script, 'wb') as f:
            f.write(json.dumps(js, sort_keys=True, indent=4).encode('ascii'))


    def packDir(self, name='', recursive=True, pattern='sheet_%d.png', best=False, size=(1024, 1024)):

        logging.info('Packing sprites in: %s' % os.path.join(self.base, name))
        self.reset()
        self.addDir(name, recursive=recursive)
        logging.info('- Found %d images' % len(self.files))

        self.generate(pattern, best, size)

