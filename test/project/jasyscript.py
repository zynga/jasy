# Core - JavaScript Foundation
# Copyright 2010-2012 Zynga Inc.

session.permutateField("es5")
session.permutateField("debug")

@task
def hello():
    core.hello()


@task
def fun():
    core.dosome()


@task
def clean():
    """Clear build cache"""

    session.clean()


@task
def distclean():
    """Clears caches and build results"""

    session.clean()

    removeDir("api")
    removeDir("dist")

    #if os.path.exists(".git"):
    #    session.pause()
    #    git clean -n -d -x
    #    session.resume()


@task(prefix="dist")
def module():
    """Build module.js"""

    for permutation in session.permutate():
        resolver = Resolver().addClassName("core.Module")
        storeCompressed(resolver.getSortedClasses(), "module-%s.js" % permutation.getChecksum())


@task(prefix="dist")
def oo():
    """Build oo.js"""

    for permutation in session.permutate():
        resolver = Resolver().addClassName("core.Module").addClassName("core.Class")
        storeCompressed(resolver.getSortedClasses(), "oo-%s.js" % permutation.getChecksum())
        
        
@task(prefix="dist")
def sugar():
    """Build sugar.js"""

    for permutation in session.permutate():
        resolver = Resolver()
        resolver.addClassName("ext.sugar.Array")
        resolver.addClassName("ext.sugar.Function")
        resolver.addClassName("ext.sugar.Number")
        resolver.addClassName("ext.sugar.Object")
        resolver.addClassName("ext.sugar.String")

        storeCompressed(resolver.getSortedClasses(), "sugar-%s.js" % permutation.getChecksum())

                