#!/usr/bin/env python3

import os, sys

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, "lib"))
sys.path.insert(0, jasyroot)

import logging, unittest

loader = unittest.TestLoader()
res = loader.discover("test", pattern='*.py')

logging.getLogger().setLevel(logging.ERROR)

unittest.TextTestRunner(verbosity=0).run(res)
