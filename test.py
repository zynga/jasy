#!/usr/bin/env python3

#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Sebastian Werner
#

import logging, unittest, pkg_resources

loader = unittest.TestLoader()
res = loader.discover("jasy/test", pattern='*.py')

logging.getLogger().setLevel(logging.ERROR)

unittest.TextTestRunner(verbosity=1).run(res)
