#!/usr/bin/env python3

#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import sys, os, pkg_resources

major, minor = sys.version_info[:2]

if major < 3:
    print("Jasy requires Python 3")
    sys.exit(1)

# Load distutils and switch to distribute afterwards
from distutils.core import setup

# Import Jasy for version info etc.
import jasy

requires = [ 'pygments', 'polib', 'misaka', 'msgpack-python' ]

if not "sdist" in sys.argv:
    if sys.platform == "win32":
        try:
            import misaka
        except ImportError:
            print("Please install Misaka using a binary distribution first!")
            sys.exit(1)

        try:
            import msgpack
        except ImportError:
            print("Please install Msgpack-Python using a binary distribution first!")
            sys.exit(1)
        
        requires = [ 'pygments', 'polib' ]
    
    else:
        try:
            import cython
        except ImportError:
            print("Please install Cython first!")
            sys.exit(1)



setup(
      name = 'jasy',
      version = jasy.__version__,
      
      author = 'Zynga Inc.',
      author_email = 'germany@zynga.com',
      
      url = 'http://github.com/wpbasti/jasy',
      download_url = "http://pypi.python.org/packages/source/j/jasy/jasy-%s.zip" % jasy.__version__,
      
      license = "Apache v2.0",
      platforms = 'any',
      
      description = "Web Tooling Framework",
      long_description = open('readme.md').read(),
      
      # Via: http://pypi.python.org/pypi?%3Aaction=list_classifiers
      classifiers = [
        
        'Development Status :: 3 - Alpha',
        'Environment :: Console',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: Apache Software License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.2',
        'Topic :: Documentation',
        'Topic :: Software Development :: Build Tools',
        'Topic :: Software Development :: Compilers',
        'Topic :: Software Development :: Code Generators',
        'Topic :: Software Development :: Internationalization',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Topic :: Software Development :: Localization',
        'Topic :: Software Development :: Testing'
      
      ],
      
      packages = [
        'jasy',
        'jasy.asset',
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
        'jasy.test'
      ],
      
      package_data = {
        'jasy': [
          'data/cldr/VERSION', 
          'data/cldr/keys/*.xml', 
          'data/cldr/main/*.xml', 
          'data/cldr/supplemental/*.xml'
        ]
      },
      
      install_requires=requires,
      
      scripts = [ "bin/jasy", "bin/jasy-test",  "bin/jasy-util", "bin/jasy.bat", "bin/jasy-test.bat", "bin/jasy-util.bat" ],
      
      data_files = [
        ("doc", [
          "license.md",
          "readme.md"
         ]
        )
      ]
)
