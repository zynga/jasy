#!/usr/bin/env python3

# Extend PYTHONPATH with 'lib'
import sys, os
sys.path.insert(0, os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(sys.argv[0])), os.pardir, "lib")))

# Import JavaScript tooling
from js import *

# Application specific code
session = Session()
session.addProject(Project("../../qooxdoo/qooxdoo/framework"))
session.addProject(Project("../../qooxdoo/qooxdoo/component/apiviewer"))
session.addProject(Project("../../unify/framework"))

# Locale data
session.addLocale("en_US")

# Resolve Classes
resolver = Resolver(session)
resolver.addClassName("apiviewer.Application")
resolver.addClassName("apiviewer.Theme")

# Collect Resources
resources = Resources(session, resolver.getIncludedClasses())
resourceCode = resources.export()

# Generate Loader
loader = Loader(Sorter(resolver).getSortedClasses())
loaderCode = loader.generate("qx.core.Init.boot(apiviewer.Application)")

# Write file
outfile = open("source.js", mode="w", encoding="utf-8")
outfile.write(resourceCode + loaderCode)
outfile.close()

# Close session
session.close()
