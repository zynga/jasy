#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

from jasy.asset.ImageInfo import ImgInfo
from jasy.asset.sprite.Block import Block

from jasy.asset.sprite.BlockPacker import BlockPacker
from jasy.asset.sprite.File import SpriteFile
from jasy.asset.sprite.Sheet import SpriteSheet

import os, json, itertools, logging, math

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

        # TODO crop transparent "borders"
        # TODO allow for rotation

        self.files.append(SpriteFile(w, h, relPath, fullPath, checksum))

        logging.debug('- Found image "%s" (%dx%dpx)' % (relPath, w, h))


    def packBest(self):

        sheets, extraBlocks = [], []
        score = 0
        
        class PackerScore():

            def __init__(self, sheets, external):
                
                self.sheets = sheets
                self.external = external

                # TODO choose quadratic over non??
                self.sizes = ['%dx%dpx' % (s.width, s.height) for s in sheets]
                self.indexSize = sum([s.width / 128 + s.height / 128 for s in sheets])

                # the total area used
                self.area = sum([s.area for s in sheets]) * 0.0001
                self.exArea = sum([s.area for s in external]) * 0.0001
                self.usedArea = sum([s.usedArea for s in sheets]) * 0.0001
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
                    return self.indexSize < other.indexSize

                else:
                    return False

            def __gt__(self, other):
                return not self < other

            def __repr__(self):
                return '<PackerScore %d sheets #%d (%s) Area: %d Used: %d (%2.f%%) External: %d Count: %d Value: %2.5f>' % (self.count, self.indexSize, ', '.join(self.sizes), self.area, self.usedArea, self.efficency, self.excount, self.count ** self.count, self.value)

        best = {
            'score': 0,
            'area': 10000000000000000000,
            'count': 10000000000000,
            'eff': 0
        }
        
        # Sort Functions
        def sortHeight(img):
            return (img.w, img.h)

        def sortWidth(img):
            return (img.h, img.w)

        def sortArea(img):
            return (img.w * img.h, img.w, img.h)

        sorts = [sortHeight, sortWidth, sortArea]

        # Determine minimum size for spritesheet generation
        # by averaging the widths and heights of all images
        # while taking the ones in the sorted middile higher into account
        # then the ones at the outer edges of the spectirum
        l = len(self.files)
        mw = [(l - abs(i - l / 2)) / l * v for i, v in enumerate(sorted([i.width for i in self.files]))]
        mh = [(l - abs(i - l / 2)) / l * v for i, v in enumerate(sorted([i.height for i in self.files]))]

        minWidth = math.pow(2, math.ceil(math.log(sum(mw) / l, 2)))
        minHeight = math.pow(2, math.ceil(math.log(sum(mh) / l, 2)))

        sizes = list(itertools.product([w for w in [128, 256, 512, 1024, 2048] if w >= minWidth],
                                       [h for h in [128, 256, 512, 1024, 2048] if h >= minHeight]))

        methods = list(itertools.product(sorts, sizes))

        logging.debug('Packing SpriteSheet Variants...')

        scores = []
        for sort, size in methods:

            # pack with current settings
            sh, ex, _ = self.pack(size[0], size[1], sort, silent=True)
            score = PackerScore(sh, ex)

            # Determine score, highest wins
            scores.append(score)

        scores.sort()

        logging.debug('\n Generated the following sheets:')
        for i in scores:
            logging.debug(' - ' + str(i))

        sheets, external = scores[0].data()
        return sheets, external, len(scores)


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

        return (sheets, extraBlocks, 0)


    def generate(self, pattern='sheet_%d.png', best=False, size=(1024, 1024), path=''):
        
        logging.info('\nGenerating sprite sheet variants:')
        sheets, tooBig, count = self.packBest() if best else self.pack()
        logging.info(' - Choosing best image from %d candidates...' % count)

        # Clean up
        i = 0
        while i < 100:

            name = pattern % i
            out = os.path.join(self.base, path, name)

            if os.path.exists(out):
                logging.debug('Removing old sprite sheet: %s' % out)
                os.unlink(out)

            i += 1


        # Write PNG files
        js = {}
        for i, sheet in enumerate(sheets):

            name = pattern % i
            out = os.path.join(self.base, path, name)

            logging.info(' - Creating image for sheet (%dx%dpx) with %d image(s) > %s' % (sheet.width, sheet.height, len(sheet), out))
            sheet.toImage(out, False)

            js[name] = sheet.toJSON()

        # Generate json
        script = os.path.join(self.base, path, 'jasysprite.json')

        logging.info(' - Generating json meta data > %s' % script)
        with open(script, 'wb') as f:
            f.write(json.dumps(js, sort_keys=True, indent=4).encode('ascii'))


        # Log about files which were to big
        logging.info('\nThe following images have not been added to the sheet:')
        for block in tooBig:
            logging.info(' - "%s" (%dx%dpx) into spritesheet, too big to be efficent' % (block.image.relPath, block.w, block.h))
            #js[block.image.relPath] = block.toJSON()



    def packDir(self, path='', recursive=True, pattern='sheet_%d.png', best=False, size=(1024, 1024)):

        logging.info('\nPacking sprites in: %s' % os.path.join(self.base, path))
        self.reset()
        self.addDir(path, recursive=recursive)
        logging.info('- Found %d images' % len(self.files))

        if len(self.files) > 0:
            self.generate(pattern, best, size, path=path)

