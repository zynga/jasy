#!/usr/bin/env bash

cd `dirname $0`/..
version=`python3 -c "import jasy; print(jasy.__version__)"`

python3 setup.py clean
python3 setup.py sdist --formats zip upload
