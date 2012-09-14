#!/usr/bin/env bash

cd `dirname $0`/..
rm -rf doc
sphinx-apidoc --full --maxdepth 3 --output-dir doc jasy
cd doc
make html
