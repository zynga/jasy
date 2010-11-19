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

session.addProject(Project("../../boot"))
session.addProject(Project("../../../qooxdoo/qooxdoo/framework"))
session.addProject(Project("../../../qooxdoo/qooxdoo/application/feedreader"))



#
# Tasks
#

@task
def locales():
    print("Pre-processing locales")
    
    import jasy.core.LocaleData as loc
    
    loc.getMain("de_DE")


@task
def clear():
    logging.info("Clearing cache...")
    session.clearCache()


@task
def source():
    # Locales
    session.addLocale("de_DE")
    session.addLocale("en_US")

    # Resolve Classes
    resolver = Resolver(session)
    resolver.addClassName("feedreader.Application")
    resolver.addClassName("qx.theme.Modern")

    # Collect Resources
    resources = Resources(session, resolver.getIncludedClasses())
    resourceCode = resources.exportInfo(prefixRoots="../")

    # Generate Loader
    loader = Loader(Sorter(resolver).getSortedClasses(), "../")
    loaderCode = loader.generate("qx.core.Init.boot(feedreader.Application)")

    # Write file
    for locale in session.getLocales():
        # TODO
        localeCode = ""
        writefile("source/script/feedreader-%s.js" % locale, localeCode + resourceCode + loaderCode)


@task
def build():
    # Values
    session.addVariant("qx.debug", [ '"on"' ])
    session.addVariant("qx.client", [ '"gecko"' ])
    session.addVariant("qx.dynlocale", [ '"off"' ])
    session.addVariant("qx.globalErrorHandling", [ '"off"' ])
    session.addVariant("qx.version", ["1.0"])
    session.addVariant("qx.theme", ['"qx.theme.Modern"'])

    # Locales
    session.addLocale("de_DE")
    session.addLocale("en_US")

    # Create optimizer for improved speed/compression
    optimization = Optimization(["unused", "privates", "variables", "declarations", "blocks"])

    # Process every possible permutation/locale
    for permutation in session.getPermutations():
        for locale in session.getLocales():
            print("------------------------------------------------------------------------------")

            # Build file header
            headerCode = ""
            headerCode += "/*\n"
            headerCode += " * Copyright 2010\n"
            headerCode += " *\n"
            headerCode += " * Permutation: %s\n" % permutation
            headerCode += " * Locale: %s\n" % locale
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

            # Prepare localization support
            translation = session.getTranslation(locale)
            localization = session.getLocalization(locale)
            
            # Compiling classes
            sorter = Sorter(resolver, permutation)
            compressedCode = Combiner(permutation, optimization, translation, localization).compress(sorter.getSortedClasses(), format=False)

            # TODO: Create filenames
            # Based on permutation.getKey(), optimization, locale, modification date, etc.

            # Write file
            writefile("build/script/feedreader-%s.js" % locale, headerCode + resourceCode + compressedCode + bootCode)



#
# Execute Jasy
#

run()