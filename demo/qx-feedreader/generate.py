#!/usr/bin/env python3

# Extend PYTHONPATH with 'lib'
import sys, os
sys.path.insert(0, os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(sys.argv[0])), os.pardir, os.pardir, "lib")))

# Import JavaScript tooling
from jasy import *

#
# Config
#

session = Session()

session.addProject(Project("../../../qooxdoo/qooxdoo/framework"))
session.addProject(Project("../../../qooxdoo/qooxdoo/application/feedreader"))



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
    resolver.addClassName("feedreader.Application")
    resolver.addClassName("feedreader.Theme")

    # Collect Resources
    resources = Resources(session, resolver.getIncludedClasses())
    resourceCode = resources.exportInfo(prefixRoots="../")

    # Generate Loader
    loader = Loader(Sorter(resolver).getSortedClasses(), "../")
    loaderCode = loader.generate("qx.core.Init.boot(feedreader.Application)")

    # Write file
    writefile("source/script/feedreader.js", resourceCode + loaderCode)


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
    session.addVariant("qx.theme", ['"qx.theme.Modern"'])

    # Create optimizer for improved speed/compression
    optimization = Optimization(["unused", "privates", "variables", "declarations", "blocks"])
    
    translation = Translation("de_DE")
    localization = Localization("de_DE")
    
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
        bootCode = "qx.core.Init.boot(feedreader.Application);"
    
        # Resolving dependencies
        resolver = Resolver(session, permutation)
        resolver.addClassName("feedreader.Application")
        resolver.addClassName("qx.theme.Modern")
        classes = resolver.getIncludedClasses()

        # Collecting Resources
        resources = Resources(session, classes, permutation)
        resources.publishFiles("build/resource")
        resources.publishManifest("build/manifest", "resource")
        resourceCode = resources.exportInfo(replaceRoots="resource")

        # Compiling classes
        sorter = Sorter(resolver, permutation)
        compressedCode = Combiner(permutation, optimization, translation, localization).compress(sorter.getSortedClasses(), format=False)

        # TODO
        # Create filenames
        # Based on permutation.getKey(), optimization, modification date, etc.

        # Write file
        writefile("build/script/feedreader.js", headerCode + resourceCode + compressedCode + bootCode)



#
# Execute Jasy
#

run()