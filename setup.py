#!/usr/bin/env python3

import sys

major, minor = sys.version_info[:2]

if major < 3:
    raise Exception("Jasy requires Python 3")


from distutils.core import setup

version = "0.7"

setup(
      name = 'jasy',
      version = version,
      author = 'Sebastian Werner',
      author_email = 'info@sebastian-werner.net',
      url = 'http://github.com/wpbasti/jasy',
      download_url = "http://github.com/downloads/wpbasti/jasy/jasy-%s.tar.gz" % version,
      license = "http://www.apache.org/licenses/LICENSE-2.0",
      description = "Jasy is a build system for JavaScript focused web projects.",
      packages = ['jasy','jasy.core','jasy.ext','jasy.optimizer','jasy.parser','jasy.process','jasy.tokenizer'],
      package_dir = {'': 'lib'},
      package_data = {'jasy': ['data/cldr/VERSION', 'data/cldr/keys/*.xml', 'data/cldr/main/*.xml', 'data/cldr/supplemental/*.xml']},
      scripts = ["bin/jasy", "bin/jscompress", "bin/jsdeps", "bin/jsmeta", "bin/jsoptimize", "bin/jstree"]
)
