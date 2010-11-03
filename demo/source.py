#!/usr/bin/env python3

# Extend PYTHONPATH with 'lib'
import sys, os
sys.path.insert(0, os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(sys.argv[0])), os.pardir, "lib")))

# Import JavaScript tooling
from js import *
import logging

# Application specific code
session = Session()
session.addProject(Project("../../qooxdoo/qooxdoo/framework"))
session.addProject(Project("../../qooxdoo/qooxdoo/component/apiviewer"))
session.addProject(Project("../../unify/framework"))

# Locale data
session.addLocale("en_US")
#session.addLocale("de_DE")

# Boot Initializer
boot = "qx.core.Init.boot(apiviewer.Application);"

# Generate Source
resolver = Resolver(session)
resolver.addClassName("apiviewer.Application")
resolver.addClassName("apiviewer.Theme")
sorter = Sorter(resolver.getIncludedClasses())
loader = Loader(sorter.getSortedClasses())
loader.generate("source.js", boot)

# Info
logging.info("Runtime: %ims" % ((time.time()-start)*1000))

# Close session
session.close()
