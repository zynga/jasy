#
# JavaScript Tools - Main
# Copyright 2010 Sebastian Werner
#

from js.Project import project as jsproject
from js.Parser import parse as jsparse
from js.Dependencies import deps as jsdeps
from js.Compressor import compress as jscompress

from js.optimizer import CombineDeclarations
from js.optimizer import LocalVariables
from js.optimizer import Variants



def jsresolve(className, classes, result):
    print "  - Add %s" % className
    result.add(className)
    
    filePath = classes[className]

    fileContent = open(filePath).read()
    fileTree = jsparse(fileContent, filePath)

    depGlobals, depClassNames = jsdeps(fileTree)
    
    for depClassName in depClassNames:
        if not depClassName in classes:
            # print "  - Unknown: %s" % depClassName
            pass
        
        elif not depClassName in result:
            jsresolve(depClassName, classes, result)