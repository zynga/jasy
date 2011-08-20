@task
def clear():
    # Setup session
    session = Session()

    # Clearing cache
    logging.info("Clearing cache...")
    session.clearCache()



@task("Simple Test")
def simple():
    # Setup session
    session = Session()
    session.addProject(Project("."))

    # Collecting projects
    resolver = Resolver(session.getProjects())
    resolver.addClassName("ootest.Test")
    
    # Resolving classes
    classes = Sorter(resolver).getSortedClasses()
    
    # Compressing classes
    compressedCode = Combiner(classes).getCompressedCode()
    
    # Writing files
    writefile("build/simple.js", compressedCode)



@task("Full Test")
def build():
    # Setup session
    session = Session()
    session.addProject(Project("."))
    session.permutateField("debug")
    session.permutateField("es5")
    session.permutateField("engine")
    session.permutateField("locale", ["en"])
    
    # Permutation independend config
    optimization = Optimization("unused", "privates", "variables", "declarations", "blocks")
    formatting = Format("semicolon", "comma")

    # Store loader script
    loaderIncluded = session.writeLoader("build/loader.js", optimization, formatting)
    
    # Copy HTML file from source
    updatefile("index.html", "build/index.html")

    # Process every possible permutation
    permutations = session.getPermutations()
    for pos, permutation in enumerate(permutations):
        logging.info("Permutation %s/%s" % (pos+1, len(permutations)))

        # Get projects
        projects = session.getProjects(permutation)

        # Resolving dependencies
        resolver = Resolver(projects, permutation)
        resolver.addClassName("ootest.Test")
        resolver.excludeClasses(loaderIncluded)
        classes = resolver.getIncludedClasses()

        # Compressing classes
        translation = session.getTranslation(permutation.get("locale"))
        classes = Sorter(resolver, permutation).getSortedClasses()
        compressedCode = Combiner(classes).getCompressedCode(permutation, translation, optimization, formatting)
        
        # Boot logic
        bootCode = ""

        # Write file
        writefile("build/oo-%s.js" % permutation.getChecksum(), compressedCode + bootCode)
