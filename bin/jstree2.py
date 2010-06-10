#!/usr/bin/env python

# Extend PYTHONPATH with 'lib'
import sys, os
sys.path.insert(0, os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(sys.argv[0])), os.pardir, "lib")))


__author__ = "JT Olds"
__author_email__ = "jtolds@xnet5.com"
__date__ = "2009-03-24"
__all__ = ["ParseError", "parse", "tokens"]

import re, sys, types
from narcissus.Tokenizer import Tokenizer
from narcissus.Statements import Script, CompilerContext


def parse(source, filename=None):
    """Parse some Javascript

    Args:
        source: the Javascript source, as a string
        filename: the filename to include in messages
    Returns:
        the parsed source code data structure
    Raises:
        ParseError
    """
    tokenizer = Tokenizer(source, filename)
    context = CompilerContext(False)
    node = Script(tokenizer, context)
    
    if not tokenizer.done:
        raise tokenizer.newSyntaxError("Syntax error")
        
    return node


if __name__ == "__main__":
    print parse(file(sys.argv[1]).read(),sys.argv[1]).toJson()
