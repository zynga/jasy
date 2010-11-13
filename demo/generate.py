#!/usr/bin/env python3

# Extend PYTHONPATH with 'lib'
import sys, os
sys.path.insert(0, os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(sys.argv[0])), os.pardir, "lib")))

# Import JavaScript tooling
from jasy import *

#
# Config
#

session = Session()

session.addProject(Project("../../qooxdoo/qooxdoo/framework"))
session.addProject(Project("../../qooxdoo/qooxdoo/component/apiviewer"))
session.addProject(Project("../../unify/framework"))



#
# Tasks
#

@task
def clear():
    logging.info("Clearing cache...")
    session.clearCache()


@task
def source():
    # Locales
    session.addLocale("en_US")

    # Resolve Classes
    resolver = Resolver(session)
    resolver.addClassName("apiviewer.Application")
    resolver.addClassName("apiviewer.Theme")

    # Collect Resources
    resources = Resources(session, resolver.getIncludedClasses())
    resourceCode = resources.exportInfo()

    # Generate Loader
    loader = Loader(Sorter(resolver).getSortedClasses())
    loaderCode = loader.generate("qx.core.Init.boot(apiviewer.Application)")

    # Write file
    outfile = open("source/script/apiviewer.js", mode="w", encoding="utf-8")
    outfile.write(resourceCode + loaderCode)
    outfile.close()


@task
def build():
    # Locales
    session.addLocale("en_US")

    # Values
    session.addVariant("qx.debug", [ '"on"' ])
    session.addVariant("qx.client", [ '"gecko"' ])
    session.addVariant("qx.dynlocale", [ '"off"' ])
    session.addVariant("qx.globalErrorHandling", [ '"off"' ])
    session.addVariant("qx.version", ["1.0"])
    session.addVariant("qx.theme", ['"apiviewer.Theme"'])

    # Create optimizer for improved speed/compression
    optimization = Optimization(["unused", "privates", "variables", "declarations", "blocks"])
    
    # Process every possible permutation
    for permutation in session.getPermutations():
        logging.info("PERMUTATION: %s" % permutation)
        
        # Build file header
        headerCode = ""
        headerCode += "/*\n"
        headerCode += " * Copyright 2010\n"
        headerCode += " *\n"
        headerCode += " * Permutation: %s\n" % permutation
        headerCode += " * Optimizations: %s\n" % optimization
        headerCode += " */\n\n"
        
        # Boot
        bootCode = "qx.core.Init.boot(apiviewer.Application);"
    
        # Resolving dependencies
        resolver = Resolver(session, permutation)
        resolver.addClassName("apiviewer.Application")
        resolver.addClassName("apiviewer.Theme")
        classes = resolver.getIncludedClasses()

        # Collecting Resources
        resources = Resources(session, classes, permutation)
        resources.publishFiles("build/resource")
        resources.publishManifest("build/manifest", "resource")
        resourceCode = resources.exportInfo(root="resource")

        # Compiling classes
        sorter = Sorter(resolver, permutation)
        compressedCode = Combiner(permutation, optimization).compress(sorter.getSortedClasses(), format=False)

        # TODO
        # Create filenames
        # Based on permutation.getKey(), optimization, modification date, etc.

        # Write files
        compressedName = "build/script/apiviewer.js"
        compressedFile = open(compressedName, mode="w", encoding="utf-8")
        compressedFile.write(headerCode + resourceCode + compressedCode + bootCode)
        compressedFile.close()


#
# Execute Jasy
#

run()