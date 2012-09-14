#!/usr/bin/env bash

cd `dirname $0`/..
sphinx-apidoc --full --maxdepth 8 --output-dir doc jasy
cd doc
make html
