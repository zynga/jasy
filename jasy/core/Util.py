#
# Jasy - Web Tooling Framework
# Copyright 2010-2012 Zynga Inc.
#

import hashlib

def sha1File(f, block_size=2**20):
    sha1 = hashlib.sha1()
    while True:
        data = f.read(block_size)
        if not data:
            break
        sha1.update(data)

    return sha1.hexdigest()