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

# Variant data
session.addVariant("qx.debug", [ '"on"' ])
session.addVariant("qx.client", [ '"gecko"' ])
session.addVariant("qx.dynlocale", [ '"off"' ])
session.addVariant("qx.globalErrorHandling", [ '"off"' ])
session.addVariant("qx.version", ["1.0"])
session.addVariant("qx.theme", ['"apiviewer.Theme"'])

# Create optimizer for improved speed/compression
optimization = Optimization(["unused", "privates", "variables", "declarations", "blocks"])

# Process every possible permutation
try:
    for permutation in session.getPermutations():
        logging.info("PERMUTATION: %s" % permutation)
    
        # Resolving dependencies
        resolver = Resolver(session, permutation)
        resolver.addClassName("apiviewer.Application")
        resolver.addClassName("apiviewer.Theme")
        classes = resolver.getIncludedClasses()
    
        # Collect Resources
        resources = Resources(session, classes, permutation)
        resourceCode = resources.export()    

        # Sorting classes
        sorter = Sorter(classes, permutation)
        sortedClasses = sorter.getSortedClasses()
    
        # Compiling classes
        compressor = Compressor(sortedClasses, permutation, optimization)
        compressed = compressor.compress()

        # Combine result
        buildCode = resourceCode + compressed + "qx.core.Init.boot(apiviewer.Application);"

        # Create filename
        # Based on permutation.getKey(), optimization, modification date, etc.
        outfileName = "build.js"

        # Write file
        outfile = open(outfileName, mode="w", encoding="utf-8")
        outfile.write(buildCode)
        outfile.close()

except Exception as ex:
    logging.error(ex)
    

# Close session
session.close()
