#!/usr/bin/env python

import re, sys, os

# Extend PYTHONPATH with 'lib'
sys.path.insert(0, os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(sys.argv[0])), os.pardir, "lib")))

from narcissus.Tokenizer import Tokenizer
from narcissus.Statements import Script, CompilerContext
import narcissus.Compressor as Compressor


def parse(source, filename=None):
    tokenizer = Tokenizer(source, filename)
    root = Script(tokenizer, CompilerContext(False))
    
    if not tokenizer.done:
        raise tokenizer.newSyntaxError("Syntax error")
        
        
        
    #print root.toJson()
    print Compressor.compress(root)
        
    return root


if __name__ == "__main__":
    parse(file(sys.argv[1]).read(),sys.argv[1])
