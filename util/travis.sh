#!/bin/bash

cd bin || exit 1
ln -s `which python` python3 || exit 1 
export PATH="`pwd`:$PATH"; 
cd .. || exit 1

jasy-test || exit 1
jasy-doc || exit 1

jasy create --name mytest --origin https://github.com/zynga/jasy-skeleton.git --skeleton test --user.age 34 --user.name Alex --incr 6,7,8 --foo-bar hello --pi 3.17 || exit 1
cd mytest || exit 1
jasy help || exit 1