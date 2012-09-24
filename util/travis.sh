#!/bin/bash

echo ">>> PREPARING ENVIRONMENT..."
cd bin || exit 1
if ! [ `which python3` ]; then
  ln -sf `which python` python3 || exit 1 
fi
export PATH="`pwd`:$PATH"; 
cd .. || exit 1

echo
echo ">>> RUNNING UNIT TESTS..."
jasy-test || exit 1

echo
echo ">>> RUNNING DOC GENERATOR..."
jasy-doc || exit 1

echo
echo ">>> RUNNING JASY CREATE"
jasy create --name mytest --origin https://github.com/zynga/jasy-skeleton.git --skeleton test --user.age 34 --user.name Alex --incr 6,7,8 --foo-bar hello --pi 3.17 || exit 1

echo
echo ">>> EXECUTING HELP..."
cd mytest || exit 1
jasy help || exit 1
cd .. || exit1
rm -rf mytest || exit1

echo 
echo ">>> DONE - ALL FINE"
