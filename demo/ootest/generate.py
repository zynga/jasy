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

    # Clearing cache
    logging.info("Clearing cache...")
    session.clearCache()


@task
def build():
    # Setup session
    session = Session()
    session.activateField("debug")
    session.activateField("locale", ["en"])
    
    # Permutation independend config
    optimization = Optimization(["unused", "privates", "variables", "declarations", "blocks"])
    formatting = Format()

    # Store loader script
    loaderIncluded = session.writeLoader("loader.js", optimization, formatting)

    # Process every possible permutation
    permutations = session.getPermutations()
    for pos, permutation in enumerate(permutations):
        logging.info("Permutation %s/%s" % (pos+1, len(permutations)))

        # Get projects
        projects = session.getProjects(permutation)

        # Resolving dependencies
        resolver = Resolver(projects, permutation)
        resolver.addClassName("Class")
        resolver.excludeClasses(loaderIncluded)
        classes = resolver.getIncludedClasses()

        # Compressing classes
        translation = session.getTranslation(permutation.get("locale"))
        classes = Sorter(resolver, permutation).getSortedClasses()
        compressedCode = Combiner(classes).compress(permutation, translation, optimization, formatting)
        
        # Boot logic
        bootCode = ""

        # Write file
        writefile("oo-%s.js" % permutation.getChecksum(), compressedCode + bootCode)



#
# Execute Jasy
#

run()