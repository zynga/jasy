#!/usr/bin/env bash

BASE=`python3 -c "import os.path; print(os.path.abspath(os.path.join('$0', '..', '..')))"`
VERSION=`python3 -c "import jasy; print(jasy.__version__)"`
ROOT=pack
DIST=$ROOT/jasy-$VERSION

echo ">>> Cleaning up..."
rm -rf $DIST*

echo ">>> Setting up Python environment..."
mkdir -p $ROOT || exit 1
cd $ROOT || exit 1
virtualenv --prompt "" jasy-$VERSION || exit 1

echo ">>> Removing unused scripts..."
rm -rf jasy-$VERSION/bin/activate* || exit 1
rm -rf jasy-$VERSION/bin/easy_install*
rm -rf jasy-$VERSION/bin/pip*

echo ">>> Reconfiguring PATH to $BASE/$DIST/bin"
export PATH="$BASE/$DIST/bin:$PATH"

cd $TMPDIR
echo ">>> Installing Distribute..."
curl http://python-distribute.org/distribute_setup.py 2> /dev/null | python3 2>&1 > /dev/null || exit 1

echo ">>> Installing PIP..."
curl https://raw.github.com/pypa/pip/master/contrib/get-pip.py 2> /dev/null | python3 2>&1 > /dev/null || exit 1
cd ~-

echo ">>> Installing Cython..."
pip install Cython || exit 1

echo ">>> Installing Jasy..."
pip install jasy || exit 1

echo ">>> Patching scripts..."
find $BASE/$DIST/bin -type f -exec sed -i "" s:$BASE/$DIST/bin/:"/usr/bin/env ":g {} \;

echo ">>> Zipping files..."
cd $BASE/$ROOT || exit 1
zip -rq jasy-$VERSION.zip jasy-$VERSION || exit 1

echo ">>> Cleaning up..."
rm -rf jasy-$VERSION

echo ">>> Congratulations!"
echo ">>> Jasy was packed as jasy-$VERSION.zip."
echo ">>> You can use this file for redistribution proposes."
echo ">>> Unpack it to any folder and prepend the \"bin\" folder to your PATH."

