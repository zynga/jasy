#
# Jasy - JavaScript Tooling Refined
# Copyright 2010 Sebastian Werner
#

#
# Configure logging
#

import logging

logging.basicConfig(filename="log.txt", level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Define a Handler which writes INFO messages or higher to the sys.stderr
console = logging.StreamHandler()
console.setLevel(logging.INFO)
console.setFormatter(logging.Formatter('>>> %(message)s', '%H:%M:%S'))
logging.getLogger('').addHandler(console)



#
# Import core classes
#

from jasy.Session import *
from jasy.Project import *
from jasy.Resolver import *
from jasy.Sorter import *
from jasy.Combiner import *
from jasy.Resources import * 
from jasy.Optimization import *
from jasy.Format import *
from jasy.File import *
from jasy.Task import *
