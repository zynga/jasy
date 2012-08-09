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
    
    

def getKey(data, key, default=None):
    if key in data:
        return data[key]
    else:
        return default


from threading import Timer

def debounce(wait):
    """ Decorator that will postpone a functions
        execution until after wait seconds
        have elapsed since the last time it was invoked. """
    def decorator(fn):
        def debounced(*args, **kwargs):
            def call_it():
                fn(*args, **kwargs)
            try:
                debounced.t.cancel()
            except(AttributeError):
                pass
            debounced.t = Timer(wait, call_it)
            debounced.t.start()
        return debounced
    return decorator