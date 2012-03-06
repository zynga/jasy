#!/usr/bin/env bash

PYTHONVER=3.2.2

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
./configure --prefix=/opt/jasy --disable-tk --disable-debug --with-universal-archs=intel > /dev/null || exit 1

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

echo "export PATH=/opt/jasy/bin:\$PATH" > /opt/jasy/activate.sh
echo "export PYTHONHOME=/opt/jasy" >> /opt/jasy/activate.sh

echo '#/usr/bin/env bash' > /opt/jasy/install.sh
echo 'echo "Installing Jasy into /opt/jasy. Press ENTER to continue"' >> /opt/jasy/install.sh
echo 'read' >> /opt/jasy/install.sh
echo 'sudo mv `dirname $0/..` /opt/jasy || exit 1' >> /opt/jasy/install.sh
echo 'sudo chown -R $USER /opt/jasy || exit 1' >> /opt/jasy/install.sh
echo 'echo "" >> ~/.profile' >> /opt/jasy/install.sh
echo 'echo "# Added by Jasy" >> ~/.profile' >> /opt/jasy/install.sh
echo 'echo "source /opt/jasy/activate.sh" >> ~/.profile' >> /opt/jasy/install.sh
echo 'echo "Successfully installed Jasy in /opt/jasy." >> /opt/jasy/install.sh
chmod 755 /opt/jasy/install.sh

echo '/opt/jasy/bin/pip --no-deps --upgrade jasy' >

echo ">>> Installing Cython..."
pip install Cython || exit 1

echo ">>> Installing Jasy..."
pip install jasy || exit 1

echo ">>> Zipping files..."
cd /opt || exit 1
VERSION=`python3 -c "import jasy; print(jasy.__version__)"`
zip -rq jasy-$VERSION.zip jasy || exit 1

echo ">>> Congratulations!"
echo ">>> Jasy was packed as jasy-$VERSION.zip."
echo ">>> You can use this file for redistribution proposes."
echo ">>> Now unpack and execute install.sh on every target machine"
