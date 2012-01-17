#!/usr/bin/env bash

cd `dirname $0`/..
python3 setup.py sdist --formats zip upload
