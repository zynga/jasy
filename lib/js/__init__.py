#
# JavaScript Tools - Main
# Copyright 2010 Sebastian Werner
#

from js.Project import manifest as jsmanifest
from js.Parser import parse as jsparse
from js.Dependencies import deps as jsdeps
from js.Compressor import compress as jscompress

from js.optimizer import CombineDeclarations
from js.optimizer import LocalVariables
from js.optimizer import Variants
