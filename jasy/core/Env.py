#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import logging, os

# Include the Jasy public API
import jasy

# Print out some info
logging.info("Jasy %s" % jasy.__version__)
logging.debug("Jasy Path: %s" % os.path.dirname(os.path.abspath(jasy.__file__)))

from jasy.core.Session import Session

session = Session()

# Task API for user scripts
from jasy.core.Task import *
from jasy.asset.Asset import * 

# Resolving/Sorting classes
from jasy.js.Resolver import Resolver
from jasy.js.Sorter import Sorter

# API Writer
from jasy.js.api.Writer import ApiWriter

# Output options
from jasy.js.output.Optimization import Optimization
from jasy.js.output.Formatting import Formatting

formatting = Formatting()
optimization = Optimization("variables", "declarations", "blocks", "privates")

# Import file operation goodies
from jasy.util.File import *

# Import combiner script for merging/write js output
from jasy.js.output.Combiner import *

