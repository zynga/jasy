#!/usr/bin/env python3

import logging, unittest

import api, blockreduce, combinedecl, comments, compressor, inject, localvariables, meta, privates, translation, unused

classes = [
    api.Tests, 
    blockreduce.Tests, 
    combinedecl.Tests, 
    comments.Tests, 
    compressor.Tests, 
    inject.Tests, 
    localvariables.Tests, 
    meta.Tests, 
    privates.Tests, 
    translation.Tests, 
    unused.Tests
]

logging.getLogger().setLevel(logging.ERROR)

for testClass in classes:
    suite = unittest.TestLoader().loadTestsFromTestCase(testClass)
    unittest.TextTestRunner(verbosity=1).run(suite)
    

