#!/usr/bin/env bash

cd `dirname $0`/..
version=`python3 -c "import jasy; print(jasy.__version__)"`

python3 setup.py test > /dev/null || exit 1
python3 setup.py clean || exit 1

python3 setup.py sdist --formats zip upload || exit 1

python3 bin/jasy-doc || exit 1
python3 setup.py upload_docs --upload-dir=docs || exit 1
