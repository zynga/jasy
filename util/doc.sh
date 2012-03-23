#!/usr/bin/env bash

cd `dirname $0`/..
rm -rf doc
sphinx-apidoc --full --maxdepth 8 --output-dir doc jasy
cp -f util/doc-conf.py doc/conf.py
cd doc
make html
