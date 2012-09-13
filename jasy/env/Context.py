#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

"""Global environment which is used by jasyscript.py files"""

# Modules
import jasy.core.Console as Console

# Classes
from jasy.asset.SpritePacker import SpritePacker
from jasy.js.Resolver import Resolver
from jasy.js.api.Writer import ApiWriter
from jasy.env.Config import Config

# Commands
# TODO: Move them into modules
from jasy.env.Task import task, executeTask, runTask
from jasy.env.File import *
from jasy.http.Server import serve
from jasy.core.Util import executeCommand
from jasy.env.JavaScript import *

from jasy.vcs.Git import cleanGitRepository, distcleanGitRepository

# from jasy.js.output.Optimization import Optimization
# from jasy.js.output.Formatting import Formatting
# 
# jsFormatting = Formatting()
# jsOptimization = Optimization("variables", "declarations", "blocks", "privates")
# 
# # Unimport classes
# del Formatting
# del Optimization

