#!/usr/bin/env bash

BASE=`python3 -c "import os.path; print(os.path.abspath(os.path.join('$0', '..', '..')))"`
VERSION=`python3 -c "import jasy; print(jasy.__version__)"`
ROOT=pack
DIST=$ROOT/jasy-$VERSION
PYTHONVER=3.2.2

echo ">>> Cleaning up..."
rm -rf $DIST*

echo ">>> Reconfiguring PATH to /opt/jasy/bin"
export PATH="/opt/jasy/bin:$PATH"
export PYTHONHOME=/opt/jasy
export JASYHOME=/opt/jasy

cd $TMPDIR

echo ">>> Downloading Python..."
rm -f Python-$PYTHONVER.tar.bz2
curl --silent -o Python-$PYTHONVER.tar.bz2 http://python.org/ftp/python/$PYTHONVER/Python-$PYTHONVER.tar.bz2

echo ">>> Unpacking Python..."
rm -rf Python-$PYTHONVER
tar xfj Python-$PYTHONVER.tar.bz2

echo ">>> Configuring Python..."
cd Python-$PYTHONVER
export MACOSX_DEPLOYMENT_TARGET=10.5
./configure --prefix=/opt/jasy --with-universal-archs=intel > /dev/null || exit 1

echo ">>> Building Python..."
make > /dev/null || exit 1

echo ">>> Installing Python..."
make install > /dev/null || exit 1
cd /opt/jasy/bin || exit 1
ln -s python3 python || exit 1
cd ~- || exit 1

echo ">>> Downloading Distribute..."
rm -f distribute_setup.py
curl --silent http://python-distribute.org/distribute_setup.py -o distribute_setup.py || exit 1

echo ">>> Installing Distribute..."
python3 distribute_setup.py 2>&1 > /dev/null || exit 1

echo ">>> Downloading PIP..."
rm -f get-pip.py
curl --silent https://raw.github.com/pypa/pip/master/contrib/get-pip.py -o get-pip.py || exit 1

echo ">>> Installing PIP..."
python3 get-pip.py 2>&1 > /dev/null || exit 1

cd ~-

echo "# Added by Jasy" > /opt/jasy/bin/activate
echo "export PATH=/opt/jasy/bin" >> /opt/jasy/bin/activate
echo "export PYTHONHOME=/opt/jasy" >> /opt/jasy/bin/activate

echo ">>> Installing Cython..."
pip install Cython || exit 1

echo ">>> Installing Jasy..."
pip install jasy || exit 1

echo ">>> Zipping files..."
cd /opt || exit 1
zip -rq jasy-$VERSION.zip jasy || exit 1

echo ">>> Congratulations!"
echo ">>> Jasy was packed as jasy-$VERSION.zip."
echo ">>> You can use this file for redistribution proposes."
echo ">>> Unpack it to /opt/jasy and add \"source /opt/jasy/bin/activate\" to your .profile or .bashrc"
echo ">>> Alternatively prepend /opt/jasy/bin to your PATH and set PYTHONHOME to /opt/jasy."

