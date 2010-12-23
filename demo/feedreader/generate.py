#!/usr/bin/env python3

# Extend PYTHONPATH with 'lib'
import sys, os
sys.path.insert(0, os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(sys.argv[0])), os.pardir, os.pardir, "lib")))

# Import JavaScript tooling
from jasy import *



#
# Tasks
#

@task
def clear():
    # Setup session
    session = Session()
    session.addProject(Project("../../data/jscore"))
    session.addProject(Project("../../../qooxdoo/qooxdoo/framework"))
    session.addProject(Project("../../../qooxdoo/qooxdoo/application/feedreader"))

    # Clearing cache
    logging.info("Clearing cache...")
    session.clearCache()


@task
def source():
    # Setup session
    session = Session()
    session.addProject(Project("../../data/jscore"))
    session.addProject(Project("../../../qooxdoo/qooxdoo/framework"))
    session.addProject(Project("../../../qooxdoo/qooxdoo/application/feedreader"))
    
    # Setup locales
    session.addLocale("de_DE")
    session.addLocale("en_US")
    session.addLocale("ro_RO")

    # Process every possible permutation
    for permutation in session.getPermutations():
        print("------------------------------------------------------------------------------")
        
        # Get projects
        projects = session.getProjects(permutation)
        
        # Resolve Classes
        resolver = Resolver(projects)
        resolver.addClassName("feedreader.Application")
        resolver.addClassName("qx.theme.Modern")

        # Collect Resources
        resources = Resources(session, resolver.getIncludedClasses())
        resourceCode = resources.exportInfo(prefixRoots="../")

        # Generate Loader
        loader = Loader(Sorter(resolver).getSortedClasses(), "../")
        loaderCode = loader.generate("qx.core.Init.boot(feedreader.Application)")
        
        # Prepare translation
        translation = session.getTranslation(permutation.get("locale"))
        translationCode = translation.generate()

        # Finally write file
        writefile("source/script/feedreader-%s.js" % permutation.get("locale"), translationCode + resourceCode + loaderCode)


@task
def build():
    # Setup session
    session = Session()
    session.addProject(Project("../../data/jscore"))
    session.addProject(Project("../../../qooxdoo/qooxdoo/framework"))
    session.addProject(Project("../../../qooxdoo/qooxdoo/application/feedreader"))
    
    # Values
    session.addValue("qx.debug", [ '"on"' ])
    session.addValue("qx.client", [ '"gecko"' ])
    session.addValue("qx.globalErrorHandling", [ '"off"' ])
    session.addValue("qx.version", ["1.0"])
    session.addValue("qx.theme", ['"qx.theme.Modern"'])

    # Setup locales
    session.addLocale("de_DE")
    session.addLocale("en_US")

    # Permutation independend config
    optimization = Optimization(["unused", "privates", "variables", "declarations", "blocks"])
    formatting = Format()

    # Process every possible permutation
    for permutation in session.getPermutations():
        print("------------------------------------------------------------------------------")

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
        
        # Get projects
        projects = session.getProjects(permutation)

        # Resolving dependencies
        resolver = Resolver(projects, permutation)
        resolver.addClassName("feedreader.Application")
        resolver.addClassName("qx.theme.Modern")
        classes = resolver.getIncludedClasses()

        # Collecting Resources
        resources = Resources(session, classes, permutation)
        resources.publishFiles("build/resource")
        resources.publishManifest("build/manifest", "resource")
        resourceCode = resources.exportInfo(replaceRoots="resource")

        # Preparation
        translation = session.getTranslation(permutation.get("locale"))
        combiner = Combiner(permutation, translation, optimization, formatting)
        sorter = Sorter(resolver, permutation)
        
        # Compressing classes
        compressedCode = combiner.compress(sorter.getSortedClasses())

        # Write file
        # TODO: Create filenames
        # Based on permutation.getKey(), optimization, modification date, etc.
        writefile("build/script/feedreader-%s.js" % permutation.get("locale"), headerCode + resourceCode + compressedCode + bootCode)


    # Copy HTML file from source
    updatefile("source/build.html", "build/index.html")



#
# Execute Jasy
#

run()