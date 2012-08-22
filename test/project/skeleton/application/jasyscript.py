#
# This is the jasyscript.py of $${name} file. 
# This file defines tasks for the Jasy build tool we use for development and deployment of $${name}.
#

@task
def user():
    print("User: %s @ %s" % (config.get("user.name"), config.get("user.age")))


@task
def clean():
    """Clear build cache"""
    
    session.clean()


@task
def distclean():
    """Clear caches and build results"""
    
    session.clean()

    removeDir("build")
    removeDir("external")
    removeDir("source/script")


@task
def api():
    """Build API viewer"""
    
    runTask("apibrowser", "build")
    ApiWriter().write("data")
    
    
@task
def server():
    """Start HTTP server"""
    
    serve()


@task
def build():
    """Build self-contained deploy ready version"""
    
    # Configure permutations
    session.permutateField("es5")
    session.permutateField("debug")

    # Configure assets for being loaded from local asset folder
    assetManager.deploy(Resolver().addClassName("$${name}.Main").getIncludedClasses())
    assetManager.addBuildProfile()
    
    # Write kernel script
    includedByKernel = storeKernel("script/kernel.js")

    # Copy files from source
    updateFile("source/index.html", "index.html")
    
    # Process every possible permutation
    for permutation in session.permutate():
        
        # Resolving dependencies
        resolver = Resolver().addClassName("$${name}.Main").excludeClasses(includedByKernel)

        # Compressing classes
        storeCompressed(resolver.getSortedClasses(), "script/$${name}-%s.js" % permutation.getChecksum(), "new $${name}.Main;")


@task
def source():
    """Generate source version for development"""

    # Configure permutations
    session.permutateField("es5")
    session.setField("debug", True)

    # Configure assets for being loaded from source folders
    assetManager.addSourceProfile()

    # Write kernel script
    includedByKernel = storeKernel("script/kernel.js", debug=True)

    # Process every possible permutation
    for permutation in session.permutate():

        # Resolving dependencies
        resolver = Resolver().addClassName("$${name}.Main").excludeClasses(includedByKernel)

        # Building class loader
        storeLoader(resolver.getSortedClasses(), "script/$${name}-%s.js" % permutation.getChecksum(), "new $${name}.Main;")

