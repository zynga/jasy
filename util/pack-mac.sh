#!/usr/bin/env bash

BASE=`pwd`
PYTHONVER=3.2.3
UTILFOLDER=`pwd`/`dirname $0`

echo ">>> Reconfiguring PATH to /opt/jasy/bin"
export PATH="/opt/jasy/bin:$PATH"
export PYTHONHOME=/opt/jasy
export JASYHOME=/opt/jasy

echo ">>> Deleting old Jasy install..."
rm -rf $JASYHOME

cd $TMPDIR || exit 1

echo ">>> Downloading Python..."
rm -f Python-$PYTHONVER.tar.bz2
curl --silent -o Python-$PYTHONVER.tar.bz2 http://python.org/ftp/python/$PYTHONVER/Python-$PYTHONVER.tar.bz2 || exit 1

echo ">>> Unpacking Python..."
rm -rf Python-$PYTHONVER
tar xfj Python-$PYTHONVER.tar.bz2 || exit 1

echo ">>> Configuring Python..."
cd Python-$PYTHONVER || exit 1
patch -p0 < $UTILFOLDER/python_dbm.patch || exit 1
export MACOSX_DEPLOYMENT_TARGET=10.5
./configure --prefix=$JASYHOME --with-universal-archs=intel > /dev/null || exit 1

echo ">>> Building Python..."
make > /dev/null || exit 1

echo ">>> Installing Python..."
make install > /dev/null || exit 1
cd $JASYHOME/bin || exit 1
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

cp $UTILFOLDER/activate.sh.tmpl $JASYHOME/activate.sh
cp $UTILFOLDER/install.sh.tmpl $JASYHOME/install.sh
cp $UTILFOLDER/update.sh.tmpl $JASYHOME/update.sh
chmod 755 $JASYHOME/install.sh
chmod 755 $JASYHOME/update.sh

echo ">>> Installing Cython..."
pip install Cython || exit 1

echo ">>> Installing Jasy..."
pip install $UTILFOLDER/.. || exit 1
# pip install jasy || exit 1

echo ">>> Zipping files..."
cd /opt || exit 1
VERSION=`python3 -c "import jasy; print(jasy.__version__)"`
zip -rq jasy-$VERSION-mac.zip jasy || exit 1

echo ">>> Congratulations!"
echo ">>> Jasy was packed as jasy-$VERSION.zip."
echo ">>> You can use this file for redistribution proposes."
echo ">>> Now unpack and execute install.sh on every target machine"
