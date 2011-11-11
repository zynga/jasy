#!/usr/bin/env python3

import sys, os
from distutils.core import setup

# Extend PYTHONPATH with local 'lib' folder
jasyroot = os.path.normpath(os.path.join(os.path.abspath(sys.argv[0]), os.pardir, "lib"))
sys.path.insert(0, jasyroot)

import jasy

major, minor = sys.version_info[:2]

if major < 3:
    raise Exception("Jasy requires Python 3")

setup(
      name = 'jasy',
      version = jasy.VERSION,
      
      author = 'Sebastian Werner',
      author_email = 'info@sebastian-werner.net',
      
      url = 'http://github.com/wpbasti/jasy',
      download_url = "http://github.com/downloads/wpbasti/jasy/jasy-%s.tar.gz" % jasy.VERSION,
      
      license = "http://www.apache.org/licenses/LICENSE-2.0",
      
      description = "Jasy is a build system for JavaScript focused web projects.",
      long_description = "",

      packages = [
        'jasy',
        'jasy.core',
        'jasy.ext',
        'jasy.optimizer',
        'jasy.parser',
        'jasy.process',
        'jasy.tokenizer'
      ],
      
      package_dir = {
        '': 'lib'
      },
      
      package_data = {
        'jasy': [
          'data/cldr/VERSION', 
          'data/cldr/keys/*.xml', 
          'data/cldr/main/*.xml', 
          'data/cldr/supplemental/*.xml'
        ]
      },
      
      scripts = [
        "bin/jasy", 
        "bin/jscompress", 
        "bin/jsdeps", 
        "bin/jsmeta", 
        "bin/jsoptimize", 
        "bin/jstree"
      ],
      
      data_files = [
        ("doc", [
          "readme.md", 
          "license.md"
        ])
      ]
)
