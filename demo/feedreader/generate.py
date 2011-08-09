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
    session.addProject(Project("../../../qooxdoo/qooxdoo/framework"))
    session.addProject(Project("../../../qooxdoo/qooxdoo/application/feedreader"))

    # Clearing cache
    logging.info("Clearing cache...")
    session.clearCache()


@task
def source():
    # Setup session
    session = Session()
    session.addProject(Project("../../../qooxdoo/qooxdoo/framework"))
    session.addProject(Project("../../../qooxdoo/qooxdoo/application/feedreader"))
    
    # Setup values
    session.addValue("jasy.locale", ["en","de","ro"], "jasy.detect.Param")
    session.addValue("qx.client", ["gecko","webkit"])
    
    # Store loader script
    loaderIncluded = session.writeLoader("source/script/feedreader.js")
    
    # Process every possible permutation
    permutations = session.getPermutations()
    for pos, permutation in enumerate(permutations):
        logging.info("Permutation %s/%s" % (pos+1, len(permutations)))
        
        # Get projects
        projects = session.getProjects(permutation)
        
        # Resolve Classes
        resolver = Resolver(projects)
        resolver.addClassName("feedreader.Application")
        resolver.addClassName("qx.theme.Modern")
        resolver.excludeClasses(loaderIncluded)
        
        # Collect Asset
        resources = Asset(session, resolver.getIncludedClasses())
        resourceCode = resources.exportInfo(prefixRoots="../")
        
        # Generate Loader
        classes = Sorter(resolver).getSortedClasses()
        loaderCode = Combiner(classes).getLoaderCode("qx.core.Init.boot(feedreader.Application)", "../")
        
        # Prepare translation
        translationCode = session.getTranslation(permutation.get("jasy.locale")).generate()
        
        # Write file
        writefile("source/script/feedreader-%s.js" % permutation.getChecksum(), translationCode + resourceCode + loaderCode)


@task
def build():
    # Setup session
    session = Session()
    session.addProject(Project("../../../qooxdoo/qooxdoo/framework"))
    session.addProject(Project("../../../qooxdoo/qooxdoo/application/feedreader"))
    
    # Values
    session.addValue("jasy.locale", ["de","en","ro"], "jasy.detect.Param")
    session.addValue("qx.debug", ["on"])
    session.addValue("qx.client", ["gecko","webkit"])
    session.addValue("feature.appcache", [True,False])
    session.addValue("feature.worker", [True,False])
    session.addValue("feature.xhr", [True,False])
    session.addValue("feature.storage", [True,False])
    #session.addValue("feature.gl", [True,False])
    #session.addValue("feature.message", [True,False])
    #session.addValue("feature.db", [True,False])
    #session.addValue("feature.json", [True,False])
    #session.addValue("feature.socket", [True,False])

    # Permutation independend config
    optimization = Optimization(["unused", "privates", "variables", "declarations", "blocks"])
    formatting = Format()

    # Store loader script
    loaderIncluded = session.writeLoader("build/script/feedreader.js", optimization, formatting)

    # Copy HTML file from source
    updatefile("source/index.html", "build/index.html")

    # Collecting Asset
    resolver = Resolver(session.getProjects())
    resolver.addClassName("feedreader.Application")
    resolver.addClassName("qx.theme.Modern")
    resources = Asset(session, resolver.getIncludedClasses())
    resources.publishFiles("build/resource")
    resources.publishManifest("build/feedreader.appcache", "resource")
    resourceCode = resources.exportInfo(replaceRoots="resource")

    # Process every possible permutation
    permutations = session.getPermutations()
    for pos, permutation in enumerate(permutations):
        logging.info("Permutation %s/%s" % (pos+1, len(permutations)))

        # Get projects
        projects = session.getProjects(permutation)

        # Resolving dependencies
        resolver = Resolver(projects, permutation)
        resolver.addClassName("feedreader.Application")
        resolver.addClassName("qx.theme.Modern")
        resolver.excludeClasses(loaderIncluded)
        classes = resolver.getIncludedClasses()

        # Compressing classes
        translation = session.getTranslation(permutation.get("jasy.locale"))
        classes = Sorter(resolver, permutation).getSortedClasses()
        compressedCode = Combiner(classes).getCompressedCode(permutation, translation, optimization, formatting)
        
        # Boot logic
        bootCode = "qx.core.Init.boot(feedreader.Application)"

        # Write file
        writefile("build/script/feedreader-%s.js" % permutation.getChecksum(), resourceCode + compressedCode + bootCode)



#
# Execute Jasy
#

run()