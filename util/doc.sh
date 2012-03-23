#!/usr/bin/env bash

cd `dirname $0`/..
rm -rf doc
sphinx-apidoc --full --maxdepth 6 --output-dir doc jasy
cd doc
make html
