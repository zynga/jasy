#!/usr/bin/env python3

#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import sys

if sys.version < "3.2":
  print("Jasy requires Python 3.2 or higher")
  sys.exit(1)

# Prefer setuptools (aka distribute) over distutils 
# - Distutils comes with Python3 but is not capable of installing requires, extras, etc.
# - Distribute is a fork of the Setuptools project (http://packages.python.org/distribute/)
try:
  from setuptools import setup
  uses = "distribute"
except ImportError:
  print("Jasy prefers distribute over distutils for installing dependencies!")
  from distutils.core import setup
  uses = "distutils"


print(sys.argv[1])


if uses == "distribute":

  extra = {

    "test_suite" : "jasy.test",

    "install_requires" : [ 
      "distribute",
      "Pygments>=1.5", 
      "polib>=1.0", 
      "requests>=0.13", 
      "CherryPy>=3.2", 
      "PyYAML>=3" 
    ],

    "extras_require" : {
      "jsdoc" : ["misaka"],
      "daemon" : ["watchdog"],
      "sprites" : ["pil"]
    },

    "dependency_links" : [
      "https://github.com/sloonz/pil-py3k",
      "https://github.com/wpbasti/watchdog"
    ],

    "include_package_data" : True,

    "package_data" : {
      'jasy': [
        'data/cldr/VERSION', 
        'data/cldr/keys/*.xml', 
        'data/cldr/main/*.xml', 
        'data/cldr/supplemental/*.xml'
      ]
    },    

  }


else:

  extra = {

    "package_data" : {
      'jasy': [
        'data/cldr/VERSION', 
        'data/cldr/keys/*.xml', 
        'data/cldr/main/*.xml', 
        'data/cldr/supplemental/*.xml'
      ]
    },

    "data_files" : [
      ("jasy", [
        "changelog.md",
        "license.md",
        "readme.md",
        "requirements.txt"
       ]
      )
    ]

  }


# Integrate batch script for win32 only
extra["scripts"] = [ "bin/jasy", "bin/jasy-test",  "bin/jasy-util" ]
if sys.platform == "win32":
  extra["scripts"] += [ "bin/jasy.bat", "bin/jasy-test.bat", "bin/jasy-util.bat" ]

# Import Jasy for version info etc.
import jasy

# Run setup
setup(
  name = 'jasy',
  version = jasy.__version__,

  author = 'Zynga Inc.',
  author_email = 'germany@zynga.com',

  maintainer = 'Zynga Inc.',
  maintainer_email = 'germany@zynga.com',

  url = 'http://github.com/zynga/jasy',
  download_url = "http://pypi.python.org/packages/source/j/jasy/jasy-%s.zip" % jasy.__version__,

  license = "MIT",
  platforms = 'any',

  description = "Web Tooling Framework",
  long_description = """Jasy is a powerful Python3-based tooling framework. It makes it 
                        easy to manage heavy web projects. Its main goal is to offer 
                        an API which could be used by developers to write their custom 
                        build/deployment scripts.""",

  # Via: http://pypi.python.org/pypi?%3Aaction=list_classifiers
  classifiers = [

    'Development Status :: 5 - Production/Stable',
    'Environment :: Console',
    'Intended Audience :: Developers',
    'License :: OSI Approved :: MIT License',
    'License :: Freely Distributable',
    'Operating System :: OS Independent',
    'Programming Language :: Python',
    'Programming Language :: Python :: 3',
    'Programming Language :: Python :: 3.2',
    'Programming Language :: Python :: 3.3',
    'Topic :: Documentation',
    'Topic :: Software Development :: Build Tools',
    'Topic :: Software Development :: Compilers',
    'Topic :: Software Development :: Code Generators',
    'Topic :: Software Development :: Internationalization',
    'Topic :: Software Development :: Libraries :: Python Modules',
    'Topic :: Software Development :: Localization',
    'Topic :: Software Development :: Testing',
    'Topic :: Internet :: WWW/HTTP :: HTTP Servers',

  ],

  packages = [
    'jasy',
    'jasy.asset',
    'jasy.asset.sprite',
    'jasy.core',
    'jasy.env',
    'jasy.i18n',
    'jasy.js',
    'jasy.js.api',
    'jasy.js.clean',
    'jasy.js.optimize',
    'jasy.js.output',
    'jasy.js.parse',
    'jasy.js.tokenize',
    'jasy.js.util',
    'jasy.test',
    'jasy.server'
  ],

  **extra
)
